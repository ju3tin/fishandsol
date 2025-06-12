const { Connection, PublicKey, SystemProgram } = solanaWeb3;
const anchor = window.anchor;

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const programId = new PublicKey("YourProgramIDHere"); // Replace with actual Program ID

let provider, program, walletPublicKey;

const idl = {
  version: "0.1.0",
  name: "solana_vault",
  instructions: [
    { name: "initialize", accounts: [
      { name: "vault", isMut: true, isSigner: false },
      { name: "user", isMut: true, isSigner: true },
      { name: "systemProgram", isMut: false, isSigner: false }
    ], args: [] },
    { name: "deposit", accounts: [
      { name: "vault", isMut: true, isSigner: false },
      { name: "vaultAccount", isMut: true, isSigner: false },
      { name: "user", isMut: true, isSigner: true },
      { name: "systemProgram", isMut: false, isSigner: false }
    ], args: [{ name: "amount", type: "u64" }] },
    { name: "withdraw", accounts: [
      { name: "vault", isMut: true, isSigner: false },
      { name: "vaultAccount", isMut: true, isSigner: false },
      { name: "user", isMut: true, isSigner: true },
      { name: "systemProgram", isMut: false, isSigner: false }
    ], args: [{ name: "amount", type: "u64" }] }
  ],
  accounts: [{
    name: "Vault",
    type: {
      kind: "struct",
      fields: [
        { name: "authority", type: "publicKey" },
        { name: "balance", type: "u64" }
      ]
    }
  }],
  errors: [
    { code: 6000, name: "InvalidAmount", msg: "Invalid amount specified" },
    { code: 6001, name: "InsufficientFunds", msg: "Insufficient funds in vault" },
    { code: 6002, name: "Unauthorized", msg: "Unauthorized access" },
    { code: 6003, name: "Overflow", msg: "Arithmetic overflow" },
    { code: 6004, name: "Underflow", msg: "Arithmetic underflow" }
  ]
};

async function connectWallet() {
  if ("solana" in window) {
    const resp = await window.solana.connect();
    walletPublicKey = resp.publicKey;
    document.getElementById("wallet-address").textContent = `Wallet: ${walletPublicKey.toString()}`;

    provider = new anchor.AnchorProvider(connection, window.solana, {
      preflightCommitment: "confirmed"
    });

    program = new anchor.Program(idl, programId, provider);
  } else {
    alert("Phantom wallet not found. Please install it.");
  }
}

async function initializeVault() {
  const [vaultPDA] = await PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), walletPublicKey.toBuffer()],
    programId
  );

  try {
    await program.methods.initialize().accounts({
      vault: vaultPDA,
      user: walletPublicKey,
      systemProgram: SystemProgram.programId
    }).rpc();
    alert("Vault initialized!");
  } catch (e) {
    console.error(e);
    alert("Vault initialization failed.");
  }
}

async function deposit() {
  const amount = parseInt(document.getElementById("deposit-amount").value);
  const [vaultPDA] = await PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), walletPublicKey.toBuffer()],
    programId
  );

  const [vaultAccount] = await PublicKey.findProgramAddressSync(
    [Buffer.from("vault_account"), walletPublicKey.toBuffer()],
    programId
  );

  try {
    await program.methods.deposit(new anchor.BN(amount)).accounts({
      vault: vaultPDA,
      vaultAccount,
      user: walletPublicKey,
      systemProgram: SystemProgram.programId
    }).rpc();
    alert("Deposit successful!");
  } catch (e) {
    console.error(e);
    alert("Deposit failed.");
  }
}

async function withdraw() {
  const amount = parseInt(document.getElementById("withdraw-amount").value);
  const [vaultPDA] = await PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), walletPublicKey.toBuffer()],
    programId
  );

  const [vaultAccount] = await PublicKey.findProgramAddressSync(
    [Buffer.from("vault_account"), walletPublicKey.toBuffer()],
    programId
  );

  try {
    await program.methods.withdraw(new anchor.BN(amount)).accounts({
      vault: vaultPDA,
      vaultAccount,
      user: walletPublicKey,
      systemProgram: SystemProgram.programId
    }).rpc();
    alert("Withdraw successful!");
  } catch (e) {
    console.error(e);
    alert("Withdraw failed.");
  }
}
