import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Counterapp } from "../target/types/counterapp";

describe("counterapp", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Counterapp as Program<Counterapp>;

  it("Is initialized!", async () => {
    const key = new anchor.BN(42);

    const seeds = [key.toArrayLike(Buffer,"le",8)];
    let valueAccount = anchor.web3.PublicKey.findProgramAddressSync(
      seeds,
      program.programId
    )[0];

    await program.methods.initialize(key).accounts(valueAccount).rpc()
  });
});
