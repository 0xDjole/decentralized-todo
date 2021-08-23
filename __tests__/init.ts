import * as anchor from '@project-serum/anchor'

describe('todoBoard', () => {
    const provider = anchor.Provider.env()
    // Configure the client to use the local cluster.
    anchor.setProvider(provider)
    const program = anchor.workspace.Todo

    it('should create todo board', async () => {
        const user = anchor.web3.Keypair.generate()
        const todoBoardAccount = anchor.web3.Keypair.generate()
        // airdrop to the authority

        await program.rpc.createTodoBoard('Board name', {
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
    })
})
