import React, {createContext, useContext, useState, type FC, type ReactElement} from 'react';
import {InjectedAccountWithMeta} from "@polkadot/extension-inject/types";

interface Props {
  children?: ReactElement
}

interface WalletContextType {
  isWalletConnected: boolean;
  setWalletConnected: (_: boolean) => void;
  walletData: InjectedAccountWithMeta[];
  setWalletData: (_: InjectedAccountWithMeta[]) => void;
  currentAccount: string;
  setCurrentAccount: (_: string) => void;
  currentBalance: number,
  name: string,
  setName: (_: string) => void
}

// Create a Context
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Create a Provider component
export const WalletProvider: FC<Props> = ({ children }) => {
  const [isWalletConnected, setWalletConnected] = useState(false);
  const [walletData, setWalletData] = useState<InjectedAccountWithMeta[]>([]);
  const [currentAccount, setCurrentAccount] = useState<string>("")
  const [currentBalance, setCurrentBalance] = useState(0);
  const [name, setName] = useState("");

  return (
    <WalletContext.Provider value={{
      isWalletConnected,
      setWalletConnected,
      walletData,
      setWalletData,
      currentAccount,
      setCurrentAccount,
      currentBalance,
      name,
      setName
    }}>
      {children}
    </WalletContext.Provider>
  );
};

// Create a custom hook to use the context
export const useWalletContext = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within an AuthProvider');
  }
  return context;
}
