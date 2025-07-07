use super::utils::{load_acc_mut_unchecked, DataLen};
use api::types::overlock::crossplane::v1beta1;
use pinocchio::{account_info::AccountInfo, pubkey::Pubkey,  ProgramResult};

/// Fixed-size provider state for Pinocchio
#[repr(C)]
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Provider {
    pub name_len: u8,
    pub name: [u8; 50],
    pub ip_len: u8,
    pub ip: [u8; 50],
    pub port: u16,
    pub country_len: u8,
    pub country: [u8; 50],
    pub environment_type_len: u8,
    pub environment_type: [u8; 50],
    pub availability: bool,
}

impl DataLen for Provider {
    const LEN: usize = 1 + 50 + 1 + 50 + 2 + 1 + 50 + 1 + 50 + 1;
}

impl Provider {
    pub fn initialize(provider_acc: &AccountInfo, proto: &Provider) -> ProgramResult {
        let provider_state = unsafe {
            load_acc_mut_unchecked::<Provider>(provider_acc.borrow_mut_data_unchecked())?
        };
        let converted: Provider = proto.clone().into();

        provider_state.name_len = converted.name_len;
        provider_state.name = converted.name;
        provider_state.ip_len = converted.ip_len;
        provider_state.ip = converted.ip;
        provider_state.port = converted.port;
        provider_state.country_len = converted.country_len;
        provider_state.country = converted.country;
        provider_state.environment_type_len = converted.environment_type_len;
        provider_state.environment_type = converted.environment_type;
        provider_state.availability = converted.availability;
        Ok(())
    }
}

impl From<v1beta1::Provider> for Provider {
    fn from(proto: v1beta1::Provider) -> Self {
        let mut string_to_bytes = |s: &str, len_out: &mut u8, arr_out: &mut [u8; 50]| {
            let s_bytes = s.as_bytes();
            let s_len = s_bytes.len().min(50);
            *len_out = s_len as u8;
            arr_out[..s_len].copy_from_slice(&s_bytes[..s_len]);
        };

        let mut name_bytes = [0u8; 50];
        let mut name_len = 0;
        string_to_bytes(
            &proto.metadata.as_ref().map_or("", |m| &m.name),
            &mut name_len,
            &mut name_bytes,
        );

        let mut ip_bytes = [0u8; 50];
        let mut ip_len = 0;
        string_to_bytes(&proto.ip, &mut ip_len, &mut ip_bytes);

        let mut country_bytes = [0u8; 50];
        let mut country_len = 0;
        string_to_bytes(&proto.country_code, &mut country_len, &mut country_bytes);

        let mut env_type_bytes = [0u8; 50];
        let mut env_type_len = 0;
        string_to_bytes(
            &proto.environment_type,
            &mut env_type_len,
            &mut env_type_bytes,
        );

        Provider {
            name_len,
            name: name_bytes,
            ip_len,
            ip: ip_bytes,
            port: proto.port as u16,
            country_len,
            country: country_bytes,
            environment_type_len: env_type_len,
            environment_type: env_type_bytes,
            availability: proto.availability.to_lowercase() == "true"
                || proto.availability.to_lowercase() == "available",
        }
    }
}