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
import { Provider as ProtoProvider } from "../api/ts/src/overlock/crossplane/v1beta1/provider";
import * as borsh from "@coral-xyz/borsh";

const OnChainProviderSchema = borsh.struct([
  borsh.u8("name_len"),
  borsh.array(borsh.u8(), 50, "name"),
  borsh.u8("ip_len"),
  borsh.array(borsh.u8(), 50, "ip"),
  borsh.u16("port"),
  borsh.u8("country_len"),
  borsh.array(borsh.u8(), 50, "country"),
  borsh.u8("environment_type_len"),
  borsh.array(borsh.u8(), 50, "environment_type"),
  borsh.u8("availability"),
]);

describe("LiteSVM Provider Test", () => {
  it("creates a provider account successfully", () => {
    const svm = new LiteSVM();
    const payer = Keypair.generate();
    svm.airdrop(payer.publicKey, 1_000_000_000n);

    const programKeypair = Keypair.fromSecretKey(
      Uint8Array.from(
        JSON.parse(
          fs.readFileSync("./target/deploy/provider-keypair.json", "utf8"),
        ),
      ),
    );
    const PROGRAM_ID = programKeypair.publicKey;
    const programData = fs.readFileSync("./target/deploy/provider.so");
    svm.addProgram(PROGRAM_ID, programData);

    const providerAccount = new Keypair();

    const protoProvider: ProtoProvider = {
      metadata: { name: "test-provider", annotations: "test annotations" },
      ip: "127.0.0.1",
      port: 8080,
      countryCode: "US",
      environmentType: "dev",
      availability: "available",
      id: BigInt(1),
      creator: payer.publicKey.toBase58(),
      registerTime: new Date(1_654_000_000 * 1000),
    };

    const encoded = ProtoProvider.encode(protoProvider).finish();

    const instructionData = Buffer.concat([
      Buffer.from([0]),
      Buffer.from(encoded),
    ]);

    const createIx = new TransactionInstruction({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: payer.publicKey, isSigner: true, isWritable: true },
        { pubkey: providerAccount.publicKey, isSigner: true, isWritable: true },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data: instructionData,
    });

    const tx = new Transaction();
    tx.recentBlockhash = svm.latestBlockhash();
    tx.feePayer = payer.publicKey;
    tx.add(createIx);
    tx.sign(payer, providerAccount);

    try {
      svm.sendTransaction(tx);
    } catch (e) {
      console.error("Transaction failed!");
      if (e.logs) {
        console.error("Logs:");
        e.logs.forEach((log) => console.log(`   > ${log}`));
      }
      throw e;
    }

    const acct = svm.getAccount(providerAccount.publicKey);
    assert.ok(acct !== null, "Account not found");
    assert.ok(acct.data && acct.data.length > 0, "Account has no data");

    const decoded = OnChainProviderSchema.decode(Buffer.from(acct.data));

    const name = Buffer.from(decoded.name.slice(0, decoded.name_len)).toString(
      "utf-8",
    );
    const ip = Buffer.from(decoded.ip.slice(0, decoded.ip_len)).toString(
      "utf-8",
    );
    const country = Buffer.from(
      decoded.country.slice(0, decoded.country_len),
    ).toString("utf-8");
    const envType = Buffer.from(
      decoded.environment_type.slice(0, decoded.environment_type_len),
    ).toString("utf-8");

    assert.strictEqual(name, "test-provider", "Name mismatch");
    assert.strictEqual(ip, "127.0.0.1", "IP mismatch");
    assert.strictEqual(decoded.port, 8080, "Port mismatch");
    assert.strictEqual(country, "US", "Country mismatch");
    assert.strictEqual(envType, "dev", "Env type mismatch");
    assert.strictEqual(decoded.availability, 1, "Availability mismatch");

    console.log("Provider test passed!");
    console.log("   - Name:", name);
    console.log("   - IP:", ip);
    console.log("   - Country:", country);
    console.log("   - Env Type:", envType);
  });
});
