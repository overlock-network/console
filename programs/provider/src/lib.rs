
#[cfg(not(feature = "no-entrypoint"))]
pub mod errors;
pub mod instructions;
pub mod state;
mod entrypoint;

pinocchio_pubkey::declare_id!("BfHgyDmEcrmt2GyQ1ypLcopsKUJXp4zo86y3TnKffuLz");