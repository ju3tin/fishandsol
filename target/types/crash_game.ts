import { BN } from "@coral-xyz/anchor";
import type { IdlType } from "@coral-xyz/anchor/dist/cjs/idl";
import { PublicKey } from "@solana/web3.js";

export type DepositMadeEvent = {
  player: PublicKey;
  poolBalance: BN;
};

export type GameOutcomeEvent = {
  player: PublicKey;
  poolBalance: BN;
  betAmount: number;
  multiplier: number;
  payout: number;
  isWin: boolean;
};

export type WithdrawalEvent = {
  player: PublicKey;
};

export type CrashGame = {
  version: string;
  name: string;
  instructions: {
    name: string;
    accounts: { name: string; isMut: boolean; isSigner: boolean }[];
    args: { name: string; type: IdlType }[];
    discriminator: number[];
  }[];
  accounts: {
    name: string;
    type: {
      kind: string;
      fields: { name: string; type: IdlType }[];
    };
    discriminator: number[];
  }[];
  errors: { code: number; name: string; msg?: string }[];
  metadata: {
    address: string;
    name: string;
    version: string;
    spec: string;
  };
  address: string;
  events: {
    name: string;
    fields: { name: string; type: IdlType }[];
    discriminator: number[];
  }[];
};
