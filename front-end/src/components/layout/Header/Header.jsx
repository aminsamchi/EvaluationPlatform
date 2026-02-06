import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

const Header = () => {
  const user = JSON.parse(localStorage.getItem('governance_user') || '{}');
  
  const handleLogout = () => {
    localStorage.removeItem('governance_token');
    localStorage.removeItem('governance_user');
    window.location.href = '/login';
  };
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">G</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              Governance Platform
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User size={20} className="text-gray-600" />
              <span className="text-sm text-gray-700">{user.fullName || 'User'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;