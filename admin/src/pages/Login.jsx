import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, KeyRound, AlertCircle, Sparkles } from 'lucide-react';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const loginToast = toast.loading('Decrypting master session...');
    
    // Simulating authentication delay
    setTimeout(() => {
      if (email === 'admin@vkfurniture.com' && password === 'admin123') {
        // Save dummy credentials and token
        localStorage.setItem('vk_admin_token', 'demo-token-9988');
        localStorage.setItem('vk_admin_user', 'Admin Ritesh');
        sessionStorage.setItem('vk_admin_authenticated', 'true');
        
        toast.success('Matrix decrypted. Welcome back, Ritesh!', { id: loginToast });
        setLoading(false);
        navigate('/dashboard');
      } else {
        const msg = 'Invalid Email or Password';
        setError(msg);
        toast.error('Authentication Failed', { id: loginToast });
        setLoading(false);
      }
    }, 1000);

    /* 
    // Kept clean for future FastAPI JWT authentication Integration:
    try {
      const data = await authAPI.login(email, password);
      localStorage.setItem('vk_admin_token', data.token);
      localStorage.setItem('vk_admin_user', email);
      sessionStorage.setItem('vk_admin_authenticated', 'true');
      toast.success('Matrix decrypted. Welcome back, Ritesh!', { id: loginToast });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid admin credentials. Access Denied.');
      toast.error('Authentication Failed', { id: loginToast });
    } finally {
      setLoading(false);
    }
    */
  };

  return (
    <div className="min-h-screen bg-[#050811] text-[#E2E8F0] font-sans flex flex-col justify-center items-center px-4 relative overflow-hidden select-none">
      {/* Background visual luxury gold glows */}
      <div className="absolute top-[10%] left-[-15%] w-[50vw] h-[50vw] bg-[#B08D57]/3 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[45vw] h-[45vw] bg-[#D4AF75]/2 blur-[120px] rounded-full pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md relative z-10">
        <div className="glass-panel p-8 sm:p-10 rounded-[32px] border border-[#B08D57]/20 shadow-[0_0_80px_rgba(0,0,0,0.6)] flex flex-col items-center bg-gradient-to-b from-[#0E121E] to-[#070910]">
          
          {/* Circular logo core with gold accent */}
          <div className="p-4 bg-[#B08D57]/5 border border-[#B08D57]/25 rounded-2xl mb-6 text-[#D4AF75] flex items-center justify-center relative group">
            <KeyRound className="w-8 h-8" />
            <div className="absolute inset-0 rounded-2xl border border-dashed border-[#D4AF75]/20 animate-spin" style={{ animationDuration: '30s' }} />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-serif font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#B08D57] via-[#D4AF75] to-[#B08D57]">
              V.K. Furniture
            </h1>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF75]/60 font-semibold mt-1 font-mono">
              Workstation Security Portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-6 text-left">
            {error && (
              <div className="flex items-center gap-2 border border-red-500/30 bg-red-500/5 rounded-xl px-4 py-3 text-xs font-semibold text-red-400 font-mono animate-pulse">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-white/40 text-[10px] uppercase tracking-widest font-mono font-bold">Admin Email</label>
              <div className="relative">
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@vkfurniture.com"
                  className="w-full bg-[#070910] border border-white/5 focus:border-[#B08D57]/40 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold text-white placeholder-white/10 transition-all font-mono"
                  disabled={loading}
                />
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-white/20" />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-white/40 text-[10px] uppercase tracking-widest font-mono font-bold">Security Key</label>
              <div className="relative">
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#070910] border border-white/5 focus:border-[#B08D57]/40 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold text-white placeholder-white/10 transition-all font-mono"
                  disabled={loading}
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-white/20" />
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#B08D57] to-[#D4AF75] hover:opacity-90 text-[#070910] font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(176,141,87,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-[#070910] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Decrypt Matrix</span>
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
export default Login;
