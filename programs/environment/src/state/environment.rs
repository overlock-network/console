use anchor_lang::prelude::*;
use api::types::overlock::crossplane::v1beta1;
use std::str::FromStr;

#[account]
#[derive(InitSpace)]
pub struct Environment {
    #[max_len(50)]
    pub name: String,
    pub owner: Pubkey,
    pub provider: Pubkey,
}

impl From<v1beta1::Environment> for Environment {
    fn from(proto: v1beta1::Environment) -> Self {
        Environment {
            name: proto
                .metadata
                .as_ref()
                .map(|m| m.name.clone())
                .unwrap_or_default(),

            owner: Pubkey::from_str(&proto.creator).unwrap_or(Pubkey::default()),

            provider: {
                let mut bytes = [0u8; 32];
                bytes[24..].copy_from_slice(&proto.provider.to_be_bytes());
                Pubkey::new_from_array(bytes)
            },
        }
    }
}
