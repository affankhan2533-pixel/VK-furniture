import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, MessageSquare } from 'lucide-react';
import SEO from '../components/SEO';

const productsData = [
  {
    id: 'royal-sagwan-sofa',
    name: 'Royal Sagwan Sofa Set',
    category: 'Sofas',
    price: 'Direct Wholesale Price',
    material: '100% Genuine Teak Wood (Sagwan)',
    image: '/images/sofa-teak.png',
    description: 'Luxurious heavy-carving teak wood framework sofa set with high-density foam cushioning. Highly durable and custom sizing available.'
  },
  {
    id: 'lshape-sectional-sofa',
    name: 'L-Shape Teak Sectional Sofa',
    category: 'Sofas',
    price: 'Wholesale Fabricated Price',
    material: 'Premium Sagwan Base & Linen Cushions',
    image: '/images/sofa-lshape.png',
    description: 'Modern L-shape sectional sofa set featuring deep lounge cushions, solid teak wooden frame support, and customizable fabrics.'
  },
  {
    id: 'teak-sofa-cum-bed',
    name: 'Teak Wood Sofa-Cum-Bed',
    category: 'Sofas',
    price: 'Direct Factory Rate',
    material: 'kiln-dried Teak & HR Foam',
    image: '/images/sofa-cumbed.png',
    description: 'Versatile space-saving sofa-cum-bed handcrafted in solid sagwan. Easily expands into a double bed, perfect for compact spaces.'
  },
  {
    id: 'handcrafted-teak-dining-set',
    name: 'Premium Glass-Top Dining Set (4-Seater)',
    category: 'Tables',
    price: 'Wholesale Fabricated Price',
    material: 'Teak Wood Frame & Temper Glass Top',
    image: '/images/dining-4seater.png',
    description: 'Elegant 4-seater dining table with premium glass-top and matching upholstered teak chairs. Dark walnut finish.'
  },
  {
    id: 'sagwan-dining-6seater',
    name: 'Sagwan Glass-Top Dining Set (6-Seater)',
    category: 'Tables',
    price: 'Wholesale Fabricated Price',
    material: 'Heavy Sagwan Frame & Tempered Glass',
    image: '/images/dining-6seater.png',
    description: 'A spacious 6-seater sagwan dining suite with heavy teak frames, natural grain finish, and sturdy tempered glass top.'
  },
  {
    id: 'traditional-sagwan-bed',
    name: 'Imperial Sagwan Wood Bed',
    category: 'Beds',
    price: 'Direct Wholesale Price',
    material: 'Premium Sag Wood Frame',
    image: '/images/king-bed.png',
    description: 'Sturdy king-size bed handcrafted with premium grain sagwood. Built to last for generations with custom storage options.'
  },
  {
    id: 'hydraulic-storage-bed',
    name: 'Hydraulic Teak Storage Bed',
    category: 'Beds',
    price: 'Wholesale Fabricated Price',
    material: 'Teak Wood Frame & Plywood Box',
    image: '/images/bed-hydraulic.png',
    description: 'Smart king-size bed with a smooth gas-lift hydraulic storage mechanism, heavy-gauge solid wood framework, and modern headboard.'
  },
  {
    id: 'vintage-carved-bed',
    name: 'Vintage Hand-Carved Bed',
    category: 'Beds',
    price: 'Direct Wholesale Price',
    material: 'Selected Premium Seasoned Teak',
    image: '/images/bed-vintage.png',
    description: 'Classic heritage four-pillar design featuring ornate floral wood carvings on the headboard and posts. Polished natural honey shade.'
  },
  {
    id: 'upholstered-accent-armchair',
    name: 'Modern Upholstered Accent Chair',
    category: 'Chairs',
    price: 'MOQ: 50 Units for Bulk pricing',
    material: 'Walnut Finish Legs & Premium Fabric',
    image: '/images/grey-armchair.png',
    description: 'Chic lounge armchair featuring modern curved aesthetics, walnut-finished wood frame, and premium stain-resistant upholstery.'
  },
  {
    id: 'vintage-wooden-lounge-chair',
    name: 'Vintage Teak Lounge Chair',
    category: 'Chairs',
    price: 'Wholesale and Retail Price',
    material: 'Reclaimed Teak & Hand-woven Cane',
    image: 'https://images.pexels.com/photos/31567149/pexels-photo-31567149.jpeg',
    description: 'Traditional Indian style armchair with organic woven cane backing and teakwood frame. Extremely comfortable and premium quality.'
  },
  {
    id: 'nesting-accent-tables',
    name: 'Craftsman Nesting Tables',
    category: 'Tables',
    price: 'Wholesale Fabricated Price',
    material: 'Teak Wood & Powder Coated Metal',
    image: 'https://images.pexels.com/photos/37145335/pexels-photo-37145335.jpeg',
    description: 'Set of three nesting tables perfect for side tables, accent décor, or coffee service. Sturdy structures custom manufactured.'
  }
];

const categories = ['All', 'Sofas', 'Chairs', 'Tables', 'Beds'];

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';
  
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(productsData);

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    let result = productsData;
    
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
  }, [selectedCategory, searchQuery]);

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
    <div className="bg-cream py-12 fade-in">
      <SEO
        title="Wooden Collections Catalog | V.K. Furniture Mumbai"
        description="Browse our full B2B furniture catalog. High-grade teakwood (sagwan) sofa sets, glass-top dining tables, storage beds, and accent chairs direct from our workshop."
        schema={catalogSchema}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-left border-b border-borderSubtle pb-8 mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-espresso leading-none">
            Our Masterpieces
          </h1>
          <span className="font-devanagari text-lg text-brass mt-1 block tracking-wider font-semibold">
            कस्टम और थोक फर्नीचर संग्रह
          </span>
          <p className="text-stone font-sans text-sm max-w-xl mt-3">
            Handcrafted with premium Sagwan (teak) wood in our Dharavi workshop. We offer bulk wholesaling and custom sizing adjustments.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Filter size={16} className="text-stone flex-shrink-0 mr-1" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                data-testid={`category-chip-${cat.toLowerCase()}`}
                className={`px-5 py-2 border font-sans text-sm tracking-wider uppercase transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-teak text-cream border-teak'
                    : 'bg-white text-stone border-borderSubtle hover:border-teak'
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
              className="w-full pl-10 pr-4 py-3 bg-white border border-borderSubtle font-sans text-sm focus:outline-none focus:border-teak text-espresso placeholder-stone/60"
            />
            <Search className="absolute left-3.5 top-3.5 text-stone" size={16} />
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                data-testid={`product-card-${product.id}`}
                className="bg-white border border-borderSubtle flex flex-col group overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 reveal glass-hover-card"
              >
                {/* Image */}
                <div className="h-[280px] overflow-hidden relative border-b border-borderSubtle bg-parchment image-reveal active">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 furniture-card-img"
                  />
                  <div className="absolute top-4 left-4 bg-teak text-cream px-3 py-1 text-xs uppercase tracking-wider font-semibold">
                    {product.category}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex flex-col flex-grow text-left space-y-3">
                  <h3 className="font-serif text-xl md:text-2xl font-semibold text-espresso">
                    {product.name}
                  </h3>
                  
                  <p className="text-xs uppercase tracking-wider text-brass font-bold">
                    {product.material}
                  </p>

                  <p className="text-stone font-sans text-sm leading-relaxed flex-grow">
                    {product.description}
                  </p>

                  <div className="text-sm font-semibold text-teak font-sans pt-2 border-t border-cream">
                    {product.price}
                  </div>

                  {/* CTAs */}
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <Link
                      to={`/product/${product.id}`}
                      data-testid={`view-detail-${product.id}`}
                      className="border border-teak text-teak py-3 text-center text-xs uppercase tracking-wider font-bold font-sans hover:bg-teak hover:text-white transition-colors duration-300"
                    >
                      View Specs
                    </Link>
                    <a
                      href={`https://wa.me/919821454706?text=Hi%20V.K.%20Furniture%2C%20I%20am%20interested%20in%20enquiring%20about%20"${encodeURIComponent(product.name)}".`}
                      target="_blank"
                      rel="noreferrer"
                      data-testid={`enquire-whatsapp-${product.id}`}
                      className="bg-[#25D366] text-white py-3 flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider font-bold font-sans hover:bg-[#20ba5a] transition-colors duration-300"
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
          <div className="text-center py-20 bg-white border border-borderSubtle">
            <p className="text-stone font-serif text-xl">No items match your filter criteria.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="mt-4 bg-teak text-cream px-6 py-2 text-xs uppercase font-sans tracking-wider"
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
