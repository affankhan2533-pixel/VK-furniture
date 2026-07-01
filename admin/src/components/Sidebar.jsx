import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Image as ImageIcon, 
  MessageSquare, 
  Settings, 
  LogOut,
  X
} from 'lucide-react';

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('vk_admin_token');
    localStorage.removeItem('vk_admin_user');
    sessionStorage.removeItem('vk_admin_authenticated');
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Products', path: '/products', icon: <Package className="w-5 h-5" /> },
    { label: 'Gallery', path: '/gallery', icon: <ImageIcon className="w-5 h-5" /> },
    { label: 'Enquiries', path: '/enquiries', icon: <MessageSquare className="w-5 h-5" /> },
    { label: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-[#0A0D16] border-r border-[#B08D57]/20 transition-transform duration-300 transform 
        md:translate-x-0 md:static md:h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-[#B08D57]/15">
          <div className="flex flex-col text-left">
            <h1 className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#B08D57] via-[#D4AF75] to-[#B08D57] font-serif uppercase">
              V.K. Furniture
            </h1>
            <span className="text-[9px] uppercase tracking-widest text-[#D4AF75]/60 font-mono mt-0.5">
              वी.के. फर्नीचर &bull; Admin
            </span>
          </div>
          <button 
            onClick={toggleSidebar}
            className="p-1 text-white/60 hover:text-white rounded-lg md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 768) toggleSidebar();
              }}
              className={({ isActive }) => `
                sidebar-link flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200
                ${isActive 
                  ? 'bg-[#B08D57]/10 text-[#D4AF75] border-l-4 border-[#B08D57] pl-3' 
                  : 'text-white/60 hover:bg-[#B08D57]/5 hover:text-[#D4AF75]'}
              `}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#B08D57]/10 bg-[#070910]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold tracking-wide text-red-400 hover:bg-red-500/10 rounded-xl transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
