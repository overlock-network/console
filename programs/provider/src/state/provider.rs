use anchor_lang::prelude::*;
use api::types::overlock::crossplane::v1beta1;

#[account]
#[derive(InitSpace)]
pub struct Provider {
    #[max_len(50)]
    pub name: String,
    #[max_len(50)]
    pub ip: String,
    pub port: u16,
    #[max_len(50)]
    pub country: String,
    #[max_len(50)]
    pub environment_type: String,
    pub availability: bool,
}

impl From<v1beta1::Provider> for Provider {
    fn from(proto: v1beta1::Provider) -> Self {
        Provider {
            name: proto
                .metadata
                .as_ref()
                .map(|m| m.name.clone())
                .unwrap_or_default(),
            ip: proto.ip,
            port: proto.port as u16,
            country: proto.country_code,
            environment_type: proto.environment_type,
            availability: proto.availability.to_lowercase() == "true"
                || proto.availability.to_lowercase() == "available",
        }
    }
}
