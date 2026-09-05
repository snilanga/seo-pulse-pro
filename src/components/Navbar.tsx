import React, { useState } from 'react';
import type { ClientProject, UserAccount } from '../types/seo';
import { Globe, ChevronDown, Search, ShieldCheck, UserCheck, Plus, Sparkles, User, Shield } from 'lucide-react';

interface NavbarProps {
  clients: ClientProject[];
  selectedClient: ClientProject;
  currentUser: UserAccount;
  onSelectClient: (client: ClientProject) => void;
  isClientPortal: boolean;
  onTogglePortalMode: () => void;
  onRunQuickAudit: (url: string) => void;
  onAddNewClient: () => void;
  onOpenLoginModal: () => void;
  onOpenAdminDashboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  clients,
  selectedClient,
  currentUser,
  onSelectClient,
  isClientPortal,
  onTogglePortalMode,
  onRunQuickAudit,
  onAddNewClient,
  onOpenLoginModal,
  onOpenAdminDashboard
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [quickAuditUrl, setQuickAuditUrl] = useState('');

  const handleAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickAuditUrl.trim()) {
      onRunQuickAudit(quickAuditUrl.trim());
      setQuickAuditUrl('');
    }
  };

  return (
    <header className="no-print sticky top-0 z-40 bg-[#0d1322]/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Agency Logo */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 p-[2px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                <Globe className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">RankPulse<span className="text-indigo-400">Pro</span></span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-xs text-slate-400">Google & Bing Page 1 Ranking Suite</p>
            </div>
          </div>

          {/* Client Selector Dropdown for Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
            >
              <span>{selectedClient.name}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Quick URL Audit Bar */}
        <form onSubmit={handleAuditSubmit} className="w-full md:w-96 flex items-center">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Audit any website domain (e.g. client.com)..."
              value={quickAuditUrl}
              onChange={(e) => setQuickAuditUrl(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-9 pr-24 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-medium flex items-center space-x-1 transition"
            >
              <Sparkles className="w-3 h-3" />
              <span>Audit Now</span>
            </button>
          </div>
        </form>

        {/* Right Section: Client Project Selector & Portal Mode */}
        <div className="hidden md:flex items-center space-x-3">
          
          {/* Client Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-3 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 px-3 py-1.5 rounded-xl text-left transition"
            >
              <img
                src={selectedClient.logo}
                alt={selectedClient.name}
                className="w-6 h-6 rounded-md object-cover border border-slate-600"
              />
              <div className="hidden lg:block">
                <p className="text-xs font-semibold text-white leading-tight">{selectedClient.name}</p>
                <p className="text-[10px] text-slate-400">{selectedClient.domain}</p>
              </div>
              <div className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-mono">
                {selectedClient.healthScore}%
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-[#131b2e] border border-slate-700 rounded-xl shadow-2xl z-50 py-2">
                <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Select Client Domain</span>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onAddNewClient();
                    }}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>New Client</span>
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/50">
                  {clients.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        onSelectClient(c);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 flex items-center justify-between hover:bg-slate-800/60 transition ${
                        c.id === selectedClient.id ? 'bg-indigo-600/15 border-l-2 border-indigo-500' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <img src={c.logo} alt={c.name} className="w-7 h-7 rounded-md object-cover" />
                        <div>
                          <p className="text-xs font-medium text-white">{c.name}</p>
                          <p className="text-[10px] text-slate-400">{c.domain}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-emerald-400">{c.healthScore}%</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Admin Control Panel Button (Only visible for Super Admins) */}
          {currentUser.role === 'super_admin' && (
            <button
              onClick={onOpenAdminDashboard}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold border border-purple-400/40 shadow-md shadow-purple-600/20 transition"
              title="Open Admin Control Panel"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>
          )}

          {/* Toggle View Mode Button (Agency vs Client View) */}
          <button
            onClick={onTogglePortalMode}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              isClientPortal
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-600/30'
            }`}
          >
            {isClientPortal ? (
              <>
                <UserCheck className="w-3.5 h-3.5" />
                <span>Client Portal View</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Agency View</span>
              </>
            )}
          </button>

          {/* Active Logged-in User Account Button */}
          <button
            onClick={onOpenLoginModal}
            className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 px-2.5 py-1.5 rounded-xl text-left transition"
            title="Switch User / Sign In"
          >
            <img src={currentUser.avatar} alt={currentUser.name} className="w-6 h-6 rounded-full object-cover border border-purple-400/50" />
            <div className="hidden lg:block">
              <p className="text-[11px] font-bold text-white leading-tight truncate max-w-[100px]">{currentUser.name.split(' ')[0]}</p>
              <p className="text-[9px] text-purple-400 font-mono font-semibold uppercase">{currentUser.role === 'super_admin' ? 'Admin' : currentUser.role === 'client_manager' ? 'Client' : 'Analyst'}</p>
            </div>
            <User className="w-3 h-3 text-slate-400" />
          </button>

        </div>
      </div>
    </header>
  );
};
