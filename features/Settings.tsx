
import React, { useState } from 'react';
import { User } from '../types';

interface SettingsProps {
  user: User;
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onLogout }) => {
  const [biometrics, setBiometrics] = useState(true);

  const menuItems = [
    { label: 'KYC Verification', icon: '👤', description: 'BVN/NIN Documents' },
    { label: 'Saved Beneficiaries', icon: '⭐', description: 'Frequent numbers & accounts' },
    { label: 'Help & Support', icon: '🎧', description: 'WhatsApp & Email Support' },
    { label: 'Refer & Earn', icon: '🎁', description: 'Invite friends to earn cash' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-xl font-black text-gray-900 px-1">Settings</h2>

      {/* User Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 bg-[#5E00A3]/10 text-[#5E00A3] rounded-full flex items-center justify-center text-2xl font-bold">
          {user.displayName.charAt(0)}
        </div>
        <div>
          <h3 className="font-black text-gray-900">{user.displayName}</h3>
          <p className="text-xs text-gray-400 font-medium">{user.email}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Verified User</span>
          </div>
        </div>
      </div>

      {/* Security Section with Toggle */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 flex items-center justify-between border-b border-gray-50">
          <div className="flex items-center gap-4 text-left">
            <div className="w-10 h-10 bg-indigo-50 text-[#5E00A3] rounded-xl flex items-center justify-center text-xl">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.02-.1 3.02"/><path d="M7 10a5 5 0 0 1 10 0"/><path d="M2 12a10 10 0 0 1 18.29-5.69"/></svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Fingerprint Login</h4>
              <p className="text-[10px] text-gray-400 font-medium">Use your biometrics for quick sign-in</p>
            </div>
          </div>
          <button 
            onClick={() => setBiometrics(!biometrics)}
            className={`w-12 h-6 rounded-full transition-colors relative ${biometrics ? 'bg-[#5E00A3]' : 'bg-gray-200'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${biometrics ? 'translate-x-7' : 'translate-x-1'}`}></div>
          </button>
        </div>
        
        <button className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors border-b border-gray-50">
          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xl">
            🔑
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-gray-900">Transaction PIN</h4>
            <p className="text-[10px] text-gray-400 font-medium">Change your 4-digit security PIN</p>
          </div>
          <span className="text-gray-300">→</span>
        </button>
      </div>

      {/* Menu List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
        {menuItems.map((item) => (
          <button key={item.label} className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xl">
              {item.icon}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-900">{item.label}</h4>
              <p className="text-[10px] text-gray-400 font-medium">{item.description}</p>
            </div>
            <span className="text-gray-300">→</span>
          </button>
        ))}
      </div>

      {/* Log Out */}
      <button 
        onClick={onLogout}
        className="w-full text-red-500 font-black text-sm uppercase tracking-widest py-4 border-2 border-red-50 px-4 rounded-2xl bg-red-50/30 hover:bg-red-50 transition-colors"
      >
        Log Out Account
      </button>

      <div className="text-center pt-4">
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">DataHub Africa v1.0.4</p>
      </div>
    </div>
  );
};

export default Settings;
