import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../public/assets/css/loc-layout.css';
import '../../public/assets/css/main.css';
import { useWallet } from '../context/walletContext';
import Layout from './Layout';

const Team: React.FC = () => {
    return (
        <div>
            <Layout />
            <div className="loc-content-container">
                
            </div>
        </div>
    );
};

export default Team;