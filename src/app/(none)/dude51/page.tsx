'use client'

import { useState } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'

export default function Page() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const checkTokenAccount = async () => {
    setLoading(true)
    setResult(null)

    try {
      const pubkey = new PublicKey(input)
      const connection = new Connection('https://api.devnet.solana.com')

      const info = await connection.getParsedAccountInfo(pubkey)

      const data = info.value?.data as any

      if (data?.program === 'spl-token') {
        setResult('✅ This is a valid SPL Token account.')
      } else {
        setResult('❌ This is not a token account.')
      }
    } catch (err: any) {
      console.error(err)
      setResult('❌ Invalid public key or unable to fetch account info.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex flex-col items-center gap-4 p-8">
      <h1 className="text-2xl font-bold">SPL Token Account Checker</h1>
      <input
        type="text"
        placeholder="Enter token account address"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border px-4 py-2 w-[400px]"
      />
      <button
        onClick={checkTokenAccount}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Checking...' : 'Check'}
      </button>
      {result && <p className="text-lg">{result}</p>}
    </main>
  )
}
