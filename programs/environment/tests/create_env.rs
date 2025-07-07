use std::path::PathBuf;

use api::types::overlock::crossplane::v1beta1;
use environment::state::{DataLen, Environment};
use mollusk_svm::{program, Mollusk, result::Check};
use prost::Message;
use solana_sdk::{
    account::Account,
    instruction::{AccountMeta, Instruction},
    native_token::LAMPORTS_PER_SOL,
    pubkey::Pubkey,
    signature::{read_keypair_file, Signer},
    sysvar::rent::ID,
};
use solana_sdk::rent::Rent;
use solana_sdk::sysvar::Sysvar;

pub const RENT: Pubkey = ID;

fn to_bytes<T: Sized>(val: &T) -> &[u8] {
    unsafe {
        core::slice::from_raw_parts((val as *const T) as *const u8, core::mem::size_of::<T>())
    }
}

pub fn load_program_id() -> Pubkey {
    let keypair_path = PathBuf::from("../../target/deploy/environment-keypair.json");
    let keypair = read_keypair_file(keypair_path).expect("Failed to read program keypair");
    keypair.pubkey()
}

pub fn load_payer_id() -> Pubkey {
    let home_dir = std::env::var("HOME").expect("HOME environment variable not set");
    let keypair_path = PathBuf::from(format!("{}/.config/solana/id.json", home_dir));
    let keypair = read_keypair_file(keypair_path)
        .expect("Failed to read payer keypair from ~/.config/solana/id.json");
    keypair.pubkey()
}

pub fn mollusk() -> Mollusk {
    let program_id = load_program_id();
    Mollusk::new(&program_id, "../../target/deploy/environment")
}

pub fn get_rent_data() -> Vec<u8> {
    let rent = Rent::default();

    unsafe {
        core::slice::from_raw_parts(&rent as *const Rent as *const u8, Rent::size_of()).to_vec()
    }
}

#[test]
fn test_create_environment() {
    let payer_id = load_payer_id();
    let program_id = load_program_id();
    let mollusk = Mollusk::new(&program_id, "../../target/deploy/environment");

    let (system_program, system_account) = program::keyed_account_for_system_program();
    let environment_key = Pubkey::new_unique();

    let payer_account = Account::new(1 * LAMPORTS_PER_SOL, 0, &system_program);
    let environment_account = Account::new(0, 0, &system_program);

    let min_balance = mollusk.sysvars.rent.minimum_balance(Rent::size_of());

    let mut rent_account = Account::new(min_balance, Rent::size_of(), &RENT);
    rent_account.data = get_rent_data();

    let rent_for_env = mollusk.sysvars.rent.minimum_balance(Environment::LEN);

    let ix_accounts: Vec<AccountMeta> = vec![
        AccountMeta::new(payer_id, true),
        AccountMeta::new(environment_key, true),
        AccountMeta::new_readonly(RENT, false),
        AccountMeta::new_readonly(system_program, false),
    ];

    let ix_data = v1beta1::Environment {
        metadata: Some(v1beta1::Metadata {
            name: "test-env".to_string(),
            annotations: "test annotations".to_string(),
        }),
        id: 12,
        creator: payer_id.to_string(),
        provider: 0,
    };

    let mut encoded_env = Vec::with_capacity(ix_data.encoded_len());
    ix_data.encode(&mut encoded_env).unwrap();

    let mut ser_ix_data = vec![0];
    ser_ix_data.extend_from_slice(&encoded_env);

    let instruction = Instruction::new_with_bytes(program_id, &ser_ix_data, ix_accounts);

    let tx_accounts = &vec![
        (payer_id, payer_account.clone()),
        (environment_key, environment_account.clone()),
        (RENT, rent_account.clone()),
        (system_program, system_account.clone()),
    ];

    let name_str = "test-env";
    let mut name_bytes = [0u8; 50];
    name_bytes[..name_str.len()].copy_from_slice(name_str.as_bytes());

    let mut expected_provider = [0u8; 32];
    expected_provider[24..].copy_from_slice(&0u64.to_be_bytes());

    let expected_state = Environment {
        name_len: name_str.len() as u8,
        name: name_bytes,
        owner: payer_id.to_bytes(),
        provider: expected_provider,
    };

    let expected_data =  { to_bytes(&expected_state) }.to_vec();
 
    let checks = &[
        Check::success(),
        Check::account(&environment_key)
            .owner(&program_id)
            .lamports(rent_for_env)
            .data(&expected_data)
            .build(),
        Check::account(&payer_id)
            .lamports(payer_account.lamports - rent_for_env)
            .build(),
    ];

    mollusk.process_and_validate_instruction(&instruction, tx_accounts, checks);
}
