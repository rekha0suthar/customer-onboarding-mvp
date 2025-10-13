import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, customer, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold hover:opacity-90 transition">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline">Customer Onboarding</span>
            <span className="sm:hidden">CO</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className={`hover:text-blue-100 transition font-medium ${
                    isActive('/profile') ? 'text-yellow-300' : ''
                  }`}
                >
                  Profile
                </Link>
                <Link
                  to="/documents"
                  className={`hover:text-blue-100 transition font-medium ${
                    isActive('/documents') ? 'text-yellow-300' : ''
                  }`}
                >
                  Documents
                </Link>
                <div className="flex items-center space-x-4 pl-4">
                  <button
                    onClick={handleLogout}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`hover:text-blue-100 transition font-medium ${
                    isActive('/login')
                      ? 'text-yellow-300 font-bold'
                      : 'text-white'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`hover:text-blue-100 transition font-medium ${
                    isActive('/register')
                      ? 'text-yellow-300 font-bold'
                      : 'text-white'
                  }`}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-400">
            {user ? (
              <div className="space-y-3">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 hover:bg-white/10 rounded-lg transition ${
                    isActive('/profile') ? 'bg-white/20' : ''
                  }`}
                >
                  Profile
                </Link>
                <Link
                  to="/documents"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 hover:bg-white/10 rounded-lg transition ${
                    isActive('/documents') ? 'bg-white/20' : ''
                  }`}
                >
                  Documents
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg transition font-medium hover:bg-white/10 ${
                    isActive('/login')
                      ? 'text-yellow-300 font-bold'
                      : 'text-white'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg transition font-medium hover:bg-white/10 ${
                    isActive('/register')
                      ? 'text-yellow-300 font-bold'
                      : 'text-white'
                  }`}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

