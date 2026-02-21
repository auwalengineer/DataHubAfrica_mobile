
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { 
  User, 
  Transaction, 
  TransactionType, 
  ServiceCategory, 
  TransactionStatus 
} from './types';
import Dashboard from './features/Dashboard';
import Services from './features/Services';
import Wallet from './features/Wallet';
import TransactionHistory from './features/Transactions';
import Settings from './features/Settings';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import { Layout } from './components/Layout';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Global State Simulation
  const [user, setUser] = useState<User>({
    uid: 'user-123',
    email: 'tunde.ade@example.com',
    displayName: 'Tunde Adebayo',
    phoneNumber: '08012345678',
    walletBalance: 2500000, // ₦25,000.00 in Kobo
    virtualAccount: {
      bankName: 'Wema Bank',
      accountNumber: '7829102931',
      accountName: 'DATAHUB - Tunde Adebayo'
    },
    kycStatus: 'verified',
    pinSet: true,
    biometricsEnabled: true
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'tx-1',
      userId: 'user-123',
      type: TransactionType.DEBIT,
      category: ServiceCategory.DATA,
      amount: 50000,
      previousBalance: 2550000,
      newBalance: 2500000,
      status: TransactionStatus.SUCCESS,
      reference: 'DH-123456',
      metadata: { network: 'MTN', plan: '1GB' },
      timestamp: new Date().toISOString()
    },
    {
      id: 'tx-2',
      userId: 'user-123',
      type: TransactionType.CREDIT,
      category: ServiceCategory.WALLET_FUND,
      amount: 1000000,
      previousBalance: 1550000,
      newBalance: 2550000,
      status: TransactionStatus.SUCCESS,
      reference: 'PAYSTACK-9922',
      metadata: { method: 'Card' },
      timestamp: new Date(Date.now() - 86400000).toISOString()
    }
  ]);

  const addTransaction = (category: ServiceCategory, amount: number, metadata: any) => {
    const prevBalance = user.walletBalance;
    const newBal = prevBalance - amount;

    if (newBal < 0) return false;

    const newTx: Transaction = {
      id: `tx-${Math.random().toString(36).substr(2, 9)}`,
      userId: user.uid,
      type: TransactionType.DEBIT,
      category,
      amount,
      previousBalance: prevBalance,
      newBalance: newBal,
      status: TransactionStatus.SUCCESS,
      reference: `DH-${Math.floor(Math.random() * 1000000)}`,
      metadata,
      timestamp: new Date().toISOString()
    };

    setTransactions([newTx, ...transactions]);
    setUser(prev => ({ ...prev, walletBalance: newBal }));
    return true;
  };

  const fundWallet = (amount: number) => {
    const prevBalance = user.walletBalance;
    const newBal = prevBalance + amount;

    const newTx: Transaction = {
      id: `tx-${Math.random().toString(36).substr(2, 9)}`,
      userId: user.uid,
      type: TransactionType.CREDIT,
      category: ServiceCategory.WALLET_FUND,
      amount,
      previousBalance: prevBalance,
      newBalance: newBal,
      status: TransactionStatus.SUCCESS,
      reference: `FUND-${Math.floor(Math.random() * 1000000)}`,
      metadata: { method: 'Simulation' },
      timestamp: new Date().toISOString()
    };

    setTransactions([newTx, ...transactions]);
    setUser(prev => ({ ...prev, walletBalance: newBal }));
  };

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleAuthSuccess} />} />
          <Route path="/register" element={<Register onRegister={handleAuthSuccess} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Layout user={user}>
        <Routes>
          <Route path="/" element={<Dashboard user={user} transactions={transactions} />} />
          <Route path="/services" element={<Services user={user} onPurchase={addTransaction} />} />
          <Route path="/wallet" element={<Wallet user={user} onFund={fundWallet} />} />
          <Route path="/transactions" element={<TransactionHistory transactions={transactions} />} />
          <Route path="/settings" element={<Settings user={user} onLogout={handleLogout} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
