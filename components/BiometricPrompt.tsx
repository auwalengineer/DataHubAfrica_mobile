
import React, { useEffect, useState } from 'react';

interface BiometricPromptProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const BiometricPrompt: React.FC<BiometricPromptProps> = ({ onSuccess, onCancel }) => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');

  useEffect(() => {
    // Start scanning simulation automatically
    const timer = setTimeout(() => {
      setStatus('scanning');
      
      setTimeout(() => {
        setStatus('success');
        setTimeout(() => {
          onSuccess();
        }, 1000);
      }, 3000);
    }, 500);

    return () => clearTimeout(timer);
  }, [onSuccess]);

  return (
    <div className="fixed inset-0 z-[200] bg-[#1A0033]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-white animate-in fade-in duration-500">
      <div className="relative group mb-16">
        {/* Glow effect */}
        <div className={`absolute inset-0 bg-[#FF5100] blur-[80px] rounded-full transition-opacity duration-1000 ${status === 'scanning' ? 'opacity-30' : status === 'success' ? 'opacity-10 bg-emerald-500' : 'opacity-0'}`}></div>
        
        {/* Scanner Ring */}
        <div className={`w-56 h-56 rounded-full border-2 flex items-center justify-center relative transition-all duration-700 ${status === 'success' ? 'border-emerald-500 scale-110 shadow-[0_0_50px_rgba(16,185,129,0.3)]' : 'border-white/10'}`}>
          
          {/* Progress Circle (only visible during scanning) */}
          {status === 'scanning' && (
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="112"
                cy="112"
                r="110"
                fill="none"
                stroke="#FF5100"
                strokeWidth="4"
                strokeDasharray="691"
                className="animate-[progress_3s_linear_forwards]"
              />
            </svg>
          )}

          {/* Fingerprint Icon */}
          <div className={`relative z-10 transition-all duration-500 ${status === 'success' ? 'text-emerald-500' : status === 'scanning' ? 'text-[#FF5100]' : 'text-white/20'}`}>
            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.02-.1 3.02" />
              <path d="M7 10a5 5 0 0 1 10 0" />
              <path d="M2 12a10 10 0 0 1 18.29-5.69" />
              <path d="M10 18c0 .33.03.66.08 1" />
              <path d="M14 18c0 .33-.03.66-.08 1" />
              <path d="M22 12c0 2.2-1.3 4.1-3.3 5" />
              <path d="M2 12c0 2.2 1.3 4.1 3.3 5" />
              <path d="M12 22a2 2 0 0 0 2-2c0-1.02.1-2.02.1-3.02" />
            </svg>
          </div>
          
          {/* Ripple Effect */}
          {status === 'scanning' && (
            <div className="absolute inset-0 rounded-full bg-[#FF5100]/20 animate-ping opacity-20"></div>
          )}
        </div>
      </div>

      <div className="text-center max-w-xs relative z-10">
        <h3 className="text-2xl font-black mb-3 tracking-tight">
          {status === 'idle' && 'Biometric Access'}
          {status === 'scanning' && 'Scanning...'}
          {status === 'success' && 'Verified'}
          {status === 'failed' && 'Retry Failed'}
        </h3>
        <p className="text-white/40 font-bold text-[10px] uppercase tracking-[0.2em] leading-relaxed">
          {status === 'scanning' ? 'Hold your finger on the sensor to authenticate secure access.' : 
           status === 'success' ? 'Identity confirmed. Accessing DataHub servers...' : 
           'Please verify your identity using the fingerprint sensor.'}
        </p>
      </div>

      <button 
        onClick={onCancel}
        className="mt-20 px-8 py-3 bg-white/5 border border-white/10 rounded-full text-white/60 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 hover:text-white transition-all"
      >
        Use Secure Password
      </button>

      <style>{`
        @keyframes progress {
          from { stroke-dashoffset: 691; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
};
