import * as anchor from '@project-serum/anchor'

describe('todoBoard', () => {
    const provider = anchor.Provider.env()
    // Configure the client to use the local cluster.
    anchor.setProvider(provider)
    const program = anchor.workspace.Todo

    it('should create todo board', async () => {
        const todoBoardAuthority = anchor.web3.Keypair.generate()
        // airdrop to the authority
        let todoBoardType = anchor.web3.Keypair.generate()
        let todoBoardTypeKey = todoBoardType.publicKey
        let holder = anchor.web3.Keypair.generate()

        await provider.connection.confirmTransaction(
            await provider.connection.requestAirdrop(
                todoBoardAuthority.publicKey,
                10000000000
            ),
            'confirmed'
        )
        // generate the associated key
        const todoBoardKey = await program.account.todoBoard.associatedAddress(
            todoBoardAuthority.publicKey,
            todoBoardTypeKey
        )

        await program.rpc.createTodoBoard('Board name', {
            accounts: {
                holder: holder.publicKey,
                todoBoard: todoBoardKey,
                todoBoardType: todoBoardTypeKey,
                authority: todoBoardAuthority.publicKey,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                systemProgram: anchor.web3.SystemProgram.programId
            },
            signers: [holder, todoBoardAuthority],
            instructions: [
                await program.account.holder.createInstruction(holder, 300)
            ]
        })

        const account = await program.account.todoBoard.associated(
            todoBoardAuthority.publicKey,
            todoBoardTypeKey
        )

        console.log(account)
    })
})
