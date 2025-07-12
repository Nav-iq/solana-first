use solana_program::{
    account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, msg, pubkey::Pubkey,
};

// Instruction is the function that will be called when the program is executed
entrypoint!(my_defi_app);

fn my_defi_app(
    program_id: &Pubkey,
    account: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    msg!("Hello, world!");
    msg!("Investing in Solana");
    Ok(())
}
