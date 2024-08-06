import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/loc-layout.css';
import '../css/main.css';
import {Layout} from './Layout';

export const Team: React.FC = () => {
    return (
        <div>
            <Layout />
            <div className="loc-content-container">
                
            </div>
        </div>
    );
};

