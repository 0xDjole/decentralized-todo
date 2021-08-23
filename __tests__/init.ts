import * as anchor from '@project-serum/anchor'

describe('init', () => {
    // Configure the client to use the local cluster.
    const provider = anchor.Provider.env()
    anchor.setProvider(provider)
    const program = anchor.workspace.Todo

    // Add your test here.
    // The Account to create.
    const todoAccount = anchor.web3.Keypair.generate()
    const user = anchor.web3.Keypair.generate()

    it('Is initialized!', async () => {
        // Atomically create the new account and initialize it with the program.
        const value = 'something'
        await program.rpc.createTodo(value, {
            accounts: {
                todoAccount: todoAccount.publicKey,
                authority: user.publicKey,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY
            },
            signers: [todoAccount, user],
            instructions: [
                await program.account.todoAccount.createInstruction(
                    todoAccount,
                    300
                )
            ]
        })

        const todoFetched = await program.account.todoAccount.fetch(
            todoAccount.publicKey
        )

        console.log(todoFetched)
        // Check it's state was initialized.
        expect(todoFetched.todo.toString()).toBe(value.toString())
    })
})
