import React, { useState } from 'react';
import { X, User, Bell, Shield, Globe, Palette, Monitor } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('account');

  if (!isOpen) return null;

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'language', label: 'Language', icon: Globe },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'playback', label: 'Playback', icon: Monitor },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(8, 25, 50, 0.8)' }}>
      <div className="rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden" style={{ backgroundColor: '#0f2f5f' }}>
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-white text-2xl font-bold">Settings</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors p-2"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex h-[600px]">
          {/* Sidebar */}
          <div className="w-64 p-4" style={{ backgroundColor: '#081932' }}>
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left ${
                      activeTab === tab.id
                        ? 'text-white'
                        : 'text-white/80 hover:bg-gray-700'
                    }`}
                    style={{ backgroundColor: activeTab === tab.id ? '#ddb870' : 'transparent' }}
                    onMouseEnter={(e) => {
                      if (activeTab !== tab.id) {
                        e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.5)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== tab.id) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <Icon size={20} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'account' && (
              <div className="space-y-6">
                <h3 className="text-white text-xl font-semibold">Account Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      defaultValue="John Doe"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="john.doe@email.com"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
                    <button 
                      className="text-white px-4 py-2 rounded-lg transition-colors"
                      style={{ backgroundColor: '#ddb870' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ebdcb5'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ddb870'}
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-white text-xl font-semibold">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { label: 'New episodes', desc: 'Get notifications for new episodes of your series' },
                    { label: 'Recommendations', desc: 'Personalized suggestions based on your preferences' },
                    { label: 'Reminders', desc: 'Remember where you left off watching' },
                    { label: 'Email marketing', desc: 'Special offers and updates via email' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#081932' }}>
                      <div>
                        <h4 className="text-white font-medium">{item.label}</h4>
                        <p className="text-white/60 text-sm">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" style={{ '--peer-checked-bg': '#ddb870' }}></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h3 className="text-white text-xl font-semibold">Privacy & Security</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#081932' }}>
                    <h4 className="text-white font-medium mb-2">Viewing History</h4>
                    <p className="text-white/60 text-sm mb-3">
                      Manage your viewing history and usage data
                    </p>
                    <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
                      Clear History
                    </button>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#081932' }}>
                    <h4 className="text-white font-medium mb-2">Download your data</h4>
                    <p className="text-white/60 text-sm mb-3">
                      Download a copy of your personal data
                    </p>
                    <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
                      Request Download
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'language' && (
              <div className="space-y-6">
                <h3 className="text-white text-xl font-semibold">Language & Region</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Interface Language
                    </label>
                    <select className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500">
                      <option>English</option>
                      <option>Italiano</option>
                      <option>Español</option>
                      <option>Français</option>
                      <option>Deutsch</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Region
                    </label>
                    <select className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500">
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Germany</option>
                      <option>France</option>
                      <option>Italy</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-white text-xl font-semibold">Appearance</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Theme
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Dark', 'Light', 'Auto'].map((theme) => (
                        <button
                          key={theme}
                          className={`p-3 rounded-lg border-2 transition-colors ${
                            theme === 'Dark'
                              ? 'border-gray-600'
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                          style={{ 
                            backgroundColor: '#081932',
                            borderColor: theme === 'Dark' ? '#ddb870' : '#6b7280'
                          }}
                        >
                          <div className="text-white text-sm font-medium">{theme}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'playback' && (
              <div className="space-y-6">
                <h3 className="text-white text-xl font-semibold">Playback Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Video Quality
                    </label>
                    <select className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500">
                      <option>Auto</option>
                      <option>4K Ultra HD</option>
                      <option>HD 1080p</option>
                      <option>HD 720p</option>
                      <option>SD 480p</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#081932' }}>
                    <div>
                      <h4 className="text-white font-medium">Autoplay</h4>
                      <p className="text-white/60 text-sm">Automatically start the next episode</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" style={{ '--peer-checked-bg': '#ddb870' }}></div>
                    </label>
                  </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-700 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            className="px-6 py-2 text-white rounded-lg transition-colors"
            style={{ backgroundColor: '#ddb870' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ebdcb5'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ddb870'}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};