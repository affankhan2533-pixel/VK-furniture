import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Phone, 
  Mail, 
  MessageCircle, 
  MapPin, 
  Share2, 
  Palette, 
  Save, 
  Sparkles,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Settings = () => {
  const defaultSettings = {
    businessName: 'V.K. Furniture (वी.के. फर्नीचर)',
    phone: '+91 99306 68406',
    email: 'riteshsharma9930@gmail.com',
    whatsapp: '+91 99306 68406',
    googleMap: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.5034692736237!2d72.8530366!3d19.0416174!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8d9df16a7f1%3A0xe54e6fc238ff7a98!2sNaik%20Nagar%20Dharavi!5e0!3m2!1sen!2sin!4v1700000000000',
    facebook: 'https://www.facebook.com/vkfurniture',
    instagram: 'https://www.instagram.com/official_vk_furniture',
    youtube: 'https://www.youtube.com/c/vkfurniture',
    accentColor: '#B08D57',
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('vk_admin_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);

    const saveToast = toast.loading('Saving business profiles to workspace storage...');
    setTimeout(() => {
      localStorage.setItem('vk_admin_settings', JSON.stringify(settings));
      
      // Optionally update root custom css properties if we want to change accents dynamically
      document.documentElement.style.setProperty('--vk-gold-accent', settings.accentColor);
      
      toast.success('Settings synchronized successfully', { id: saveToast });
      setLoading(false);
    }, 800);
  };

  const accents = [
    { name: 'Royal Gold (Sagwan)', value: '#B08D57' },
    { name: 'Imperial Bronze', value: '#CD7F32' },
    { name: 'Champagne Gold', value: '#E3C18F' },
    { name: 'Honey Wood Polish', value: '#A0522D' },
    { name: 'Luxury Rose Gold', value: '#B76E79' },
  ];

  return (
    <div className="p-6 space-y-8 text-left select-none max-w-4xl mx-auto">
      
      {/* Title Header */}
      <div className="border-b border-[#B08D57]/15 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-white font-serif uppercase">
          Portal Settings
        </h1>
        <p className="text-white/40 text-xs font-semibold tracking-wider font-mono mt-1">
          Configure business metadata, communication channels, and design accents
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Section 1: Business Details */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 bg-[#131722]/50 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#D4AF75] flex items-center gap-2 border-b border-white/5 pb-3">
            <Building className="w-4 h-4" />
            <span>Workshop Identity & Communications</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Business Name */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-white/40 text-[10px] uppercase tracking-widest font-mono font-bold">Business Name</label>
              <input 
                type="text" 
                required
                value={settings.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
                className="w-full bg-[#0A0D16] border border-white/5 rounded-xl py-2.5 px-3.5 text-xs text-white"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-white/40 text-[10px] uppercase tracking-widest font-mono font-bold flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#D4AF75]" />
                <span>Phone Call line</span>
              </label>
              <input 
                type="text" 
                required
                value={settings.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full bg-[#0A0D16] border border-white/5 rounded-xl py-2.5 px-3.5 text-xs text-white font-mono"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-white/40 text-[10px] uppercase tracking-widest font-mono font-bold flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#D4AF75]" />
                <span>Business Email Address</span>
              </label>
              <input 
                type="email" 
                required
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full bg-[#0A0D16] border border-white/5 rounded-xl py-2.5 px-3.5 text-xs text-white font-mono"
              />
            </div>

            {/* WhatsApp */}
            <div className="flex flex-col gap-1.5">
              <label className="text-white/40 text-[10px] uppercase tracking-widest font-mono font-bold flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5 text-[#D4AF75]" />
                <span>WhatsApp API Number</span>
              </label>
              <input 
                type="text" 
                required
                value={settings.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                className="w-full bg-[#0A0D16] border border-white/5 rounded-xl py-2.5 px-3.5 text-xs text-white font-mono"
              />
            </div>

            {/* Google Map Link */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-white/40 text-[10px] uppercase tracking-widest font-mono font-bold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF75]" />
                <span>Google Map Embed Iframe URL</span>
              </label>
              <input 
                type="text" 
                value={settings.googleMap}
                onChange={(e) => handleChange('googleMap', e.target.value)}
                placeholder="https://google.com/maps/embed/..."
                className="w-full bg-[#0A0D16] border border-white/5 rounded-xl py-2.5 px-3.5 text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Social Media */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 bg-[#131722]/50 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#D4AF75] flex items-center gap-2 border-b border-white/5 pb-3">
            <Share2 className="w-4 h-4" />
            <span>Social Media Channels</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Facebook */}
            <div className="flex flex-col gap-1.5">
              <label className="text-white/40 text-[10px] uppercase tracking-widest font-mono font-bold">Facebook Profile</label>
              <input 
                type="text" 
                value={settings.facebook}
                onChange={(e) => handleChange('facebook', e.target.value)}
                className="w-full bg-[#0A0D16] border border-white/5 rounded-xl py-2.5 px-3.5 text-xs text-white font-mono"
              />
            </div>

            {/* Instagram */}
            <div className="flex flex-col gap-1.5">
              <label className="text-white/40 text-[10px] uppercase tracking-widest font-mono font-bold">Instagram Handle</label>
              <input 
                type="text" 
                value={settings.instagram}
                onChange={(e) => handleChange('instagram', e.target.value)}
                className="w-full bg-[#0A0D16] border border-white/5 rounded-xl py-2.5 px-3.5 text-xs text-white font-mono"
              />
            </div>

            {/* YouTube */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-white/40 text-[10px] uppercase tracking-widest font-mono font-bold">YouTube Channel</label>
              <input 
                type="text" 
                value={settings.youtube}
                onChange={(e) => handleChange('youtube', e.target.value)}
                className="w-full bg-[#0A0D16] border border-white/5 rounded-xl py-2.5 px-3.5 text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Design Accents */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 bg-[#131722]/50 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#D4AF75] flex items-center gap-2 border-b border-white/5 pb-3">
            <Palette className="w-4 h-4" />
            <span>Theme & Accent Settings</span>
          </h3>

          <div className="space-y-4">
            <label className="text-white/40 text-[10px] uppercase tracking-widest font-mono font-bold block">Gold Accent Selection</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {accents.map((acc) => {
                const selected = settings.accentColor === acc.value;
                return (
                  <button
                    key={acc.value}
                    type="button"
                    onClick={() => handleChange('accentColor', acc.value)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      selected 
                        ? 'bg-[#B08D57]/10 border-[#B08D57] text-white shadow-[0_0_15px_rgba(176,141,87,0.15)]' 
                        : 'bg-[#0A0D16] border-white/5 text-white/50 hover:border-white/10'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: acc.value }} />
                    <span className="text-[11px] font-semibold tracking-wide uppercase">{acc.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Info panel */}
        <div className="bg-[#B08D57]/5 border border-[#B08D57]/15 rounded-2xl p-4 flex gap-3 items-start select-none">
          <Info className="w-5 h-5 text-[#D4AF75] shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-white/60">
            <p className="font-bold text-[#D4AF75] uppercase tracking-wide">Sync Info Profile</p>
            <p className="mt-0.5">
              These details synchronize with your client-side public portfolio and WhatsApp message templates. Make sure phone lines support global call routing (+91 prefix).
            </p>
          </div>
        </div>

        {/* Submit Save */}
        <div className="flex justify-end select-none">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-gradient-to-r from-[#B08D57] to-[#D4AF75] hover:opacity-90 text-[#070910] font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(176,141,87,0.25)] cursor-pointer flex items-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-[#070910] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
export default Settings;
