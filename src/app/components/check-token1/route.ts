// app/api/check-token/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';

const connection = new Connection('https://api.devnet.solana.com');

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get('wallet');
  const tokenMint = searchParams.get('tokenMint');

  if (!wallet || !tokenMint) {
    return NextResponse.json({ error: 'Missing wallet or tokenMint' }, { status: 400 });
  }

  try {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      new PublicKey(wallet),
      { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') }
    );

    const hasToken = tokenAccounts.value.some((accountInfo) => {
      const info = accountInfo.account.data.parsed.info;
      return (
        info.mint === tokenMint &&
        parseInt(info.tokenAmount.amount) > 0
      );
    });

    return NextResponse.json({ hasToken });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
