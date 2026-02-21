
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot, setDoc, collection, query, where, orderBy, addDoc, updateDoc, increment } from 'firebase/firestore';
import { auth, db } from './services/firebase';
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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setIsLoggedIn(true);
        
        // Listen to user document
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUser(docSnap.data() as User);
          } else {
            // If user doc doesn't exist, we might need to create it (usually handled in Register)
            // But for safety, we can handle it here or just wait for Register to do it.
          }
        });

        // Listen to transactions
        const txQuery = query(
          collection(db, 'transactions'),
          where('userId', '==', firebaseUser.uid),
          orderBy('timestamp', 'desc')
        );
        const unsubscribeTx = onSnapshot(txQuery, (querySnapshot) => {
          const txs: Transaction[] = [];
          querySnapshot.forEach((doc) => {
            txs.push({ id: doc.id, ...doc.data() } as Transaction);
          });
          setTransactions(txs);
        });

        return () => {
          unsubscribeUser();
          unsubscribeTx();
        };
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setTransactions([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const addTransaction = async (category: ServiceCategory, amount: number, metadata: any) => {
    if (!user) return false;
    
    const prevBalance = user.walletBalance;
    const newBal = prevBalance - amount;

    if (newBal < 0) return false;

    try {
      const txData = {
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

      await addDoc(collection(db, 'transactions'), txData);
      
      // Update user balance
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        walletBalance: increment(-amount)
      });

      return true;
    } catch (error) {
      console.error("Transaction failed:", error);
      return false;
    }
  };

  const fundWallet = async (amount: number) => {
    if (!user) return;
    
    const prevBalance = user.walletBalance;
    const newBal = prevBalance + amount;

    try {
      const txData = {
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

      await addDoc(collection(db, 'transactions'), txData);
      
      // Update user balance
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        walletBalance: increment(amount)
      });
    } catch (error) {
      console.error("Funding failed:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (isLoggedIn === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F8FD]">
        <div className="w-12 h-12 border-4 border-[#5E00A3] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
