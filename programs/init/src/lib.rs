use anchor_lang::prelude::*;

#[program]
pub mod todo {
    use super::*;
    pub fn create_todo_board(
        ctx: Context<CreateTodoBoard>,
        board_name: Option<String>,
    ) -> ProgramResult {
        let todo_board = &mut ctx.accounts.todo_board;
        todo_board.authority = *ctx.accounts.authority.key;
        todo_board.name = board_name;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateTodoBoard<'info> {
    #[account(init)]
    pub todo_board: ProgramAccount<'info, TodoBoard>,
    #[account(mut, signer)]
    authority: AccountInfo<'info>,
    rent: Sysvar<'info, Rent>,
    system_program: AccountInfo<'info>,
}

#[account]
pub struct TodoBoard {
    name: Option<String>,
    authority: Pubkey,
}
