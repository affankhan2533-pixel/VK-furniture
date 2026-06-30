import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldAlert, KeyRound, User } from 'lucide-react';
import SEO from '../components/SEO';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/admin/login`, {
        username,
        password,
      });
      if (response.data?.token) {
        localStorage.setItem('vk_admin_token', response.data.token);
        navigate('/admin');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 fade-in">
      <SEO
        title="Admin Login Secure Portal | V.K. Furniture"
        description="Secure login portal for V.K. Furniture administrative operations."
      />
      <div className="max-w-md w-full bg-white border border-borderSubtle p-8 shadow-md">
        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-cream flex items-center justify-center border border-borderSubtle text-teak">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h2 className="font-serif text-3xl font-bold text-espresso leading-none">
              Admin Secure Portal
            </h2>
            <span className="font-devanagari text-sm text-brass block mt-1 tracking-wider font-semibold">
              सुरक्षित प्रशासनिक लॉगिन
            </span>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-3.5 bg-red-50 border border-red-200 text-red-600 text-xs font-sans text-left">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6 text-left" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-widest text-stone font-sans">
                Admin Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin user"
                  className="w-full pl-10 pr-3 py-3 bg-cream/40 border border-borderSubtle font-sans text-sm focus:outline-none focus:border-teak text-espresso"
                />
                <User className="absolute left-3.5 top-3.5 text-stone" size={16} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-widest text-stone font-sans">
                Access Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-3 bg-cream/40 border border-borderSubtle font-sans text-sm focus:outline-none focus:border-teak text-espresso"
                />
                <KeyRound className="absolute left-3.5 top-3.5 text-stone" size={16} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-espresso text-cream py-4 text-xs font-sans font-bold tracking-widest uppercase hover:bg-teak hover:text-white transition-all cursor-pointer border-none"
          >
            {loading ? 'Authenticating Secure Key...' : 'Request Access Key'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
