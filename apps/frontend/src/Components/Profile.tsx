import React, {useEffect} from 'react';

import "../css/loc-h-content.css"
import '../css/loc-layout.css';
import '../css/loc-login.css';
import '../css/main.css';
import {useNavigate} from 'react-router-dom';
import {useWallet} from '../context/WalletContext';
import {InjectedAccountWithMeta} from "@polkadot/extension-inject/types";

export const Profile: React.FC = () => {

    const {isWalletConnected, setCurrentAccount, walletData} = useWallet();
    const navigate = useNavigate(); // Initialize useNavigate

    const updateAccounts = (address: string): void => {
        console.log("add", address);
        setCurrentAccount(address);
        localStorage.setItem("currentAccount", address);
    };

    const onButtonClick = () => {
        navigate('/home');
    }

    useEffect(() => {
        if(!isWalletConnected) {
            navigate('/');
        }
    })
    return (
        <div className="loc-login-container">
            <div className="row" style={{height: '100%'}}>
                <div className="col-12 col-md-6 col-lg-8">
                    <div className="loc-login-content">
                    <div>
                        <img style={{width: '150px', marginBottom: '70px'}} src="/images/svg/logo.svg"
                                alt="brand-logo"/>
                    </div>
                    <img style={{width: '350px'}} className="d-block" src="/images/png/ic_login-image.png"
                                         alt="First slide"/>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <div className="loc-login-right-panel" style={{height: '100%'}}>
                        <div className="loc-login-form">
                            <h2>Login</h2>
                            <form style={{width: '100%', padding: '50px 0 0 0'}}>
                                <div style={{width: '100%'}}>

                                    <label htmlFor="loc-n" className="loc-label">Select wallet address</label>
                                    {isWalletConnected ? <select className="loc-form-control" id="loc-login-select"
                                                style={{width: '100%', padding: '0 10px'}}
                                                onChange={(e) => {
                                                    const selectedAddress = e.target.value;
                                                    const selectedAccount = walletData.find((account: {
                                                        address: string;
                                                    }) => account.address === selectedAddress);
                                                    if (selectedAccount) {
                                                        updateAccounts(selectedAccount.address);
                                                    }
                                                }}>
                                            {walletData.map((add: InjectedAccountWithMeta, index: number) => (
                                                <option key={index} value={add.address}>
                                                    {add.address.slice(0, 6)}...{add.address.slice(-6)}
                                                </option>
                                            ))}
                                        </select> : null}
                                    {/* <label htmlFor="loc-n" className="loc-label">Name</label>
                                <input style={{ width: '100%' }} id="loc-n" className="loc-form-control"/> */}
                                </div>
                                <button className="loc-btn" type="button" style={{ marginTop: '30px', width: '100%' }} onClick={onButtonClick}>
                                    Connect
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};