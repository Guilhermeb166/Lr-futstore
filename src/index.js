import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {  } from 'react-router-dom';
import { AppProvider } from './Context/AppContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AppProvider>
        <App />
    </AppProvider>
);

