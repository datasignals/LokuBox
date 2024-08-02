import React, { useEffect } from 'react';

import "../../public/assets/css/loc-h-content.css"
import '../../public/assets/css/loc-layout.css';
import '../../public/assets/css/loc-login.css';
import '../../public/assets/css/main.css';
import { useNavigate } from 'react-router-dom';

import { useWallet } from '../context/walletContext';
import { WalletAccount } from '../comman/wallet'; 

const Profile: React.FC = () => {

    const {  isWalletConnected, setCurrentAccount, setWalletConnected, walletData} = useWallet();
    const navigate = useNavigate(); // Initialize useNavigate

    const updateAccounts = (address: string) => {
        console.log("add", address);
        setCurrentAccount(address); 
        localStorage.setItem("currentAccount", address);
    };

    const onButtonClick = ()  =>  {
        navigate('/home');
    }

    useEffect(()  =>  {
        console.log("data", walletData);
        console.log("isWalletConnected", isWalletConnected);
    })
    return (
        <div className="loc-login-container">
            <div className="row" style={{ height: '100%' }}>
                <div className="col-12 col-md-6 col-lg-8">
                    <div className="loc-login-content">
                        <div>
                            <img style={{ width: '150px', marginBottom: '70px' }} src="../../public/assets/images/svg/logo.svg" alt="brand-logo"/>
                        </div>
                        <div id="carouselExampleIndicators" className="carousel slide"
                            data-bs-ride="carousel" data-bs-interval="3000">
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <img className="d-block w-100" src="../../public/assets/images/png/ic_login-image.png" alt="First slide"/>
                                </div>
                                <div className="carousel-item">
                                    <img className="d-block w-100" src="../../public/assets/images/png/ic_login-image.png" alt="Second slide"/>
                                </div>
                                <div className="carousel-item">
                                    <img className="d-block w-100" src="../../public/assets/images/png/ic_login-image.png" alt="Third slide" />
                                </div>
                            </div>
                            <ol className="carousel-indicators">
                                <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active"></li>
                                <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"></li>
                                <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"></li>
                            </ol>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <div style={{ backgroundColor: 'white', height: '100%' }}>
                        <div className="loc-login-form">
                            <h2>Login</h2>
                            <form style={{ width: '100%', padding: '50px 0 0 0' }}>
                                <div style={{ width: '100%' }}>

                                <label htmlFor="loc-n" className="loc-label">Select wallet address</label>
                                {isWalletConnected && (
                                    <select className="loc-form-control" id="loc-login-select" style={{ width: '100%', padding: '0 10px' }}
                                        onChange={(e) => {
                                            const selectedAddress = e.target.value;
                                            const selectedAccount = walletData.find((account: { address: string; }) => account.address === selectedAddress);
                                                if (selectedAccount) {
                                                    updateAccounts(selectedAccount.address);
                                                }
                                            }}>
                                            {walletData.map((add: WalletAccount, index: number) => (
                                                <option key={index} value={add.address}>
                                                    {add.address.slice(0, 6)}...{add.address.slice(-6)}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                {/* <label htmlFor="loc-n" className="loc-label">Name</label>
                                <input style={{ width: '100%' }} id="loc-n" className="loc-form-control"/> */}
                                </div>
                                <button className="loc-btn" type="button" style={{ marginTop: '30px', width: '100%' }} onClick={onButtonClick}>
                                    Login
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;