#![allow(clippy::result_large_err)]
use anchor_lang::prelude::*;
use instructions::*;

pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

declare_id!("BfHgyDmEcrmt2GyQ1ypLcopsKUJXp4zo86y3TnKffuLz");

#[program]
pub mod provider {
    use super::*;

    pub fn register_provider(
        ctx: Context<RegisterProvider>,
        name: String,
        ip: String,
        port: u16,
        country: String,
        environment_type: String,
        availability: bool,
    ) -> Result<()> {
        register::register_provider(ctx, name, ip, port, country, environment_type, availability)
    }
}
