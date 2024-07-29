import React from 'react';
import './assets/css/loc-h-content.css';
import './assets/css/loc-layout.css';
import './assets/css/loc-login.css';
import './assets/css/main.css';

const Login: React.FC = () => {
    return (
        <div className="loc-login-container">
        <div className="row" style={{ height: '100%' }}>
            <div className="col-12 col-md-6 col-lg-8">
            <div className="loc-login-content">
                <div>
                <img
                    style={{ width: '150px', marginBottom: '70px' }}
                    src="images/svg/logo.svg"
                    alt="brand-logo"
                />
                </div>
                <div
                id="carouselExampleIndicators"
                className="carousel slide"
                data-bs-ride="carousel"
                data-bs-interval="3000"
                >
                <div className="carousel-inner">
                    <div className="carousel-item active">
                    <img
                        className="d-block w-100"
                        src="images/png/ic_login-image.png"
                        alt="First slide"
                    />
                    </div>
                    <div className="carousel-item">
                    <img
                        className="d-block w-100"
                        src="images/png/ic_login-image.png"
                        alt="First slide"
                    />
                    </div>
                    <div className="carousel-item">
                    <img
                        className="d-block w-100"
                        src="images/png/ic_login-image.png"
                        alt="First slide"
                    />
                    </div>
                </div>
                <ol className="carousel-indicators">
                    <li
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to="0"
                    className="active"
                    ></li>
                    <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"></li>
                    <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"></li>
                </ol>
                </div>
            </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
            <div style={{ backgroundColor: 'white', height: '100%' }}>
                <div className="loc-login-form">
                <h2>Secure & share your files with provenance tracking.</h2>
                <form style={{ width: '100%', padding: '100px 0' }}>
                    <div style={{ width: '100%' }}>
                    <label htmlFor="loc-login-select" className="loc-label">
                        Select your wallet
                    </label>
                    <select
                        className="loc-form-control"
                        id="loc-login-select"
                        style={{ width: '100%', padding: '0 10px' }}
                    >
                        <option>Coinbase</option>
                        <option>Wallet 2</option>
                    </select>
                    </div>
                    <button
                    className="loc-btn"
                    type="button"
                    style={{ marginTop: '30px', width: '100%' }}
                    >
                    Connect
                    </button>
                </form>
                <p style={{ color: '#92A1AC', marginBottom: '2px', fontSize: '12px' }}>
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

export default Login;