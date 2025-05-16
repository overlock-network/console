import * as anchor from "@coral-xyz/anchor";
import { Keypair } from "@solana/web3.js";
import type { Provider as ProviderProgram } from "../target/types/provider";

describe("Account Data!", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;
  const program = anchor.workspace.provider as anchor.Program<ProviderProgram>;

  // Generate a new keypair for the providerInfo account
  const providerAccount = new Keypair();

  it("Create the provider account", async () => {
    console.log(`Payer Address      : ${payer.publicKey}`);
    console.log(`Address Info Acct  : ${providerAccount.publicKey}`);

    // Instruction Ix data
    const providerInfo = {
      name: "test-provider",
      ip: "127.0.0.1",
      port: 5000,
      country: "MD",
      environment_type: "crossplane",
      availability: true,
    };

    await program.methods
      .registerProvider(
        providerInfo.name,
        providerInfo.ip,
        providerInfo.port,
        providerInfo.country,
        providerInfo.environment_type,
        providerInfo.availability,
      )
      .accounts({
        provider: providerAccount.publicKey,
        payer: payer.publicKey,
      })
      .signers([providerAccount])
      .rpc();
  });

  it("Read the new account's data", async () => {
    const providerResponse = await program.account.provider.fetch(
      providerAccount.publicKey,
    );
    console.log(`Name     : ${providerResponse.name}`);
    console.log(`Ip       : ${providerResponse.ip}`);
    console.log(`Port     : ${providerResponse.port}`);
    console.log(`Country  : ${providerResponse.country}`);
    console.log(`Type     : ${providerResponse.environmentType}`);
    console.log(`Available: ${providerResponse.availability}`);
  });
});
