
import React, { useState } from 'react';
import { User, ServiceCategory } from '../types';
import { validateTransactionWithAI } from '../services/geminiService';

interface ServicesProps {
  user: User;
  onPurchase: (category: ServiceCategory, amount: number, metadata: any) => boolean;
}

const Services: React.FC<ServicesProps> = ({ user, onPurchase }) => {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [network, setNetwork] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<string>('');

  const categories = [
    { id: ServiceCategory.AIRTIME, label: 'Airtime VTU', icon: '📱', color: 'bg-indigo-50 text-[#5E00A3]' },
    { id: ServiceCategory.DATA, label: 'Data Bundles', icon: '📶', color: 'bg-orange-50 text-[#FF5100]' },
    { id: ServiceCategory.ELECTRICITY, label: 'Power Bill', icon: '💡', color: 'bg-yellow-50 text-[#FFB800]' },
    { id: ServiceCategory.CABLE, label: 'Cable TV', icon: '📺', color: 'bg-purple-50 text-purple-600' },
  ];

  const networks = ['MTN', 'Airtel', 'Glo', '9Mobile'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !amount) return;

    setIsProcessing(true);
    setFeedback('Authenticating with DataHub AI...');

    const amountKobo = parseInt(amount) * 100;
    const metadata = { network, phoneNumber, timestamp: new Date().toISOString() };
    
    const aiResponse = await validateTransactionWithAI(amountKobo, selectedCategory, metadata);
    setFeedback(aiResponse);

    setTimeout(() => {
      const success = onPurchase(selectedCategory, amountKobo, metadata);
      if (success) {
        setFeedback("Transaction Completed Successfully!");
        setTimeout(() => {
          setSelectedCategory(null);
          setAmount('');
          setPhoneNumber('');
          setFeedback('');
          setIsProcessing(false);
        }, 2000);
      } else {
        setFeedback("Payment Failed: Insufficient Wallet Balance.");
        setIsProcessing(false);
      }
    }, 1500);
  };

  if (selectedCategory) {
    return (
      <div className="space-y-6 animate-in slide-in-from-right duration-300">
        <button 
          onClick={() => setSelectedCategory(null)} 
          className="text-[#5E00A3] font-black uppercase tracking-widest text-[10px] flex items-center gap-2 mb-4 hover:opacity-70 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
          Back to Services
        </button>

        <div className="bg-white p-8 rounded-[32px] shadow-2xl border border-gray-100">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-[#1A0033] capitalize mb-1">Buy {selectedCategory}</h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Instant vending service</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {(selectedCategory === ServiceCategory.AIRTIME || selectedCategory === ServiceCategory.DATA) && (
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Service Provider</label>
                <div className="grid grid-cols-2 gap-2">
                  {networks.map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setNetwork(n)}
                      className={`py-3 text-xs font-black rounded-2xl border-2 transition-all ${network === n ? 'bg-[#5E00A3] text-white border-[#5E00A3]' : 'bg-gray-50 text-gray-400 border-gray-100 hover:border-gray-200'}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Phone Number</label>
              <input
                type="tel"
                placeholder="e.g. 08012345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl font-bold text-lg focus:outline-none focus:border-[#5E00A3] transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Purchase Amount (₦)</label>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl font-black text-3xl text-[#1A0033] focus:outline-none focus:border-[#5E00A3] transition-all"
                required
              />
            </div>

            <button
              disabled={isProcessing}
              type="submit"
              className="w-full bg-[#5E00A3] text-white py-5 rounded-[24px] font-black text-lg shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98] disabled:bg-gray-300 disabled:shadow-none transition-all mt-4"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : `Pay ₦${amount || '0.00'}`}
            </button>
          </form>

          {feedback && (
            <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
              <p className="text-[10px] font-black text-[#5E00A3] uppercase tracking-widest mb-1">AI Assistant</p>
              <p className="text-xs font-bold text-indigo-900/70 italic leading-relaxed">{feedback}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="px-1">
        <h2 className="text-2xl font-black text-[#1A0033] tracking-tight">Utility Hub</h2>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Everything you need in one place</p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className="bg-white p-6 rounded-[30px] flex items-center gap-6 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-xl hover:border-[#5E00A3]/20 transition-all text-left group overflow-hidden relative"
          >
             <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-125 transition-transform duration-700">
                <span className="text-8xl">{cat.icon}</span>
             </div>
            <div className={`w-16 h-16 ${cat.color} rounded-[22px] flex items-center justify-center text-4xl shadow-sm group-hover:scale-110 transition-transform`}>
              {cat.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-black text-[#1A0033] text-lg leading-tight">{cat.label}</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Instant activation</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#5E00A3] group-hover:text-white transition-all">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Services;
