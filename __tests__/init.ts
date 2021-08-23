import * as anchor from '@project-serum/anchor'

describe('todoBoard', () => {
    const provider = anchor.Provider.env()
    // Configure the client to use the local cluster.
    anchor.setProvider(provider)
    const program = anchor.workspace.Todo

    it('should create todo board', async () => {
        const user = anchor.web3.Keypair.generate()
        const todoBoardAccount = anchor.web3.Keypair.generate()

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
        expect(todoBoardFetched.name).toBe(boardName.toString())
    })
})
