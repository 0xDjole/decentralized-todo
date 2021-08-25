import * as anchor from '@project-serum/anchor'
const { PublicKey } = anchor.web3

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

        const todoNumber = 1
        const byteArray = new Uint8Array([0, 0, 0, 0, 0, 0, 0, todoNumber])

        const [todoKey, bump] = await PublicKey.findProgramAddress(
            [todoBoardAccount.publicKey.toBuffer(), byteArray],
            program.programId
        )

        const todoNameInput = 'My todo'
        await program.rpc.createTodo(
            todoNameInput,
            new anchor.BN(todoNumber),
            bump,
            {
                accounts: {
                    todo: todoKey,
                    todoBoard: todoBoardAccount.publicKey,
                    authority: user.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId
                },
                signers: [user]
            }
        )
        const todo = await program.account.todo.fetch(todoKey)
        expect(todo.name).toEqual(todoNameInput)
        expect(todo.authority).toEqual(todoBoardAccount.publicKey)
        expect(todoBoardFetched.name).toBe(boardName)

        const todoNameUpdatedInput = 'Updated todo'

        await program.rpc.updateTodo(
            todoNameUpdatedInput,
            new anchor.BN(todoNumber),
            bump,
            {
                accounts: {
                    todo: todoKey,
                    todoBoard: todoBoardAccount.publicKey,
                    authority: user.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId
                },
                signers: [user]
            }
        )

        const updatedTodo = await program.account.todo.fetch(todoKey)
        expect(updatedTodo.name).toEqual(todoNameUpdatedInput)
    })
})
