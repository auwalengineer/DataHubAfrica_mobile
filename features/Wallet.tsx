
import React, { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { User } from '../types';

interface WalletProps {
  user: User;
  onFund: (amount: number) => Promise<void>;
}

const Wallet: React.FC<WalletProps> = ({ user, onFund }) => {
  const [fundAmount, setFundAmount] = useState('');
  const [showFundModal, setShowFundModal] = useState(false);
  const [isFunding, setIsFunding] = useState(false);
  const [fundingStatus, setFundingStatus] = useState<string | null>(null);

  const config = {
    reference: (new Date()).getTime().toString(),
    email: user.email,
    amount: parseInt(fundAmount) * 100, // Paystack expects amount in kobo
    publicKey: 'pk_test_37641a55d427e86351692a896b37f40f56d9b9bd',
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = async (reference: any) => {
    setIsFunding(true);
    setFundingStatus("Verifying payment...");
    try {
      // Verify payment on the server
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reference: reference.reference }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setFundingStatus("Updating wallet...");
        const success = await onFund(data.amount);
        if (success) {
          setFundingStatus("Success! Wallet funded.");
          setTimeout(() => {
            setShowFundModal(false);
            setFundAmount('');
            setFundingStatus(null);
          }, 2000);
        } else {
          setFundingStatus("Error: Failed to update balance in database.");
        }
      } else {
        setFundingStatus(`Error: ${data.message || 'Verification failed'}`);
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      setFundingStatus(`Error: ${error.message || 'An error occurred'}`);
    } finally {
      setIsFunding(false);
    }
  };

  const onClose = () => {
    console.log('Payment closed');
  };

  const formatNaira = (kobo: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(kobo / 100);
  };

  const handleFund = () => {
    const val = parseInt(fundAmount);
    if (!isNaN(val) && val >= 100) {
      initializePayment({ onSuccess, onClose });
    } else {
      alert("Minimum funding amount is ₦100");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="px-1">
        <h2 className="text-2xl font-black text-[#1A0033] tracking-tight">My Wallet</h2>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Manage your funds securely</p>
      </div>

      {/* Virtual Account Card - Premium UI */}
      <div className="relative group">
        <div className="absolute inset-0 bg-[#5E00A3] blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
        <div className="bg-[#1A0033] rounded-[36px] p-8 text-white shadow-2xl relative overflow-hidden">
          {/* Logo Brand Mark */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-br from-[#FF5100] to-[#FFB800] opacity-10 rounded-full blur-[40px]"></div>
          <div className="absolute top-8 right-8 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
             <span className="text-xl">🏦</span>
          </div>
          
          <div className="relative z-10">
            <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em] mb-6">Funding Account Details</p>
            
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Bank Partner</p>
                  <p className="font-black text-xl tracking-tight">Paystack-Titan</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Status</p>
                   <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md border border-emerald-400/20 uppercase">Active</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">Account Number</p>
                <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10 group/item hover:bg-white/10 transition-colors">
                  <p className="font-black text-3xl tracking-[0.15em] text-[#FF5100]">{user.virtualAccount.accountNumber}</p>
                  <button 
                    onClick={() => navigator.clipboard.writeText(user.virtualAccount.accountNumber)} 
                    className="p-2 bg-white/10 rounded-xl hover:bg-[#FF5100] transition-all group-hover/item:scale-110"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/></svg>
                  </button>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1 text-center">Beneficiary Name</p>
                <p className="font-bold text-sm text-center opacity-80">{user.virtualAccount.accountName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)] space-y-6">
        <div>
          <h3 className="font-black text-[#1A0033] text-lg tracking-tight">Instant Card Funding</h3>
          <p className="text-xs text-gray-400 font-medium leading-relaxed mt-1">
            Securely add money to your wallet using any Nigerian debit card. Powered by Paystack.
          </p>
        </div>
        <button 
          onClick={() => setShowFundModal(true)}
          className="w-full bg-[#FF5100] text-white py-5 rounded-[22px] font-black text-lg shadow-xl shadow-orange-100 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
          Fund with Card
        </button>
      </div>

      {showFundModal && (
        <div className="fixed inset-0 bg-[#1A0033]/60 backdrop-blur-md z-[100] flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-[40px] p-10 animate-in slide-in-from-bottom duration-500 shadow-2xl">
            <div className="w-16 h-1.5 bg-gray-100 rounded-full mx-auto mb-8"></div>
            <h3 className="text-2xl font-black text-[#1A0033] mb-8 text-center">Add Funds</h3>
            <div className="space-y-6">
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-3xl font-black text-gray-300">₦</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-100 p-5 pl-12 rounded-[24px] text-4xl font-black text-[#1A0033] focus:outline-none focus:border-[#FF5100] transition-all"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[1000, 5000, 10000].map(amt => (
                  <button 
                    key={amt} 
                    onClick={() => setFundAmount(amt.toString())}
                    className="py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-xs font-black text-gray-600 hover:border-[#FF5100] hover:text-[#FF5100] transition-all"
                  >
                    +₦{amt.toLocaleString()}
                  </button>
                ))}
              </div>
              <button 
                onClick={handleFund}
                disabled={isFunding}
                className="w-full bg-[#5E00A3] text-white py-5 rounded-[24px] font-black text-lg shadow-xl mt-6 hover:bg-[#4A0080] disabled:opacity-50 transition-all"
              >
                {isFunding ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{fundingStatus || 'Processing...'}</span>
                  </div>
                ) : 'Continue to Payment'}
              </button>

              {fundingStatus && !isFunding && (
                <div className={`mt-4 p-4 rounded-2xl text-center font-bold text-sm ${fundingStatus.startsWith('Success') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  {fundingStatus}
                </div>
              )}
              <button 
                onClick={() => setShowFundModal(false)}
                className="w-full text-gray-400 py-2 font-black text-[10px] uppercase tracking-[0.3em]"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
