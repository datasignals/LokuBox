import React from 'react';
import '../css/loc-h-content.css';
import '../css/loc-layout.css';
import '../css/loc-login.css';
import '../css/main.css';

const Profile: React.FC = () => {
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
                                        alt="Second slide"
                                    />
                                </div>
                                <div className="carousel-item">
                                    <img
                                        className="d-block w-100"
                                        src="images/png/ic_login-image.png"
                                        alt="Third slide"
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
                            <h2>Complete Your Lokubox Profile</h2>
                            <form style={{ width: '100%', padding: '50px 0 0 0' }}>
                                <div style={{ width: '100%' }}>
                                    <label htmlFor="loc-n" className="loc-label">
                                        Name
                                    </label>
                                    <input
                                        style={{ width: '100%' }}
                                        id="loc-n"
                                        className="loc-form-control"
                                    />
                                </div>
                                <button
                                    className="loc-btn"
                                    type="button"
                                    style={{ marginTop: '30px', width: '100%' }}
                                >
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

export default Profile;