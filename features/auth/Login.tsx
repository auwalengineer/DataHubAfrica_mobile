
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../../components/BrandLogo';
import { BiometricPrompt } from '../../components/BiometricPrompt';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showBiometrics, setShowBiometrics] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen flex flex-col p-8 bg-[#F9F8FD] animate-in fade-in duration-500">
      {showBiometrics && (
        <BiometricPrompt 
          onSuccess={onLogin} 
          onCancel={() => setShowBiometrics(false)} 
        />
      )}

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="mb-12 text-center flex flex-col items-center">
          <BrandLogo size={120} showText className="mb-8" />
          <h1 className="text-2xl font-black text-[#1A0033] tracking-tight">Welcome Back</h1>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2">Sign in to your wallet</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-white border-2 border-gray-100 p-4 rounded-2xl font-bold text-sm focus:outline-none focus:border-[#5E00A3] transition-all shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white border-2 border-gray-100 p-4 rounded-2xl font-bold text-sm focus:outline-none focus:border-[#5E00A3] transition-all shadow-sm"
            />
          </div>

          <div className="flex justify-between items-center">
             <button 
              type="button" 
              onClick={() => setShowBiometrics(true)}
              className="flex items-center gap-2 text-[#5E00A3] text-[10px] font-black uppercase tracking-widest hover:opacity-70 transition-opacity"
            >
              <div className="w-8 h-8 bg-[#5E00A3]/10 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.02-.1 3.02" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M7 10a5 5 0 0 1 10 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M2 12a10 10 0 0 1 18.29-5.69" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              </div>
              Fingerprint
            </button>
            <button type="button" className="text-gray-400 text-[10px] font-black uppercase tracking-widest hover:opacity-70 transition-opacity">Forgot Password?</button>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#5E00A3] text-white py-5 rounded-[22px] font-black text-lg shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
          >
            Sign In
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-gray-400 text-sm font-bold">
            New to DataHub? {' '}
            <Link to="/register" className="text-[#FF5100] font-black uppercase tracking-widest text-xs ml-1 underline decoration-2 underline-offset-4">Register</Link>
          </p>
        </div>
      </div>

      <div className="text-center pb-6 opacity-30 mt-auto">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Secured by DataHub Systems</p>
      </div>
    </div>
  );
};

export default Login;
