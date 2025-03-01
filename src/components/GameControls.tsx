"use client";

import { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
//import { useWalletContext } from "../../src/providers/WalletContextProvider";
import { Checkbox } from "@nextui-org/checkbox";
import { useGameStore, GameState } from "../store/gameStore";
import { useEffectEvent } from "../hooks/useEffectEvent";
import useWalletAuth from "../hooks/useWalletAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { currencies } from "../lib/currencies";
import CurrencyList from "./CurrencyList";
import styles from "../styles/components/GameControls.module.css";

export default function GameControls() {
	const walletAuth = useWalletAuth();

	const [betAmount, setBetAmount] = useState<string>("0");
	const [autoCashOut, setAutoCashOut] = useState<string>("0");
	const [currency, setCurrency] = useState<string>(currencies[0].id);
	const [isAutoCashOutDisabled, setIsAutoCashOutDisabled] = useState(false);

	const isWaiting = useGameStore((game: GameState) => game.isWaiting);
	const isPlaying = useGameStore((game: GameState) => game.isPlaying);
	const isCashedOut = useGameStore((game: GameState) => game.isCashedOut);
	const gameStatus = useGameStore((game: GameState) => game.status);
	const isConnected = useGameStore((game: GameState) => game.isConnected);
	const isLoggedIn = useGameStore((game: GameState) => game.isLoggedIn);
	const balances = useGameStore((game: GameState) => game.balances);
	const errors = useGameStore((game: GameState) => game.errors);
	const errorCount = useGameStore((game: GameState) => game.errorCount);

	const { placeBet, cancelBet, cashOut } = useGameStore(
		(game: GameState) => game.actions
	);

	const haveValidBet =
		/^[0-9]+(\.?[0-9])*$/.test(betAmount) && parseFloat(betAmount);

	const handleChangeBetAmount = (amount: string) => {
		setBetAmount(amount);
	};

	const handleChangeAutoCashOut = (amount: string) => {
		setAutoCashOut(amount);
	};

	const handleCheckboxChange = (checked: boolean) => {
		setIsAutoCashOutDisabled(checked);
		if (checked) {
			setAutoCashOut("0"); // Optionally reset autoCashOut when disabling
		}
	};

	const handleButtonClick = () => {
		if (isWaiting) {
			cancelBet();
			return;
		}

		if (isPlaying && !isCashedOut) {
			cashOut();
		} else {
			placeBet(betAmount, autoCashOut, currency);
		}
	};

	const isButtonDisabled: boolean = !isConnected;

	const getButtonText = (): string => {
		if (!isConnected) return "Connecting...";
		if (isWaiting) return "Cancel bet";

		if (gameStatus == "Running") {
			if (isPlaying && !isCashedOut) {
				return "Cash out";
			} else {
				return "Place bet (next round)";
			}
		} else {
			return "Place bet";
		}
	};

	const showErrorToast = useEffectEvent(() => {
		if (errors.length > 0) toast("⚠️ " + errors[errors.length - 1]);
	});

	useEffect(() => {
		showErrorToast();
	}, [errorCount, showErrorToast]);
	//const { wallet1a } = useWalletContext();
	return (
		<Card>
			<CardHeader>
				<CardTitle>Place your bets!</CardTitle>
			</CardHeader>

			<CardContent>
				<Label>Bet Amount</Label>
				<Input
					placeholder="Bet amount"
					type="number"
					min="0"
					onChange={(e) => handleChangeBetAmount(e.target.value)}
					value={betAmount}
				/>
				<Label>Auto Cashout</Label>
				<Checkbox
					isSelected={isAutoCashOutDisabled}
					onChange={(e) => handleCheckboxChange(e.target.checked)}
				>
					Disable Auto Cashout
				</Checkbox>
				<Input
					placeholder="Auto cashout"
					type="number"
					min="0"
					step="0.01"
					onChange={(e) => handleChangeAutoCashOut(e.target.value)}
					value={autoCashOut}
					disabled={isAutoCashOutDisabled}
				/>
				<Label>Currency</Label>
				<CurrencyList 
					balances={balances} 
					onCurrencyChange={setCurrency}
				/>
			</CardContent>

			<CardFooter>
				<Button onClick={handleButtonClick} disabled={isButtonDisabled} className={styles.BetButton}>
					{getButtonText()}
				</Button>
			</CardFooter>
		</Card>
	);
}