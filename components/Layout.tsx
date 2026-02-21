
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';
import { 
  HomeIcon, 
  WalletIcon, 
  GridIcon, 
  HistoryIcon, 
  SettingsIcon 
} from './Icons';
import { COLORS } from '../constants';
import { BrandLogo } from './BrandLogo';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
}

export const Layout: React.FC<LayoutProps> = ({ children, user }) => {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'Services', path: '/services', icon: <GridIcon /> },
    { label: 'Wallet', path: '/wallet', icon: <WalletIcon /> },
    { label: 'History', path: '/transactions', icon: <HistoryIcon /> },
    { label: 'Profile', path: '/settings', icon: <SettingsIcon /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F8FD] max-w-md mx-auto relative overflow-hidden shadow-2xl border-x border-gray-100">
      {/* Header */}
      <header className="bg-[#5E00A3] p-6 pt-12 text-white rounded-b-[40px] shadow-2xl relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-[#FF5100] opacity-20 blur-[60px] rounded-full"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-32 h-32 bg-white opacity-10 blur-[40px] rounded-full"></div>
        
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <BrandLogo size={36} />
            <div>
              <p className="text-white/60 text-[10px] font-black uppercase tracking-wider">Dashboard</p>
              <h1 className="text-lg font-bold tracking-tight">{user.displayName.split(' ')[0]}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all backdrop-blur-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-5 pb-24 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/80 backdrop-blur-xl border-t border-gray-100 flex justify-around py-4 px-4 z-50 rounded-t-[30px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative ${isActive ? 'text-[#5E00A3]' : 'text-gray-400'}`}
            >
              <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-black tracking-tight transition-opacity ${isActive ? 'opacity-100' : 'opacity-60'}`}>{item.label}</span>
              {isActive && <div className="absolute -bottom-1 w-1 h-1 bg-[#5E00A3] rounded-full"></div>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
