import React, { useState, useEffect } from 'react';
import { Menu, Search, Bell, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Navbar = ({ toggleSidebar, searchVal, setSearchVal }) => {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [adminName, setAdminName] = useState('Admin Ritesh');

  useEffect(() => {
    const user = localStorage.getItem('vk_admin_user');
    if (user) {
      setAdminName(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('vk_admin_token');
    localStorage.removeItem('vk_admin_user');
    sessionStorage.removeItem('vk_admin_authenticated');
    navigate('/login');
  };

  return (
    <header className="h-20 bg-[#0A0D16] border-b border-[#B08D57]/20 flex items-center justify-between px-6 z-30 relative select-none">
      
      {/* Mobile Menu Trigger & Search */}
      <div className="flex items-center gap-4 flex-1 md:flex-initial">
        <button 
          onClick={toggleSidebar}
          className="p-2 text-white/80 hover:text-white rounded-lg md:hidden hover:bg-white/5 transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search */}
        <div className="relative w-full max-w-[280px] hidden sm:block">
          <input 
            type="text"
            value={searchVal || ''}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search items, enquiries..."
            className="w-full bg-[#131722] border border-[#B08D57]/15 rounded-xl py-2 pl-9 pr-4 text-xs font-medium text-white placeholder-white/20 focus:outline-none transition-all"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
        </div>
      </div>

      {/* Quick Actions (Notifications & Profile) */}
      <div className="flex items-center gap-4">
        
        {/* Notifications Icon with Flyout */}
        <div className="relative">
          <button 
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
            }}
            className="p-2.5 bg-[#131722] border border-[#B08D57]/10 hover:border-[#B08D57]/30 text-white/70 hover:text-[#D4AF75] rounded-xl transition-all relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#B08D57] animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#B08D57]" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0E121E] border border-[#B08D57]/25 rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.7)] text-left z-50">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF75] border-b border-[#B08D57]/10 pb-2 mb-2">Notifications</h4>
              <div className="space-y-3">
                <div className="text-[11px] leading-normal border-b border-white/5 pb-2">
                  <p className="text-white font-semibold">New custom order submission</p>
                  <p className="text-white/40 mt-0.5">Sofa design request from Dharavi showroom</p>
                </div>
                <div className="text-[11px] leading-normal pb-1">
                  <p className="text-white font-semibold">Inventory Alert: Low Stock</p>
                  <p className="text-white/40 mt-0.5">Sagwan Beds set catalog items under 3 units</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Selector Dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-3 px-3 py-2 bg-[#131722] border border-[#B08D57]/10 hover:border-[#B08D57]/30 rounded-xl transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#B08D57]/10 border border-[#B08D57]/30 flex items-center justify-center text-[#D4AF75]">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-bold text-white tracking-wide">{adminName}</p>
              <p className="text-[9px] uppercase tracking-widest text-[#D4AF75] font-semibold mt-0.5">Master Owner</p>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#0E121E] border border-[#B08D57]/25 rounded-2xl py-2 shadow-[0_10px_40px_rgba(0,0,0,0.7)] text-left z-50 overflow-hidden">
              <button 
                onClick={() => {
                  setProfileOpen(false);
                  navigate('/settings');
                }}
                className="flex items-center gap-2 px-4 py-3 text-xs text-white/70 hover:text-[#D4AF75] hover:bg-[#B08D57]/5 w-full transition-colors font-semibold uppercase tracking-wider"
              >
                <SettingsIcon className="w-4 h-4" />
                <span>Settings</span>
              </button>
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-3 text-xs text-red-400 hover:bg-red-500/10 w-full transition-colors border-t border-white/5 font-semibold uppercase tracking-wider"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
