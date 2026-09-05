import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Key, 
  Activity, 
  UserPlus, 
  Search, 
  Building2, 
  Lock, 
  Unlock, 
  Check, 
  Save, 
  Cpu
} from 'lucide-react';
import type { UserAccount, UserRole, ClientProject } from '../../types/seo';

interface AdminDashboardProps {
  currentUser: UserAccount;
  users: UserAccount[];
  clients: ClientProject[];
  onAddUser: (user: UserAccount) => void;
  onUpdateUserRole: (userId: string, role: UserRole) => void;
  onToggleUserStatus: (userId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  users,
  clients,
  onAddUser,
  onUpdateUserRole,
  onToggleUserStatus
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'branding' | 'api-keys' | 'logs'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // New User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('seo_analyst');
  const [newUserClientId, setNewUserClientId] = useState<string>(clients[0]?.id || '');

  // White-Label Settings State
  const [agencyName, setAgencyName] = useState('RankPulse SEO Enterprise Agency');
  const [customDomain, setCustomDomain] = useState('seo.clientportal.io');
  const [supportEmail, setSupportEmail] = useState('support@rankpulse.io');
  const [savedSettings, setSavedSettings] = useState(false);

  // API Key State
  const [gscKey, setGscKey] = useState('gsc_live_api_88492049182390192');
  const [bingKey, setBingKey] = useState('bing_serp_key_771920394012');
  const [aiAgentKey, setAiAgentKey] = useState('sk-antigravity-ai-agent-v4-99201');

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
      role: newUserRole,
      clientId: newUserRole === 'client_manager' ? newUserClientId : undefined,
      status: 'active',
      lastLogin: 'Just now'
    };

    onAddUser(newUser);
    setNewUserName('');
    setNewUserEmail('');
    setShowAddUserModal(false);
    alert(`User Account "${newUser.name}" successfully created!`);
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Admin Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-6 rounded-2xl border border-purple-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Enterprise Admin Control Panel
            </h1>
            <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold rounded-full border border-indigo-500/30">
              👑 {currentUser.role.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-slate-300">
            Manage agency team members, client logins, white-label custom domain branding, and global API keys.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Accounts ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('branding')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
              activeTab === 'branding'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>White-Label Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('api-keys')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
              activeTab === 'api-keys'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>API Integrations</span>
          </button>
        </div>
      </div>

      {/* Admin KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Registered Users</p>
            <h3 className="text-2xl font-bold text-white mt-1">{users.length} Users</h3>
            <p className="text-[11px] text-emerald-400 font-medium mt-1">3 Super Admins & Managers</p>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Active Agency Clients</p>
            <h3 className="text-2xl font-bold text-white mt-1">{clients.length} Clients</h3>
            <p className="text-[11px] text-indigo-400 font-medium mt-1">100% Active Subscriptions</p>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Autonomous AI Agent Calls</p>
            <h3 className="text-2xl font-bold text-white mt-1">42,850</h3>
            <p className="text-[11px] text-emerald-400 font-medium mt-1">99.8% Success Rate</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Cpu className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">System Uptime & Latency</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">99.98%</h3>
            <p className="text-[11px] text-slate-400 font-medium mt-1">42ms Average API Latency</p>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* TAB 1: USER ACCOUNTS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4">
          
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user name or email..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              onClick={() => setShowAddUserModal(true)}
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-lg shadow-purple-600/30"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create New User Account</span>
            </button>
          </div>

          {/* User Accounts Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-950/60">
                  <th className="py-3 px-4">User Details</th>
                  <th className="py-3 px-4">Role Permission</th>
                  <th className="py-3 px-4">Scoped Client</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Login</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredUsers.map((usr) => (
                  <tr key={usr.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <img src={usr.avatar} alt={usr.name} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                        <div>
                          <div className="font-bold text-white flex items-center space-x-1.5">
                            <span>{usr.name}</span>
                            {usr.id === currentUser.id && (
                              <span className="px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 text-[9px] font-bold rounded">You</span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400">{usr.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={usr.role}
                        onChange={(e) => onUpdateUserRole(usr.id, e.target.value as UserRole)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-purple-500 font-semibold"
                      >
                        <option value="super_admin">👑 Super Admin</option>
                        <option value="client_manager">💼 Client Manager</option>
                        <option value="seo_analyst">🔍 SEO Specialist</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {usr.clientId ? clients.find(c => c.id === usr.clientId)?.name || 'Scoped Domain' : 'All Agency Clients (Full)'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center space-x-1 w-fit ${
                        usr.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        <span className="capitalize">{usr.status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {usr.lastLogin}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => onToggleUserStatus(usr.id)}
                        className={`p-1.5 rounded-lg border transition ${
                          usr.status === 'active' 
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                        }`}
                        title={usr.status === 'active' ? 'Suspend Account' : 'Activate Account'}
                      >
                        {usr.status === 'active' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 2: WHITE-LABEL BRANDING */}
      {activeTab === 'branding' && (
        <form onSubmit={handleSaveBranding} className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-purple-400" />
              <span>Agency White-Label Branding Settings</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Customize the platform name, logo, custom domain portal URL, and executive client PDF footer metadata.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Agency / Company Name</label>
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Custom Client Portal Domain (CNAME)</label>
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Agency Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center space-x-3">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-purple-600/30"
            >
              <Save className="w-4 h-4" />
              <span>Save Branding Settings</span>
            </button>

            {savedSettings && (
              <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                <Check className="w-4 h-4" />
                <span>Branding updated successfully!</span>
              </span>
            )}
          </div>
        </form>
      )}

      {/* TAB 3: API INTEGRATION KEYS */}
      {activeTab === 'api-keys' && (
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Key className="w-5 h-5 text-indigo-400" />
              <span>Live Search Engine API & AI Agent Credentials</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Configure real-time API connection keys for Google Search Console, Bing Webmaster Tools, and the Autonomous AI Agent.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-white">Google Search Console API Key</label>
              <input
                type="password"
                value={gscKey}
                onChange={(e) => setGscKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-white">Bing Webmaster API Key</label>
              <input
                type="password"
                value={bingKey}
                onChange={(e) => setBingKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-white">Autonomous AI Agent LLM API Key</label>
              <input
                type="password"
                value={aiAgentKey}
                onChange={(e) => setAiAgentKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW USER MODAL */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-5">
            <h3 className="text-lg font-bold text-white">Create New User Account</h3>
            
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="e.g. jane@clientdomain.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">User Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="super_admin">👑 Super Admin (Full Agency Access)</option>
                  <option value="client_manager">💼 Client Manager (Domain Scoped)</option>
                  <option value="seo_analyst">🔍 SEO Specialist (Read/Write Tools)</option>
                </select>
              </div>

              {newUserRole === 'client_manager' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Assign Client Domain</label>
                  <select
                    value={newUserClientId}
                    onChange={(e) => setNewUserClientId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.domain})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/30"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
