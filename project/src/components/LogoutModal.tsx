import React, { useState } from 'react';
import { X, User, Mail, Lock, ArrowRight } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLogout: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirmLogout }) => {
  const [showSwitchAccount, setShowSwitchAccount] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  if (!isOpen) return null;

  const handleSwitchAccount = () => {
    setShowSwitchAccount(true);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login process
    console.log('Switching to account:', loginForm.email);
    onClose();
    // In a real app, this would handle the account switch
  };

  const savedAccounts = [
    { email: 'mario.rossi@email.com', name: 'Mario Rossi', avatar: 'M' },
    { email: 'anna.verdi@email.com', name: 'Anna Verdi', avatar: 'A' },
    { email: 'luca.bianchi@email.com', name: 'Luca Bianchi', avatar: 'L' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(8, 25, 50, 0.8)' }}>
      <div className="rounded-lg max-w-md w-full" style={{ backgroundColor: '#0f2f5f' }}>
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-white text-xl font-bold">
            {showSwitchAccount ? 'Switch Account' : 'Sign Out'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors p-2"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {!showSwitchAccount ? (
            <div className="space-y-6">
              {/* Current User Info */}
              <div className="flex items-center space-x-4 p-4 rounded-lg" style={{ backgroundColor: '#081932' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ddb870' }}>
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">John Doe</h3>
                  <p className="text-white/60 text-sm">john.doe@email.com</p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-white/80 mb-6">
                  Are you sure you want to sign out of your account?
                </p>

                <div className="space-y-3">
                  <button
                    onClick={handleSwitchAccount}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <ArrowRight size={20} />
                    <span>Switch Account</span>
                  </button>

                  <button
                    onClick={onConfirmLogout}
                    className="w-full text-white py-3 px-4 rounded-lg transition-colors"
                    style={{ backgroundColor: '#ddb870' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ebdcb5'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ddb870'}
                  >
                    Sign Out
                  </button>

                  <button
                    onClick={onClose}
                    className="w-full bg-transparent border border-gray-600 hover:border-gray-500 text-white py-3 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Saved Accounts */}
              <div>
                <h3 className="text-white font-semibold mb-4">Saved Accounts</h3>
                <div className="space-y-2">
                  {savedAccounts.map((account) => (
                    <button
                      key={account.email}
                      onClick={() => {
                        console.log('Switching to:', account.email);
                        onClose();
                      }}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg transition-colors"
                      style={{ backgroundColor: '#081932' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.7)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#081932'}
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ddb870' }}>
                        <span className="text-white font-semibold">{account.avatar}</span>
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="text-white font-medium">{account.name}</h4>
                        <p className="text-white/60 text-sm">{account.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Login Form */}
              <div>
                <h3 className="text-white font-semibold mb-4">Sign in with another account</h3>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                    <input
                      type="email"
                      placeholder="Email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-red-500"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                    <input
                      type="password"
                      placeholder="Password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-red-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full text-white py-3 px-4 rounded-lg transition-colors"
                    style={{ backgroundColor: '#ddb870' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ebdcb5'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ddb870'}
                  >
                    Sign In
                  </button>
                </form>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setShowSwitchAccount(false)}
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  ← Go back
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};