use anchor_lang::prelude::*;
use borsh::{BorshDeserialize, BorshSerialize};

#[program]
pub mod todo {
    use super::*;
    pub fn create_todo_board(
        ctx: Context<CreateTodoBoard>,
        board_name: Option<String>,
    ) -> ProgramResult {
        let todo_board = &mut ctx.accounts.todo_board;
        todo_board.authority = *ctx.accounts.authority.to_account_info().key;
        todo_board.name = board_name;
        Ok(())
    }

    pub fn create_todo(ctx: Context<CreateTodo>, name: String, bump: u8) -> ProgramResult {
        let todo = &mut ctx.accounts.todo;

        todo.name = name;
        todo.authority = *ctx.accounts.authority.key;
        todo.bump = bump;
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

#[derive(Accounts)]
#[instruction(name: String, bump: u8)]
pub struct CreateTodo<'info> {
    #[account(
        init,
        seeds = [authority.key.as_ref()],
        bump = bump,
        payer = authority,
        space = 320,
    )]
    todo: ProgramAccount<'info, Todo>,
    #[account(signer)]
    authority: AccountInfo<'info>,
    system_program: AccountInfo<'info>,
}

#[account]
pub struct Todo {
    name: String,
    authority: Pubkey,
    bump: u8,
}
