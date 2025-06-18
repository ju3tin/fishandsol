// utils/checkToken.ts
import { Connection, PublicKey } from '@solana/web3.js';

export async function checkTokenInWallet(walletAddress: string, tokenMint: string): Promise<boolean> {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
    new PublicKey(walletAddress),
    {
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
    }
  );

  return tokenAccounts.value.some(
    (accountInfo) =>
      accountInfo.account.data.parsed.info.mint === tokenMint &&
      parseInt(accountInfo.account.data.parsed.info.tokenAmount.amount) > 0
  );
}
