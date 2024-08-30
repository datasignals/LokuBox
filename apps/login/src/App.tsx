import React, { useEffect, useState } from "react";
import { web3Enable, web3Accounts } from "@polkadot/extension-dapp";
import { type InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { Bounce, Flip, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const App = () => {
  const [account, setAccount] = useState<InjectedAccountWithMeta | undefined>(
    undefined,
  );
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);

  useEffect(() => {
    const connectWallet = async () => {
      const extensions = await web3Enable("My Web App");
      if (extensions.length === 0) {
        console.log(
          "No extension installed, or user did not accept the authorization",
        );
        return;
      }

      const accounts: InjectedAccountWithMeta[] = await web3Accounts();
      setAccounts(accounts); // Select the first account
    };

    void connectWallet();
  }, []);

  return (
    <div>
      <ToastContainer />
      {accounts.length > 0 ? (
        <ul>
          {accounts.map((e: InjectedAccountWithMeta) => (
            <li
              key={e.address}
              onClick={() => {
                setAccount(e);
                toast.dismiss();
                toast.success(`Wallet ${e.meta.name} selected`, {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: 0,
                  theme: "light",
                  transition: Flip,
                });
              }}
              style={{
                cursor: "pointer",
                backgroundColor: account === e ? "#d3d3d3" : "transparent",
              }}
            >
              {e.meta.name}
            </li>
          ))}
          <button
            onClick={() => {
              sendAccountToElectron(account);
            }}
          >
            Send Wallet Information to LokuBox
          </button>
        </ul>
      ) : (
        <p>Connecting...</p>
      )}
    </div>
  );
};

const sendAccountToElectron = (account: InjectedAccountWithMeta) => {
  const address = account.address;
  const name = account.meta.name!;

  fetch(`http://localhost:3001/wallet-data?address=${address}&name=${name}`)
    .then((response) => response.text())
    .then((data) => {
      console.log(data); // Confirmation from the server
    })
    .catch((error) => {
      console.error("Error sending wallet data:", error);
    });
};
