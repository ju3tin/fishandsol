'use client'

import { useEffect, useState } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'

const TOKEN_MINT = 'YOUR_TOKEN_MINT_ADDRESS_HERE' // replace with actual token mint
const SOLANA_RPC = 'https://api.mainnet-beta.solana.com'

export default function FormPage() {
  const [wallet, setWallet] = useState<string | null>(null)
  const [hasToken, setHasToken] = useState(false)
  const [isFriday, setIsFriday] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const today = new Date()
    setIsFriday(today.getDay() === 5)
  }, [])

  async function connectWallet() {
    if ('solana' in window) {
      const provider = (window as any).solana
      const res = await provider.connect()
      setWallet(res.publicKey.toString())
    }
  }

  async function checkTokenOwnership(walletAddress: string) {
    setLoading(true)
    const connection = new Connection(SOLANA_RPC)
    const pubkey = new PublicKey(walletAddress)

    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubkey, {
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
    })

    const found = tokenAccounts.value.some((accountInfo) => {
      const info = accountInfo.account.data.parsed.info
      return (
        info.mint === TOKEN_MINT &&
        parseFloat(info.tokenAmount.uiAmountString) > 0
      )
    })

    setHasToken(found)
    setLoading(false)
  }

  useEffect(() => {
    if (wallet) checkTokenOwnership(wallet)
  }, [wallet])

  if (!isFriday) {
    return <div className="p-6 text-red-500 text-center">Form is only available on Fridays.</div>
  }

  return (
    <div className="max-w-md mx-auto p-6">
      {!wallet ? (
        <button onClick={connectWallet} className="bg-purple-600 text-white p-2 rounded">
          Connect Wallet
        </button>
      ) : loading ? (
        <p>Checking token ownership...</p>
      ) : hasToken ? (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const data = new FormData(e.target as HTMLFormElement)
            alert(`Submitted: ${data.get('tweet')}`)
          }}
          className="flex flex-col gap-4 mt-4"
        >
          <textarea
            name="tweet"
            rows={4}
            className="w-full p-2 border rounded"
            placeholder="Write your tweet..."
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      ) : (
        <div className="text-red-500 mt-4">
          You don’t hold the required token to use this form.
        </div>
      )}
    </div>
  )
}
