import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, MessageSquare } from 'lucide-react';
import axios from 'axios';
import SEO from '../components/SEO';

const productsData = [
  {
    id: 'royal-sagwan-sofa',
    name: 'Royal Sagwan Sofa Set',
    category: 'Sofas',
    price: '₹ 45,000',
    material: '100% Genuine Teak Wood (Sagwan)',
    image: '/images/sofa-teak.png',
    description: 'Luxurious heavy-carving teak wood framework sofa set with high-density foam cushioning. Highly durable and custom sizing available.'
  },
  {
    id: 'lshape-sectional-sofa',
    name: 'L-Shape Teak Sectional Sofa',
    category: 'Sofas',
    price: '₹ 65,000',
    material: 'Premium Sagwan Base & Linen Cushions',
    image: '/images/sofa-lshape.png',
    description: 'Modern L-shape sectional sofa set featuring deep lounge cushions, solid teak wooden frame support, and customizable fabrics.'
  },
  {
    id: 'teak-sofa-cum-bed',
    name: 'Teak Wood Sofa-Cum-Bed',
    category: 'Sofas',
    price: '₹ 38,000',
    material: 'kiln-dried Teak & HR Foam',
    image: '/images/sofa-cumbed.png',
    description: 'Versatile space-saving sofa-cum-bed handcrafted in solid sagwan. Easily expands into a double bed, perfect for compact spaces.'
  },
  {
    id: 'handcrafted-teak-dining-set',
    name: 'Premium Glass-Top Dining Set (4-Seater)',
    category: 'Tables',
    price: '₹ 48,000',
    material: 'Teak Wood Frame & Temper Glass Top',
    image: '/images/dining-4seater.png',
    description: 'Elegant 4-seater dining table with premium glass-top and matching upholstered teak chairs. Dark walnut finish.'
  },
  {
    id: 'sagwan-dining-6seater',
    name: 'Sagwan Glass-Top Dining Set (6-Seater)',
    category: 'Tables',
    price: '₹ 58,000',
    material: 'Heavy Sagwan Frame & Tempered Glass',
    image: '/images/dining-6seater.png',
    description: 'A spacious 6-seater sagwan dining suite with heavy teak frames, natural grain finish, and sturdy tempered glass top.'
  },
  {
    id: 'traditional-sagwan-bed',
    name: 'Imperial Sagwan Wood Bed',
    category: 'Beds',
    price: '₹ 52,000',
    material: 'Premium Sag Wood Frame',
    image: '/images/king-bed.png',
    description: 'Sturdy king-size bed handcrafted with premium grain sagwood. Built to last for generations with custom storage options.'
  },
  {
    id: 'hydraulic-storage-bed',
    name: 'Hydraulic Teak Storage Bed',
    category: 'Beds',
    price: '₹ 55,000',
    material: 'Teak Wood Frame & Plywood Box',
    image: '/images/bed-hydraulic.png',
    description: 'Smart king-size bed with a smooth gas-lift hydraulic storage mechanism, heavy-gauge solid wood framework, and modern headboard.'
  },
  {
    id: 'vintage-carved-bed',
    name: 'Vintage Hand-Carved Bed',
    category: 'Beds',
    price: '₹ 60,000',
    material: 'Selected Premium Seasoned Teak',
    image: '/images/bed-vintage.png',
    description: 'Classic heritage four-pillar design featuring ornate floral wood carvings on the headboard and posts. Polished natural honey shade.'
  },
  {
    id: 'upholstered-accent-armchair',
    name: 'Modern Upholstered Accent Chair',
    category: 'Chairs',
    price: '₹ 18,000',
    material: 'Walnut Finish Legs & Premium Fabric',
    image: '/images/grey-armchair.png',
    description: 'Chic lounge armchair featuring modern curved aesthetics, walnut-finished wood frame, and premium stain-resistant upholstery.'
  }
];

const categories = ['All', 'Sofas', 'Chairs', 'Tables', 'Beds'];

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';
  
  const [products, setProducts] = useState(productsData);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(productsData);

  useEffect(() => {
    const fetchProducts = async () => {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
      try {
        const res = await axios.get(`${BACKEND_URL}/api/products`);
        if (res.data && res.data.length > 0) {
          setProducts(res.data);
          setFilteredProducts(res.data);
        }
      } catch (err) {
        console.error("Failed to load products from API:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    let result = products;
    
    // Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    // Search Filter
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.material.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredProducts(result);
  }, [selectedCategory, searchQuery, products]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchParams(category === 'All' ? {} : { category });
  };

  const catalogSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "V.K. Furniture Collections",
    "numberOfItems": productsData.length,
    "itemListElement": productsData.map((item, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": item.name,
      "url": `https://vk-furniture.vercel.app/product/${item.id}`
    }))
  };

  return (
    <div className="bg-light py-16 text-dark fade-in">
      <SEO
        title="Wooden Collections Catalog | V.K. Furniture Mumbai"
        description="Browse our full B2B furniture catalog. High-grade teakwood (sagwan) sofa sets, glass-top dining tables, storage beds, and accent chairs direct from our workshop."
        schema={catalogSchema}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-left border-b border-borderSubtle pb-8 mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold leading-none">
            Our Masterpieces
          </h1>
          <span className="font-devanagari text-lg text-primary mt-1.5 block tracking-wider font-semibold">
            कस्टम और थोक फर्नीचर संग्रह
          </span>
          <p className="text-gray-600 dark:text-gray-300 font-sans text-sm max-w-xl mt-3 leading-relaxed">
            Handcrafted with premium Sagwan (teak) wood in our Dharavi workshop. We offer bulk wholesaling and custom sizing adjustments.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Filter size={15} className="text-gray-500 flex-shrink-0 mr-1.5" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                data-testid={`category-chip-${cat.toLowerCase()}`}
                className={`px-6 py-2 border font-sans text-xs tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white dark:bg-dark-light text-gray-500 border-borderSubtle hover:border-primary hover:text-dark'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md w-full">
            <input
              type="text"
              placeholder="Search design, material or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="catalog-search-input"
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-dark-light border border-borderSubtle font-sans text-xs focus:outline-none focus:border-primary text-dark placeholder-gray-400"
            />
            <Search className="absolute left-3.5 top-3.5 text-gray-500" size={15} />
          </div>
        </div>


        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                data-testid={`product-card-${product.id}`}
                className="bg-white dark:bg-dark-light border border-borderSubtle flex flex-col group overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 reveal glass-hover-card"
              >
                {/* Image */}
                <div className="h-[280px] overflow-hidden relative border-b border-borderSubtle bg-parchment image-reveal active">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 furniture-card-img"
                  />
                  <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 text-[9px] uppercase tracking-widest font-bold font-sans">
                    {product.category}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex flex-col flex-grow text-left space-y-3">
                  <h3 className="font-serif text-xl md:text-2xl font-bold leading-tight">
                    {product.name}
                  </h3>
                  
                  <p className="text-[10px] uppercase tracking-widest text-primary font-bold">
                    {product.material}
                  </p>

                  <p className="text-gray-500 dark:text-gray-400 font-sans text-xs leading-relaxed flex-grow">
                    {product.description}
                  </p>

                  <div className="text-sm font-bold text-primary font-mono pt-3 border-t border-borderSubtle">
                    {product.price}
                  </div>

                  {/* CTAs */}
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <Link
                      to={`/product/${product.id}`}
                      data-testid={`view-detail-${product.id}`}
                      className="luxury-btn py-3 text-center text-[10px] uppercase tracking-widest font-bold font-sans flex items-center justify-center gap-1.5"
                    >
                      View Specs
                    </Link>
                    <a
                      href={`https://wa.me/919821454706?text=Hi%20V.K.%20Furniture%2C%20I%20am%20interested%20in%20enquiring%20about%20"${encodeURIComponent(product.name)}".`}
                      target="_blank"
                      rel="noreferrer"
                      data-testid={`enquire-whatsapp-${product.id}`}
                      className="bg-[#25D366] text-white py-3 flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-widest font-bold font-sans hover:bg-[#20ba5a] transition-all"
                    >
                      <MessageSquare size={14} className="fill-white stroke-none" />
                      Enquire
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-dark-light border border-borderSubtle">
            <p className="text-gray-500 font-serif text-lg">No items match your filter criteria.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="mt-4 bg-primary text-white px-6 py-2.5 text-xs uppercase font-sans tracking-widest font-bold border-none cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
