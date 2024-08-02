import React, { createContext, useContext, useState, type ReactNode } from 'react';
import {type InjectedAccountWithMeta} from "@polkadot/extension-inject/types";

// Define types for the context state
interface WalletContextType {
  isWalletConnected: boolean;
  setWalletConnected: (_: boolean) => void;
  walletData: InjectedAccountWithMeta[];
  setWalletData: (_: InjectedAccountWithMeta[]) => void;
  currentAccount: string;
  setCurrentAccount: (_: string) => void;
  currentBalance: number;
  setCurrentBalance: (_: number) => void;
  name: string;
  setName: (_: string) => void;
}

// Create a Context with a default value
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Define types for the provider props
interface WalletProviderProps {
  children: ReactNode;
}

// Create a Provider component
export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isWalletConnected, setWalletConnected] = useState<boolean>(false);
  const [walletData, setWalletData] = useState<InjectedAccountWithMeta[]>([]); // Replace `any` with the appropriate type
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [name, setName] = useState<string>("");

  return (
    <WalletContext.Provider value={{ isWalletConnected, setWalletConnected, walletData, setWalletData, currentAccount, setCurrentAccount, currentBalance, setCurrentBalance, name, setName }}>
      {children}
    </WalletContext.Provider>
  );
};

// Create a custom hook to use the context
export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
