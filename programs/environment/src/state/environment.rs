use super::utils::{load_acc_mut_unchecked, DataLen};
use api::types::overlock::crossplane::v1beta1;
use pinocchio::{account_info::AccountInfo, pubkey::Pubkey, ProgramResult};

#[repr(C)]
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Environment {
    pub name_len: u8,
    pub name: [u8; 50],
    pub owner: Pubkey,
    pub provider: Pubkey,
}

impl DataLen for Environment {
    const LEN: usize = 1 + 50 + 32 + 32;
}

impl Environment {
    pub fn initialize(env_acc: &AccountInfo, proto: &Environment) -> ProgramResult {
        let env_state =
            unsafe { load_acc_mut_unchecked::<Environment>(env_acc.borrow_mut_data_unchecked())? };

        let converted: Environment = proto.clone().into();

        env_state.name_len = converted.name_len;
        env_state.name = converted.name;
        env_state.owner = converted.owner;
        env_state.provider = converted.provider;

        Ok(())
    }
}

impl From<v1beta1::Environment> for Environment {
    fn from(proto: v1beta1::Environment) -> Self {
        let mut name_bytes = [0u8; 50];
        let name_str = proto
            .metadata
            .as_ref()
            .map(|m| m.name.clone())
            .unwrap_or_default();
        let name_len = name_str.len().min(50) as u8;
        name_bytes[..name_len as usize].copy_from_slice(&name_str.as_bytes()[..name_len as usize]);

        let owner = bs58::decode(&proto.creator)
            .into_vec()
            .ok()
            .and_then(|bytes| {
                if bytes.len() == 32 {
                    let mut arr = [0u8; 32];
                    arr.copy_from_slice(&bytes);
                    Some(arr)
                } else {
                    None
                }
            })
            .unwrap_or([0u8; 32]);

        let mut provider: [u8; 32] = [0u8; 32];
        provider[24..].copy_from_slice(&proto.provider.to_be_bytes());

        Environment {
            name_len,
            name: name_bytes,
            owner,
            provider,
        }
    }
}
