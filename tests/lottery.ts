import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Lottery } from "../target/types/lottery";
async function airdropSol(publicKey, amount) {
  let airdropTx = await anchor.getProvider().connection.requestAirdrop(publicKey, amount);
  await confirmTransaction(airdropTx);
}

async function confirmTransaction(tx) {
  const latestBlockHash = await anchor.getProvider().connection.getLatestBlockhash();
  await anchor.getProvider().connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: tx,
  });
}
describe("lottery", () => {
  // Configure the client to use the local cluster.

  const program = anchor.workspace.Lottery as Program<Lottery>;

  it("Set map", async () => {

    anchor.setProvider(anchor.AnchorProvider.env());
    const newKeypair = anchor.web3.Keypair.generate();
    await airdropSol(newKeypair.publicKey, 1e9); // 1 SOL

    const key1 = new anchor.BN(42);
    const key2 = new anchor.BN(2);
    const val = new anchor.BN(6);

    const keyOne = new anchor.BN(1);
    const keyTwo = new anchor.BN(5);
    const valDefault = new anchor.BN(1000000);
    const ticketNumber = new anchor.BN(1999999);
    const ticketNumberUser = new anchor.BN(1899999);

    const seeds = [key1.toArrayLike(Buffer, "le", 8), key2.toArrayLike(Buffer, "le", 8)];
    let valueAccount = anchor.web3.PublicKey.findProgramAddressSync(
      seeds,
      program.programId
    )[0];

    await program.methods.initialize(key1, key2).accounts(valueAccount).rpc()
    await program.methods.set(key1,key2,ticketNumber).accounts({ lotteryInfo: valueAccount }).rpc()



    // const seedsTwo = [keyOne.toArrayLike(Buffer, "le", 8), keyTwo.toArrayLike(Buffer, "le", 8)];
    // let valueAccountTwo = anchor.web3.PublicKey.findProgramAddressSync(
    //   seedsTwo,
    //   program.programId
    // )[0];

    // await program.methods.initialize(keyOne, keyTwo).accounts({signer:newKeypair.publicKey,lottery_info:valueAccountTwo} as any).signers([newKeypair]).rpc()
    // await program.methods.set(keyOne,keyTwo,valDefault).accounts({lotteryInfo: valueAccountTwo }).rpc()
    // await program.methods.set(keyOne,keyTwo,valSigner).accounts({signer:newKeypair.publicKey, lotteryInfo: valueAccountTwo }).signers([newKeypair]).rpc()


    await program.methods.pickWinner(key1,key2,ticketNumberUser).accounts({ lotteryInfo: valueAccount }).rpc()
    let result = await program.account.lotteryInfo.fetch(valueAccount)
    console.log("resultTI: ", result.tickets, valueAccount.toBase58())
    console.log("resultFC: ", result.fullMatchCount)
    console.log("resultFM: ", result.fullMatch)
    console.log("result5C: ", result.partial5Count)
    console.log("result5M: ", result.partial5Match)
    // result = await program.account.lotteryInfo.fetch(valueAccountTwo)

    // console.log("result: ", result, valueAccountTwo.toBase58())
  });
});
