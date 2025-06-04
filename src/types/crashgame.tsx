import { Idl, Program, Provider } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

// Import the IDL
import idl from "./idl.json";
export const IDL = idl as unknown as Idl;

// Export the Program type
export type CrashGame = typeof IDL;
export type CrashGameProgram = Program<typeof IDL>;