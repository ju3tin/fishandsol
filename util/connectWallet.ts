// utils/connectWallet.ts
export async function connectWallet(): Promise<string> {
    if ('solana' in window) {
      const provider = (window as any).solana;
      if (provider?.isPhantom) {
        const resp = await provider.connect();
        return resp.publicKey.toString();
      }
    }
    throw new Error('Phantom Wallet not found');
  }
  