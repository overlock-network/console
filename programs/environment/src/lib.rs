#![allow(clippy::result_large_err)]
use anchor_lang::prelude::*;
use instructions::*;

pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

declare_id!("F6MJX57V1LjRHxF6a7zbJGT8MyQfYAv8jrDZ8DnXpgtV");

#[program]
pub mod environment {
    use super::*;

    pub fn create_environment(
        ctx: Context<CreateEnvironment>,
        name: String,
        owner: Pubkey,
        provider: Pubkey,
    ) -> Result<()> {
        create::create_environment(ctx, name, owner, provider)
    }
}
