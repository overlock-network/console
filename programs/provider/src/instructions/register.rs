use crate::{
    errors::MyProgramError,
    state::{utils::DataLen, Provider},
};
use api::types::overlock::crossplane::v1beta1;
use pinocchio::{
    account_info::AccountInfo, program_error::ProgramError, sysvars::rent::Rent, ProgramResult,
};
use pinocchio_system::instructions::CreateAccount;
use prost::{bytes::Bytes, Message};

pub fn register_provider(accounts: &[AccountInfo], data: &[u8]) -> ProgramResult {
    let [payer_acc, provider_acc, sysvar_rent_acc, system_program] = accounts else {
        return Err(ProgramError::NotEnoughAccountKeys);
    };

    if !payer_acc.is_signer() || !provider_acc.is_signer() {
        return Err(ProgramError::MissingRequiredSignature);
    }

    if !provider_acc.data_is_empty() {
        return Err(ProgramError::AccountAlreadyInitialized);
    }

    let buf = Bytes::copy_from_slice(data);
    let proto_provider =
        v1beta1::Provider::decode(buf).map_err(|_| MyProgramError::InvalidInstructionData)?;

    let ix_data: Provider = proto_provider.into();

    if ix_data.name_len > 50 {
        return Err(MyProgramError::NameTooLong.into());
    }

    let rent = Rent::from_account_info(sysvar_rent_acc)?;

    CreateAccount {
        from: payer_acc,
        to: provider_acc,
        space: Provider::LEN as u64,
        owner: &crate::ID,
        lamports: rent.minimum_balance(Provider::LEN),
    }
    .invoke()?;

    Provider::initialize(provider_acc, &ix_data)?;

    Ok(())
}
