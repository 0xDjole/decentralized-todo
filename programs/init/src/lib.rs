use anchor_lang::prelude::*;

#[program]
pub mod todo {
    use super::*;
    pub fn create_todo_board(ctx: Context<CreateTodoBoard>) -> ProgramResult {
        let portfolio = &mut ctx.accounts.portfolio;
        portfolio.authority = *ctx.accounts.authority.key;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateTodoBoard<'info> {
    // TODO figure out how to get the constraint on the mint of the vault
    // workaround would be to pass in mint and add contraint to
    // the vault_account.mint == mint
    #[account(init, associated = authority, with = vault_account)]
    pub portfolio: ProgramAccount<'info, Portfolio>,
    pub vault_account: AccountInfo<'info>,
    #[account(mut, signer)]
    authority: AccountInfo<'info>,
    rent: Sysvar<'info, Rent>,
    system_program: AccountInfo<'info>,
}

#[associated]
#[derive(Default)]
pub struct Portfolio {
    /// The users owner address that must sign all transactions for the account
    authority: Pubkey,
}
