import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Upload, 
  Sparkles,
  Info,
  Archive,
  Wrench,
  DollarSign
} from 'lucide-react';
import { productsAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { useOutletContext } from 'react-router-dom';

export const Products = () => {
  const { searchVal } = useOutletContext() || { searchVal: '' };
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Form Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPid, setEditingPid] = useState(null);

  const initialFormState = {
    name: '',
    category: 'Sofas',
    price: 'Direct Factory Rate',
    material: 'Genuine Seasoned Teak Wood (Sagwan)',
    image: '',
    description: '',
    stock: 5,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [specsList, setSpecsList] = useState([{ key: '', value: '' }]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const search = (searchTerm || searchVal || '').toLowerCase();
    if (!search) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(
          (p) =>
            p.name.toLowerCase().includes(search) ||
            p.category.toLowerCase().includes(search) ||
            p.material.toLowerCase().includes(search)
        )
      );
    }
  }, [searchTerm, searchVal, products]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productsAPI.getAll();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      console.error(err);
      toast.error('Could not sync products list.');
    } finally {
      setLoading(false);
    }
  };

  // Convert image upload to base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }));
      toast.success('Image loaded successfully');
    };
    reader.readAsDataURL(file);
  };

  // Specs helpers
  const handleSpecChange = (index, field, value) => {
    const newList = [...specsList];
    newList[index][field] = value;
    setSpecsList(newList);
  };

  const addSpecField = () => {
    setSpecsList([...specsList, { key: '', value: '' }]);
  };

  const removeSpecField = (index) => {
    if (specsList.length === 1) {
      setSpecsList([{ key: '', value: '' }]);
    } else {
      setSpecsList(specsList.filter((_, i) => i !== index));
    }
  };

  const openAddModal = () => {
    setFormData(initialFormState);
    setSpecsList([{ key: '', value: '' }]);
    setIsEditing(false);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      material: product.material,
      image: product.image,
      description: product.description,
      stock: product.stock || 5,
    });

    const specsArr = Object.entries(product.specs || {}).map(([k, v]) => ({
      key: k,
      value: v,
    }));
    setSpecsList(specsArr.length > 0 ? specsArr : [{ key: '', value: '' }]);

    setIsEditing(true);
    setEditingPid(product.id);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      toast.error('Please upload an image or provide an image link');
      return;
    }

    // compile specs
    const specs = {};
    specsList.forEach((s) => {
      if (s.key.trim() && s.value.trim()) {
        specs[s.key.trim()] = s.value.trim();
      }
    });

    const payload = {
      ...formData,
      specs,
    };

    const actionToast = toast.loading(isEditing ? 'Updating item...' : 'Seeding item to catalog...');
    try {
      if (isEditing) {
        await productsAPI.update(editingPid, payload);
        toast.success('Catalog item updated successfully', { id: actionToast });
      } else {
        await productsAPI.create(payload);
        toast.success('Seeded to catalog successfully', { id: actionToast });
      }
      setModalOpen(false);
      loadProducts();
    } catch (err) {
      console.error(err);
      toast.error('Catalog operation failed.', { id: actionToast });
    }
  };

  const handleDelete = async (pid) => {
    if (!window.confirm('Delete this product permanently from the database catalog?')) return;
    
    const delToast = toast.loading('Deleting catalog item...');
    try {
      await productsAPI.delete(pid);
      toast.success('Deleted successfully', { id: delToast });
      loadProducts();
    } catch (err) {
      console.error(err);
      toast.error('Could not remove product.', { id: delToast });
    }
  };

  const categories = ['Sofas', 'Beds', 'Tables', 'Chairs', 'Cabinets', 'Dining', 'Others'];

  return (
    <div className="p-6 space-y-8 text-left select-none max-w-7xl mx-auto">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#B08D57]/15 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-serif uppercase">
            Furniture Catalog
          </h1>
          <p className="text-white/40 text-xs font-semibold tracking-wider font-mono mt-1">
            Manage factory rates, seasoned wood specs, and structural inventories
          </p>
        </div>
        
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#B08D57] to-[#D4AF75] hover:opacity-90 text-[#070910] font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(176,141,87,0.2)] cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Furniture</span>
        </button>
      </div>

      {/* Filter Options */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch justify-between">
        <div className="relative w-full max-w-xs">
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter catalog items..."
            className="w-full bg-[#131722] border border-[#B08D57]/15 rounded-xl py-2.5 pl-9 pr-4 text-xs font-medium text-white placeholder-white/20 focus:outline-none transition-all"
          />
          <Search className="absolute left-3 top-3 w-4 h-4 text-white/30" />
        </div>
      </div>

      {/* Loading state / Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-8 h-8 border-2 border-[#B08D57] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono tracking-widest text-white/40 uppercase">Loading catalog data...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="glass-panel p-16 rounded-3xl border border-white/5 text-center bg-gradient-to-b from-[#131722] to-transparent">
          <Archive className="w-12 h-12 text-[#D4AF75] mx-auto mb-4 opacity-50" />
          <h3 className="text-white font-bold uppercase tracking-wider text-sm">No items matching criteria</h3>
          <p className="text-white/30 text-xs mt-1 leading-relaxed">
            Create a new furniture item or refine your filter terms.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => (
            <div 
              key={prod.id} 
              className="card-hover rounded-3xl bg-[#131722] border border-white/5 overflow-hidden flex flex-col justify-between hover:border-[#B08D57]/35 relative"
            >
              {/* Product Image */}
              <div className="relative aspect-[16/11] overflow-hidden bg-black/40 border-b border-[#B08D57]/10">
                <img 
                  src={prod.image.startsWith('data:') ? prod.image : prod.image} 
                  alt={prod.name} 
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 px-3 py-1 bg-[#0A0D16]/90 border border-[#B08D57]/30 text-[#D4AF75] font-mono font-bold text-[9px] uppercase tracking-widest rounded-md">
                  {prod.category}
                </span>
                {prod.stock <= 3 && (
                  <span className="absolute top-4 right-4 px-2 py-1 bg-red-500/10 border border-red-500/30 text-red-400 font-mono font-bold text-[9px] uppercase tracking-widest rounded-md animate-pulse">
                    Low Stock: {prod.stock}
                  </span>
                )}
              </div>

              {/* Product Content Details */}
              <div className="p-6 flex-1 flex flex-col justify-between text-left space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-white font-bold uppercase tracking-wide text-base leading-snug truncate pr-2" title={prod.name}>
                      {prod.name}
                    </h3>
                    <span className="text-[#D4AF75] font-bold text-xs shrink-0 font-mono">
                      {prod.price}
                    </span>
                  </div>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider font-semibold font-mono border-b border-white/5 pb-2">
                    Material: {prod.material}
                  </p>
                  <p className="text-white/60 text-xs leading-relaxed font-light line-clamp-2">
                    {prod.description}
                  </p>
                </div>

                {/* Key specifications preview */}
                {Object.keys(prod.specs || {}).length > 0 && (
                  <div className="bg-[#0A0D16]/50 border border-white/[0.03] rounded-xl p-3 space-y-1.5 select-none text-[10px]">
                    {Object.entries(prod.specs).slice(0, 3).map(([k, v]) => (
                      <div key={k} className="flex justify-between items-center text-white/50">
                        <span className="font-mono">{k}:</span>
                        <span className="text-white/80 font-semibold max-w-[140px] truncate">{v}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex justify-between items-center border-t border-white/5 pt-4">
                  <button
                    onClick={() => handleDelete(prod.id)}
                    className="flex items-center gap-1.5 text-[10px] text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/10 rounded-lg px-3 py-1.5 transition-all duration-300 cursor-pointer uppercase font-bold tracking-wider"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                  
                  <button
                    onClick={() => openEditModal(prod)}
                    className="flex items-center gap-1.5 text-[10px] text-[#D4AF75] hover:text-white bg-[#B08D57]/10 hover:bg-[#B08D57]/20 border border-[#B08D57]/20 rounded-lg px-3.5 py-2 transition-all duration-300 cursor-pointer uppercase font-bold tracking-wider"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Specifications</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CRUD Add/Edit Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0E121E] border border-[#B08D57]/25 rounded-[32px] p-6 sm:p-8 shadow-[0_0_80px_rgba(176,141,87,0.15)] max-h-[90vh] overflow-y-auto custom-scrollbar text-left bg-gradient-to-br from-[#0E121E] via-[#090C14] to-[#171120]">
            
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
                {isEditing ? 'Editing Catalog Entry' : 'New Catalog Entry'}
              </span>
              <h2 className="text-xl font-bold uppercase text-white mt-1 leading-tight font-serif">
                {isEditing ? 'Modify Furniture Specifications' : 'Seed Furniture to Workshop Catalog'}
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Product Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/40 text-[10px] uppercase tracking-widest font-mono font-bold">Furniture Title</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Royal Sagwan Dining Table"
                    className="bg-[#0A0D16] border border-white/5 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-white/10 transition-all"
                  />
                </div>

                {/* Price */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/40 text-[10px] uppercase tracking-widest font-mono font-bold flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-[#D4AF75]" />
                    <span>Price / Rate Label</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. ₹45,000 or Direct Factory Rate"
                    className="bg-[#0A0D16] border border-white/5 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-white/10 transition-all"
                  />
                </div>

                {/* Category Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/40 text-[10px] uppercase tracking-widest font-mono font-bold">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="bg-[#0A0D16] border border-white/5 rounded-xl py-2.5 px-3.5 text-xs text-white transition-all cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#0E121E]">{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Stock Level */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/40 text-[10px] uppercase tracking-widest font-mono font-bold">Structural Stock</label>
                  <input 
                    type="number" 
                    min={0}
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    placeholder="5"
                    className="bg-[#0A0D16] border border-white/5 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-white/10 transition-all font-mono"
                  />
                </div>

                {/* Material */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-white/40 text-[10px] uppercase tracking-widest font-mono font-bold flex items-center gap-1">
                    <Wrench className="w-3.5 h-3.5 text-[#D4AF75]" />
                    <span>Structural Material Description</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    placeholder="e.g. 100% Genuine Seasoned Teak Wood (Sagwan)"
                    className="w-full bg-[#0A0D16] border border-white/5 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-white/10 transition-all"
                  />
                </div>

                {/* Image Upload / URL Link */}
                <div className="flex flex-col gap-2 sm:col-span-2 border border-white/5 p-4 rounded-2xl bg-[#0A0D16]/50">
                  <label className="text-white/40 text-[10px] uppercase tracking-widest font-mono font-bold">Showcase Image Asset</label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* File Upload */}
                    <div className="flex flex-col gap-2 justify-center border-r border-white/5 pr-4">
                      <div className="relative w-full h-24 border border-dashed border-white/10 hover:border-[#B08D57]/40 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all bg-[#0A0D16] cursor-pointer">
                        <Upload className="w-5 h-5 text-white/30" />
                        <span className="text-[10px] text-white/40">Upload simulated file</span>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                    
                    {/* URL String */}
                    <div className="flex flex-col gap-1.5 justify-center">
                      <span className="text-[9px] uppercase font-mono text-white/30">Or provide direct URL link</span>
                      <input 
                        type="text" 
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="http://example.com/image.jpg"
                        className="w-full bg-[#0A0D16] border border-white/5 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-white/10 transition-all font-mono"
                      />
                    </div>
                  </div>

                  {formData.image && (
                    <div className="mt-3 flex items-center gap-3 bg-[#0A0D16] p-2.5 border border-white/5 rounded-xl">
                      <img src={formData.image} alt="Preview" className="w-14 h-10 object-cover rounded" />
                      <div className="flex-1 truncate">
                        <p className="text-[9px] uppercase tracking-wider text-[#D4AF75] font-bold">Thumbnail Preview</p>
                        <p className="text-[10px] text-white/30 font-mono truncate">{formData.image}</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="text-[9px] uppercase font-mono px-2 py-1 bg-red-500/10 text-red-400 hover:text-white border border-red-500/20 rounded-md cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-white/40 text-[10px] uppercase tracking-widest font-mono font-bold">Catalog Description</label>
                  <textarea 
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide details about structural joints, finishing details, polish types, cushion upholstery configurations..."
                    className="w-full bg-[#0A0D16] border border-white/5 rounded-xl py-2 px-3.5 text-xs text-white placeholder-white/10 transition-all resize-none"
                  />
                </div>

                {/* Spec List Builder */}
                <div className="flex flex-col gap-2 sm:col-span-2 border-t border-white/5 pt-4">
                  <div className="flex justify-between items-center select-none">
                    <label className="text-white/40 text-[10px] uppercase tracking-widest font-mono font-bold flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-[#D4AF75]" />
                      <span>Artisan Specifications Sheets</span>
                    </label>
                    <button
                      type="button"
                      onClick={addSpecField}
                      className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#D4AF75] hover:text-white transition-colors cursor-pointer"
                    >
                      + Add row specification
                    </button>
                  </div>

                  <div className="space-y-3 mt-2">
                    {specsList.map((spec, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <input 
                          type="text" 
                          placeholder="e.g. Wood Type"
                          value={spec.key}
                          onChange={(e) => handleSpecChange(i, 'key', e.target.value)}
                          className="flex-1 bg-[#0A0D16] border border-white/5 rounded-xl py-2 px-3 text-xs text-white placeholder-white/10 font-mono"
                        />
                        <span className="text-white/20 font-bold">:</span>
                        <input 
                          type="text" 
                          placeholder="e.g. Sagwan (Teak)"
                          value={spec.value}
                          onChange={(e) => handleSpecChange(i, 'value', e.target.value)}
                          className="flex-1 bg-[#0A0D16] border border-white/5 rounded-xl py-2 px-3 text-xs text-white placeholder-white/10"
                        />
                        <button
                          type="button"
                          onClick={() => removeSpecField(i)}
                          className="p-2 bg-red-500/5 hover:bg-red-500/15 border border-red-500/10 hover:border-red-500/30 rounded-xl text-red-400 transition-all cursor-pointer"
                          title="Dismiss spec field"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Submit CTA */}
              <div className="mt-8 flex justify-end gap-3 select-none">
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
                  <span>{isEditing ? 'Apply Changes' : 'Seed Catalog'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
export default Products;
