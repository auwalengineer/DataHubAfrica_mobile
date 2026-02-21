
import React, { useState, useEffect } from 'react';
import { User, Transaction, TransactionType } from '../types';
import { getFinancialAdvice } from '../services/geminiService';
import { Link } from 'react-router-dom';

interface DashboardProps {
  user: User;
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, transactions }) => {
  const [advice, setAdvice] = useState<string>("Analyzing your spending...");

  useEffect(() => {
    const fetchAdvice = async () => {
      const res = await getFinancialAdvice(transactions, user.walletBalance);
      setAdvice(res || "Save more by bundling your data purchases.");
    };
    fetchAdvice();
  }, [transactions, user.walletBalance]);

  const formatNaira = (kobo: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(kobo / 100);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Balance Card - The Hero Section */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-[#5E00A3] via-[#FF5100] to-[#FFB800] rounded-[32px] blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
        <div className="bg-gradient-to-br from-[#1A0033] to-[#5E00A3] rounded-[32px] p-8 shadow-2xl relative overflow-hidden text-white min-h-[220px] flex flex-col justify-between">
          {/* Logo element background overlay */}
          <div className="absolute top-[-20px] right-[-20px] opacity-10">
             <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">Current Wallet</span>
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            <h2 className="text-4xl font-black tracking-tight">{formatNaira(user.walletBalance)}</h2>
          </div>

          <div className="flex gap-3 mt-8">
            <Link to="/wallet" className="flex-1 bg-white text-[#5E00A3] text-center py-4 rounded-2xl font-black text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
              Fund Wallet
            </Link>
            <Link to="/services" className="flex-1 bg-[#FF5100] text-white text-center py-4 rounded-2xl font-black text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
              Pay Bills
            </Link>
          </div>
        </div>
      </div>

      {/* AI Intelligence Card */}
      <div className="bg-white rounded-[28px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50 flex gap-4 items-center">
        <div className="w-12 h-12 bg-[#FF5100]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-[#FF5100]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.047a1 1 0 01.897.95V4.31a8.001 8.001 0 014.2 13.684l-1.415-1.414a6 6 0 10-8.47 0l-1.414 1.414a8.001 8.001 0 014.2-13.684V1.997a1 1 0 01.896-.95zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/></svg>
        </div>
        <div>
          <h4 className="text-[10px] font-black text-[#FF5100] uppercase tracking-widest mb-0.5">Financial Tip</h4>
          <p className="text-xs text-gray-700 font-medium leading-relaxed italic">"{advice}"</p>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-4 gap-4 px-1">
        {[
          { label: 'Airtime', icon: '📱', color: 'bg-indigo-50 text-[#5E00A3]' },
          { label: 'Data', icon: '📶', color: 'bg-orange-50 text-[#FF5100]' },
          { label: 'Power', icon: '💡', color: 'bg-yellow-50 text-[#FFB800]' },
          { label: 'Cable', icon: '📺', color: 'bg-purple-50 text-purple-600' },
        ].map((action) => (
          <Link to="/services" key={action.label} className="flex flex-col items-center gap-3 group">
            <div className={`w-16 h-16 ${action.color} rounded-[24px] flex items-center justify-center text-3xl shadow-sm border border-white group-hover:shadow-md group-hover:-translate-y-1 transition-all`}>
              {action.icon}
            </div>
            <span className="text-[11px] font-black text-gray-500 uppercase tracking-tighter">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Transactions Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-black text-lg text-[#1A0033] tracking-tight">Recent Activity</h3>
          <Link to="/transactions" className="text-[#5E00A3] text-xs font-black uppercase tracking-widest">View History</Link>
        </div>
        <div className="space-y-3">
          {transactions.slice(0, 4).map((tx) => (
            <div key={tx.id} className="bg-white p-5 rounded-[24px] flex items-center justify-between border border-gray-100/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${tx.type === TransactionType.CREDIT ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'}`}>
                   {tx.category === 'data' ? '📶' : tx.category === 'airtime' ? '📱' : tx.type === TransactionType.CREDIT ? '💰' : '📄'}
                </div>
                <div>
                  <p className="text-sm font-black text-[#1A0033] capitalize">{tx.category.replace('_', ' ')}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{new Date(tx.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-black ${tx.type === TransactionType.CREDIT ? 'text-emerald-500' : 'text-[#1A0033]'}`}>
                  {tx.type === TransactionType.CREDIT ? '+' : '-'}{formatNaira(tx.amount)}
                </p>
                <div className={`text-[8px] font-black uppercase inline-block px-1.5 py-0.5 rounded-md mt-1 ${tx.status === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  {tx.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
