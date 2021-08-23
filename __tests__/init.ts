import * as anchor from '@project-serum/anchor'

describe('todoBoard', () => {
    const provider = anchor.Provider.env()
    // Configure the client to use the local cluster.
    anchor.setProvider(provider)
    const program = anchor.workspace.Todo

    it('should create todo board', async () => {
        const user = anchor.web3.Keypair.generate()
        const todoBoardAccount = anchor.web3.Keypair.generate()

        await provider.connection.confirmTransaction(
            await provider.connection.requestAirdrop(
                user.publicKey,
                10000000000
            ),
            'confirmed'
        )

        const boardName = 'Board name'
        await program.rpc.createTodoBoard(boardName, {
            accounts: {
                todoBoard: todoBoardAccount.publicKey,
                authority: user.publicKey,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                systemProgram: anchor.web3.SystemProgram.programId
            },
            signers: [user, todoBoardAccount],
            instructions: [
                await program.account.todoBoard.createInstruction(
                    todoBoardAccount,
                    300
                )
            ]
        })

        const todoBoardFetched = await program.account.todoBoard.fetch(
            todoBoardAccount.publicKey
        )

        console.log(todoBoardFetched)
        // Check it's state was initialized.

        const todoKey = await program.account.todo.associatedAddress(
            user.publicKey,
            todoBoardAccount.publicKey
        )

        console.log(todoKey, todoBoardAccount.publicKey, user.publicKey)

        const todoName = 'Todo name'
        await program.rpc.createTodo(todoName, {
            accounts: {
                todo: todoKey,
                todoBoard: todoBoardAccount.publicKey,
                authority: user.publicKey,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                systemProgram: anchor.web3.SystemProgram.programId
            },
            signers: [user]
        })

        expect(todoBoardFetched.name).toBe(boardName.toString())
    })
})
