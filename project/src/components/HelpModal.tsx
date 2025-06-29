import React, { useState } from 'react';
import { X, Search, MessageCircle, Phone, Mail, Book, Video, Headphones } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('general');

  if (!isOpen) return null;

  const categories = [
    { id: 'general', label: 'General Questions', icon: Book },
    { id: 'account', label: 'Account & Billing', icon: MessageCircle },
    { id: 'technical', label: 'Technical Issues', icon: Video },
    { id: 'content', label: 'Content', icon: Headphones },
  ];

  const faqs = {
    general: [
      {
        question: 'How can I change my subscription plan?',
        answer: 'You can change your plan by going to Settings > Account > Manage Subscription. From there you can choose from available plans.'
      },
      {
        question: 'Can I watch content offline?',
        answer: 'Yes, you can download selected content for offline viewing. Look for the download icon next to the title.'
      },
      {
        question: 'How many devices can I watch on simultaneously?',
        answer: 'The number of devices depends on your plan: Basic (1), Standard (2), Premium (4).'
      }
    ],
    account: [
      {
        question: 'How can I reset my password?',
        answer: 'Click "Forgot password?" on the login page and follow the instructions sent to your email.'
      },
      {
        question: 'How can I delete my account?',
        answer: 'Go to Settings > Account > Delete Account. Note that this action is irreversible.'
      },
      {
        question: 'When is payment charged?',
        answer: 'Payment is charged on the same day of the month you signed up, every month.'
      }
    ],
    technical: [
      {
        question: 'The video won\'t load, what can I do?',
        answer: 'Try refreshing the page, check your internet connection, or try changing the video quality.'
      },
      {
        question: 'Audio is not synchronized with video',
        answer: 'This may be due to connection issues. Try pausing and restarting the video.'
      },
      {
        question: 'The app crashes frequently',
        answer: 'Make sure you have the latest version of the app installed and restart your device.'
      }
    ],
    content: [
      {
        question: 'Why is some content not available in my region?',
        answer: 'Distribution rights vary by region. We are working to expand content availability.'
      },
      {
        question: 'How can I request new content?',
        answer: 'You can send us suggestions through the contact form. We evaluate all requests for future acquisitions.'
      },
      {
        question: 'When are new episodes added?',
        answer: 'New episodes are usually added weekly. You can enable notifications to be notified.'
      }
    ]
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(8, 25, 50, 0.8)' }}>
      <div className="rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden" style={{ backgroundColor: '#0f2f5f' }}>
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-white text-2xl font-bold">Help Center</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors p-2"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
            <input
              type="text"
              placeholder="Search help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#081932' }}>
              <MessageCircle className="mx-auto mb-2" size={32} style={{ color: '#ddb870' }} />
              <h3 className="text-white font-semibold mb-1">Live Chat</h3>
              <p className="text-white/60 text-sm mb-3">Available 24/7</p>
              <button 
                className="text-white px-4 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: '#ddb870' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ebdcb5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ddb870'}
              >
                Start Chat
              </button>
            </div>
            <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#081932' }}>
              <Phone className="mx-auto mb-2" size={32} style={{ color: '#ddb870' }} />
              <h3 className="text-white font-semibold mb-1">Phone</h3>
              <p className="text-white/60 text-sm mb-3">Mon-Fri 9:00-18:00</p>
              <button 
                className="text-white px-4 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: '#ddb870' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ebdcb5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ddb870'}
              >
                Call Now
              </button>
            </div>
            <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#081932' }}>
              <Mail className="mx-auto mb-2" size={32} style={{ color: '#ddb870' }} />
              <h3 className="text-white font-semibold mb-1">Email</h3>
              <p className="text-white/60 text-sm mb-3">Response in 24h</p>
              <button 
                className="text-white px-4 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: '#ddb870' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ebdcb5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ddb870'}
              >
                Send Email
              </button>
            </div>
          </div>

          <div className="flex h-96">
            {/* Categories Sidebar */}
            <div className="w-64 rounded-l-lg p-4" style={{ backgroundColor: '#081932' }}>
              <h3 className="text-white font-semibold mb-4">Categories</h3>
              <nav className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left ${
                        activeCategory === category.id
                          ? 'text-white'
                          : 'text-white/80 hover:bg-gray-700'
                      }`}
                      style={{ backgroundColor: activeCategory === category.id ? '#ddb870' : 'transparent' }}
                      onMouseEnter={(e) => {
                        if (activeCategory !== category.id) {
                          e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.5)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activeCategory !== category.id) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <Icon size={20} />
                      <span className="text-sm">{category.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* FAQ Content */}
            <div className="flex-1 rounded-r-lg p-6 overflow-y-auto" style={{ backgroundColor: '#081932' }}>
              <h3 className="text-white text-lg font-semibold mb-4">
                Frequently Asked Questions - {categories.find(c => c.id === activeCategory)?.label}
              </h3>
              <div className="space-y-4">
                {faqs[activeCategory as keyof typeof faqs].map((faq, index) => (
                  <div key={index} className="border-b border-gray-700 pb-4">
                    <h4 className="text-white font-medium mb-2">{faq.question}</h4>
                    <p className="text-white/70 text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};