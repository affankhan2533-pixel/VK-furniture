import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Trash2, 
  Eye, 
  RefreshCw, 
  ChevronRight, 
  Sparkles, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Compass,
  X,
  MessageSquareCode
} from 'lucide-react';
import { enquiriesAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { useOutletContext } from 'react-router-dom';

export const Enquiries = () => {
  const { searchVal } = useOutletContext() || { searchVal: '' };
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Detail Drawer States
  const [selectedLead, setSelectedLead] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    const search = (searchTerm || searchVal || '').toLowerCase();
    if (!search) {
      setFilteredLeads(leads);
    } else {
      setFilteredLeads(
        leads.filter(
          (l) =>
            l.name.toLowerCase().includes(search) ||
            l.phone.toLowerCase().includes(search) ||
            (l.email && l.email.toLowerCase().includes(search)) ||
            (l.subject && l.subject.toLowerCase().includes(search))
        )
      );
    }
  }, [searchTerm, searchVal, leads]);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const data = await enquiriesAPI.getAll();
      setLeads(data);
      setFilteredLeads(data);
    } catch (err) {
      console.error(err);
      toast.error('Could not sync leads database.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (eid, newStatus) => {
    const statusToast = toast.loading('Syncing status change...');
    try {
      await enquiriesAPI.updateStatus(eid, newStatus);
      toast.success(`Lead status updated to ${newStatus}`, { id: statusToast });
      
      // Update locally
      setLeads((prev) =>
        prev.map((l) => (l.id === eid ? { ...l, status: newStatus } : l))
      );
      if (selectedLead && selectedLead.id === eid) {
        setSelectedLead((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error(err);
      toast.error('Could not update status.', { id: statusToast });
    }
  };

  const handleDelete = async (eid) => {
    if (!window.confirm('Delete this inquiry permanently from the CRM database?')) return;

    const delToast = toast.loading('Removing lead from database...');
    try {
      await enquiriesAPI.delete(eid);
      toast.success('Lead removed successfully', { id: delToast });
      if (selectedLead && selectedLead.id === eid) {
        setDrawerOpen(false);
        setSelectedLead(null);
      }
      loadLeads();
    } catch (err) {
      console.error(err);
      toast.error('Could not remove lead.', { id: delToast });
    }
  };

  const openDrawer = (lead) => {
    setSelectedLead(lead);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedLead(null);
  };

  const statusOptions = ['New', 'Contacted', 'Quotation Sent', 'Won', 'Lost'];

  const getStatusStyle = (status) => {
    const norm = (status || 'New').toLowerCase();
    if (norm === 'won') return 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400';
    if (norm === 'lost') return 'bg-rose-500/10 border-rose-500/35 text-rose-400';
    if (norm === 'contacted') return 'bg-cyan-500/10 border-cyan-500/35 text-cyan-400';
    if (norm === 'quotation sent') return 'bg-purple-500/10 border-purple-500/35 text-purple-400';
    return 'bg-amber-500/10 border-amber-500/35 text-amber-400';
  };

  return (
    <div className="p-6 space-y-8 text-left select-none max-w-7xl mx-auto relative">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#B08D57]/15 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-serif uppercase">
            Inbound Enquiries
          </h1>
          <p className="text-white/40 text-xs font-semibold tracking-wider font-mono mt-1">
            Track customer requests, design blueprints, and lead conversion rates
          </p>
        </div>
        
        <button
          onClick={loadLeads}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-[#131722] border border-[#B08D57]/20 hover:border-[#B08D57]/50 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#D4AF75] transition-all cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Database</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch justify-between">
        <div className="relative w-full max-w-xs">
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search leads name, phone..."
            className="w-full bg-[#131722] border border-[#B08D57]/15 rounded-xl py-2.5 pl-9 pr-4 text-xs font-medium text-white placeholder-white/20 focus:outline-none transition-all"
          />
          <Search className="absolute left-3 top-3 w-4 h-4 text-white/30" />
        </div>
      </div>

      {/* Database CRM Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-8 h-8 border-2 border-[#B08D57] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono tracking-widest text-white/40 uppercase">Connecting to CRM database...</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="glass-panel p-16 rounded-3xl border border-white/5 text-center bg-gradient-to-b from-[#131722] to-transparent">
          <MessageSquareCode className="w-12 h-12 text-[#D4AF75] mx-auto mb-4 opacity-50" />
          <h3 className="text-white font-bold uppercase tracking-wider text-sm">CRM Database Empty</h3>
          <p className="text-white/30 text-xs mt-1 leading-relaxed">
            No inquiries or custom design plans found matching filters.
          </p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-[#0D101A] text-white/40 uppercase font-mono tracking-wider border-b border-white/5 text-[9px]">
                  <th className="px-6 py-4 font-bold">Client & Type</th>
                  <th className="px-6 py-4 font-bold">Contact Phone</th>
                  <th className="px-6 py-4 font-bold">Inquiry / Subject</th>
                  <th className="px-6 py-4 font-bold">City / Budget</th>
                  <th className="px-6 py-4 font-bold">Date Received</th>
                  <th className="px-6 py-4 font-bold">Status CRM</th>
                  <th className="px-6 py-4 text-center font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLeads.map((lead) => {
                  const isCustom = lead.type === 'custom';
                  
                  // Extract budget details
                  const budgetVal = lead.budget || 'Custom Rate';
                  const cityVal = lead.city || 'Mumbai (Workshop)';
                  
                  return (
                    <tr key={lead.id} className="table-row-hover text-white/80">
                      
                      {/* Name & Type */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-white font-semibold text-sm leading-snug">{lead.name}</p>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase font-mono tracking-wider border ${
                            isCustom 
                              ? 'bg-[#B600A8]/10 border-[#B600A8]/30 text-[#B600A8]' 
                              : 'bg-[#00F5FF]/10 border-[#00F5FF]/20 text-[#00F5FF]'
                          }`}>
                            {isCustom ? 'Custom Design' : 'Wholesale inquiry'}
                          </span>
                        </div>
                      </td>

                      {/* Phone / Email */}
                      <td className="px-6 py-4 font-mono">
                        <div className="space-y-0.5 text-white/70">
                          <p className="font-bold">{lead.phone}</p>
                          {lead.email && <p className="text-[10px] text-white/30">{lead.email}</p>}
                        </div>
                      </td>

                      {/* Subject */}
                      <td className="px-6 py-4 font-semibold text-white/90">
                        {lead.subject}
                      </td>

                      {/* City / Budget */}
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-white/70 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#D4AF75]" />
                            <span>{cityVal}</span>
                          </p>
                          <p className="text-[10px] text-[#D4AF75] font-bold font-mono">{budgetVal}</p>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 font-mono text-white/40">
                        {lead.date ? new Date(lead.date).toLocaleDateString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'N/A'}
                      </td>

                      {/* Status select dropdown */}
                      <td className="px-6 py-4 select-none">
                        <select
                          value={lead.status || 'New'}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-full border text-[10px] font-extrabold uppercase tracking-wider focus:outline-none transition-all cursor-pointer font-mono ${getStatusStyle(lead.status)}`}
                        >
                          {statusOptions.map((st) => (
                            <option key={st} value={st} className="bg-[#0E121E] text-white">{st}</option>
                          ))}
                        </select>
                      </td>

                      {/* Action buttons */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openDrawer(lead)}
                            className="p-2 bg-[#1A1F2E] border border-white/5 hover:border-[#B08D57]/30 text-[#D4AF75] rounded-xl transition-all cursor-pointer"
                            title="View inquiry details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(lead.id)}
                            className="p-2 bg-[#1A1F2E] border border-white/5 hover:border-red-500/30 text-red-400 rounded-xl transition-all cursor-pointer"
                            title="Dismiss lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slide-out details drawer */}
      {drawerOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm select-none">
          {/* Overlay click close */}
          <div className="absolute inset-0 z-0" onClick={closeDrawer} />
          
          {/* Drawer Body container */}
          <div className="relative w-full max-w-lg bg-[#0E121E] border-l border-[#B08D57]/30 h-full p-8 shadow-[-10px_0_40px_rgba(0,0,0,0.8)] z-10 flex flex-col justify-between overflow-y-auto text-left bg-gradient-to-b from-[#0E121E] via-[#090C14] to-[#0A0E18]">
            
            {/* Header info */}
            <div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                <div>
                  <span className="text-[#D4AF75] font-mono font-bold text-[9px] uppercase tracking-widest">Lead details</span>
                  <h2 className="text-xl font-bold uppercase text-white leading-tight font-serif mt-0.5">CRM Specifications</h2>
                </div>
                <button
                  onClick={closeDrawer}
                  className="p-2 rounded-xl bg-white/5 border border-white/5 hover:border-[#B08D57]/30 hover:text-[#D4AF75] text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Lead Cards */}
              <div className="space-y-6">
                
                {/* Status card */}
                <div className="glass-panel p-4 rounded-xl border border-white/5 flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-white/30 text-[9px] uppercase font-mono font-bold">Status CRM</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] uppercase font-bold font-mono border mt-1 ${getStatusStyle(selectedLead.status)}`}>
                      {selectedLead.status || 'New'}
                    </span>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-white/30 text-[9px] uppercase font-mono font-bold">Category Type</p>
                    <span className="inline-block px-2.5 py-0.5 bg-white/5 border border-white/10 rounded-md text-[#D4AF75] text-[10px] uppercase font-bold font-mono mt-1">
                      {selectedLead.type === 'custom' ? 'Custom Design' : 'Wholesale'}
                    </span>
                  </div>
                </div>

                {/* Profile detail */}
                <div className="space-y-4">
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider border-b border-white/5 pb-2">Client Profile</h4>
                  
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex items-center gap-3 text-white">
                      <span className="font-semibold w-16 text-white/40 uppercase">Name:</span>
                      <span className="text-sm font-sans font-bold">{selectedLead.name}</span>
                    </div>

                    <div className="flex items-center gap-3 text-white">
                      <span className="font-semibold w-16 text-white/40 uppercase">Phone:</span>
                      <a href={`tel:${selectedLead.phone}`} className="hover:text-[#D4AF75] transition-colors flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-[#D4AF75]" />
                        <span>{selectedLead.phone}</span>
                      </a>
                    </div>

                    {selectedLead.email && (
                      <div className="flex items-center gap-3 text-white">
                        <span className="font-semibold w-16 text-white/40 uppercase">Email:</span>
                        <a href={`mailto:${selectedLead.email}`} className="hover:text-[#D4AF75] transition-colors flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-[#D4AF75]" />
                          <span className="truncate max-w-[200px]">{selectedLead.email}</span>
                        </a>
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-white">
                      <span className="font-semibold w-16 text-white/40 uppercase">Location:</span>
                      <span className="flex items-center gap-1 font-sans">
                        <MapPin className="w-3.5 h-3.5 text-[#D4AF75]" />
                        <span>{selectedLead.city || 'Mumbai (Workshop)'}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-white">
                      <span className="font-semibold w-16 text-white/40 uppercase">Budget:</span>
                      <span className="text-[#D4AF75] font-bold">{selectedLead.budget || 'Custom Rate'}</span>
                    </div>

                    <div className="flex items-center gap-3 text-white">
                      <span className="font-semibold w-16 text-white/40 uppercase">Received:</span>
                      <span className="text-white/40 flex items-center gap-1.5 font-sans">
                        <Clock className="w-3.5 h-3.5 text-[#D4AF75]" />
                        <span>
                          {selectedLead.date ? new Date(selectedLead.date).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          }) : 'N/A'}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Requirements detail */}
                <div className="space-y-4">
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider border-b border-white/5 pb-2">Requirement Subject</h4>
                  <p className="text-[#D4AF75] font-bold text-sm bg-[#B08D57]/5 border border-[#B08D57]/20 p-3.5 rounded-xl flex items-center gap-2">
                    <Compass className="w-4 h-4" />
                    <span>{selectedLead.subject}</span>
                  </p>
                </div>

                {/* Message detail */}
                <div className="space-y-2">
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider border-b border-white/5 pb-2">Message & Notes</h4>
                  <div className="bg-[#0A0D16] border border-white/5 rounded-2xl p-4 min-h-[140px]">
                    <p className="text-white/80 text-xs sm:text-sm font-light leading-relaxed whitespace-pre-wrap">
                      {selectedLead.message}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer actions */}
            <div className="border-t border-white/5 pt-6 flex justify-between gap-3 mt-8">
              <button
                onClick={() => handleDelete(selectedLead.id)}
                className="flex items-center justify-center gap-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/10 rounded-xl px-4 py-2.5 transition-all duration-300 cursor-pointer font-bold uppercase tracking-wider"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Dismiss Lead</span>
              </button>
              
              <div className="flex items-center gap-2">
                <select
                  value={selectedLead.status || 'New'}
                  onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                  className={`px-3 py-2 bg-[#1A1F2E] border border-[#B08D57]/20 rounded-xl text-xs text-white focus:outline-none transition-all cursor-pointer font-bold uppercase tracking-wider`}
                >
                  {statusOptions.map((st) => (
                    <option key={st} value={st} className="bg-[#0E121E]">{st}</option>
                  ))}
                </select>
                
                <a
                  href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}?text=Hello%20${selectedLead.name},%20this%20is%20V.K.%20Furniture%20workshop.%20We%20received%20your%20design%20enquiry%20regarding%20${encodeURIComponent(selectedLead.subject)}.%20Let's%20discuss%20specifications!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 text-xs bg-gradient-to-r from-[#B08D57] to-[#D4AF75] text-[#070910] font-bold rounded-xl px-4 py-2.5 transition-all hover:shadow-[0_0_15px_rgba(176,141,87,0.3)] cursor-pointer uppercase tracking-wider"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>Connect WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
export default Enquiries;
