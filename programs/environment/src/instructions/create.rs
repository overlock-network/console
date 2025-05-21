use crate::{constants::ANCHOR_DISCRIMINATOR_SIZE, state::Environment};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct CreateEnvironment<'info> {
    #[account(mut)]
    payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        space = ANCHOR_DISCRIMINATOR_SIZE + Environment::INIT_SPACE,
    )]
    environment: Account<'info, Environment>,
    system_program: Program<'info, System>,
}

pub fn create_environment(
    ctx: Context<CreateEnvironment>,
    name: String,
    owner: Pubkey,
    provider: Pubkey,
) -> Result<()> {
    *ctx.accounts.environment = Environment {
        name,
        owner,
        provider,
    };
    Ok(())
}
