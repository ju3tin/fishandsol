// utils/fakePostApi.ts

export interface BetRequest {
    walletAddress: string;
    betAmount: number;
    autoCashout: boolean;
    currency: string;
}

export interface BetResponse {
    id: string;
    walletAddress: string;
    betAmount: number;
    autoCashout: boolean;
    currency: string;
    status: 'success' | 'failed';
    message: string;
}

export async function fakePostApi(
    url: string,
    data: BetRequest,
    delay = 1000
): Promise<BetResponse> {
    console.log(`Fake POST to ${url}`, data);

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: Math.random().toString(36).substring(2, 10),
                ...data,
                status: 'success',
                message: `Bet placed successfully to ${url}`,
            });
        }, delay);
    });
}