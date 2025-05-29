import { Idl, Program, Provider } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

// Define the IDL type based on your IDL.json
export type CrashGame = {
  version: "0.1.0";
  name: "crash_game";
  address: string;
  metadata: {
    address: string;
    name: string;
    version: string;
    spec: string;
  };
  instructions: [
    {
      name: "initializeGame";
      discriminator: [number, number, number, number, number, number, number, number];
      accounts: [
        { name: "game"; isMut: true; isSigner: false },
        { name: "pool"; isMut: true; isSigner: true },
        { name: "vault"; isMut: true; isSigner: false },
        { name: "authority"; isMut: false; isSigner: true },
        { name: "systemProgram"; isMut: false; isSigner: false }
      ];
      args: [{ name: "seed"; type: "u64" }];
    },
    {
      name: "depositToPool";
      discriminator: [number, number, number, number, number, number, number, number];
      accounts: [
        { name: "poolBalance"; isMut: true; isSigner: false },
        { name: "pool"; isMut: true; isSigner: false },
        { name: "player"; isMut: true; isSigner: true },
        { name: "game"; isMut: false; isSigner: false },
        { name: "systemProgram"; isMut: false; isSigner: false },
        { name: "authority"; isMut: false; isSigner: true }
      ];
      args: [{ name: "amount"; type: "u64" }];
    },
    {
      name: "getPoolBalance";
      discriminator: [number, number, number, number, number, number, number, number];
      accounts: [
        { name: "game"; isMut: false; isSigner: false },
        { name: "poolBalance"; isMut: false; isSigner: false },
        { name: "player"; isMut: false; isSigner: true },
        { name: "authority"; isMut: false; isSigner: true }
      ];
      args: [];
    },
    {
      name: "withdraw";
      discriminator: [number, number, number, number, number, number, number, number];
      accounts: [
        { name: "game"; isMut: false; isSigner: false },
        { name: "poolBalance"; isMut: true; isSigner: false },
        { name: "player"; isMut: true; isSigner: true },
        { name: "pool"; isMut: true; isSigner: false },
        { name: "systemProgram"; isMut: false; isSigner: false },
        { name: "authority"; isMut: false; isSigner: true }
      ];
      args: [];
    },
    {
      name: "startGame";
      discriminator: [number, number, number, number, number, number, number, number];
      accounts: [
        { name: "game"; isMut: true; isSigner: false },
        { name: "bet"; isMut: true; isSigner: false },
        { name: "poolBalance"; isMut: true; isSigner: false },
        { name: "player"; isMut: true; isSigner: true },
        { name: "vault"; isMut: true; isSigner: false },
        { name: "pool"; isMut: true; isSigner: false },
        { name: "systemProgram"; isMut: false; isSigner: false },
        { name: "authority"; isMut: false; isSigner: true }
      ];
      args: [
        { name: "betAmount"; type: "u64" },
        { name: "multiplier"; type: "i32" },
        { name: "nonce"; type: "u64" }
      ];
    }
  ];
  accounts: [
    {
      name: "Game";
      discriminator: [number, number, number, number, number, number, number, number];
      type: {
        kind: "struct";
        fields: [
          { name: "authority"; type: "publicKey" },
          { name: "seed"; type: "u64" },
          { name: "pool"; type: "publicKey" }
        ];
      };
    },
    {
      name: "poolBalance";
      discriminator: [number, number, number, number, number, number, number, number];
      type: {
        kind: "struct";
        fields: [
          { name: "player"; type: "publicKey" },
          { name: "amount"; type: "u64" }
        ];
      };
    },
    {
      name: "Bet";
      discriminator: [number, number, number, number, number, number, number, number];
      type: {
        kind: "struct";
        fields: [
          { name: "player"; type: "publicKey" },
          { name: "betAmount"; type: "u64" },
          { name: "multiplier"; type: "i32" },
          { name: "nonce"; type: "u64" }
        ];
      };
    }
  ];
  events: [
    {
      name: "DepositMade";
      discriminator: [number, number, number, number, number, number, number, number];
      fields: [
        { name: "player"; type: "publicKey"; index: false },
        { name: "poolBalance"; type: "u64"; index: false }
      ];
    },
    {
      name: "GameOutcome";
      discriminator: [number, number, number, number, number, number, number, number];
      fields: [
        { name: "player"; type: "publicKey"; index: false },
        { name: "betAmount"; type: "u64"; index: false },
        { name: "multiplier"; type: "i32"; index: false },
        { name: "payout"; type: "u64"; index: false },
        { name: "isWin"; type: "bool"; index: false },
        { name: "poolBalance"; type: "u64"; index: false }
      ];
    },
    {
      name: "Withdrawal";
      discriminator: [number, number, number, number, number, number, number, number];
      fields: [
        { name: "player"; type: "publicKey"; index: false },
        { name: "amount"; type: "u64"; index: false }
      ];
    }
  ];
};

// Export the IDL
export const IDL: CrashGame = require("../../(update4)/test123a/idl.json");

// Export the Program type
export type CrashGameProgram = Program<CrashGame>;