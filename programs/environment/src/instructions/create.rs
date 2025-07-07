use crate::{
    errors::MyProgramError,
    state::{
        DataLen,
        Environment,
    },
};
use api::types::overlock::crossplane::v1beta1;
use pinocchio::{
    account_info::AccountInfo, msg, program_error::ProgramError,
    sysvars::rent::Rent, ProgramResult,
};
use pinocchio_system::instructions::CreateAccount;
use prost::{bytes::Bytes, Message};

pub fn create_environment(accounts: &[AccountInfo], data: &[u8]) -> ProgramResult {
    let [payer_acc, environment_acc, sysvar_rent_acc, _system_program] = accounts else {
        return Err(ProgramError::NotEnoughAccountKeys);
    };

    if !payer_acc.is_signer() || !environment_acc.is_signer() {
        return Err(ProgramError::MissingRequiredSignature);
    }

    if !environment_acc.data_is_empty() {
        return Err(ProgramError::AccountAlreadyInitialized);
    }

    let buf = Bytes::copy_from_slice(data);
    let proto_env = v1beta1::Environment::decode(buf).map_err(|_| {
        msg!("Decode error");
        MyProgramError::InvalidInstructionData
    })?;

    let ix_data: Environment = proto_env.into();

    if ix_data.name_len > 50 {
        return Err(MyProgramError::NameTooLong.into());
    }

    let rent = Rent::from_account_info(sysvar_rent_acc)?;

    CreateAccount {
        from: payer_acc,
        to: environment_acc,
        space: Environment::LEN as u64,
        owner: &crate::ID,
        lamports: rent.minimum_balance(Environment::LEN),
    }
    .invoke()?;

    Environment::initialize(environment_acc, &ix_data)?;

    Ok(())
}
