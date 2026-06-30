import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutDashboard, Inbox, Armchair, Image, Users2, LogOut, 
  Plus, Trash2, Edit, CheckCircle, Clock, Eye, RefreshCw, Calendar, ShoppingCart
} from 'lucide-react';
import SEO from '../components/SEO';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ totalViews: 0, uniqueVisitors: 0, totalEnquiries: 0, topPages: [], enquiryStatus: {} });
  const [enquiries, setEnquiries] = useState([]);
  const [products, setProducts] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Products form states
  const [productForm, setProductForm] = useState({ name: '', category: 'Sofas', price: 'Direct Factory Rate', material: '', image: '', description: '', specs: '', stock: 5 });
  const [editingPid, setEditingPid] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productError, setProductError] = useState('');
  const [productSuccess, setProductSuccess] = useState('');

  // Gallery form states
  const [galleryForm, setGalleryForm] = useState({ src: '', alt: '', category: 'Living', label: '', productId: '' });
  const [showGalleryForm, setShowGalleryForm] = useState(false);

  const navigate = useNavigate();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const token = localStorage.getItem('vk_admin_token');

  // Avoid ESLint warnings by wrapping fetchDashboardData in useCallback or matching dependencies
  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
    } else {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const fetchDashboardData = async () => {
        setLoading(true);
        try {
          const statsRes = await axios.get(`${BACKEND_URL}/api/analytics/stats`, config);
          const enqsRes = await axios.get(`${BACKEND_URL}/api/admin/enquiries`, config);
          const prodsRes = await axios.get(`${BACKEND_URL}/api/products`, config);
          const galRes = await axios.get(`${BACKEND_URL}/api/gallery`, config);
          const custRes = await axios.get(`${BACKEND_URL}/api/admin/customers`, config);
          const aptsRes = await axios.get(`${BACKEND_URL}/api/admin/appointments`, config);
          const ordersRes = await axios.get(`${BACKEND_URL}/api/admin/orders`, config);

          setStats(statsRes.data);
          setEnquiries(enqsRes.data);
          setProducts(prodsRes.data);
          setGallery(galRes.data);
          setCustomers(custRes.data);
          setAppointments(aptsRes.data);
          setOrders(ordersRes.data);
        } catch (err) {
          console.error(err);
          if (err.response?.status === 401) {
            localStorage.removeItem('vk_admin_token');
            navigate('/admin/login');
          }
        } finally {
          setLoading(false);
        }
      };

      fetchDashboardData();
    }
  }, [token, navigate, BACKEND_URL]);

  const triggerDataRefresh = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const statsRes = await axios.get(`${BACKEND_URL}/api/analytics/stats`, config);
      const enqsRes = await axios.get(`${BACKEND_URL}/api/admin/enquiries`, config);
      const prodsRes = await axios.get(`${BACKEND_URL}/api/products`, config);
      const galRes = await axios.get(`${BACKEND_URL}/api/gallery`, config);
      const custRes = await axios.get(`${BACKEND_URL}/api/admin/customers`, config);
      const aptsRes = await axios.get(`${BACKEND_URL}/api/admin/appointments`, config);
      const ordersRes = await axios.get(`${BACKEND_URL}/api/admin/orders`, config);

      setStats(statsRes.data);
      setEnquiries(enqsRes.data);
      setProducts(prodsRes.data);
      setGallery(galRes.data);
      setCustomers(custRes.data);
      setAppointments(aptsRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vk_admin_token');
    navigate('/admin/login');
  };

  // Enquiries Status Updates
  const handleUpdateStatus = async (eid, newStatus) => {
    try {
      await axios.put(`${BACKEND_URL}/api/admin/enquiries/${eid}`, { status: newStatus });
      triggerDataRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEnquiry = async (eid) => {
    if (!window.confirm("Are you sure you want to delete this enquiry lead?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/enquiries/${eid}`);
      triggerDataRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  // Products CRUD
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setProductError('');
    setProductSuccess('');

    // Parse specifications textarea into dictionary object
    let parsedSpecs = {};
    try {
      if (productForm.specs.trim()) {
        const lines = productForm.specs.split('\n');
        lines.forEach(line => {
          const parts = line.split(':');
          if (parts.length >= 2) {
            parsedSpecs[parts[0].trim()] = parts.slice(1).join(':').trim();
          }
        });
      }
    } catch (err) {
      setProductError('Invalid specifications format. Use "Key: Value" on each line.');
      return;
    }

    const payload = {
      name: productForm.name,
      category: productForm.category,
      price: productForm.price,
      material: productForm.material,
      image: productForm.image || '/images/workshop.png',
      description: productForm.description,
      specs: parsedSpecs,
      stock: parseInt(productForm.stock) || 5
    };

    try {
      if (editingPid) {
        await axios.put(`${BACKEND_URL}/api/products/${editingPid}`, payload);
        setProductSuccess('Product updated successfully!');
      } else {
        await axios.post(`${BACKEND_URL}/api/products`, payload);
        setProductSuccess('New product created successfully!');
      }
      setProductForm({ name: '', category: 'Sofas', price: 'Direct Factory Rate', material: '', image: '', description: '', specs: '', stock: 5 });
      setEditingPid(null);
      setShowProductForm(false);
      triggerDataRefresh();
    } catch (err) {
      console.error(err);
      setProductError('Failed to save product database entries.');
    }
  };

  const handleEditProduct = (p) => {
    const specString = Object.entries(p.specs).map(([k, v]) => `${k}: ${v}`).join('\n');
    setProductForm({
      name: p.name,
      category: p.category,
      price: p.price,
      material: p.material,
      image: p.image,
      description: p.description,
      specs: specString,
      stock: p.stock || 5
    });
    setEditingPid(p.id);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (pid) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/products/${pid}`);
      triggerDataRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  // Gallery CRUD
  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}/api/gallery`, {
        src: galleryForm.src || '/images/workshop.png',
        alt: galleryForm.alt || galleryForm.label,
        category: galleryForm.category,
        label: galleryForm.label,
        productId: galleryForm.productId || null
      });
      setGalleryForm({ src: '', alt: '', category: 'Living', label: '', productId: '' });
      setShowGalleryForm(false);
      triggerDataRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGallery = async (gid) => {
    if (!window.confirm("Are you sure you want to delete this photo item?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/gallery/${gid}`);
      triggerDataRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  // Appointment slots CRUD
  const handleDeleteAppointment = async (aid) => {
    if (!window.confirm("Are you sure you want to remove this appointment?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/appointments/${aid}`);
      triggerDataRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  // E-commerce orders CRUD
  const handleUpdateOrderStep = async (oid, newStatus, newStep) => {
    try {
      await axios.put(`${BACKEND_URL}/api/admin/orders/${oid}`, { status: newStatus, step: parseInt(newStep) });
      triggerDataRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteOrder = async (oid) => {
    if (!window.confirm("Are you sure you want to cancel this customer order?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/orders/${oid}`);
      triggerDataRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="bg-cream min-h-screen flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="animate-spin text-teak" size={32} />
        <p className="font-sans text-sm text-stone uppercase tracking-widest font-semibold">
          Fetching Command Data...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen text-espresso flex flex-col md:flex-row fade-in">
      <SEO
        title="Admin Control Dashboard | V.K. Furniture"
        description="Admin dashboard console panel for custom orders, analytics reporting, and inventory management."
      />

      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-espresso text-cream flex flex-col justify-between border-r border-walnut">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-walnut text-left">
            <h1 className="font-serif text-xl font-bold tracking-widest uppercase">
              VK Admin Panel
            </h1>
            <span className="text-[10px] text-brass uppercase font-bold tracking-wider block mt-1">
              Command Center
            </span>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1 text-left">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-bold transition-all ${
                activeTab === 'overview' ? 'bg-teak text-cream' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <LayoutDashboard size={16} />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('enquiries')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-bold transition-all ${
                activeTab === 'enquiries' ? 'bg-teak text-cream' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Inbox size={16} />
              Enquiries
              {enquiries.filter(e => e.status === 'pending').length > 0 && (
                <span className="ml-auto bg-brass text-espresso text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {enquiries.filter(e => e.status === 'pending').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-bold transition-all ${
                activeTab === 'products' ? 'bg-teak text-cream' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Armchair size={16} />
              Products
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-bold transition-all ${
                activeTab === 'gallery' ? 'bg-teak text-cream' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Image size={16} />
              Gallery
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-bold transition-all ${
                activeTab === 'customers' ? 'bg-teak text-cream' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Users2 size={16} />
              Customers
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-bold transition-all ${
                activeTab === 'appointments' ? 'bg-teak text-cream' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Calendar size={16} />
              Appointments
              {appointments.length > 0 && (
                <span className="ml-auto bg-brass text-espresso text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {appointments.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-bold transition-all ${
                activeTab === 'orders' ? 'bg-teak text-cream' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <ShoppingCart size={16} />
              Orders
              {orders.length > 0 && (
                <span className="ml-auto bg-brass text-espresso text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {orders.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-walnut">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs uppercase tracking-widest font-bold transition-all border border-red-900/50 cursor-pointer"
          >
            <LogOut size={14} />
            Logout Securely
          </button>
        </div>
      </aside>

      {/* Main Admin Workspace */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto max-h-screen">
        
        {/* TAB 1: OVERVIEW ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8 text-left">
            <div>
              <h2 className="font-serif text-3xl font-bold text-espresso leading-none">Dashboard Overview</h2>
              <p className="text-xs text-stone font-sans mt-1">Visitor statistics, unique log audits, and B2B engagement reports.</p>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white border border-borderSubtle p-6 flex flex-col justify-between shadow-sm">
                <span className="text-[10px] uppercase font-bold tracking-widest text-stone font-sans">Total Page Hits</span>
                <span className="font-serif text-4xl font-bold text-espresso mt-2">{stats.totalViews}</span>
                <span className="text-[10px] text-brass mt-1 font-sans">Incremental Visitor Hits</span>
              </div>
              <div className="bg-white border border-borderSubtle p-6 flex flex-col justify-between shadow-sm">
                <span className="text-[10px] uppercase font-bold tracking-widest text-stone font-sans">Unique Visitors</span>
                <span className="font-serif text-4xl font-bold text-espresso mt-2">{stats.uniqueVisitors}</span>
                <span className="text-[10px] text-brass mt-1 font-sans">Anonymized Unique IPs Logged</span>
              </div>
              <div className="bg-white border border-borderSubtle p-6 flex flex-col justify-between shadow-sm">
                <span className="text-[10px] uppercase font-bold tracking-widest text-stone font-sans">Total Leads</span>
                <span className="font-serif text-4xl font-bold text-espresso mt-2">{stats.totalEnquiries}</span>
                <span className="text-[10px] text-brass mt-1 font-sans">Quotes & Wholesales Enquiries</span>
              </div>
            </div>

            {/* Sub Analytics Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Visited Pages (Dynamic SVG charts) */}
              <div className="bg-white border border-borderSubtle p-6 shadow-sm">
                <h3 className="font-serif text-lg font-bold text-espresso mb-4">Top Visited Pages</h3>
                <div className="space-y-4">
                  {stats.topPages.map((page, idx) => {
                    const maxViews = Math.max(...stats.topPages.map(p => p.views), 1);
                    const percentage = (page.views / maxViews) * 100;
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-sans">
                          <span className="font-semibold text-stone-600 font-mono">{page.path}</span>
                          <span className="text-espresso font-bold">{page.views} hits</span>
                        </div>
                        <div className="w-full bg-cream h-2 overflow-hidden">
                          <div className="bg-teak h-full transition-all duration-500" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Leads Status breakdown */}
              <div className="bg-white border border-borderSubtle p-6 shadow-sm flex flex-col justify-between">
                <h3 className="font-serif text-lg font-bold text-espresso mb-4">Enquiries Action States</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-amber-50/50 border border-amber-200">
                    <Clock className="text-amber-500 mx-auto mb-1" size={20} />
                    <span className="text-[10px] uppercase tracking-wider text-stone font-bold block">Pending</span>
                    <span className="text-2xl font-bold text-espresso block mt-1">{stats.enquiryStatus.pending || 0}</span>
                  </div>
                  <div className="p-4 bg-blue-50/50 border border-blue-200">
                    <Eye className="text-blue-500 mx-auto mb-1" size={20} />
                    <span className="text-[10px] uppercase tracking-wider text-stone font-bold block">Contacted</span>
                    <span className="text-2xl font-bold text-espresso block mt-1">{stats.enquiryStatus.contacted || 0}</span>
                  </div>
                  <div className="p-4 bg-emerald-50/50 border border-emerald-200">
                    <CheckCircle className="text-emerald-500 mx-auto mb-1" size={20} />
                    <span className="text-[10px] uppercase tracking-wider text-stone font-bold block">Resolved</span>
                    <span className="text-2xl font-bold text-espresso block mt-1">{stats.enquiryStatus.completed || 0}</span>
                  </div>
                </div>
                <div className="text-[11px] text-stone font-sans text-center mt-4">
                  Conversion Rate: **{stats.uniqueVisitors > 0 ? ((stats.totalEnquiries / stats.uniqueVisitors) * 100).toFixed(1) : 0}%** (Leads / Unique Visitors)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ENQUIRIES CRM */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6 text-left">
            <div>
              <h2 className="font-serif text-3xl font-bold text-espresso leading-none">Manage Lead Enquiries</h2>
              <p className="text-xs text-stone font-sans mt-1">Review B2B inquiries and design plan worksheets submitted online.</p>
            </div>

            <div className="bg-white border border-borderSubtle shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-borderSubtle font-sans text-xs">
                  <thead className="bg-cream">
                    <tr>
                      <th className="px-6 py-4 font-bold text-left uppercase tracking-wider text-espresso">Type / Date</th>
                      <th className="px-6 py-4 font-bold text-left uppercase tracking-wider text-espresso">Client</th>
                      <th className="px-6 py-4 font-bold text-left uppercase tracking-wider text-espresso">Subject</th>
                      <th className="px-6 py-4 font-bold text-left uppercase tracking-wider text-espresso">Message details</th>
                      <th className="px-6 py-4 font-bold text-center uppercase tracking-wider text-espresso">Status</th>
                      <th className="px-6 py-4 font-bold text-right uppercase tracking-wider text-espresso">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-borderSubtle bg-white">
                    {enquiries.length > 0 ? (
                      enquiries.map((lead, idx) => (
                        <tr key={idx} className="hover:bg-cream/20">
                          <td className="px-6 py-4 whitespace-nowrap text-left space-y-1">
                            <span className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider ${
                              lead.type === 'custom' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {lead.type}
                            </span>
                            <span className="block text-stone font-mono">{new Date(lead.date || lead.timestamp).toLocaleDateString()}</span>
                          </td>
                          <td className="px-6 py-4 text-left font-semibold text-espresso">
                            <div>{lead.name}</div>
                            <div className="text-stone font-normal font-mono">{lead.phone}</div>
                            {lead.email && <div className="text-stone font-normal">{lead.email}</div>}
                          </td>
                          <td className="px-6 py-4 text-left font-serif font-bold text-stone">
                            {lead.subject}
                          </td>
                          <td className="px-6 py-4 text-left text-stone max-w-xs break-words">
                            {lead.message}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold ${
                              lead.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                              lead.status === 'contacted' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {lead.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                            <select
                              value={lead.status}
                              onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                              className="px-2 py-1.5 border border-borderSubtle bg-cream text-[10px] font-bold focus:outline-none focus:border-teak"
                            >
                              <option value="pending">Pending</option>
                              <option value="contacted">Contacted</option>
                              <option value="completed">Completed</option>
                            </select>
                            <button
                              onClick={() => handleDeleteEnquiry(lead.id)}
                              className="p-1.5 border border-red-200 text-red-500 hover:bg-red-50 cursor-pointer"
                              title="Delete Lead"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-stone">
                          No enquiries registered in the database.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS CRUD */}
        {activeTab === 'products' && (
          <div className="space-y-6 text-left">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-3xl font-bold text-espresso leading-none">Manage Catalog Products</h2>
                <p className="text-xs text-stone font-sans mt-1">Publish, update, or remove showroom design catalog listings.</p>
              </div>
              <button
                onClick={() => {
                  setEditingPid(null);
                  setProductForm({ name: '', category: 'Sofas', price: 'Direct Factory Rate', material: '', image: '', description: '', specs: '', stock: 5 });
                  setShowProductForm(!showProductForm);
                }}
                className="bg-espresso text-cream px-5 py-3 text-xs font-sans font-bold tracking-widest uppercase hover:bg-teak transition-colors flex items-center gap-2 cursor-pointer border-none"
              >
                <Plus size={16} />
                {showProductForm ? 'Cancel Form' : 'Add New Product'}
              </button>
            </div>

            {/* Product Add/Edit Form */}
            {showProductForm && (
              <form onSubmit={handleProductSubmit} className="bg-white border border-borderSubtle p-6 md:p-8 space-y-4 shadow-sm">
                <h3 className="font-serif text-xl font-bold text-espresso mb-2">
                  {editingPid ? 'Edit Product Parameters' : 'Add New Showroom Masterpiece'}
                </h3>
                
                {productError && <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs">{productError}</div>}
                {productSuccess && <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs">{productSuccess}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone font-sans">Product Name</label>
                    <input
                      type="text" required placeholder="E.g., Royal Handcrafted Sofa"
                      value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full px-3 py-2.5 bg-cream/40 border border-borderSubtle font-sans text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone font-sans">Category</label>
                    <select
                      value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-3 py-2.5 bg-cream/40 border border-borderSubtle font-sans text-sm focus:outline-none"
                    >
                      <option value="Sofas">Sofas</option>
                      <option value="Tables">Tables</option>
                      <option value="Beds">Beds</option>
                      <option value="Chairs">Chairs</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone font-sans">Material Statement</label>
                    <input
                      type="text" required placeholder="E.g., Genuine Teak Wood (Sagwan)"
                      value={productForm.material} onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                      className="w-full px-3 py-2.5 bg-cream/40 border border-borderSubtle font-sans text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone font-sans">Direct Pricing Label</label>
                    <input
                      type="text" required placeholder="E.g., Direct Factory Rate"
                      value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full px-3 py-2.5 bg-cream/40 border border-borderSubtle font-sans text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone font-sans">Image File Route / URL</label>
                    <input
                      type="text" placeholder="/images/sofa-teak.png"
                      value={productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      className="w-full px-3 py-2.5 bg-cream/40 border border-borderSubtle font-sans text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone font-sans">Inventory Stock Level</label>
                    <input
                      type="number" min="0" placeholder="5"
                      value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      className="w-full px-3 py-2.5 bg-cream/40 border border-borderSubtle font-sans text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-stone font-sans">Product Description</label>
                  <textarea
                    rows={3} required placeholder="Detailed marketing descriptors..."
                    value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full px-3 py-2.5 bg-cream/40 border border-borderSubtle font-sans text-sm focus:outline-none resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-stone font-sans">Specifications (Key: Value - One per line)</label>
                  <textarea
                    rows={4} placeholder="E.g.&#10;Wood Type: Seasoned Teak&#10;Cushion: 40 Density Foam&#10;Dimensions: 78 W x 32 D"
                    value={productForm.specs} onChange={(e) => setProductForm({ ...productForm, specs: e.target.value })}
                    className="w-full px-3 py-2.5 bg-cream/40 border border-borderSubtle font-sans font-mono text-xs focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-espresso text-cream hover:bg-teak hover:text-white px-6 py-3.5 text-xs font-sans font-bold tracking-widest uppercase transition-all cursor-pointer border-none"
                >
                  {editingPid ? 'Save Product Changes' : 'Publish Product to Catalog'}
                </button>
              </form>
            )}

            {/* Products grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(p => (
                <div key={p.id} className="bg-white border border-borderSubtle flex flex-col justify-between shadow-sm">
                  <div className="h-48 overflow-hidden bg-parchment relative border-b border-borderSubtle">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-teak text-cream px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold">
                      {p.category}
                    </span>
                  </div>
                  <div className="p-4 flex-grow text-left space-y-2">
                    <h4 className="font-serif text-lg font-bold text-espresso leading-tight">{p.name}</h4>
                    <p className="text-[10px] text-brass uppercase font-bold tracking-wider">
                      {p.material} | Stock: {p.stock !== undefined ? p.stock : 5} units
                    </p>
                    <p className="text-stone font-sans text-xs line-clamp-2 leading-relaxed">{p.description}</p>
                  </div>
                  <div className="p-4 border-t border-cream flex gap-2 justify-end bg-parchment/10">
                    <button
                      onClick={() => handleEditProduct(p)}
                      className="p-2 border border-borderSubtle text-stone hover:text-teak hover:border-teak transition-colors cursor-pointer"
                      title="Edit Product"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="p-2 border border-red-200 text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: GALLERY MANAGEMENT */}
        {activeTab === 'gallery' && (
          <div className="space-y-6 text-left">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-3xl font-bold text-espresso leading-none">Manage Gallery Catalog</h2>
                <p className="text-xs text-stone font-sans mt-1">Upload and catalog photography logs directly onto the public visual boards.</p>
              </div>
              <button
                onClick={() => setShowGalleryForm(!showGalleryForm)}
                className="bg-espresso text-cream px-5 py-3 text-xs font-sans font-bold tracking-widest uppercase hover:bg-teak transition-colors flex items-center gap-2 cursor-pointer border-none"
              >
                <Plus size={16} />
                {showGalleryForm ? 'Cancel Form' : 'Add New Photo'}
              </button>
            </div>

            {/* Gallery Upload Form */}
            {showGalleryForm && (
              <form onSubmit={handleGallerySubmit} className="bg-white border border-borderSubtle p-6 md:p-8 space-y-4 shadow-sm max-w-xl">
                <h3 className="font-serif text-xl font-bold text-espresso mb-2">Add Photo Asset</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone font-sans">Photo Label / Caption</label>
                    <input
                      type="text" required placeholder="E.g. Solid Teak Joinery Detail"
                      value={galleryForm.label} onChange={(e) => setGalleryForm({ ...galleryForm, label: e.target.value })}
                      className="w-full px-3 py-2.5 bg-cream/40 border border-borderSubtle font-sans text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone font-sans">Category Tag</label>
                    <select
                      value={galleryForm.category} onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                      className="w-full px-3 py-2.5 bg-cream/40 border border-borderSubtle font-sans text-sm focus:outline-none"
                    >
                      <option value="Living">Living Room</option>
                      <option value="Bedroom">Bedroom</option>
                      <option value="Dining">Dining Room</option>
                      <option value="Chairs">Chairs/Stools</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone font-sans">Image Route / URL</label>
                    <input
                      type="text" required placeholder="/images/workshop.png"
                      value={galleryForm.src} onChange={(e) => setGalleryForm({ ...galleryForm, src: e.target.value })}
                      className="w-full px-3 py-2.5 bg-cream/40 border border-borderSubtle font-sans text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone font-sans">Linked Product ID (Optional)</label>
                    <input
                      type="text" placeholder="e.g. handcrafted-teak-sofa"
                      value={galleryForm.productId} onChange={(e) => setGalleryForm({ ...galleryForm, productId: e.target.value })}
                      className="w-full px-3 py-2.5 bg-cream/40 border border-borderSubtle font-sans text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-espresso text-cream hover:bg-teak hover:text-white px-6 py-3.5 text-xs font-sans font-bold tracking-widest uppercase transition-all cursor-pointer border-none"
                >
                  Upload Photo
                </button>
              </form>
            )}

            {/* Gallery list */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {gallery.map(g => (
                <div key={g.id} className="bg-white border border-borderSubtle flex flex-col group overflow-hidden shadow-sm relative">
                  <div className="h-40 overflow-hidden bg-parchment">
                    <img src={g.src} alt={g.alt} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 text-left">
                    <span className="text-[9px] uppercase tracking-wider text-brass font-bold">{g.category}</span>
                    <h5 className="font-serif text-sm font-semibold text-espresso truncate">{g.label}</h5>
                  </div>
                  <button
                    onClick={() => handleDeleteGallery(g.id)}
                    className="absolute top-2 right-2 p-2 bg-red-900/90 text-white rounded-full hover:bg-red-800 transition-colors cursor-pointer border-none"
                    title="Delete Photo"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CUSTOMERS CRM */}
        {activeTab === 'customers' && (
          <div className="space-y-6 text-left">
            <div>
              <h2 className="font-serif text-3xl font-bold text-espresso leading-none">Customers Directory</h2>
              <p className="text-xs text-stone font-sans mt-1">Unified registry mapping contact data and request frequency of active B2B partners.</p>
            </div>

            <div className="bg-white border border-borderSubtle shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-borderSubtle font-sans text-xs">
                <thead className="bg-cream">
                  <tr>
                    <th className="px-6 py-4 font-bold text-left uppercase tracking-wider text-espresso">Client Name</th>
                    <th className="px-6 py-4 font-bold text-left uppercase tracking-wider text-espresso">Phone Number</th>
                    <th className="px-6 py-4 font-bold text-left uppercase tracking-wider text-espresso">Email Address</th>
                    <th className="px-6 py-4 font-bold text-center uppercase tracking-wider text-espresso">Request Count</th>
                    <th className="px-6 py-4 font-bold text-right uppercase tracking-wider text-espresso">Last Activity Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderSubtle bg-white">
                  {customers.length > 0 ? (
                    customers.map((c, idx) => (
                      <tr key={idx} className="hover:bg-cream/10">
                        <td className="px-6 py-4 text-left font-semibold text-espresso">{c.name}</td>
                        <td className="px-6 py-4 text-left font-mono">{c.phone}</td>
                        <td className="px-6 py-4 text-left text-stone">{c.email}</td>
                        <td className="px-6 py-4 text-center font-bold text-teak">{c.requestsCount} leads</td>
                        <td className="px-6 py-4 text-right text-stone font-mono">
                          {new Date(c.lastActive).toLocaleDateString()} at {new Date(c.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-stone">
                        No clients registered in the directory yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: APPOINTMENTS CRM */}
        {activeTab === 'appointments' && (
          <div className="space-y-6 text-left">
            <div>
              <h2 className="font-serif text-3xl font-bold text-espresso leading-none">Consultation Bookings</h2>
              <p className="text-xs text-stone font-sans mt-1">Review active showroom appointments and live workshop tours scheduled online.</p>
            </div>

            <div className="bg-white border border-borderSubtle shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-borderSubtle font-sans text-xs">
                <thead className="bg-cream">
                  <tr>
                    <th className="px-6 py-4 font-bold text-left uppercase tracking-wider text-espresso">Client</th>
                    <th className="px-6 py-4 font-bold text-left uppercase tracking-wider text-espresso">Date & Time</th>
                    <th className="px-6 py-4 font-bold text-left uppercase tracking-wider text-espresso">Consultation Purpose</th>
                    <th className="px-6 py-4 font-bold text-left uppercase tracking-wider text-espresso">Notes / Requests</th>
                    <th className="px-6 py-4 font-bold text-right uppercase tracking-wider text-espresso">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderSubtle bg-white">
                  {appointments.length > 0 ? (
                    appointments.map((apt, idx) => (
                      <tr key={idx} className="hover:bg-cream/10">
                        <td className="px-6 py-4 text-left font-semibold text-espresso">
                          <div>{apt.name}</div>
                          <div className="text-stone font-normal font-mono">{apt.phone}</div>
                        </td>
                        <td className="px-6 py-4 text-left font-mono font-semibold text-teak">
                          {apt.date} at {apt.time}
                        </td>
                        <td className="px-6 py-4 text-left">
                          <span className="px-2 py-0.5 bg-brass/20 text-espresso text-[10px] uppercase font-bold tracking-wider">
                            {apt.purpose}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-left text-stone max-w-xs break-words">
                          {apt.notes || 'None'}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteAppointment(apt.id)}
                            className="p-1.5 border border-red-200 text-red-500 hover:bg-red-50 cursor-pointer"
                            title="Cancel Booking"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-stone">
                        No scheduled showroom appointments.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6 text-left">
            <div>
              <h2 className="font-serif text-3xl font-bold text-espresso leading-none">Customer Orders</h2>
              <p className="text-xs text-stone font-sans mt-1">Track payments, shipping options, and modify active production fabrication steps.</p>
            </div>

            <div className="bg-white border border-borderSubtle shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-borderSubtle font-sans text-xs">
                <thead className="bg-cream">
                  <tr>
                    <th className="px-6 py-4 font-bold text-left uppercase tracking-wider text-espresso">Order Reference</th>
                    <th className="px-6 py-4 font-bold text-left uppercase tracking-wider text-espresso">Client</th>
                    <th className="px-6 py-4 font-bold text-left uppercase tracking-wider text-espresso">Purchased Items</th>
                    <th className="px-6 py-4 font-bold text-center uppercase tracking-wider text-espresso">Pay Total</th>
                    <th className="px-6 py-4 font-bold text-center uppercase tracking-wider text-espresso">Production Stage</th>
                    <th className="px-6 py-4 font-bold text-right uppercase tracking-wider text-espresso">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderSubtle bg-white">
                  {orders.length > 0 ? (
                    orders.map((ord, idx) => (
                      <tr key={idx} className="hover:bg-cream/10">
                        <td className="px-6 py-4 text-left font-mono">
                          <span className="font-bold text-teak block">{ord.id}</span>
                          <span className="text-[10px] text-stone">{new Date(ord.timestamp).toLocaleDateString()}</span>
                        </td>
                        <td className="px-6 py-4 text-left">
                          <div className="font-semibold">{ord.name}</div>
                          <div className="text-stone font-mono">{ord.phone}</div>
                          <div className="text-[10px] text-stone-500 truncate max-w-[150px]">{ord.address}, {ord.city}</div>
                        </td>
                        <td className="px-6 py-4 text-left text-stone max-w-xs">
                          {ord.items.map((it, i) => (
                            <div key={i} className="truncate">
                              {it.name} <strong className="font-mono text-teak">x{it.quantity}</strong>
                            </div>
                          ))}
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-espresso font-mono">
                          ₹ {ord.total.toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold block mb-1">
                            {ord.status}
                          </span>
                          <span className="text-[10px] text-stone-400">Step {ord.step} of 6</span>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                          <select
                            value={`${ord.status}|${ord.step}`}
                            onChange={(e) => {
                              const [status, step] = e.target.value.split('|');
                              handleUpdateOrderStep(ord.id, status, step);
                            }}
                            className="px-2 py-1.5 border border-borderSubtle bg-cream text-[10px] font-bold focus:outline-none"
                          >
                            <option value="Order Received|1">1. Received</option>
                            <option value="Raw Wood Selection|2">2. Wood Setup</option>
                            <option value="Artisan Carving|3">3. Carving</option>
                            <option value="Polishing & Finishing|4">4. Polishing</option>
                            <option value="Out for Delivery|5">5. Out for Delivery</option>
                            <option value="Delivered|6">6. Delivered</option>
                          </select>
                          <button
                            onClick={() => handleDeleteOrder(ord.id)}
                            className="p-1.5 border border-red-200 text-red-500 hover:bg-red-50 cursor-pointer"
                            title="Cancel Order"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-stone">
                        No transactions or orders currently placed.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
