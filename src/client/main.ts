import {
  Connection,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { readFile } from "fs/promises";
import path from "path";

// import the keypair which we had build on rust on-chain
const myKeypair = path.join(
  path.resolve(__dirname, "../../contract/program"),
  "solana_2-keypair.json"
);

// Define Main function
async function main() {
  console.log("--------------- Starting the program -------------");

  // Connection to the solana network
  const localConnection = new Connection("http://localhost:8899", "confirmed");

  // Get our program public key
  const secretKeyString = await readFile(myKeypair, "utf-8");
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  const programKeypair = Keypair.fromSecretKey(secretKey);

  // get the program id
  const programId: PublicKey = programKeypair.publicKey;

  // Generating an account keypair to transact with our program
  const accountKeypair = Keypair.generate();

  // Airdrop some SOL to the account
  const airdropReq = await localConnection.requestAirdrop(
    accountKeypair.publicKey,
    LAMPORTS_PER_SOL
  );
  await localConnection.confirmTransaction(airdropReq);

  // Let execute the transaction
  const instruction = new TransactionInstruction({
    keys: [
      {
        pubkey: accountKeypair.publicKey,
        isSigner: false,
        isWritable: true,
      },
    ],
    programId: programId,
    data: Buffer.alloc(0),
  });
  await sendAndConfirmTransaction(localConnection, new Transaction().add(instruction), [
    accountKeypair,
  ]);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
