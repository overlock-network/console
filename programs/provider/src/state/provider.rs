use anchor_lang::prelude::*;

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
