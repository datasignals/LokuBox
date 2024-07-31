import React, { createContext, useContext, useState, useEffect } from 'react';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

// Create a Context
const WalletContext = createContext();

// Create a Provider component
export const WalletProvider = ({ children }) => {
  const [isWalletConnected, setWalletConnected] = useState(false);
  const [walletData, setWalletData] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(null)
  const [currentBalance, setCurrentBalance] = useState(0);
  const [name, setName] = useState("");

  return (
    <WalletContext.Provider value={{ isWalletConnected, setWalletConnected, walletData, setWalletData, currentAccount, setCurrentAccount, currentBalance, name, setName}}>
      {children}
    </WalletContext.Provider>
  );
};

// Create a custom hook to use the context
export const useWallet = () => useContext(WalletContext);