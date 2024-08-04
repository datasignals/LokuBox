import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../public/assets/css/loc-layout.css';
import '../../public/assets/css/loc-content.css';
import '../../public/assets/css/main.css';
import { useWallet } from '../context/walletContext';
import Layout from './Layout';

const Shared: React.FC = () => {
    const navigate = useNavigate();
    const { currentAccount } = useWallet();
    const [view, setView] = useState('list');

    const handleNavigation = (path: string) => (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        navigate(path);
    };

    useEffect(() => {
        if (currentAccount || localStorage.getItem("currentAccount")) {
            navigate("");
        }
    }, [currentAccount, navigate]);


    const handleToggleView = (viewType: string) => {
        setView(viewType);
    };


    return (
        <div>
            <Layout />
            <div className="loc-content-container">
                <div className="loc-h-content-o">
                    <div className="row">
                        <div className="col-12">
                            <div className="loc-card loc-h">
                                <div className="position-relative" style={{ width: '350px' }}>
                                    <input style={{ width: '350px' }} type="text" className="loc-form-control" placeholder="Search" />
                                    <img style={{ position: 'absolute', top: '12px', right: '15px' }} src={'../../public/assets/images/svg/ic_search.svg'} alt="" />
                                </div>
                                <div className="loc-card-toggler">
                                    <ul className='loc-view-toggle-con'>
                                        <li className={view === 'list' ? 'active' : ''} onClick={() => handleToggleView('list')}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12">
                                                <path id="ic_list" d="M3831.866-739a.862.862,0,0,1-.867-.857.862.862,0,0,1,.867-.857h11.267a.861.861,0,0,1,.866.857.862.862,0,0,1-.866.857Zm0-5.143A.862.862,0,0,1,3831-745a.862.862,0,0,1,.867-.857h11.267A.862.862,0,0,1,3844-745a.862.862,0,0,1-.866.858Zm0-5.144a.862.862,0,0,1-.867-.857.862.862,0,0,1,.867-.857h11.267a.862.862,0,0,1,.866.857.862.862,0,0,1-.866.857Z" transform="translate(-3830.999 751)"/>
                                            </svg>
                                        </li>
                                        <li className={view === 'grid' ? 'active' : ''} onClick={() => handleToggleView('grid')}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14.654" height="13.957" viewBox="0 0 14.654 13.957">
                                                <path id="ic_grid" d="M55.456,47.676h-2.2a2.148,2.148,0,0,0-2.2,2.093v2.093a2.148,2.148,0,0,0,2.2,2.093h2.2a2.148,2.148,0,0,0,2.2-2.093V49.769a2.148,2.148,0,0,0-2.2-2.093m-8.06,0H45.2A2.148,2.148,0,0,0,43,49.769v2.093a2.148,2.148,0,0,0,2.2,2.093h2.2a2.148,2.148,0,0,0,2.2-2.093V49.769a2.148,2.148,0,0,0-2.2-2.093M55.456,40h-2.2a2.148,2.148,0,0,0-2.2,2.093v2.093a2.148,2.148,0,0,0,2.2,2.093h2.2a2.148,2.148,0,0,0,2.2-2.093V42.093A2.148,2.148,0,0,0,55.456,40m-5.862,2.093v2.093a2.148,2.148,0,0,1-2.2,2.093H45.2A2.148,2.148,0,0,1,43,44.187V42.093A2.148,2.148,0,0,1,45.2,40h2.2a2.148,2.148,0,0,1,2.2,2.093" transform="translate(-43 -39.999)" fill-rule="evenodd"/>
                                            </svg>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {view === 'list' ? (
                                <div className='list'>   
                                    <div className="loc-card" style={{ marginTop: '20px' }}>
                                        <div className="loc-h-card-content-con">
                                            <div className="loc-h-card-content">
                                                <img src={'../../public/assets/images/svg/ic_pdf.svg'} alt=""/>
                                                <div>
                                                    <h4 style={{ marginBottom: '5px' }}>myfiles.pdf</h4>
                                                    <h5>25-10-2024, 10:30 AM</h5>
                                                </div>
                                            </div>
                                            <div className="loc-h-tools">
                                                <div className="loc-s-users">
                                                    <img src={'../../public/assets/images/svg/default_user.svg'} alt=""/>
                                                    <div style={{ fontSize: '12px', color: '#8B959B', marginTop: '5px' }}>Jos</div>
                                                </div>
                                                <div className="dropdown">
                                                    <img className="dropdown-toggle" src={'../../public/assets/images/svg/ic_3_dots.svg'} alt="more-options" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false"/>
                                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                                                        <li className="dropdown-item">
                                                            Delete
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="loc-card" style={{ marginTop: '20px' }}>
                                        <div className="loc-h-card-content-con">
                                            <div className="loc-h-card-content">
                                                <img src={'../../public/assets/images/svg/ic_pdf.svg'} alt=""/>
                                                <div>
                                                    <h4 style={{ marginBottom: '5px' }}>newfiles.pdf</h4>
                                                    <h5>27-10-2024, 10:30 AM</h5>
                                                </div>
                                            </div>
                                            <div className="loc-h-tools">
                                                <div className="loc-s-users">
                                                    <img src={'../../public/assets/images/svg/default_user.svg'} alt=""/>
                                                    <div style={{ fontSize: '12px', color: '#8B959B', marginTop: '5px' }}>Jos</div>
                                                </div>
                                                <div className="dropdown">
                                                    <img className="dropdown-toggle" src={'../../public/assets/images/svg/ic_3_dots.svg'} alt="more-options" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false"/>
                                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                                                        <li className="dropdown-item">
                                                            Delete
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className='grid'>
                                    <div className='row'>
                                        <div className='col-12 col-sm-6 col-lg-4'>
                                            <div className="loc-card" style={{ marginTop: '20px', position: 'relative' }}>
                                                <div className="loc-s-users-grid">
                                                    <img src={'../../public/assets/images/svg/default_user.svg'} alt=""/>
                                                    <div style={{ fontSize: '12px', color: '#8B959B', marginTop: '5px' }}>Jos</div>
                                                </div>
                                                <div className="loc-s-card-con-grid">
                                                    <img src={'../../public/assets/images/svg/ic_pdf.svg'} alt=""/>
                                                    <div style={{ marginTop: '15px' }}>
                                                        <h4 style={{ marginBottom: '5px', textAlign: 'center' }}>newfiles.pdf</h4>
                                                        <h5>27-10-2024, 10:30 AM</h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-6 col-lg-4'>
                                            <div className="loc-card" style={{ marginTop: '20px', position: 'relative' }}>
                                                <div className="loc-s-users-grid">
                                                    <img src={'../../public/assets/images/svg/default_user.svg'} alt=""/>
                                                    <div style={{ fontSize: '12px', color: '#8B959B', marginTop: '5px' }}>Jos</div>
                                                </div>
                                                <div className="loc-s-card-con-grid">
                                                    <img src={'../../public/assets/images/svg/ic_pdf.svg'} alt=""/>
                                                    <div style={{ marginTop: '15px' }}>
                                                        <h4 style={{ marginBottom: '5px', textAlign: 'center' }}>newfiles.pdf</h4>
                                                        <h5>27-10-2024, 10:30 AM</h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> 
                            )}      
                        </div>
                    </div>
                </div>
            </div>
            <div className="loc-h-content-details">
                <div className="loc-h-content-title">
                    Notifications
                </div>
                <div className="loc-s-activity-content-con" style={{ marginTop: '20px' }}>
                    <div className="loc-card" style={{ height: '100%' }}>
                        <div className="loc-s-activity-content">
                            <div style={{ fontSize: '12px' }}>Joe Root wants to share file</div>
                            <div>
                                <img style={{ cursor: 'pointer' }} src={'../../public/assets/images/svg/ic_reject.svg'} alt=""/>
                                <img style={{ marginLeft: '10px', cursor: 'pointer' }} src={'../../public/assets/images/svg/ic_check.svg'} alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shared;