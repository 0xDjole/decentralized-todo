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

    pub fn create_todo(ctx: Context<CreateTodo>, todo_name: Option<String>) -> ProgramResult {
        let todo = &mut ctx.accounts.todo;
        let todo_board = &mut ctx.accounts.todo_board;

        let given_todo_name = todo_name.unwrap();
        let given_todo_name_bytes = given_todo_name.as_bytes();

        let mut parsed_todo_name = [0u8; 30];

        parsed_todo_name[..given_todo_name_bytes.len()].copy_from_slice(given_todo_name_bytes);

        todo.authority = todo_board.authority;
        todo.name = parsed_todo_name;
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
pub struct CreateTodo<'info> {
    #[account(init, associated = authority, with = todo_board)]
    pub todo: ProgramAccount<'info, Todo>,
    pub todo_board: ProgramAccount<'info, TodoBoard>,
    #[account(mut, signer)]
    authority: AccountInfo<'info>,
    rent: Sysvar<'info, Rent>,
    system_program: AccountInfo<'info>,
}

#[associated]
#[derive(Default)]
pub struct Todo {
    name: [u8; 30],
    authority: Pubkey,
}
