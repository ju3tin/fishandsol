'use client';

import React, { useEffect, useState } from 'react';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { AnchorProvider, Program, web3, utils, BN } from '@coral-xyz/anchor';
import idl from '../../../../idl/123.json';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const PROGRAM_ID = new PublicKey('97wCxKPKifEEUqNV7LAUVqzmCsXzYR88eZjYuKqTk5BY');
const NETWORK = 'https://api.devnet.solana.com';

export default function StakingPage() {
    const wallet = useAnchorWallet();
    const [program, setProgram] = useState<Program | null>(null);
    const [amount, setAmount] = useState('');
    const [tierIndex, setTierIndex] = useState(0);

    const connection = new Connection(NETWORK, 'confirmed');
    const provider = wallet ? new AnchorProvider(connection, wallet, { preflightCommitment: 'processed' }) : null;

    useEffect(() => {
        if (provider) {
            try {
                // @ts-ignore
                const _program = new Program(idl as any, PROGRAM_ID, provider);
                setProgram(_program);
            } catch (e) {
                console.error('Failed to create Program:', e);
            }
        }
    }, [provider]);

    const stake = async () => {
        if (!program || !wallet?.publicKey) return;

        const stakeAccountKeypair = web3.Keypair.generate();

        try {
            await program.methods.stakeFlwr(
                new BN(amount),
                tierIndex
            ).accounts({
                stakeAccount: stakeAccountKeypair.publicKey,
                user: wallet.publicKey,
                userTokenAccount: new PublicKey('YOUR_USER_TOKEN_ACCOUNT_PUBLIC_KEY'),
                vaultAccount: new PublicKey('YOUR_VAULT_ACCOUNT_PUBLIC_KEY'),
                stakingConfig: new PublicKey('YOUR_STAKING_CONFIG_PUBLIC_KEY'),
                tokenProgram: utils.token.TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
            }).signers([stakeAccountKeypair]).rpc();

            alert('Staking successful!');
        } catch (err) {
            console.error(err);
            alert('Staking failed.');
        }
    };

    const unstake = async () => {
        if (!program || !wallet?.publicKey) return;

        try {
            await program.methods.unstake().accounts({
                stakeAccount: new PublicKey('YOUR_STAKE_ACCOUNT_PUBLIC_KEY'),
                user: wallet.publicKey,
                userTokenAccount: new PublicKey('YOUR_USER_TOKEN_ACCOUNT_PUBLIC_KEY'),
                vaultAccount: new PublicKey('YOUR_VAULT_ACCOUNT_PUBLIC_KEY'),
                vaultAuthority: new PublicKey('YOUR_VAULT_AUTHORITY_PUBLIC_KEY'),
                stakingConfig: new PublicKey('YOUR_STAKING_CONFIG_PUBLIC_KEY'),
                tokenProgram: utils.token.TOKEN_PROGRAM_ID,
            }).rpc();

            alert('Unstaking successful!');
        } catch (err) {
            console.error(err);
            alert('Unstaking failed.');
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">FLWR Staking Dashboard</h1>
            <WalletMultiButton />

            <div className="mt-8">
                <input
                    type="number"
                    placeholder="Amount to stake"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="p-2 border rounded mr-4"
                />

                <select
                    value={tierIndex}
                    onChange={(e) => setTierIndex(Number(e.target.value))}
                    className="p-2 border rounded mr-4"
                >
                    <option value={0}>4 Months (3% reward, 6% penalty)</option>
                    <option value={1}>6 Months (6% reward, 12% penalty)</option>
                    <option value={2}>12 Months (10% reward, 24% penalty)</option>
                </select>

                <button onClick={stake} className="p-2 bg-green-500 text-white rounded mr-4">
                    Stake
                </button>

                <button onClick={unstake} className="p-2 bg-red-500 text-white rounded">
                    Unstake
                </button>
            </div>
        </div>
    );
}
