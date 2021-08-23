use anchor_lang::prelude::*;

#[program]
pub mod todo {
    use super::*;
    pub fn create_todo(ctx: Context<CreateTodoContext>, todo: Option<String>) -> ProgramResult {
        let todo_account = &mut ctx.accounts.todo_account;
        todo_account.todo = todo;
        todo_account.authority = *ctx.accounts.authority.to_account_info().key;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateTodoContext<'info> {
    #[account(init)]
    pub todo_account: ProgramAccount<'info, TodoAccount>,
    #[account(signer)]
    pub authority: AccountInfo<'info>,
}

#[account]
pub struct TodoAccount {
    pub todo: Option<String>,
    pub authority: Pubkey,
}
