import {
  Connection,
  clusterApiUrl,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import {
  NATIVE_MINT,
  createCloseAccountInstruction,
  createSyncNativeInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import dotenv from "dotenv";

//sol to wsol
export async function wrapSol(wallet: any, amount: number) {
  const walletPublicKey = wallet.publicKey;
  if (!walletPublicKey) {
    console.error("Wallet is not connected");
    return;
  }
  
  const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
  
  // Check if the associated token account exists, if not create it
  const associatedTokenAccount = await getAssociatedTokenAddress(
    NATIVE_MINT,
    wallet.publicKey
  );
  
  let transaction = new Transaction();
  
  // Check if the token account exists
  const tokenAccountInfo = await connection.getAccountInfo(associatedTokenAccount);
  if (!tokenAccountInfo) {
    // Create the associated token account if it doesn't exist
    transaction.add(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        associatedTokenAccount,
        wallet.publicKey,
        NATIVE_MINT
      )
    );
  }
  
  // Add instructions to wrap SOL
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: associatedTokenAccount,
      lamports: LAMPORTS_PER_SOL * amount,
    }),
    createSyncNativeInstruction(associatedTokenAccount)
  );

  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = wallet.publicKey;

  try {
    // Check if we're using a Keypair (like in our script) or a wallet adapter
    if ('secretKey' in wallet) {
      // This is a Keypair, sign directly
      transaction.sign(wallet);
      
      // Send the signed transaction
      const rawTransaction = transaction.serialize();
      const signature = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: false,
        preflightCommitment: "confirmed",
      });
      
      // Confirm the transaction
      const confirmation = await connection.confirmTransaction(signature, "confirmed");
      console.log("Transaction confirmed:", signature);
      console.log(`${amount} SOL wrapped successfully! ✅`);
      return signature;
    } else if (wallet.signTransaction) {
      // This is a wallet adapter
      const signedTransaction = await wallet.signTransaction(transaction);
      
      // Send the signed transaction
      const rawTransaction = signedTransaction.serialize();
      const signature = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: false,
        preflightCommitment: "confirmed",
      });
      
      // Confirm the transaction
      const confirmation = await connection.confirmTransaction(signature, "confirmed");
      console.log("Transaction confirmed:", signature);
      console.log(`${amount} SOL wrapped successfully! ✅`);
      return signature;
    }
  } catch (error: unknown) {
    console.error("Transaction failed:", error);

    if (error instanceof Error && "logs" in error) {
      console.error("Transaction logs:", (error as { logs: unknown }).logs);
    }
    console.error(`Failed to wrap SOL: ${error instanceof Error ? error.message : String(error)}`);
  }
}

//sol to wsol
export async function unwrapSol(wallet: any, amount: number) {
  const walletPublicKey = wallet.publicKey;
  if (!walletPublicKey) {
    console.error("Wallet is not connected");
    return;
  }
  
  const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
  
  // Get the associated token account for WSOL
  const associatedTokenAccount = await getAssociatedTokenAddress(
    NATIVE_MINT,
    wallet.publicKey
  );
  
  // Check if the token account exists
  const tokenAccountInfo = await connection.getAccountInfo(associatedTokenAccount);
  if (!tokenAccountInfo) {
    console.error("No WSOL account found to unwrap");
    console.error("No WSOL account found to unwrap");
    return;
  }
  
  // Create the unwrap instruction
  const unwrapInstruction = createCloseAccountInstruction(
    associatedTokenAccount,
    wallet.publicKey, // SOL receiver
    wallet.publicKey, // Authority
    []
  );
  
  const transaction = new Transaction().add(unwrapInstruction);
  
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = wallet.publicKey;
  
  try {
    // Check if we're using a Keypair (like in our script) or a wallet adapter
    if ('secretKey' in wallet) {
      // This is a Keypair, sign directly
      transaction.sign(wallet);
      
      // Send the signed transaction
      const rawTransaction = transaction.serialize();
      const signature = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: false,
        preflightCommitment: "confirmed",
      });
      
      // Confirm the transaction
      const confirmation = await connection.confirmTransaction(signature, "confirmed");
      console.log("Unwrap transaction confirmed:", signature);
      console.log(`${amount} WSOL unwrapped successfully! ✅`);
      return signature;
    } else if (wallet.signTransaction) {
      // This is a wallet adapter
      const signedTransaction = await wallet.signTransaction(transaction);
      
      // Send the signed transaction
      const rawTransaction = signedTransaction.serialize();
      const signature = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: false,
        preflightCommitment: "confirmed",
      });
      
      // Confirm the transaction
      const confirmation = await connection.confirmTransaction(signature, "confirmed");
      console.log("Unwrap transaction confirmed:", signature);
      console.log(`${amount} WSOL unwrapped successfully! ✅`);
      return signature;
    }
  } catch (error: unknown) {
    console.error("Unwrap transaction failed:", error);
    
    if (error instanceof Error && "logs" in error) {
      console.error("Transaction logs:", (error as { logs: unknown }).logs);
    }
    console.error(`Failed to unwrap WSOL: ${error instanceof Error ? error.message : String(error)}`);
  }
} 

dotenv.config();

const privateKey = process.env.PRIVATE_KEY;

if (!privateKey) {
  console.error("PRIVATE_KEY is not set in .env file");
  process.exit(1);
}

try {
  // Try to decode the private key
  const secretKey = bs58.decode(privateKey);
  const wallet = Keypair.fromSecretKey(secretKey);
  
  console.log("Wallet public key:", wallet.publicKey.toString());
  
  // Uncomment one of these lines to perform the desired operation:
  // wrapSol(wallet, 0.1);  // Wrap 0.1 SOL to WSOL
  unwrapSol(wallet, 0.1);  // Unwrap 0.1 WSOL to SOL
} catch (error: unknown) {
  console.error("Error with private key:", error instanceof Error ? error.message : String(error));
  console.log("Make sure your PRIVATE_KEY in .env is a valid base58-encoded Solana private key");
  process.exit(1);
}

