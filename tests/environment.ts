import * as anchor from "@coral-xyz/anchor";
import { Keypair } from "@solana/web3.js";
import type { Environment as envProgram } from "../target/types/environment";

describe("Account Data!", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;
  const program = anchor.workspace.environment as anchor.Program<envProgram>;

  // Generate a new keypair for the envInfo account
  const envAccount = new Keypair();

  it("Create the env account", async () => {
    console.log(`Payer Address      : ${payer.publicKey}`);
    console.log(`Address Info Acct  : ${envAccount.publicKey}`);

    // Instruction Ix data
    const envInfo = {
      name: "test-env",
      owner: payer.publicKey,
      provider: envAccount.publicKey,
    };

    await program.methods
      .createEnvironment(envInfo.name, envInfo.owner, envInfo.provider)
      .accounts({
        environment: envAccount.publicKey,
        payer: payer.publicKey,
      })
      .signers([envAccount])
      .rpc();
  });

  it("Read the new account's data", async () => {
    const envResponse = await program.account.environment.fetch(
      envAccount.publicKey,
    );
    console.log(`Name     : ${envResponse.name}`);
    console.log(`Owner       : ${envResponse.owner}`);
    console.log(`Provider     : ${envResponse.provider}`);
  });
});
