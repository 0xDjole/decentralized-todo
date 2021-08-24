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

    pub fn create_todo(
        ctx: Context<CreateTodo>,
        name: String,
        number: u64,
        bump: u8,
    ) -> ProgramResult {
        let todo = &mut ctx.accounts.todo;

        todo.name = name;
        todo.number = number;
        todo.authority = *ctx.accounts.todo_board.to_account_info().key;
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
#[instruction(name: String, number: u64, bump: u8)]
pub struct CreateTodo<'info> {
    #[account(
        init,
        seeds = [todo_board.to_account_info().key.as_ref(), &number.to_be_bytes()],
        bump = bump,
        payer = authority,
        space = 320,
    )]
    todo: ProgramAccount<'info, Todo>,
    todo_board: ProgramAccount<'info, TodoBoard>,
    #[account(signer)]
    authority: AccountInfo<'info>,
    system_program: AccountInfo<'info>,
}

#[account]
pub struct Todo {
    name: String,
    number: u64,
    authority: Pubkey,
    bump: u8,
}
