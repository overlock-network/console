use pinocchio::program_error::ProgramError;

pub mod register;
pub use register::*;

#[repr(u8)]
pub enum ProgramInstruction {
    RegisterProvider,
}

impl TryFrom<&u8> for ProgramInstruction {
    type Error = ProgramError;

    fn try_from(value: &u8) -> Result<Self, Self::Error> {
        match *value {
            0 => Ok(ProgramInstruction::RegisterProvider),
            _ => Err(ProgramError::InvalidInstructionData),
        }
    }
}
