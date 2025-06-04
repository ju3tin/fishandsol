import { Idl, Program, Provider } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

// Define the IDL type based on your IDL.json
export type CrashGame = {
  version: "0.1.0";
  name: "crash_game";
  address: string;
  instructions: [
    {
      name: "initializeGame";
      discriminator: [0, 0, 0, 0, 0, 0, 0, 0];
      accounts: [
        { name: "game"; isMut: true; isSigner: false },
        { name: "pool"; isMut: true; isSigner: false },
        { name: "authority"; isMut: true; isSigner: true },
        { name: "systemProgram"; isMut: false; isSigner: false }
      ];
      args: [{ name: "seed"; type: "u64" }];
    },
    {
      name: "depositToPool";
      discriminator: [0, 0, 0, 0, 0, 0, 0, 0];
      accounts: [
        { name: "pool_balance"; isMut: true; isSigner: false },
        { name: "pool"; isMut: true; isSigner: false },
        { name: "player"; isMut: true; isSigner: true },
        { name: "game"; isMut: false; isSigner: false },
        { name: "systemProgram"; isMut: false; isSigner: false }
      ];
      args: [{ name: "amount"; type: "u64" }];
    },
    {
      name: "placeBet";
      discriminator: [0, 0, 0, 0, 0, 0, 0, 0];
      accounts: [
        { name: "game"; isMut: true; isSigner: false },
        { name: "bet"; isMut: true; isSigner: false },
        { name: "pool_balance"; isMut: true; isSigner: false },
        { name: "player"; isMut: true; isSigner: true },
        { name: "systemProgram"; isMut: false; isSigner: false }
      ];
      args: [{ name: "amount"; type: "u64" }];
    },
    {
      name: "cashOut";
      discriminator: [0, 0, 0, 0, 0, 0, 0, 0];
      accounts: [
        { name: "game"; isMut: true; isSigner: false },
        { name: "bet"; isMut: true; isSigner: false },
        { name: "pool_balance"; isMut: true; isSigner: false },
        { name: "player"; isMut: true; isSigner: true },
        { name: "vault"; isMut: true; isSigner: false },
        { name: "pool"; isMut: true; isSigner: false },
        { name: "systemProgram"; isMut: false; isSigner: false }
      ];
      args: [{ name: "multiplier"; type: "u32" }];
    }
  ];
  accounts: [
    {
      name: "Game";
      discriminator: [0, 0, 0, 0, 0, 0, 0, 0];
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
      name: "PoolBalance";
      discriminator: [0, 0, 0, 0, 0, 0, 0, 0];
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
      discriminator: [0, 0, 0, 0, 0, 0, 0, 0];
      type: {
        kind: "struct";
        fields: [
          { name: "player"; type: "publicKey" },
          { name: "amount"; type: "u64" },
          { name: "cashout_multiplier"; type: "u32" }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "InsufficientPoolBalance";
      msg: "Insufficient pool balance";
    },
    {
      code: 6001;
      name: "AlreadyCashedOut";
      msg: "Already cashed out";
    }
  ];
  metadata: {
    address: string;
    name: string;
    version: string;
    spec: string;
  };
};

// Export the IDL
import idl from "../idl.json";
export const IDL: CrashGame = idl;

// Export the Program type
export type CrashGameProgram = Program<CrashGame>;