"use client"

import { useState, useMemo, useEffect } from "react"
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Program, AnchorProvider, BN, type Idl } from "@coral-xyz/anchor"
import { PublicKey, SystemProgram } from "@solana/web3.js"
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

// Mock IDL - replace with your actual IDL
const idl = {
  version: "0.1.0",
  name: "staking_program",
  instructions: [
    {
      name: "initializePool",
      accounts: [
        { name: "pool", isMut: true, isSigner: false },
        { name: "authority", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [{ name: "allowedMints", type: { vec: "publicKey" } }],
    },
    {
      name: "stake",
      accounts: [
        { name: "pool", isMut: true, isSigner: false },
        { name: "stakeAccount", isMut: true, isSigner: false },
        { name: "stakeVault", isMut: true, isSigner: false },
        { name: "userTokenAccount", isMut: true, isSigner: false },
        { name: "tokenMint", isMut: false, isSigner: false },
        { name: "user", isMut: true, isSigner: true },
        { name: "tokenProgram", isMut: false, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
      args: [
        { name: "amount", type: "u64" },
        { name: "lockupPeriod", type: { defined: "LockupPeriod" } },
      ],
    },
    {
      name: "unstake",
      accounts: [
        { name: "pool", isMut: true, isSigner: false },
        { name: "stakeAccount", isMut: true, isSigner: false },
        { name: "stakeVault", isMut: true, isSigner: false },
        { name: "userTokenAccount", isMut: true, isSigner: false },
        { name: "user", isMut: true, isSigner: true },
        { name: "tokenProgram", isMut: false, isSigner: false },
      ],
      args: [],
    },
  ],
  types: [
    {
      name: "LockupPeriod",
      type: {
        kind: "enum",
        variants: [{ name: "OneMonth" }, { name: "ThreeMonths" }, { name: "SixMonths" }, { name: "OneYear" }],
      },
    },
  ],
} as unknown as Idl

const programId = new PublicKey("547rLiMZJMFCFxqwox5BoTtSmwy5wuZuitQPDqgnutqi")

export default function Home() {
  const { connection } = useConnection()
  const wallet = useAnchorWallet()
  const [mintAddress, setMintAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [lockupPeriod, setLockupPeriod] = useState("oneMonth")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userTokenAccount, setUserTokenAccount] = useState<PublicKey | null>(null)
  const [walletError, setWalletError] = useState("")

  useEffect(() => {
    console.log("Wallet:", wallet)
    console.log("Connection:", connection)
  }, [wallet, connection])

  // Get user's associated token account
  useEffect(() => {
    const getUserTokenAccount = async () => {
      if (wallet && mintAddress) {
        try {
          const mintPubkey = new PublicKey(mintAddress)
          const ata = await getAssociatedTokenAddress(mintPubkey, wallet.publicKey)
          setUserTokenAccount(ata)
        } catch (error) {
          console.error("Error getting user token account:", error)
          setUserTokenAccount(null)
        }
      }
    }

    getUserTokenAccount()
  }, [wallet, mintAddress])

  useEffect(() => {
    // Clear any wallet errors when wallet changes
    if (wallet) {
      setWalletError("")
    }
  }, [wallet])

  const program = useMemo(() => {
    if (!wallet || !connection) {
      if (!wallet) {
        setMessage("Please connect your wallet")
      }
      return null
    }

    console.log("Initializing provider with:", { connection, wallet })

    try {
      // Ensure wallet is properly connected before creating provider
      if (!wallet.publicKey) {
        setMessage("Wallet not properly connected")
        return null
      }

      const provider = new AnchorProvider(connection, wallet, {
        commitment: "confirmed",
        preflightCommitment: "confirmed",
      })

      console.log("Provider:", provider)

      const programInstance = new Program(idl, provider)
      console.log("Program initialized:", programInstance.programId.toBase58())
      setMessage("") // Clear any previous messages
      return programInstance
    } catch (error) {
      console.error("Program initialization error:", error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      setMessage(`Failed to initialize program: ${errorMessage}`)
      return null
    }
  }, [wallet, connection])

  const initializePool = async () => {
    if (!program || !wallet) {
      setMessage("Please connect your wallet and ensure program is initialized")
      return
    }

    if (!mintAddress) {
      setMessage("Please enter a token mint address")
      return
    }

    setIsLoading(true)
    setMessage("")

    try {
      const [pool] = PublicKey.findProgramAddressSync([Buffer.from("pool"), wallet.publicKey.toBuffer()], programId)

      const mintPubkey = new PublicKey(mintAddress)

      await program.methods
        .initializePool([mintPubkey])
        .accounts({
          pool,
          authority: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc()

      setMessage("Pool initialized successfully!")
    } catch (error) {
      console.error("Initialize pool error:", error)
      setMessage(`Error initializing pool: ${error instanceof Error ? error.message : String(error)}`)
    }

    setIsLoading(false)
  }

  const stake = async () => {
    if (!program || !wallet) {
      setMessage("Please connect your wallet and ensure program is initialized")
      return
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setMessage("Please enter a valid amount")
      return
    }

    if (!userTokenAccount) {
      setMessage("User token account not found. Please ensure you have the token in your wallet.")
      return
    }

    setIsLoading(true)
    setMessage("")

    try {
      const [pool] = PublicKey.findProgramAddressSync([Buffer.from("pool"), wallet.publicKey.toBuffer()], programId)

      const [stakeAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("stake"), wallet.publicKey.toBuffer(), pool.toBuffer()],
        programId,
      )

      const [stakeVault] = PublicKey.findProgramAddressSync([Buffer.from("vault"), pool.toBuffer()], programId)

      const tokenMint = new PublicKey(mintAddress)

      // Convert lockup period to the correct enum format
      const lockupPeriodEnum = {
        oneMonth: { oneMonth: {} },
        threeMonths: { threeMonths: {} },
        sixMonths: { sixMonths: {} },
        oneYear: { oneYear: {} },
      }[lockupPeriod]

      await program.methods
        .stake(new BN(amount), lockupPeriodEnum)
        .accounts({
          pool,
          stakeAccount,
          stakeVault,
          userTokenAccount,
          tokenMint,
          user: wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc()

      setMessage(`Staked ${amount} tokens successfully!`)
      setAmount("")
    } catch (error) {
      console.error("Stake error:", error)
      setMessage(`Error staking: ${error instanceof Error ? error.message : String(error)}`)
    }

    setIsLoading(false)
  }

  const unstake = async () => {
    if (!program || !wallet) {
      setMessage("Please connect your wallet and ensure program is initialized")
      return
    }

    if (!userTokenAccount) {
      setMessage("User token account not found.")
      return
    }

    setIsLoading(true)
    setMessage("")

    try {
      const [pool] = PublicKey.findProgramAddressSync([Buffer.from("pool"), wallet.publicKey.toBuffer()], programId)

      const [stakeAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("stake"), wallet.publicKey.toBuffer(), pool.toBuffer()],
        programId,
      )

      const [stakeVault] = PublicKey.findProgramAddressSync([Buffer.from("vault"), pool.toBuffer()], programId)

      await program.methods
        .unstake()
        .accounts({
          pool,
          stakeAccount,
          stakeVault,
          userTokenAccount,
          user: wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc()

      setMessage("Unstaked successfully!")
    } catch (error) {
      console.error("Unstake error:", error)
      setMessage(`Error unstaking: ${error instanceof Error ? error.message : String(error)}`)
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Solana Staking Program</h1>
          <p className="text-gray-600">Stake your tokens and earn rewards</p>
        </div>

        <div className="flex justify-center">
          <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700" />
        </div>

        {message && (
          <Alert className={message.includes("Error") ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
            <AlertDescription className={message.includes("Error") ? "text-red-800" : "text-green-800"}>
              {message}
            </AlertDescription>
          </Alert>
        )}

        {walletError && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">Wallet Error: {walletError}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">Initialize Pool</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="mintAddress">Token Mint Address</Label>
                <Input
                  id="mintAddress"
                  type="text"
                  value={mintAddress}
                  onChange={(e) => setMintAddress(e.target.value)}
                  placeholder="Enter token mint address"
                  className="mt-1"
                />
              </div>
              <Button onClick={initializePool} disabled={isLoading || !program || !mintAddress} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Initialize Pool"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stake Tokens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount to Stake</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lockupPeriod">Lockup Period</Label>
                <Select value={lockupPeriod} onValueChange={setLockupPeriod}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oneMonth">1 Month (5% APY)</SelectItem>
                    <SelectItem value="threeMonths">3 Months (15% APY)</SelectItem>
                    <SelectItem value="sixMonths">6 Months (20% APY)</SelectItem>
                    <SelectItem value="oneYear">1 Year (30% APY)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={stake}
                disabled={isLoading || !program || !amount || !mintAddress}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Stake Tokens"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Unstake Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={unstake} disabled={isLoading || !program} variant="destructive" className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Unstake Tokens"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {userTokenAccount && (
          <div className="text-center text-sm text-gray-600">
            <p>User Token Account: {userTokenAccount.toBase58()}</p>
          </div>
        )}
      </div>
    </div>
  )
}
