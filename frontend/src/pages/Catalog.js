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

const getUniqueProducts = (list) => {
  const seen = {};
  return list.filter(item => {
    const key = item.id || item._id || item.name;
    return seen.hasOwnProperty(key) ? false : (seen[key] = true);
  });
};

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';
  
  const [products, setProducts] = useState(getUniqueProducts(productsData));
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(getUniqueProducts(productsData));

  useEffect(() => {
    const fetchProducts = async () => {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
      try {
        const res = await axios.get(`${BACKEND_URL}/api/products`);
        if (res.data && res.data.length > 0) {
          const uniqueList = getUniqueProducts(res.data);
          setProducts(uniqueList);
          setFilteredProducts(uniqueList);
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
        <div className="text-left border-b border-borderSubtle pb-8 mb-12 max-w-3xl">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-espresso dark:text-light">
            Our Masterpieces
          </h1>
          <span className="font-devanagari text-base md:text-lg text-primary mt-2 block tracking-wider font-semibold">
            कस्टम और थोक फर्नीचर संग्रह
          </span>
          <p className="text-[#5B5048] dark:text-[#FAF7F2] font-sans text-[15px] md:text-base max-w-2xl mt-4 leading-relaxed font-medium">
            Handcrafted with premium Sagwan (teak) wood in our Dharavi workshop. We offer B2B wholesale rates and custom sizing adjustments.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          
          {/* Category Chips - Swipe Friendly on Mobile */}
          <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none snap-x w-full md:w-auto">
            <Filter size={15} className="text-[#3A3028] dark:text-[#FAF7F2] flex-shrink-0 mr-1.5 snap-align-start" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                data-testid={`category-chip-${cat.toLowerCase()}`}
                className={`px-6 py-3 rounded-full font-sans text-xs tracking-widest uppercase transition-all duration-300 cursor-pointer snap-align-start flex-shrink-0 border ${
                  selectedCategory === cat
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105'
                    : 'bg-white dark:bg-[#3A3028] text-gray-500 border-borderSubtle hover:border-primary hover:text-dark dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar - Premium Rounded */}
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search design, material or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="catalog-search-input"
              className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-[#3A3028] border border-borderSubtle font-sans text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-dark dark:text-light placeholder-gray-400 dark:placeholder-gray-300 rounded-full shadow-md focus:shadow-lg transition-all"
            />
            <Search className="absolute left-4.5 top-4 text-gray-500" size={16} />
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, idx) => {
              const isLast = idx === filteredProducts.length - 1;
              const isOddCount = filteredProducts.length % 2 !== 0;
              const isNotThreeMultiple = filteredProducts.length % 3 !== 0;

              return (
                <div
                  key={product.id}
                  data-testid={`product-card-${product.id}`}
                  className={`bg-white dark:bg-[#3A3028] border border-borderSubtle flex flex-col group overflow-hidden rounded-[20px] shadow-md hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1.5 transition-all duration-300 reveal ${
                    isLast && isOddCount ? 'md:col-span-2 lg:col-span-1' : ''
                  } ${
                    isLast && isNotThreeMultiple ? 'lg:col-span-3 lg:max-w-2xl lg:mx-auto lg:w-full' : ''
                  }`}
                >
                  {/* Image with overlay */}
                  <div className="h-[300px] overflow-hidden relative rounded-t-[20px] bg-parchment">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover scale-100 group-hover:scale-[1.05] active:scale-[1.05] transition-transform duration-500 furniture-card-img brightness-[1.05]"
                      loading="lazy"
                    />
                    {/* Soft glass gradient overlay over image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/15 to-transparent"></div>
                    
                    <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 text-[9px] uppercase tracking-widest font-bold font-sans rounded-full">
                      {product.category}
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="p-8 flex flex-col flex-grow text-left space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-[#B08D57] font-bold font-sans">
                        {product.material}
                      </p>
                      <h3 className="font-serif text-2xl font-bold leading-tight text-[#2B2B2B] dark:text-light">
                        {product.name}
                      </h3>
                    </div>

                    <p className="text-[#5B5048] dark:text-gray-300 font-sans text-xs leading-relaxed flex-grow line-clamp-2">
                      {product.description}
                    </p>


                    <div className="text-base font-bold text-primary font-serif pt-3 border-t border-borderSubtle flex items-center justify-between">
                      <span className="font-sans text-[10px] uppercase tracking-widest text-gray-400">Wholesale Price</span>
                      <span className="text-2xl text-primary font-bold">{product.price}</span>
                    </div>

                    {/* Showroom specs & whatsapp actions */}
                    <div className="grid grid-cols-2 gap-3.5 pt-2">
                      <Link
                        to={`/product/${product.id}`}
                        data-testid={`view-detail-${product.id}`}
                        className="border border-[#2B2621] dark:border-light/20 text-[#2B2621] dark:text-light hover:bg-[#2B2621] hover:text-white dark:hover:bg-light dark:hover:text-[#2B2621] py-3.5 text-center text-[10px] uppercase tracking-widest font-bold font-sans flex items-center justify-center gap-1.5 transition-all duration-300 rounded-[12px] min-h-[48px] active:scale-95"
                      >
                        View Specs
                      </Link>
                      <a
                        href={`https://wa.me/919821454706?text=Hi%20V.K.%20Furniture%2C%20I%20am%20interested%20in%20enquiring%20about%20"${encodeURIComponent(product.name)}".`}
                        target="_blank"
                        rel="noreferrer"
                        data-testid={`enquire-whatsapp-${product.id}`}
                        className="bg-primary text-white hover:bg-primary-dark py-3.5 flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-widest font-bold font-sans hover:bg-[#8C6A3F] transition-all duration-300 rounded-[12px] min-h-[48px] active:scale-95 shadow-md shadow-primary/20"
                      >
                        <MessageSquare size={14} className="fill-white stroke-none" />
                        Enquire
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-[#3A3028] border border-borderSubtle rounded-[20px]">
            <p className="text-gray-500 font-serif text-lg">No items match your filter criteria.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="mt-4 bg-primary text-white px-6 py-2.5 text-xs uppercase font-sans tracking-widest font-bold border-none cursor-pointer rounded-full min-h-[44px]"
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
