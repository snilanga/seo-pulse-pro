import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  X
} from 'lucide-react';
import type { UserAccount } from '../../types/seo';

interface LoginModalProps {
  users: UserAccount[];
  currentUser: UserAccount;
  onSelectUser: (user: UserAccount) => void;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  users,
  currentUser,
  onSelectUser,
  onClose
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('••••••••••••');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = users.find(u => u.email.toLowerCase() === emailInput.toLowerCase()) || users[0];
    onSelectUser(matched);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 p-6 text-center border-b border-slate-800">
          <div className="inline-flex p-3 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl text-white shadow-xl shadow-indigo-500/30 mb-3">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            User Authentication & Switch Portal
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Sign in as an Agency Admin, SEO Analyst, or Client Manager to switch permission views.
          </p>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Quick 1-Click Demo Login Profiles */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              ⚡ 1-Click Instant Demo User Switch
            </label>
            <div className="space-y-2">
              {users.map((usr) => {
                const isSelected = usr.id === currentUser.id;
                return (
                  <button
                    key={usr.id}
                    onClick={() => {
                      onSelectUser(usr);
                      onClose();
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img src={usr.avatar} alt={usr.name} className="w-9 h-9 rounded-full object-cover border border-indigo-400/40" />
                      <div>
                        <div className="text-xs font-bold text-white flex items-center space-x-2">
                          <span>{usr.name}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                            usr.role === 'super_admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                            usr.role === 'client_manager' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}>
                            {usr.role === 'super_admin' ? '👑 Super Admin' : usr.role === 'client_manager' ? '💼 Client Manager' : '🔍 Analyst'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{usr.email}</p>
                      </div>
                    </div>

                    {isSelected ? (
                      <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="text-xs text-indigo-400 font-semibold flex items-center space-x-1 group-hover:translate-x-1 transition">
                        <span>Switch</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative border-t border-slate-800 pt-4">
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-slate-900 px-3 text-[10px] text-slate-500 font-bold uppercase">
              OR Custom Credentials
            </span>
          </div>

          {/* Standard Login Form */}
          <form onSubmit={handleCustomLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="admin@rankpulse.io"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Authenticate & Access Platform</span>
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
