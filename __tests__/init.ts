import * as anchor from '@project-serum/anchor'

describe('todoBoard', () => {
    const provider = anchor.Provider.env()
    // Configure the client to use the local cluster.
    anchor.setProvider(provider)
    const program = anchor.workspace.Todo

    it('should create todo board', async () => {
        // owner of the portfolio that will be created
        const todoBoardAuthority = anchor.web3.Keypair.generate()
        // airdrop to the authority
        let vaultAPublicKey = anchor.web3.Keypair.generate().publicKey

        await provider.connection.confirmTransaction(
            await provider.connection.requestAirdrop(
                todoBoardAuthority.publicKey,
                10000000000
            ),
            'confirmed'
        )
        // generate the associated key
        const portfolioKey = await program.account.portfolio.associatedAddress(
            todoBoardAuthority.publicKey,
            vaultAPublicKey
        )

        await program.rpc.createTodoBoard({
            accounts: {
                portfolio: portfolioKey,
                vaultAccount: vaultAPublicKey,
                authority: todoBoardAuthority.publicKey,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                systemProgram: anchor.web3.SystemProgram.programId
            },
            signers: [todoBoardAuthority]
        })

        const account = await program.account.portfolio.associated(
            todoBoardAuthority.publicKey,
            vaultAPublicKey
        )

        console.log(account)
    })
})
