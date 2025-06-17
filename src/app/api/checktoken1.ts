// pages/api/check-token.ts

import type { NextApiRequest, NextApiResponse } from 'next';

const HELIUS_API_KEY = process.env.HELIUS_API_KEY;
const HELIUS_ENDPOINT = `https://api.helius.xyz/v0/addresses`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { wallet, tokenMint } = req.query;

  if (!wallet || typeof wallet !== 'string' || !tokenMint || typeof tokenMint !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid wallet or tokenMint' });
  }

  try {
    const response = await fetch(
      `${HELIUS_ENDPOINT}/${wallet}/tokens?api-key=${HELIUS_API_KEY}`
    );

    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch token data' });
    }

    const tokens = await response.json();

    const hasToken = tokens.some(
      (token: any) => token.tokenAddress === tokenMint && Number(token.amount) > 0
    );

    return res.status(200).json({ hasToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
