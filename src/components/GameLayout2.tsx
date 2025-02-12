import { PropsWithChildren } from 'react';
import React from 'react';

import styles from '../styles/GameLayout1.module.css';

interface GameLayoutProps {
	children: React.ReactNode;
	width: number;
}

const GameLayout: React.FC<GameLayoutProps> = ({ children, width }) => {
	return <div style={{ width: `${width}px` }} className={styles.GameLayout}>{children}</div>;
};

export default GameLayout;
