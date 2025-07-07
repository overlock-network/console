use std::path::PathBuf;
use alloc::vec;
use api::types::overlock::crossplane::v1beta1;
use mollusk_svm::{program, Mollusk, result::Check};
use provider::state::{DataLen, Provider};
use prost::Message;
use solana_sdk::{
    account::Account,
    instruction::{AccountMeta, Instruction},
    native_token::LAMPORTS_PER_SOL,
    pubkey::Pubkey,
    signature::{read_keypair_file, Signer},
    rent::Rent,
    sysvar::{rent::ID, Sysvar},
};
extern crate alloc;

pub fn load_program_id() -> Pubkey {
    let keypair_path = PathBuf::from("../../target/deploy/provider-keypair.json");
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

pub const RENT: Pubkey = ID;

pub fn mollusk() -> Mollusk {
    let program_id = load_program_id();
    let mollusk = Mollusk::new(&program_id, "../../target/deploy/provider");
    mollusk
}

pub fn get_rent_data() -> Vec<u8> {
    let rent = Rent::default();
    unsafe {
        core::slice::from_raw_parts(&rent as *const Rent as *const u8, Rent::size_of()).to_vec()
    }
}

#[test]
fn test_create_provider() {
    let payer_id = load_payer_id();
    let program_id = load_program_id();
    let mollusk = Mollusk::new(&program_id, "../../target/deploy/provider");

    let (system_program, system_account) = program::keyed_account_for_system_program();
    let provider_key = Pubkey::new_unique(); // Use a more descriptive name
    let payer_account = Account::new(1 * LAMPORTS_PER_SOL, 0, &system_program);

    let provider_account = Account::new(0, 0, &system_program);

    let min_balance = mollusk.sysvars.rent.minimum_balance(Rent::size_of());
    let mut rent_account = Account::new(min_balance, Rent::size_of(), &RENT);
    rent_account.data = get_rent_data();

    let rent_for_provider = mollusk.sysvars.rent.minimum_balance(Provider::LEN);

    let ix_accounts = vec![
        AccountMeta::new(payer_id, true),
        AccountMeta::new(provider_key, true),
        AccountMeta::new_readonly(RENT, false),
        AccountMeta::new_readonly(system_program, false),
    ];

    let proto_provider = v1beta1::Provider {
        metadata: Some(v1beta1::Metadata {
            name: "test-provider".to_string(),
            annotations: "test annotations".to_string(),
        }),
        ip: "127.0.0.1".to_string(),
        port: 8080,
        country_code: "US".to_string(),
        environment_type: "dev".to_string(),
        availability: "available".to_string(),
        id: 1,
        creator: "Hmjb7j2mfYfXmusGaxz67o5y1JxwXjhJ5kiWUkz7hJg4".to_string(),
        register_time: Some(prost_types::Timestamp {
            seconds: 1_654_000_000,
            nanos: 0,
        }),
    };

    let mut encoded_proto_data = Vec::with_capacity(proto_provider.encoded_len());
    proto_provider.encode(&mut encoded_proto_data).unwrap();

    let mut instruction_data = vec![0];
    instruction_data.extend_from_slice(&encoded_proto_data);

    let instruction = Instruction::new_with_bytes(program_id, &instruction_data, ix_accounts);

    let tx_accounts = &vec![
        (payer_id, payer_account.clone()),
        (provider_key, provider_account.clone()), // ← keep as-is, don't give it anything
        (RENT, rent_account.clone()),
        (system_program, system_account.clone()),
    ];

    let provider_name = "test-provider";
    let provider_ip = "127.0.0.1";
    let provider_country = "US";
    let provider_env_type = "dev";

    let mut expected_data = Vec::with_capacity(Provider::LEN);

    expected_data.push(provider_name.len() as u8);
    expected_data.extend_from_slice(&{
        let mut bytes = [0u8; 50];
        bytes[..provider_name.len()].copy_from_slice(provider_name.as_bytes());
        bytes
    });

    expected_data.push(provider_ip.len() as u8);
    expected_data.extend_from_slice(&{
        let mut bytes = [0u8; 50];
        bytes[..provider_ip.len()].copy_from_slice(provider_ip.as_bytes());
        bytes
    });

    expected_data.extend_from_slice(&8080u16.to_le_bytes());

    expected_data.push(provider_country.len() as u8);
    expected_data.extend_from_slice(&{
        let mut bytes = [0u8; 50];
        bytes[..provider_country.len()].copy_from_slice(provider_country.as_bytes());
        bytes
    });

    expected_data.push(provider_env_type.len() as u8);
    expected_data.extend_from_slice(&{
        let mut bytes = [0u8; 50];
        bytes[..provider_env_type.len()].copy_from_slice(provider_env_type.as_bytes());
        bytes
    });

    expected_data.push(1);
    
    let checks = &[
        Check::success(),
        Check::account(&provider_key)
            .owner(&program_id)
            .lamports(rent_for_provider)
            .data(&expected_data)
            .build(),
        Check::account(&payer_id)
            .lamports(payer_account.lamports - rent_for_provider)
            .build(),
    ];

    mollusk.process_and_validate_instruction(&instruction, tx_accounts, checks);
}
