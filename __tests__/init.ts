import * as anchor from '@project-serum/anchor'
import assert from 'assert'

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

        const boardName: string = 'Board name'
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

        const todoKey = await program.account.todo.associatedAddress(
            user.publicKey,
            todoBoardAccount.publicKey
        )

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

        const todo = await program.account.todo.associated(
            user.publicKey,
            todoBoardAccount.publicKey
        )

        const parsedTodoName = new TextDecoder('utf-8')
            .decode(new Uint8Array(todo.name).filter(element => element))
            .trim()

        expect(todoBoardFetched.name).toBe(boardName)
        expect(parsedTodoName).toBe(todoName)
    })
})
