
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
    let unsubscribeUser: (() => void) | null = null;
    let unsubscribeTx: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      // Cleanup previous listeners if any
      if (unsubscribeUser) unsubscribeUser();
      if (unsubscribeTx) unsubscribeTx();

      if (firebaseUser) {
        setIsLoggedIn(true);
        
        // Listen to user document
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        unsubscribeUser = onSnapshot(userDocRef, async (docSnap) => {
          if (docSnap.exists()) {
            setUser(docSnap.data() as User);
          } else {
            const newUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'DataHub User',
              phoneNumber: firebaseUser.phoneNumber || '',
              walletBalance: 0,
              virtualAccount: {
                bankName: 'Paystack-Titan',
                accountNumber: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
                accountName: `DATAHUB - ${firebaseUser.displayName || 'User'}`
              },
              kycStatus: 'unverified',
              pinSet: false,
              biometricsEnabled: false
            };
            await setDoc(userDocRef, newUser);
          }
        }, (error) => {
          console.error("User Snapshot Error:", error);
          if (error.code === 'permission-denied') {
            alert("Firestore Permission Denied: Please update your Security Rules in the Firebase Console.");
          }
        });

        // Listen to transactions
        const setupTxListener = (useOrderBy: boolean) => {
          const txCollection = collection(db, 'transactions');
          let txQuery;
          
          if (useOrderBy) {
            txQuery = query(
              txCollection,
              where('userId', '==', firebaseUser.uid),
              orderBy('timestamp', 'desc')
            );
          } else {
            txQuery = query(
              txCollection,
              where('userId', '==', firebaseUser.uid)
            );
          }
          
          return onSnapshot(txQuery, (querySnapshot) => {
            const txs: Transaction[] = [];
            querySnapshot.forEach((doc) => {
              txs.push({ id: doc.id, ...doc.data() } as Transaction);
            });
            
            // If we didn't use orderBy in the query, sort client-side
            if (!useOrderBy) {
              txs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            }
            
            setTransactions(txs);
          }, (error) => {
            // If index is missing, retry without orderBy
            if (error.code === 'failed-precondition' && useOrderBy) {
              console.warn("Firestore Index missing. Falling back to client-side sorting. To fix this permanently, create the index: https://console.firebase.google.com/v1/r/project/datahubafrica-3b9e2/firestore/indexes?create_composite=Clhwcm9qZWN0cy9kYXRhaHViYWZyaWNhLTNiOWUyL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy90cmFuc2FjdGlvbnMvaW5kZXhlcy9fEAEaCgoGdXNlcklkEAEaDQoJdGltZXN0YW1wEAIaDAoIX19uYW1lX18QAg");
              if (unsubscribeTx) unsubscribeTx();
              unsubscribeTx = setupTxListener(false);
            } else {
              console.error("Transactions Snapshot Error:", error);
            }
          });
        };

        unsubscribeTx = setupTxListener(true);
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setTransactions([]);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUser) unsubscribeUser();
      if (unsubscribeTx) unsubscribeTx();
    };
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
    if (!user) return false;
    
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
        metadata: { method: 'Paystack' },
        timestamp: new Date().toISOString()
      };

      await addDoc(collection(db, 'transactions'), txData);
      
      // Update user balance
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        walletBalance: increment(amount)
      });
      return true;
    } catch (error) {
      console.error("Funding failed:", error);
      return false;
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

  if (!isLoggedIn) {
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

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F8FD] p-8 text-center">
        <div className="w-12 h-12 border-4 border-[#5E00A3] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#1A0033] font-black text-sm uppercase tracking-widest">Loading Profile...</p>
        <button 
          onClick={handleLogout}
          className="mt-8 text-[#FF5100] font-black text-xs uppercase tracking-widest underline"
        >
          Cancel & Logout
        </button>
      </div>
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
