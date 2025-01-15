import { useState, useEffect } from "react";
import CoinMarketCapWidget from '../../../components/Coinmaket';
import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js"; // Import Solana's SDK
import { parseEther } from "ethers/lib/utils"; // You might still use ethers utils for formatting if needed

function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [inputValue, setInputValue] = useState({
    walletAddress: "",
    transferAmount: "",
    burnAmount: "",
    mintAmount: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [yourWalletAddress, setYourWalletAddress] = useState<string | null>(null);

  // Phantom Wallet connection setup
  const checkIfWalletIsConnected = async () => {
    try {
      if ("solana" in window) {
        const { solana } = window as any; // Phantom's API injected into window
        if (solana.isPhantom) {
          const response = await solana.connect(); // Connect to Phantom wallet
          setIsWalletConnected(true);
          setYourWalletAddress(response.publicKey.toString());
          console.log("Wallet connected:", response.publicKey.toString());
        } else {
          setError("Please install Phantom wallet.");
        }
      } else {
        setError("No Solana object found. Please install Phantom wallet.");
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
      setError("Failed to connect wallet. Try again.");
    }
  };

  // Transfer Token (Solana example)
  const transferToken = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (window.solana && isWalletConnected) {
        if (!yourWalletAddress) {
          setError("Wallet address is not available.");
          return;
        }

        const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
        const { solana } = window as any;
        const sender = new PublicKey(yourWalletAddress); // Ensure that `yourWalletAddress` is a valid string
        const receiver = new PublicKey(inputValue.walletAddress);
        const lamports = parseEther(inputValue.transferAmount); // Convert from SOL to lamports (1 SOL = 1 billion lamports)

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: sender,
            toPubkey: receiver,
            lamports: lamports.toString(), // Transfer amount in lamports
          })
        );

        const signature = await solana.signAndSendTransaction(transaction);
        await connection.confirmTransaction(signature, "confirmed");
        console.log("Transaction successful with signature:", signature);
      } else {
        setError("Solana wallet not found. Make sure Phantom is installed.");
      }
    } catch (err) {
      console.error("Error transferring tokens:", err);
      setError("Failed to transfer tokens. Try again.");
    }
  };

  // Handle input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  // Initialize on component mount
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <main className="main-container">
      <h2 className="headline">
        <span className="headline-gradient">Chippy Ⓜ</span> (Solana)
      </h2>
      <CoinMarketCapWidget />
      <section className="customer-section px-10 pt-5 pb-10">
        {error && <p className="text-2xl text-red-700">{error}</p>}
        <div className="mt-5">
          <span className="mr-5"><strong>Connected Wallet:</strong> {yourWalletAddress}</span>
        </div>

        {/* Transfer Token Form */}
        <div className="mt-7 mb-9">
          <form className="form-style">
            <input
              type="text"
              className="input-double"
              onChange={handleInputChange}
              name="walletAddress"
              placeholder="Wallet Address"
              value={inputValue.walletAddress}
            />
            <input
              type="number"
              className="input-double"
              onChange={handleInputChange}
              name="transferAmount"
              placeholder={`Amount in SOL`}
              value={inputValue.transferAmount}
            />
            <button
              className="btn-purple"
              onClick={transferToken}
            >
              Transfer Tokens
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default App;