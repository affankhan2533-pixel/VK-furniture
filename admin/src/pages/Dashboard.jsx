import React, { useEffect, useState } from 'react';
import { 
  Package, 
  Image as ImageIcon, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Clock, 
  RefreshCw,
  UserCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { productsAPI, galleryAPI, enquiriesAPI, analyticsAPI } from '../utils/api';
import toast from 'react-hot-toast';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalGallery: 0,
    newEnquiries: 0,
    visitors: 0,
    totalViews: 0,
  });

  const [chartsData, setChartsData] = useState({
    topPages: [],
    statusStats: [],
  });

  const [loading, setLoading] = useState(true);
  const [recentLeads, setRecentLeads] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, gallery, leads, analytics] = await Promise.all([
        productsAPI.getAll(),
        galleryAPI.getAll(),
        enquiriesAPI.getAll(),
        analyticsAPI.getStats(),
      ]);

      // Calculate stats
      const pendingLeadsCount = leads.filter((l) => l.status === 'New' || l.status === 'pending').length;
      
      setStats({
        totalProducts: prods.length,
        totalGallery: gallery.length,
        newEnquiries: pendingLeadsCount,
        visitors: analytics.uniqueVisitors || 0,
        totalViews: analytics.totalViews || 0,
      });

      // Prepare Chart 1: Top Pages Views
      const pagesData = (analytics.topPages || []).map((p) => ({
        name: p.path === '/' ? 'Home' : p.path.replace('/', '').toUpperCase(),
        views: p.views,
      }));

      // Prepare Chart 2: Status Breakdown
      const statusMap = analytics.enquiryStatus || {};
      const statusList = Object.entries(statusMap).map(([name, val]) => ({
        name: name.toUpperCase(),
        value: val,
      }));

      setChartsData({
        topPages: pagesData,
        statusStats: statusList.length > 0 ? statusList : [
          { name: 'PENDING', value: pendingLeadsCount },
          { name: 'WON', value: leads.filter(l => l.status === 'Won').length },
          { name: 'CONTACTED', value: leads.filter(l => l.status === 'Contacted').length }
        ],
      });

      // Show first 5 recent enquiries
      setRecentLeads(leads.slice(0, 5));
    } catch (err) {
      console.error(err);
      toast.error('Sync Connect Timeout: verify local API server is active.');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#B08D57', '#D4AF75', '#8C6C3A', '#E3C18F', '#6E5227'];

  const dashboardCards = [
    { 
      label: 'Total Products', 
      val: stats.totalProducts, 
      desc: 'Catalog Furniture items', 
      icon: <Package className="w-6 h-6 text-[#D4AF75]" />,
      glow: 'shadow-[0_0_20px_rgba(176,141,87,0.1)]' 
    },
    { 
      label: 'Gallery Images', 
      val: stats.totalGallery, 
      desc: 'Showcase grid uploads', 
      icon: <ImageIcon className="w-6 h-6 text-[#D4AF75]" />,
      glow: 'shadow-[0_0_20px_rgba(176,141,87,0.06)]' 
    },
    { 
      label: 'New Enquiries', 
      val: stats.newEnquiries, 
      desc: 'Pending workshop leads', 
      icon: <MessageSquare className="w-6 h-6 text-[#D4AF75]" />,
      glow: 'shadow-[0_0_20px_rgba(176,141,87,0.12)]' 
    },
    { 
      label: 'Unique Visitors', 
      val: stats.visitors, 
      desc: `Total hits: ${stats.totalViews.toLocaleString()}`, 
      icon: <Users className="w-6 h-6 text-[#D4AF75]" />,
      glow: 'shadow-[0_0_20px_rgba(176,141,87,0.06)]' 
    },
  ];

  return (
    <div className="p-6 space-y-8 text-left select-none max-w-7xl mx-auto">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-serif uppercase">
            Artisan Dashboard
          </h1>
          <p className="text-white/40 text-xs font-semibold tracking-wider font-mono mt-1">
            Real-time Workshop CRM Metrics and Site Analytics
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-[#131722] border border-[#B08D57]/20 hover:border-[#B08D57]/50 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#D4AF75] transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh stats</span>
        </button>
      </div>

      {loading && stats.totalProducts === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-8 h-8 border-2 border-[#B08D57] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono tracking-widest text-white/40 uppercase">Loading database statistics...</p>
        </div>
      ) : (
        <>
          {/* Card Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardCards.map((card) => (
              <div 
                key={card.label} 
                className={`card-hover p-6 rounded-2xl bg-[#131722] border border-white/5 flex items-center justify-between hover:border-[#B08D57]/30 ${card.glow}`}
              >
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold">{card.label}</span>
                  <h3 className="text-3xl font-black text-white font-mono">{card.val}</h3>
                  <p className="text-[11px] text-white/50">{card.desc}</p>
                </div>
                <div className="p-4 bg-[#B08D57]/5 border border-[#B08D57]/20 rounded-xl">
                  {card.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Chart 1: Views Breakdown */}
            <div className="lg:col-span-8 p-6 rounded-2xl bg-[#131722] border border-white/5 text-left">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-4 h-4 text-[#D4AF75]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">Popular Page Traffic</h3>
              </div>
              
              <div className="h-64">
                {chartsData.topPages.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center text-xs font-mono text-white/30">No traffic tracked yet</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartsData.topPages} layout="vertical" margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                      <XAxis type="number" stroke="rgba(255,255,255,0.2)" fontSize={10} fontStyle="italic" />
                      <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.2)" fontSize={10} width={70} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0A0D16', border: '1px solid rgba(176,141,87,0.3)', borderRadius: '12px' }}
                        labelClassName="text-white text-xs font-bold"
                        itemStyle={{ color: '#D4AF75', fontSize: '11px' }}
                      />
                      <Bar dataKey="views" fill="#B08D57" radius={[0, 4, 4, 0]} barSize={16}>
                        {chartsData.topPages.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Chart 2: Lead Status Split */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-[#131722] border border-white/5 text-left">
              <div className="flex items-center gap-2 mb-6">
                <UserCheck className="w-4 h-4 text-[#D4AF75]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">Leads Status Split</h3>
              </div>

              <div className="h-48 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartsData.statusStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartsData.statusStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0A0D16', border: '1px solid rgba(176,141,87,0.3)', borderRadius: '12px' }}
                      itemStyle={{ color: '#D4AF75', fontSize: '11px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Status Labels Legend */}
              <div className="mt-4 space-y-2">
                {chartsData.statusStats.map((item, idx) => (
                  <div key={item.name} className="flex justify-between items-center text-[10px] font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span className="text-white/60">{item.name}</span>
                    </div>
                    <span className="text-white font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Table: Recent Enquiries */}
          <div className="p-6 rounded-2xl bg-[#131722] border border-white/5 text-left">
            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
              <Clock className="w-4 h-4 text-[#D4AF75]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Recent leads</h3>
            </div>

            <div className="overflow-x-auto">
              {recentLeads.length === 0 ? (
                <p className="text-xs text-white/30 text-center py-6 font-mono">No customer requests in database</p>
              ) : (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-white/40 uppercase font-mono tracking-wider border-b border-white/5 text-[10px]">
                      <th className="pb-3 text-left font-bold">Client</th>
                      <th className="pb-3 text-left font-bold">Contact</th>
                      <th className="pb-3 text-left font-bold">Requirement / Subject</th>
                      <th className="pb-3 text-left font-bold">Status</th>
                      <th className="pb-3 text-right font-bold">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recentLeads.map((lead) => {
                      const isCustom = lead.type === 'custom';
                      return (
                        <tr key={lead.id} className="table-row-hover">
                          <td className="py-3 text-white font-semibold text-left">{lead.name}</td>
                          <td className="py-3 text-white/60 text-left font-mono">{lead.phone}</td>
                          <td className="py-3 text-left">
                            <div className="flex items-center gap-1.5">
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                                isCustom ? 'bg-[#B600A8]/20 border border-[#B600A8]/30 text-[#B600A8]' : 'bg-[#00F5FF]/10 border border-[#00F5FF]/20 text-[#00F5FF]'
                              }`}>
                                {isCustom ? 'Custom' : 'Wholesale'}
                              </span>
                              <span className="text-white/80">{lead.subject}</span>
                            </div>
                          </td>
                          <td className="py-3 text-left">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-extrabold border ${
                              lead.status === 'Won' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                              lead.status === 'Lost' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
                              lead.status === 'Contacted' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' :
                              'bg-amber-500/10 border-amber-500/30 text-amber-400'
                            }`}>
                              {lead.status || 'New'}
                            </span>
                          </td>
                          <td className="py-3 text-white/40 text-right font-mono">
                            {lead.date ? new Date(lead.date).toLocaleDateString('en-IN') : 'N/A'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}

    </div>
  );
};
export default Dashboard;
