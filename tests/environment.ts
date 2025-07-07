import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import * as assert from "assert";
import * as fs from "fs";
import { LiteSVM } from "litesvm";
import { Environment } from "../api/ts/src/overlock/crossplane/v1beta1/environment";
import * as borsh from "@coral-xyz/borsh";

const OnChainEnvironmentSchema = borsh.struct([
  borsh.u8("name_len"),
  borsh.array(borsh.u8(), 50, "name"),
  borsh.publicKey("owner"),
  borsh.publicKey("provider"),
]);

describe("LiteSVM program test", () => {
  it("runs a custom instruction successfully", () => {
    const svm = new LiteSVM();

    const payer = Keypair.generate();
    svm.airdrop(payer.publicKey, 1_000_000_000n);

    const programKeypair = Keypair.fromSecretKey(
      Uint8Array.from(
        JSON.parse(
          fs.readFileSync("./target/deploy/environment-keypair.json", "utf8"),
        ),
      ),
    );
    const PROGRAM_ID = programKeypair.publicKey;
    console.log("Program ID:", PROGRAM_ID.toBase58());

    const programData = fs.readFileSync("./target/deploy/environment.so");
    svm.addProgram(PROGRAM_ID, programData);

    const envAccount = new Keypair();

    const envData: Environment = {
      metadata: { name: "test-env", annotations: "from" },
      id: 1n,
      creator: payer.publicKey.toBase58(),
      provider: BigInt(0),
    };

    const protoEncodedData = Environment.encode(envData).finish();
    const instructionData = Buffer.concat([
      Buffer.from([0]),
      Buffer.from(protoEncodedData),
    ]);

    const createIx = new TransactionInstruction({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: payer.publicKey, isSigner: true, isWritable: true },
        { pubkey: envAccount.publicKey, isSigner: true, isWritable: true },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data: instructionData,
    });

    const tx = new Transaction();
    tx.recentBlockhash = svm.latestBlockhash();
    tx.feePayer = payer.publicKey;
    tx.add(createIx);
    tx.sign(payer, envAccount);

    try {
      svm.sendTransaction(tx);
    } catch (e) {
      console.error("Transaction failed!");
      if (e.logs) {
        console.error("Program Logs:");
        e.logs.forEach((log) => console.log(`   > ${log}`));
      }
      throw e;
    }
    const acct = svm.getAccount(envAccount.publicKey);
    assert.ok(acct !== null, "Account not found");
    assert.ok(acct.data && acct.data.length > 0, "Account has no data");

    const decoded = OnChainEnvironmentSchema.decode(Buffer.from(acct.data));

    const nameBytes = decoded.name.slice(0, decoded.name_len);
    const name = Buffer.from(nameBytes).toString("utf-8");

    assert.strictEqual(
      decoded.owner.toBase58(),
      payer.publicKey.toBase58(),
      "Owner does not match",
    );
    assert.strictEqual(name, "test-env", "Name does not match");
    assert.strictEqual(
      decoded.provider.toBase58(),
      new PublicKey(0).toBase58(),
    );

    console.log("Test passed!");
    console.log("   - Account Owner:", decoded.owner.toBase58());
    console.log("   - Environment Name:", name);
  });
});
