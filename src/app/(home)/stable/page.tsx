"use client";

import { useState, useEffect } from "react";
import { ethers, BrowserProvider } from "ethers";
import abi from "./contracts/MemeCoin.json";
import { formatEther, Web3Provider, parseEther } from "ethers/lib/utils";

function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [inputValue, setInputValue] = useState({
    walletAddress: "",
    transferAmount: "",
    burnAmount: "",
    mintAmount: "",
  });
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenTotalSupply, setTokenTotalSupply] = useState(0);
  const [isTokenOwner, setIsTokenOwner] = useState(false);
  const [tokenOwnerAddress, setTokenOwnerAddress] = useState(null);
  const [yourWalletAddress, setYourWalletAddress] = useState(null);
  const [error, setError] = useState(null);

  const contractAddress = "0xEbaAFC08E349776aa63c024196ce3385BC4aB48A";
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const account = accounts[0];
        setIsWalletConnected(true);
        setYourWalletAddress(account);
        console.log("Account Connected: ", account);
      } else {
        setError("No Metamask detected. Please install it to use this application.");
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
      setError("Failed to connect wallet. Try again.");
    }
  };

  const getTokenInfo = async () => {
    try {
      if (window.ethereum) {
        const provider = new Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(contractAddress, contractABI, signer);

        const [account] = await window.ethereum.request({ method: "eth_requestAccounts" });
        const tokenName = await tokenContract.name();
        const tokenSymbol = await tokenContract.symbol();
        const tokenOwner = await tokenContract.owner();
        let tokenSupply = await tokenContract.totalSupply();
        tokenSupply = formatEther(tokenSupply);

        setTokenName(tokenName);
        setTokenSymbol(tokenSymbol);
        setTokenTotalSupply(tokenSupply);
        setTokenOwnerAddress(tokenOwner);

        if (account.toLowerCase() === tokenOwner.toLowerCase()) {
          setIsTokenOwner(true);
        }
      }
    } catch (err) {
      console.error("Error fetching token info:", err);
    }
  };

  const transferToken = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await tokenContract.transfer(inputValue.walletAddress, parseEther(inputValue.transferAmount));
        console.log("Transferring tokens...");
        await txn.wait();
        console.log("Tokens Transferred", txn.hash);
      } else {
        setError("Ethereum object not found. Install Metamask.");
      }
    } catch (err) {
      console.error("Error transferring tokens:", err);
    }
  };

  const burnTokens = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await tokenContract.burn(parseEther(inputValue.burnAmount));
        console.log("Burning tokens...");
        await txn.wait();
        console.log("Tokens burned...", txn.hash);

        let tokenSupply = await tokenContract.totalSupply();
        tokenSupply = formatEther(tokenSupply);
        setTokenTotalSupply(tokenSupply);
      } else {
        setError("Ethereum object not found. Install Metamask.");
      }
    } catch (err) {
      console.error("Error burning tokens:", err);
    }
  };

  const mintTokens = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(contractAddress, contractABI, signer);

        const tokenOwner = await tokenContract.owner();
        const txn = await tokenContract.mint(tokenOwner, parseEther(inputValue.mintAmount));
        console.log("Minting tokens...");
        await txn.wait();
        console.log("Tokens minted...", txn.hash);

        let tokenSupply = await tokenContract.totalSupply();
        tokenSupply = formatEther(tokenSupply);
        setTokenTotalSupply(tokenSupply);
      } else {
        setError("Ethereum object not found. Install Metamask.");
      }
    } catch (err) {
      console.error("Error minting tokens:", err);
    }
  };

  const handleInputChange = (event) => {
    setInputValue((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    getTokenInfo();
  }, []);

  return (
    <main className="main-container">
      <h2 className="headline">
        <span className="headline-gradient">Chippy Ⓜ</span> (Solana)
      </h2>
      <section className="customer-section px-10 pt-5 pb-10">
        {error && <p className="text-2xl text-red-700">{error}</p>}
        <div className="mt-5">
          <span className="mr-5"><strong>Coin:</strong> {tokenName} </span>
          <span className="mr-5"><strong>Ticker:</strong>  {tokenSymbol} </span>
          <span className="mr-5"><strong>Total Supply:</strong>  {tokenTotalSupply}</span>
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
              placeholder={`0.0000 ${tokenSymbol}`}
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

        {/* Burn Token Form */}
        <div className="mt-7 mb-9">
          <form className="form-style">
            <input
              type="number"
              className="input-double"
              onChange={handleInputChange}
              name="burnAmount"
              placeholder={`0.0000 ${tokenSymbol}`}
              value={inputValue.burnAmount}
            />
            <button
              className="btn-purple"
              onClick={burnTokens}
            >
              Burn Tokens
            </button>
          </form>
        </div>

        {/* Mint Token Form */}
        {isTokenOwner && (
          <div className="mt-7 mb-9">
            <form className="form-style">
              <input
                type="number"
                className="input-double"
                onChange={handleInputChange}
                name="mintAmount"
                placeholder={`0.0000 ${tokenSymbol}`}
                value={inputValue.mintAmount}
              />
              <button
                className="btn-purple"
                onClick={mintTokens}
              >
                Mint Tokens
              </button>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;