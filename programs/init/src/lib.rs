use anchor_lang::prelude::*;

#[program]
pub mod todo {
    use super::*;
    pub fn create_todo_board(ctx: Context<CreateTodoBoard>, board_name: u64) -> ProgramResult {
        let todo_board = &mut ctx.accounts.todo_board;
        todo_board.authority = *ctx.accounts.authority.key;
        todo_board.name = board_name;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateTodoBoard<'info> {
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
    name: u64,
    authority: Pubkey,
}
