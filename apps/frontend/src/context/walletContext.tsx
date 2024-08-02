import React, { createContext, useContext, useState, ReactNode } from 'react';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

// Define types for the context state
interface WalletContextType {
  isWalletConnected: boolean;
  setWalletConnected: React.Dispatch<React.SetStateAction<boolean>>;
  walletData: any[]; // Replace `any` with the appropriate type for wallet data
  setWalletData: React.Dispatch<React.SetStateAction<any[]>>; // Replace `any` with the appropriate type
  currentAccount: string | null; // Adjust type based on what you expect `currentAccount` to be
  setCurrentAccount: React.Dispatch<React.SetStateAction<string | null>>;
  currentBalance: number;
  setCurrentBalance: React.Dispatch<React.SetStateAction<number>>;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
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
  const [walletData, setWalletData] = useState<any[]>([]); // Replace `any` with the appropriate type
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
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
