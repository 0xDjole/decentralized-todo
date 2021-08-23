use anchor_lang::prelude::*;

#[program]
pub mod todo {
    use super::*;
    pub fn create_todo_board(ctx: Context<CreateTodoBoard>) -> ProgramResult {
        let todo_board = &mut ctx.accounts.todo_board;
        todo_board.authority = *ctx.accounts.authority.key;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateTodoBoard<'info> {
    // TODO figure out how to get the constraint on the mint of the vault
    // workaround would be to pass in mint and add contraint to
    // the vault_account.mint == mint
    #[account(init, associated = authority, with = todo_board_type)]
    pub todo_board: ProgramAccount<'info, TodoBoard>,
    pub todo_board_type: AccountInfo<'info>,
    #[account(mut, signer)]
    authority: AccountInfo<'info>,
    rent: Sysvar<'info, Rent>,
    system_program: AccountInfo<'info>,
}

#[associated]
#[derive(Default)]
pub struct TodoBoard {
    /// The users owner address that must sign all transactions for the account
    authority: Pubkey,
}
