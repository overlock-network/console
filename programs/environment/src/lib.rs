#[cfg(not(feature = "no-entrypoint"))]
mod entrypoint;

pub mod errors;
pub mod instructions;
pub mod state;

pinocchio_pubkey::declare_id!("F6MJX57V1LjRHxF6a7zbJGT8MyQfYAv8jrDZ8DnXpgtV");
