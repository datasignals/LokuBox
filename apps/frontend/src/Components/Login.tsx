import React, {type FC} from 'react';
import "../css/loc-h-content.css"
import '../css/loc-layout.css';
import '../css/loc-login.css';
import '../css/main.css';

import {web3Accounts, web3Enable} from '@polkadot/extension-dapp';
import {useNavigate} from 'react-router-dom';
import {WalletList} from "../Wallets"
import {useWallet} from '../context/WalletContext';

export const Login: FC = () => {

    const {setCurrentAccount, setWalletConnected, setWalletData} = useWallet();

    const navigate = useNavigate(); // Initialize useNavigate

    const polkadot = async () => {
        const allInjected = await web3Enable('Lokubox');
        if (allInjected.length > 0) {
            setWalletConnected(true);
            const allAccounts = await web3Accounts();
            setWalletData(allAccounts);
            setCurrentAccount(allAccounts[0]!.address)
            localStorage.setItem("currentAccount", allAccounts[0]!.address);
            navigate('/profile');
        } else {
            alert("Wallet access is denied");
        }
    }
    const handleClick = (name: string) => {
        if (name === "Polkadot.Js") {
            polkadot();
        } else {
            alert(`Work under progress for ${name}.`);
        }
    }
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
                        {/* <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel"
                             data-bs-interval="3000">
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <img className="d-block w-100" src="/images/png/ic_login-image.png"
                                         alt="First slide"/>
                                </div>
                                <div className="carousel-item">
                                    <img className="d-block w-100" src="/images/png/ic_login-image.png"
                                         alt="First slide"/>
                                </div>
                                <div className="carousel-item">
                                    <img className="d-block w-100" src="/images/png/ic_login-image.png"
                                         alt="First slide"/>
                                </div>
                            </div>
                            <ol className="carousel-indicators">
                                <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0"
                                    className="active" />
                                <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" />
                                <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" />
                            </ol>
                        </div> */}
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <div className='loc-login-right-panel' style={{height: '100%'}}>
                        <div className="loc-login-form">
                            <h2>Secure & share your files with provenance tracking.</h2>
                            <form style={{width: '100%', padding: '100px 0'}}>
                                <div style={{width: '100%', textAlign: 'center'}}>
                                    <label htmlFor="loc-login-select" className="loc-label" style={{marginBottom: '10px', display: 'inline-block'}}>
                                        Select your wallet
                                    </label>
                                    <div className='drop-menu wallet'>
                                        <ul className="flex flex-column">
                                            {WalletList.map((item, index) => (
                                                <li className='drop-item-container' key={index} // Add the key prop here
                                                    onClick={() => { handleClick(item.name); }}>
                                                    <a className="d-item-flex">
                                                        <img src={item.img} alt="wallet-icon"/>
                                                        <div className='ml-4'>
                                                            <div className='mb-1 text-white'>{item.name}</div>
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
                            <p className="loc-login-setup-text" style={{marginBottom: '2px', fontSize: '12px'}}>
                                Don't have a wallet?
                            </p>
                            <button type="button" className="loc-btn-transparent">
                                Learn how to setup one
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};