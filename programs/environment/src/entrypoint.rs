#![allow(unexpected_cfgs)]

use crate::instructions::{self, ProgramInstruction};
use pinocchio::{
    account_info::AccountInfo, default_allocator, default_panic_handler, msg,
    program_entrypoint, program_error::ProgramError, pubkey::Pubkey, ProgramResult,
};

program_entrypoint!(process_instruction);
default_allocator!();
default_panic_handler!();

#[inline(always)]
fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let (ix_disc, instruction_data) = instruction_data
        .split_first()
        .ok_or(ProgramError::InvalidInstructionData)?;

    match ProgramInstruction::try_from(ix_disc)? {
        ProgramInstruction::CreateEnvironment => {
            msg!("Instruction: CreateEnvironment");
            instructions::create_environment(accounts, instruction_data)
        }
    }
}