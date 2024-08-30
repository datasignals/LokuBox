import React, { type FC, useEffect } from "react";
import "../css/loc-h-content.css";
import "../css/loc-layout.css";
import "../css/loc-login.css";
import "../css/main.css";

import { useNavigate } from "react-router-dom";

import { useWallet } from "ui/components/context/WalletContext";

import { WalletList } from "../Wallets";

import { web3Accounts, web3Enable, web3FromSource } from "@polkadot/extension-dapp";

// import {useWallet} from '../context/WalletContext';

export const Login: FC = () => {
  // const {setCurrentAccount, setWalletConnected, setWalletData} = useWallet();

  async function connectToWallet() {
    // Request extension to enable the app
    const extensions = await web3Enable("My Electron App");
    if (extensions.length === 0) {
      console.error("No extension installed, or user did not accept the authorization");
      return;
    }

    // Retrieve all accounts from the extension
    const allAccounts = await web3Accounts();
    console.log("Accounts:", allAccounts);

    // Get the first account (as an example)
    const firstAccount = allAccounts[0];

    // Optionally, get the injector for signing transactions or making other calls
    const injector = await web3FromSource(firstAccount.meta.source);

    return { account: firstAccount, injector };
  }

  const a = useWallet();

  useEffect(() => {
    // connectToWallet()
    //   .then(({ account, injector }) => {
    //     console.log("Connected Account:", account);
    //     // You can now use the account and injector
    //   })
    //   .catch((error) => {
    //     console.error("Error connecting to wallet:", error);
    //   });
  }, []);

  const navigate = useNavigate();

  return (
    <div className='loc-login-container'>
      <div className='row' style={{ height: "100%" }}>
        <div className='col-12 col-md-6 col-lg-8'>
          <div className='loc-login-content'>
            <div>
              <img style={{ width: "150px", marginBottom: "70px" }} src='assets/images/svg/logo.svg' alt='brand-logo' />
            </div>
            <div
              id='carouselExampleIndicators'
              className='carousel slide'
              data-bs-ride='carousel'
              data-bs-interval='3000'
            >
              <div className='carousel-inner'>
                <div className='carousel-item active'>
                  <img className='d-block w-100' src='assets/images/png/ic_login-image.png' alt='First slide' />
                </div>
                <div className='carousel-item'>
                  <img className='d-block w-100' src='assets/images/png/ic_login-image.png' alt='First slide' />
                </div>
                <div className='carousel-item'>
                  <img className='d-block w-100' src='assets/images/png/ic_login-image.png' alt='First slide' />
                </div>
              </div>
              <ol className='carousel-indicators'>
                <li data-bs-target='#carouselExampleIndicators' data-bs-slide-to='0' className='active' />
                <li data-bs-target='#carouselExampleIndicators' data-bs-slide-to='1' />
                <li data-bs-target='#carouselExampleIndicators' data-bs-slide-to='2' />
              </ol>
            </div>
          </div>
        </div>
        <div className='col-12 col-md-6 col-lg-4'>
          <div style={{ backgroundColor: "white", height: "100%" }}>
            <div className='loc-login-form'>
              <h2>Secure & share your files with provenance tracking.</h2>
              <form style={{ width: "100%", padding: "100px 0" }}>
                <div style={{ width: "100%" }}>
                  <label htmlFor='loc-login-select' className='loc-label'>
                    Select your wallet
                  </label>
                  {/* <select
                        className="loc-form-control"
                        id="loc-login-select"
                        style={{ width: '100%', padding: '0 10px' }}
                    >
                        <option>Coinbase</option>
                        <option>Wallet 2</option>
                    </select> */}

                  <div className='drop-menu wallet'>
                    <ul className='flex flex-column'>
                      {WalletList.map((item, index) => (
                        <li
                          className='drop-item-container'
                          key={index} // Add the key prop here
                          onClick={() => {
                            navigate("/home");
                          }}
                        >
                          <a className='d-item-flex'>
                            <img src={item.img} alt='wallet-icon' />
                            <div className='ml-4'>
                              <div className='mb-1'>{item.name}</div>
                            </div>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* <button
                    className="loc-btn"
                    type="button"
                    style={{ marginTop: '30px', width: '100%' }}
                    >
                    Connect
                    </button> */}
              </form>
              <p style={{ color: "#92A1AC", marginBottom: "2px", fontSize: "12px" }}>Don't have a wallet?</p>
              <button type='button' className='loc-btn-transparent'>
                Learn how to setup one
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
