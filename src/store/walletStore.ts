// walletStore.ts
export let walletAddress: string | null = null;

export const setWalletAddress = (address: string) => {
    walletAddress = address;
};