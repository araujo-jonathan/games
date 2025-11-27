
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { WalletProvider } from './contexts/WalletContext';
import Onboarding from './screens/Onboarding';
import CreateAccount from './screens/CreateAccount';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import Deposit from './screens/Deposit';
import DepositPix from './screens/DepositPix';
import Withdraw from './screens/Withdraw';
import Transfer from './screens/Transfer';
import Statement from './screens/Statement';
import Profile from './screens/Profile';

const App = () => {
  return (
    <LanguageProvider>
      <WalletProvider>
        <Router>
          <div className="max-w-md mx-auto min-h-screen bg-background shadow-2xl overflow-x-hidden relative">
            <Routes>
              <Route path="/" element={<Onboarding />} />
              <Route path="/create-account" element={<CreateAccount />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/deposit" element={<Deposit />} />
              <Route path="/deposit-pix" element={<DepositPix />} />
              <Route path="/withdraw" element={<Withdraw />} />
              <Route path="/transfer" element={<Transfer />} />
              <Route path="/statement" element={<Statement />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </Router>
      </WalletProvider>
    </LanguageProvider>
  );
};

export default App;
