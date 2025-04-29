// store/walletStore.ts

let walletAddress: string | null = null;

export const setWalletAddress = (address: string) => {
    walletAddress = address;
};

export const getWalletAddress = (): string | null => {
    return walletAddress;
};