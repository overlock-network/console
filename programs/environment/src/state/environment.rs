use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Environment {
    #[max_len(50)]
    pub name: String,
    pub owner: Pubkey,
    pub provider: Pubkey,
}
