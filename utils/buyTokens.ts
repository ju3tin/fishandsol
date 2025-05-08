import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";

export async function buyTokens(wallet: AnchorWallet, connection: Connection, tokenAmount: number): Promise<string> {
  const transaction = new Transaction();
  const lamports = tokenAmount * 1_000_000_000;
  const recipient = new PublicKey("YourTokenSaleRecipientPublicKeyHere");

  transaction.add(
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: recipient,
      lamports,
    })
  );

  const signed = await wallet.signTransaction(transaction);
  const txid = await connection.sendRawTransaction(signed.serialize());
  await connection.confirmTransaction(txid, "confirmed");

  return txid;
}