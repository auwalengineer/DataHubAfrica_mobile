
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import { BrandLogo } from '../../components/BrandLogo';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: formData.email,
        displayName: formData.name,
        phoneNumber: formData.phone,
        walletBalance: 0, // Start with 0 balance
        virtualAccount: {
          bankName: 'Wema Bank',
          accountNumber: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
          accountName: `DATAHUB - ${formData.name}`
        },
        kycStatus: 'unverified',
        pinSet: false,
        biometricsEnabled: false
      });
    } catch (err: any) {
      console.error("Registration Error:", err);
      if (err.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection or disable ad-blockers.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(err.message || 'Failed to register');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-8 bg-[#F9F8FD] animate-in slide-in-from-bottom duration-500">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-[#1A0033] tracking-tight">Join Us</h1>
            <p className="text-[#FF5100] font-black text-xs uppercase tracking-widest mt-1">Start your journey</p>
          </div>
          <BrandLogo size={60} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100">
              {error}
            </div>
          )}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Tunde Adebayo"
              className="w-full bg-white border-2 border-gray-100 p-4 rounded-2xl font-bold text-sm focus:outline-none focus:border-[#5E00A3] transition-all shadow-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
            <input 
              type="tel" 
              required
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="080 1234 5678"
              className="w-full bg-white border-2 border-gray-100 p-4 rounded-2xl font-bold text-sm focus:outline-none focus:border-[#5E00A3] transition-all shadow-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="name@email.com"
              className="w-full bg-white border-2 border-gray-100 p-4 rounded-2xl font-bold text-sm focus:outline-none focus:border-[#5E00A3] transition-all shadow-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Create Password</label>
            <input 
              type="password" 
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="8+ characters"
              className="w-full bg-white border-2 border-gray-100 p-4 rounded-2xl font-bold text-sm focus:outline-none focus:border-[#5E00A3] transition-all shadow-sm"
            />
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF5100] text-white py-5 rounded-[22px] font-black text-lg shadow-xl shadow-orange-100 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Get Started'}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm font-bold">
            Already have an account? {' '}
            <Link to="/login" className="text-[#5E00A3] font-black uppercase tracking-widest text-xs ml-1 underline decoration-2 underline-offset-4">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
