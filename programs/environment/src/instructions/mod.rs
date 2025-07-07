use pinocchio::program_error::ProgramError;

pub mod create;

pub use create::*;

#[repr(u8)]
pub enum ProgramInstruction {
    CreateEnvironment,
}

impl TryFrom<&u8> for ProgramInstruction {
    type Error = ProgramError;

    fn try_from(value: &u8) -> Result<Self, Self::Error> {
        match *value {
            0 => Ok(ProgramInstruction::CreateEnvironment),
            _ => Err(ProgramError::InvalidInstructionData),
        }
    }
}
