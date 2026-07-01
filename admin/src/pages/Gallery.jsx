import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  X, 
  Upload, 
  Sparkles,
  Link,
  Tag,
  ImageIcon,
  RefreshCw
} from 'lucide-react';
import { galleryAPI, productsAPI } from '../utils/api';
import toast from 'react-hot-toast';

export const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeFilter, setActiveFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  const initialFormState = {
    label: '',
    alt: '',
    category: 'Living',
    src: '',
    productId: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredItems(galleryItems);
    } else {
      setFilteredItems(galleryItems.filter((item) => item.category === activeFilter));
    }
  }, [activeFilter, galleryItems]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [galleryData, productsData] = await Promise.all([
        galleryAPI.getAll(),
        productsAPI.getAll(),
      ]);
      setGalleryItems(galleryData);
      setFilteredItems(galleryData);
      setProducts(productsData);
    } catch (err) {
      console.error(err);
      toast.error('Could not sync gallery data.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, src: reader.result }));
      toast.success('Image loaded successfully');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.src) {
      toast.error('Please upload an image or provide a link');
      return;
    }

    const payload = {
      ...formData,
      alt: formData.alt || formData.label, // Fallback alt to label
    };

    const actionToast = toast.loading('Adding showcase image to gallery...');
    try {
      await galleryAPI.create(payload);
      toast.success('Image added to gallery', { id: actionToast });
      setModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      toast.error('Gallery upload failed.', { id: actionToast });
    }
  };

  const handleDelete = async (gid) => {
    if (!window.confirm('Remove this image from your showcase gallery?')) return;

    const delToast = toast.loading('Deleting gallery image...');
    try {
      await galleryAPI.delete(gid);
      toast.success('Deleted successfully', { id: delToast });
      loadData();
    } catch (err) {
      console.error(err);
      toast.error('Could not remove image.', { id: delToast });
    }
  };

  const categories = ['Living', 'Bedroom', 'Dining', 'Chairs', 'Others'];

  return (
    <div className="p-6 space-y-8 text-left select-none max-w-7xl mx-auto">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#B08D57]/15 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-serif uppercase">
            Showcase Gallery
          </h1>
          <p className="text-white/40 text-xs font-semibold tracking-wider font-mono mt-1">
            Display high-end designs, artisan carvings, and workshop portfolio layouts
          </p>
        </div>
        
        <button
          onClick={() => {
            setFormData(initialFormState);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#B08D57] to-[#D4AF75] hover:opacity-90 text-[#070910] font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(176,141,87,0.2)] cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Image</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div className="flex flex-wrap gap-2">
          {['All', ...categories].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border ${
                activeFilter === filter
                  ? 'bg-gradient-to-r from-[#B08D57] to-[#D4AF75] border-[#B08D57] text-[#070910] font-bold shadow-[0_0_15px_rgba(176,141,87,0.25)]'
                  : 'bg-[#131722] border-white/5 text-white/50 hover:border-[#B08D57]/30 hover:text-[#D4AF75]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        
        <button
          onClick={loadData}
          disabled={loading}
          className="p-2 bg-[#131722] border border-white/5 hover:border-[#B08D57]/30 rounded-xl text-white/40 hover:text-white transition-all cursor-pointer"
          title="Reload grid"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Loading State / Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-8 h-8 border-2 border-[#B08D57] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono tracking-widest text-white/40 uppercase">Loading gallery media...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="glass-panel p-16 rounded-3xl border border-white/5 text-center bg-gradient-to-b from-[#131722] to-transparent">
          <ImageIcon className="w-12 h-12 text-[#D4AF75] mx-auto mb-4 opacity-50" />
          <h3 className="text-white font-bold uppercase tracking-wider text-sm">Empty Gallery Showcase</h3>
          <p className="text-white/30 text-xs mt-1 leading-relaxed">
            Upload pictures showing completed orders, polish variants, and furniture sets.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const linkedProduct = products.find((p) => p.id === item.productId);
            return (
              <div 
                key={item.id} 
                className="card-hover rounded-2xl bg-[#131722] border border-white/5 overflow-hidden flex flex-col justify-between group hover:border-[#B08D57]/30 relative"
              >
                {/* Media Image container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-black/30 border-b border-[#B08D57]/10">
                  <img 
                    src={item.src} 
                    alt={item.alt || item.label} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-[#0A0D16]/95 border border-[#B08D57]/20 text-[#D4AF75] font-mono font-bold text-[8px] uppercase tracking-wider rounded-md">
                    {item.category}
                  </span>

                  {/* Hover Delete Action Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full hover:scale-105 transition-all shadow-lg cursor-pointer"
                      title="Delete Image"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Content details */}
                <div className="p-4 space-y-2 text-left">
                  <h4 className="text-white font-bold text-xs uppercase tracking-wide truncate">
                    {item.label}
                  </h4>
                  
                  {/* Linked Product indicator */}
                  {linkedProduct ? (
                    <div className="flex items-center gap-1 text-[9px] text-[#D4AF75] font-mono font-semibold">
                      <Link className="w-3 h-3 shrink-0" />
                      <span className="truncate">Linked: {linkedProduct.name}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-[9px] text-white/20 font-mono">
                      <Link className="w-3 h-3 shrink-0" />
                      <span>Not linked</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#0E121E] border border-[#B08D57]/25 rounded-[32px] p-6 sm:p-8 shadow-[0_0_80px_rgba(176,141,87,0.15)] text-left bg-gradient-to-br from-[#0E121E] via-[#090C14] to-[#120B20]">
            
            {/* Close Button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/5 hover:border-[#B08D57]/30 hover:text-[#D4AF75] text-white transition-all duration-300 z-50 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Title Header */}
            <div className="mb-6 border-b border-[#B08D57]/15 pb-4 select-none">
              <span className="text-[#D4AF75] font-semibold text-[10px] uppercase tracking-widest font-mono">
                Gallery Upload Portal
              </span>
              <h2 className="text-xl font-bold uppercase text-white mt-1 leading-tight font-serif">
                Add Showcase Image to Gallery
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Image Label Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white/40 text-[10px] uppercase tracking-widest font-mono font-bold">Image Label / Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g. Ornate Sagewan Dining Carving"
                  className="bg-[#0A0D16] border border-white/5 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-white/10 transition-all"
                />
              </div>

              {/* Alt description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white/40 text-[10px] uppercase tracking-widest font-mono font-bold">Alt Description (SEO)</label>
                <input 
                  type="text" 
                  value={formData.alt}
                  onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                  placeholder="e.g. Detailed hand carving of Sagwan wood table corner"
                  className="bg-[#0A0D16] border border-white/5 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-white/10 transition-all"
                />
              </div>

              {/* Category & Linked Product Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/40 text-[10px] uppercase tracking-widest font-mono font-bold flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-[#D4AF75]" />
                    <span>Category</span>
                  </label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="bg-[#0A0D16] border border-white/5 rounded-xl py-2.5 px-3 text-xs text-white transition-all cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#0E121E]">{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Product Link selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/40 text-[10px] uppercase tracking-widest font-mono font-bold flex items-center gap-1">
                    <Link className="w-3.5 h-3.5 text-[#D4AF75]" />
                    <span>Link to Catalog item</span>
                  </label>
                  <select 
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    className="bg-[#0A0D16] border border-white/5 rounded-xl py-2.5 px-3 text-xs text-white transition-all cursor-pointer"
                  >
                    <option value="" className="bg-[#0E121E]">Don't link product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id} className="bg-[#0E121E]">{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image upload box */}
              <div className="flex flex-col gap-2 border border-white/5 p-4 rounded-2xl bg-[#0A0D16]/50">
                <label className="text-white/40 text-[10px] uppercase tracking-widest font-mono font-bold">Image Media Asset</label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* File upload */}
                  <div className="flex flex-col justify-center border-r border-white/5 pr-4">
                    <div className="relative w-full h-20 border border-dashed border-white/10 hover:border-[#B08D57]/40 rounded-xl flex flex-col items-center justify-center gap-1 transition-all bg-[#0A0D16] cursor-pointer">
                      <Upload className="w-4 h-4 text-white/30" />
                      <span className="text-[9px] text-white/40">Select Image File</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                  
                  {/* URL path */}
                  <div className="flex flex-col gap-1 justify-center">
                    <span className="text-[9px] uppercase font-mono text-white/30">Or provide direct URL link</span>
                    <input 
                      type="text" 
                      value={formData.src}
                      onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                      placeholder="http://example.com/item.png"
                      className="w-full bg-[#0A0D16] border border-white/5 rounded-xl py-2.5 px-3 text-xs text-white placeholder-white/10 transition-all font-mono"
                    />
                  </div>
                </div>

                {formData.src && (
                  <div className="mt-3 flex items-center gap-3 bg-[#0A0D16] p-2 border border-white/5 rounded-xl">
                    <img src={formData.src} alt="Preview" className="w-12 h-9 object-cover rounded animate-pulse" />
                    <div className="flex-1 truncate">
                      <p className="text-[8px] uppercase tracking-wider text-[#D4AF75] font-bold">Showcase Thumbnail Preview</p>
                      <p className="text-[9px] text-white/30 font-mono truncate">{formData.src}</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setFormData({ ...formData, src: '' })}
                      className="text-[9px] uppercase font-mono px-2 py-1 bg-red-500/10 text-red-400 hover:text-white border border-red-500/20 rounded-md cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Action CTA */}
              <div className="mt-6 flex justify-end gap-3 select-none">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 text-xs text-white/50 hover:text-white border border-white/5 transition-colors uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#B08D57] to-[#D4AF75] text-[#070910] font-bold text-xs uppercase tracking-widest rounded-xl transition-all hover:shadow-[0_0_20px_rgba(176,141,87,0.3)] cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
export default Gallery;
