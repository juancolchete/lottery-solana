import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Lottery } from "../target/types/lottery";

describe("lottery", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Lottery as Program<Lottery>;

  it("Set map", async () => {
    const key1 = new anchor.BN(42);
    const key2 = new anchor.BN(2);
    const val = new anchor.BN(6);

    const keyOne = new anchor.BN(1);
    const keyTwo = new anchor.BN(5);
    const valDefault = new anchor.BN(8);

    const seeds = [key1.toArrayLike(Buffer,"le",8),key2.toArrayLike(Buffer,"le",8)];
    let valueAccount = anchor.web3.PublicKey.findProgramAddressSync(
      seeds,
      program.programId
    )[0];

    await program.methods.initialize(key1,key2).accounts(valueAccount).rpc()
    await program.methods.set(key1,key2, val).accounts({val: valueAccount}).rpc()



    const seedsTwo = [keyOne.toArrayLike(Buffer,"le",8),keyTwo.toArrayLike(Buffer,"le",8)];
    let valueAccountTwo = anchor.web3.PublicKey.findProgramAddressSync(
      seedsTwo,
      program.programId
    )[0];

    await program.methods.initialize(keyOne,keyTwo).accounts(valueAccountTwo).rpc()
    await program.methods.set(keyOne,keyTwo, valDefault).accounts({val: valueAccountTwo}).rpc()

    let result = await program.account.val.fetch(valueAccount)

    console.log("result: ",result.value,valueAccount.toBase58())
    result = await program.account.val.fetch(valueAccountTwo)

    console.log("result: ",result.value,valueAccountTwo.toBase58())
  });
});
