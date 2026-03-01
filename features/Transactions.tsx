
import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';

interface TransactionsProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionsProps> = ({ transactions }) => {
  const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all');

  const filteredTransactions = transactions.filter(tx => 
    filter === 'all' || tx.type === filter
  );

  const formatNaira = (kobo: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(kobo / 100);
  };

  return (
    <div className="space-y-6 pb-10">
      <h2 className="text-xl font-bold text-gray-900 px-1">History</h2>
      
      {/* Filters */}
      <div className="flex gap-2 px-1">
        {['all', 'credit', 'debit'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-6 py-2 rounded-full text-xs font-bold capitalize transition-all ${filter === f ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-gray-400 border border-gray-100'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredTransactions.map((tx) => (
          <div key={tx.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${tx.type === TransactionType.CREDIT ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-500'}`}>
                {tx.category === 'data' ? '📶' : tx.category === 'airtime' ? '📱' : tx.category === 'wallet_fund' ? '💰' : '📑'}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 capitalize text-sm">{tx.category.replace('_', ' ')}</h4>
                <p className="text-[10px] font-medium text-gray-400">{new Date(tx.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                {tx.metadata.network && <span className="text-[10px] bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded-md border border-gray-100 mt-1 inline-block">{tx.metadata.network}</span>}
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold text-sm ${tx.type === TransactionType.CREDIT ? 'text-emerald-600' : 'text-gray-900'}`}>
                {tx.type === TransactionType.CREDIT ? '+' : '-'}{formatNaira(tx.amount)}
              </p>
              <div className="flex items-center gap-1 justify-end mt-1">
                <div className={`w-1.5 h-1.5 rounded-full ${tx.status === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{tx.status}</span>
              </div>
            </div>
          </div>
        ))}

        {filteredTransactions.length === 0 && (
          <div className="py-20 text-center bg-white rounded-[32px] border border-gray-50 shadow-sm">
            <div className="text-4xl mb-4">📂</div>
            <p className="text-gray-900 font-black text-sm uppercase tracking-widest">No Transactions Yet</p>
            <p className="text-gray-400 text-xs mt-2">Your payment history will appear here once you start using your wallet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
