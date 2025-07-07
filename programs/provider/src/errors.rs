use pinocchio::program_error::ProgramError;

#[derive(Clone, Debug, PartialEq)]
pub enum MyProgramError {
    NameTooLong,
    InvalidInstructionData,
}

impl From<MyProgramError> for ProgramError {
    fn from(e: MyProgramError) -> Self {
        Self::Custom(e as u32)
    }
}
