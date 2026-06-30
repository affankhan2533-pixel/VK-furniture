import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, CheckCircle, ShieldCheck, Truck, Heart, Share2, Download, Maximize2, FileText, X, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import SEO from '../components/SEO';
import Furniture3DViewer from '../components/Furniture3DViewer';

const productsData = [
  {
    id: 'royal-sagwan-sofa',
    name: 'Royal Sagwan Sofa Set',
    category: 'Sofas',
    price: 'Direct Factory Rate',
    material: '100% Genuine Teak Wood (Sagwan)',
    images: [
      '/images/sofa-teak.png',
      '/images/sofa-lshape.png'
    ],
    description: 'Our signature heavy-carving teak wood sofa is designed for premium residential spaces and boutique hotel lobbies. Fabricated entirely in-house at our Dharavi workshop, this set features dense hardwood frames resistant to warping and high-density foam seating with premium linen-cotton fabric upholstery.',
    specs: {
      'Structure Wood': 'A-Grade kiln-dried Sagwan (Teak Wood)',
      'Dimensions (3 Seater)': '78" W x 32" D x 36" H (Customizable)',
      'Cushion Foam': '32 Density High Resilience (HR) Foam',
      'Customization': 'Fabric colors, size configuration (1/2/3 Seater, L-Shape)',
      'Wholesale MOQ': '10 Sets minimum for wholesale discounts'
    }
  },
  {
    id: 'lshape-sectional-sofa',
    name: 'L-Shape Teak Sectional Sofa',
    category: 'Sofas',
    price: 'Direct Factory Rate',
    material: 'Premium Sagwan Base & Linen Cushions',
    images: [
      '/images/sofa-lshape.png',
      '/images/sofa-teak.png'
    ],
    description: 'Modern L-shape sectional sofa set featuring deep lounge cushions, solid teak wooden frame support, and customizable stain-resistant fabrics. Perfect for luxury drawing rooms or commercial waiting lobbies.',
    specs: {
      'Structure Wood': 'Premium kiln-seasoned Teak wood frame base',
      'Dimensions (Sectional)': '108" W x 72" D x 34" H (Customizable)',
      'Upholstery': 'Stain-resistant linen blend / Custom velvet colors',
      'Configurations': 'Left-hand facing / Right-hand facing layout options',
      'Wholesale MOQ': '5 Sets minimum'
    }
  },
  {
    id: 'teak-sofa-cum-bed',
    name: 'Teak Wood Sofa-Cum-Bed',
    category: 'Sofas',
    price: 'Direct Factory Rate',
    material: 'Kiln-dried Teak & HR Foam',
    images: [
      '/images/sofa-cumbed.png',
      '/images/sofa-teak.png'
    ],
    description: 'A space-saving wonder handcrafted in heavy solid sagwan wood. Featuring an easy-to-use expandable design that pulls out smoothly to transition from a cozy 3-seater sofa into a double bed.',
    specs: {
      'Structure Wood': 'A-grade Sagwan (Teak Wood)',
      'Dimensions (Sofa Mode)': '76" W x 34" D x 36" H',
      'Dimensions (Bed Mode)': '72" W x 74" L (Pulls out)',
      'Mattress Base': 'High density HR foam base with premium cushioning',
      'Warranty': '5 Years on wooden structure'
    }
  },
  {
    id: 'handcrafted-teak-dining-set',
    name: 'Premium Glass-Top Dining Set (4-Seater)',
    category: 'Tables',
    price: 'Direct Factory Rate',
    material: 'Teak Wood Frame & Temper Glass Top',
    images: [
      '/images/dining-4seater.png',
      '/images/dining-6seater.png'
    ],
    description: 'Elegant 4-seater dining table with premium glass-top and matching upholstered teak chairs. Perfect dining companion handcrafted in deep dark walnut finish.',
    specs: {
      'Structure Wood': 'Genuine Teak wood frame & legs',
      'Table Top': '10mm Tempered Beveled Glass Top',
      'Dimensions': '48" L x 36" W x 30" H (Customizable)',
      'Chairs Upholstery': 'Cream cushioned seats (Fabric customizable)',
      'Wholesale MOQ': '5 Sets minimum'
    }
  },
  {
    id: 'sagwan-dining-6seater',
    name: 'Sagwan Glass-Top Dining Set (6-Seater)',
    category: 'Tables',
    price: 'Direct Factory Rate',
    material: 'Heavy Sagwan Frame & Tempered Glass',
    images: [
      '/images/dining-6seater.png',
      '/images/dining-4seater.png'
    ],
    description: 'A spacious 6-seater sagwan dining suite featuring organic, premium grain hardwood. Finely polished with heat-resistant sealers, perfect for large family dinners or commercial conference layouts.',
    specs: {
      'Structure Wood': 'A-Grade heavy Sagwan wood',
      'Table Top': '12mm Tempered Glass insert with floral wood grid',
      'Dimensions': '72" L x 38" W x 30" H',
      'Chairs': '6 solid teak matching chairs with high back supports',
      'Wholesale MOQ': '5 Sets minimum'
    }
  },
  {
    id: 'traditional-sagwan-bed',
    name: 'Imperial Sagwan Wood Bed',
    category: 'Beds',
    price: 'Direct Factory Rate',
    material: 'Heavy Sagwan Wood Structure',
    images: [
      '/images/king-bed.png',
      '/images/bed-vintage.png'
    ],
    description: 'Crafted with premium selected teak wood boards, the Imperial Sagwan Bed features heavy-gauge joinery. Engineered with manual or hydraulic storage compartments underneath. The headboard displays classic wood grain accents highlighting organic craftsmanship.',
    specs: {
      'Structure Wood': 'Sagwan / Teak wood and marine-grade plywood base',
      'Dimensions': '72" W x 78" L (King Size - Custom sizes available)',
      'Storage Options': 'Box Storage / Hydraulic Lift / No Storage',
      'Finish Options': 'Walnut, Teak Gold, Natural Matte or High Gloss',
      'Wholesale MOQ': '5 Beds minimum'
    }
  },
  {
    id: 'hydraulic-storage-bed',
    name: 'Hydraulic Teak Storage Bed',
    category: 'Beds',
    price: 'Direct Factory Rate',
    material: 'Teak Wood Frame & Plywood Box',
    images: [
      '/images/bed-hydraulic.png',
      '/images/king-bed.png'
    ],
    description: 'Smart modern king-size bed featuring a smooth gas-lift hydraulic mechanism that lifts the mattress easily, revealing a massive, clean storage box underneath. Engineered with heavy-duty metal lift links.',
    specs: {
      'Structure Wood': 'Solid Sagwan border frames & commercial ply box',
      'Hydraulic Lift': 'Premium 120kg gas spring dampers',
      'Dimensions': '72" W x 78" L (King Size)',
      'Headboard': 'Stitch-detailed fabric upholstery with cushion backing',
      'Wholesale MOQ': '5 Beds minimum'
    }
  },
  {
    id: 'vintage-carved-bed',
    name: 'Vintage Hand-Carved Bed',
    category: 'Beds',
    price: 'Direct Factory Rate',
    material: 'Selected Premium Seasoned Teak',
    images: [
      '/images/bed-vintage.png',
      '/images/king-bed.png'
    ],
    description: 'A magnificent classic heritage four-pillar design showcasing detailed hand-carvings on the headboard and posts, done by skilled local artisans. Seasoned over months to prevent warping.',
    specs: {
      'Structure Wood': '100% Premium Seasoned Teak Wood (Sagwan)',
      'Dimensions': '72" W x 78" L (King Size)',
      'Polish Finish': 'Natural warm honey wax finish / Melamine matte',
      'Joinery': 'Traditional wood-to-wood mortise & tenon joints',
      'Wholesale MOQ': '3 Beds minimum'
    }
  },
  {
    id: 'upholstered-accent-armchair',
    name: 'Modern Upholstered Accent Chair',
    category: 'Chairs',
    price: 'Direct Factory Rate',
    material: 'Solid Wood & Stain-Resistant Fabric',
    images: [
      '/images/grey-armchair.png',
      '/images/workshop.png'
    ],
    description: 'Perfect accent seating for offices, lounge bars, hotel rooms, or living spaces. Sleek organic frame structure crafted by master carpenters. Available in deep tones with high durability.',
    specs: {
      'Structure Wood': 'Solid Wood framework with Sagwan accent legs',
      'Dimensions': '30" W x 32" D x 34" H',
      'Cushions': 'Premium linen blend with stain guard protection',
      'MOQ for Bulk': '50 Units (Chairs & Stools)',
      'Customization': 'Polishing shade and fabric color customization available'
    }
  },
  {
    id: 'vintage-wooden-lounge-chair',
    name: 'Vintage Teak Lounge Chair',
    category: 'Chairs',
    price: 'Direct Factory Rate',
    material: 'Premium Sagwan & Natural Rattan Cane',
    images: [
      'https://images.pexels.com/photos/31567149/pexels-photo-31567149.jpeg',
      '/images/grey-armchair.png'
    ],
    description: 'A retro classic celebrating Indian heritage design. The seat and backrest feature natural cane webbing hand-woven by local artisans. The frame is crafted from premium teak wood with smooth hand-turned joints.',
    specs: {
      'Structure Wood': 'Premium seasoned Teak wood frame',
      'Seat/Back': 'Double-woven premium natural Rattan cane',
      'Dimensions': '24" W x 30" D x 28" H',
      'Finish Options': 'Antique Teak, Dark Walnut, Natural Oak',
      'Wholesale MOQ': '20 Units minimum'
    }
  },
  {
    id: 'nesting-accent-tables',
    name: 'Craftsman Nesting Tables',
    category: 'Tables',
    price: 'Direct Factory Rate',
    material: 'Solid Sagwan Wood & Metal Base',
    images: [
      'https://images.pexels.com/photos/37145335/pexels-photo-37145335.jpeg',
      '/images/dining-4seater.png'
    ],
    description: 'A stylish and space-saving set of nested coffee tables. Features natural wooden tops showing live edge grain detailing supported by heavy duty powder-coated structural bases.',
    specs: {
      'Wood Top': '20mm Solid Teak Wood (Sagwan)',
      'Base Frame': 'Sleek metal with rustproof brass finish',
      'Dimensions (Large)': '24" Dia x 20" H',
      'Dimensions (Medium)': '18" Dia x 18" H',
      'Dimensions (Small)': '14" Dia x 16" H'
    }
  }
];

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [show3D, setShow3D] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteFormData, setQuoteFormData] = useState({ name: '', phone: '', note: '' });
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);
  const [quoteError, setQuoteError] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const API = `${BACKEND_URL}/api`;

  const handleAddToCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('vk_cart') || '[]');
    const exists = savedCart.find(item => item.id === product.id);
    let updatedCart = [...savedCart];
    
    const approx_prices = {
      "handcrafted-teak-sofa": 45000,
      "l-shape-sectional-sofa": 65000,
      "modern-sofa-cum-bed": 38000,
      "handcrafted-teak-dining-set": 48000,
      "royal-hydraulic-bed": 55000,
      "vintage-carved-bed": 60000,
      "upholstered-accent-armchair": 18000
    };
    const price = approx_prices[product.id] || 35000;

    if (exists) {
      updatedCart = savedCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
    } else {
      updatedCart.push({
        id: product.id,
        name: product.name,
        price: price,
        image: productImages[0],
        quantity: 1
      });
    }
    
    localStorage.setItem('vk_cart', JSON.stringify(updatedCart));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  useEffect(() => {
    // 1. Fallback from local static products array
    const foundProduct = productsData.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setActiveImage(foundProduct.images[0]);
    }
    setShow3D(false);
    
    const wishlist = JSON.parse(localStorage.getItem('vk_wishlist') || '[]');
    setIsWishlisted(wishlist.includes(id));

    // 2. Fetch from database API
    const fetchProductFromApi = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/products/${id}`);
        if (response.data) {
          setProduct(response.data);
          const imgs = response.data.images || [response.data.image];
          setActiveImage(imgs[0]);
        }
      } catch (err) {
        console.error("Failed to load product details from server:", err);
      }
    };
    fetchProductFromApi();
  }, [id, BACKEND_URL]);

  if (!product) {
    return (
      <div className="bg-cream py-20 text-center">
        <h2 className="font-serif text-2xl text-espresso">Product not found</h2>
        <Link to="/catalog" className="mt-4 inline-block bg-teak text-cream px-6 py-2.5 text-sm uppercase tracking-wider font-semibold">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const productImages = product.images || [product.image || '/images/workshop.png'];

  const toggleWishlist = () => {
    let wishlist = JSON.parse(localStorage.getItem('vk_wishlist') || '[]');
    if (wishlist.includes(product.id)) {
      wishlist = wishlist.filter(item => item !== product.id);
      setIsWishlisted(false);
    } else {
      wishlist.push(product.id);
      setIsWishlisted(true);
    }
    localStorage.setItem('vk_wishlist', JSON.stringify(wishlist));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} from V.K. Furniture`,
        url: window.location.href,
      }).catch(err => console.error(err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2500);
    }
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    if (!quoteFormData.name || !quoteFormData.phone) {
      setQuoteError('Name and Phone numbers are required.');
      return;
    }
    setQuoteSubmitting(true);
    setQuoteError('');
    try {
      const response = await axios.post(`${API}/enquiries`, {
        name: quoteFormData.name,
        phone: quoteFormData.phone,
        email: '',
        subject: `Quote Request: ${product.name}`,
        message: `Quote Request for ${product.name}. Special Requests: ${quoteFormData.note || 'None'}`
      });
      if (response.status === 201) {
        setQuoteSuccess(true);
        setQuoteFormData({ name: '', phone: '', note: '' });
      }
    } catch (err) {
      console.error(err);
      const serverMsg = err.response?.data?.detail || 'Failed to submit quote request. Please try again.';
      setQuoteError(serverMsg);
    } finally {
      setQuoteSubmitting(false);
    }
  };

  const queryText = `Hi V.K. Furniture, I am interested in details and pricing for "${product.name}" (ID: ${product.id}). Can you please share the lead times and custom specifications?`;
  const whatsappUrl = `https://wa.me/919821454706?text=${encodeURIComponent(queryText)}`;

  const relatedProducts = productsData
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": productImages.map(img => img.startsWith('http') ? img : `https://vk-furniture.vercel.app${img}`),
    "description": product.description,
    "material": product.material,
    "category": product.category,
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": "Wholesale Direct Pricing",
      "offerCount": 1
    }
  };

  const woodType = product.material.toLowerCase().includes("teak") || product.material.toLowerCase().includes("sagwan") 
    ? "Genuine Seasoned Teak (Sagwan) Wood" 
    : "Premium Solid Hardwood";

  const dimensions = product.specs["Dimensions"] || product.specs["Dimensions (Large)"] || product.specs["Size"] || "Custom Sized to Order";

  return (
    <div className="bg-cream py-12 fade-in">
      <SEO
        title={`${product.name} Specs & Custom Pricing | V.K. Furniture`}
        description={`Get detailed dimensions, wood finish types, cushion foam densities, and B2B wholesale pricing for ${product.name}. Handcrafted in premium Sagwan teak.`}
        ogImage={productImages[0]}
        schema={productSchema}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/catalog"
            data-testid="back-to-catalog"
            className="inline-flex items-center gap-2 text-stone hover:text-teak transition-colors text-sm uppercase tracking-wider font-bold"
          >
            <ArrowLeft size={16} />
            Back to Catalog
          </Link>

          <div className="flex items-center gap-3 relative">
            <button
              onClick={toggleWishlist}
              data-testid="wishlist-btn"
              className={`p-2.5 border transition-all ${
                isWishlisted 
                  ? 'bg-red-50 border-red-200 text-red-500' 
                  : 'bg-white border-borderSubtle text-stone hover:text-espresso'
              }`}
              title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>

            <button
              onClick={handleShare}
              data-testid="share-btn"
              className="p-2.5 border bg-white border-borderSubtle text-stone hover:text-espresso transition-all relative"
              title="Share Product"
            >
              <Share2 size={18} />
              {showShareTooltip && (
                <span className="absolute bottom-full right-0 mb-2 px-2.5 py-1 bg-espresso text-cream text-[10px] uppercase tracking-widest font-sans whitespace-nowrap shadow-md">
                  Link Copied!
                </span>
              )}
            </button>

            <a
              href="/catalogue.pdf"
              download="VK_Furniture_Catalogue.pdf"
              data-testid="download-catalogue-btn"
              className="p-2.5 border bg-white border-borderSubtle text-stone hover:text-espresso transition-all"
              title="Download Catalogue PDF"
            >
              <Download size={18} />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white border border-borderSubtle p-6 md:p-12">
          
          <div className="lg:col-span-6 flex flex-col space-y-4">
            <div className="h-[400px] md:h-[500px] border border-borderSubtle bg-parchment overflow-hidden relative">
              {show3D ? (
                <Furniture3DViewer category={product.category} />
              ) : (
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
              
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <button
                  onClick={() => setShow3D(!show3D)}
                  data-testid="toggle-3d-btn"
                  className="bg-espresso text-cream hover:bg-brass hover:text-white transition-all duration-300 py-2 px-4 text-xs font-sans font-bold tracking-widest uppercase border border-borderSubtle shadow-md cursor-pointer"
                >
                  {show3D ? 'View Photos' : 'Interactive 3D'}
                </button>
                {!show3D && (
                  <button
                    onClick={() => setShowZoom(true)}
                    data-testid="zoom-btn"
                    className="p-2 bg-white text-espresso hover:bg-parchment border border-borderSubtle shadow-md transition-colors"
                    title="Zoom Image"
                  >
                    <Maximize2 size={16} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex gap-4">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveImage(img);
                    setShow3D(false);
                  }}
                  data-testid={`thumb-${index}`}
                  className={`w-24 h-24 border overflow-hidden bg-parchment transition-all ${
                    activeImage === img && !show3D ? 'border-teak scale-95 border-2' : 'border-borderSubtle opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col text-left space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-brass font-bold font-sans block mb-1">
                {product.category}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-espresso leading-none">
                {product.name}
              </h1>
            </div>

            <div className="text-sm font-semibold text-teak font-sans">
              Pricing: <span className="text-lg font-bold">{product.price}</span>
            </div>

            <p className="text-stone font-sans text-base leading-relaxed border-b border-cream pb-6">
              {product.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-cream pb-6 text-sm">
              <div className="flex flex-col space-y-1">
                <span className="text-stone-500 font-sans text-xs uppercase tracking-wider">Wood Type</span>
                <span className="font-sans font-bold text-espresso">{woodType}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-stone-500 font-sans text-xs uppercase tracking-wider">Dimensions</span>
                <span className="font-sans font-bold text-espresso">{dimensions}</span>
              </div>
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-espresso mb-4">Specifications</h3>
              <div className="border border-borderSubtle overflow-hidden">
                <table className="min-w-full divide-y divide-borderSubtle font-sans text-sm">
                  <tbody className="divide-y divide-borderSubtle bg-white">
                    <tr className="bg-parchment/30">
                      <td className="px-4 py-3 font-semibold text-espresso w-1/3">Material</td>
                      <td className="px-4 py-3 text-stone">{product.material}</td>
                    </tr>
                    {Object.entries(product.specs).map(([key, val]) => (
                      <tr key={key}>
                        <td className="px-4 py-3 font-semibold text-espresso">{key}</td>
                        <td className="px-4 py-3 text-stone">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="flex flex-col items-center p-3 border border-borderSubtle bg-cream/40 text-center">
                <ShieldCheck className="text-teak mb-1" size={20} />
                <span className="text-[10px] uppercase font-bold text-espresso tracking-wider">Quality Checked</span>
              </div>
              <div className="flex flex-col items-center p-3 border border-borderSubtle bg-cream/40 text-center">
                <CheckCircle className="text-teak mb-1" size={20} />
                <span className="text-[10px] uppercase font-bold text-espresso tracking-wider">Custom Sizing</span>
              </div>
              <div className="flex flex-col items-center p-3 border border-borderSubtle bg-cream/40 text-center">
                <Truck className="text-teak mb-1" size={20} />
                <span className="text-[10px] uppercase font-bold text-espresso tracking-wider">Mumbai Delivery</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                data-testid="enquire-whatsapp-detail"
                className="bg-[#25D366] text-white py-4 text-center text-sm uppercase tracking-widest font-bold font-sans hover:bg-[#20ba5a] transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare size={18} className="fill-white stroke-none" />
                WhatsApp Enquiry
              </a>
              <button
                onClick={handleAddToCart}
                data-testid="add-to-cart-detail"
                className="bg-espresso text-cream py-4 text-center text-sm uppercase tracking-widest font-bold font-sans hover:bg-teak transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
              >
                <ShoppingBag size={18} />
                {addedToCart ? 'Added to Cart!' : 'Add to Shopping Cart'}
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowQuoteModal(true)}
                data-testid="request-quote-detail"
                className="w-full bg-teak text-cream py-3 text-center text-xs uppercase tracking-widest font-bold font-sans hover:bg-walnut transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
              >
                <FileText size={16} />
                Request Custom Quote
              </button>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16 text-left border-t border-borderSubtle pt-12">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-espresso mb-8">Related Collections</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map(p => (
                <div key={p.id} className="bg-white border border-borderSubtle flex flex-col group overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <div className="h-[240px] overflow-hidden relative border-b border-borderSubtle bg-parchment">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-5 flex flex-col flex-grow text-left space-y-2.5">
                    <h3 className="font-serif text-xl font-bold text-espresso">{p.name}</h3>
                    <p className="text-xs text-brass font-bold uppercase tracking-wider">{p.material}</p>
                    <Link to={`/product/${p.id}`} className="mt-4 bg-teak text-cream py-2.5 text-center text-xs uppercase tracking-widest font-bold font-sans hover:bg-walnut transition-all">
                      View Specs
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showZoom && (
        <div className="fixed inset-0 bg-espresso/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setShowZoom(false)}
            className="absolute top-6 right-6 text-cream/80 hover:text-white p-2 hover:bg-white/10 transition-colors cursor-pointer"
            title="Close Zoom"
          >
            <X size={28} />
          </button>
          <div className="max-w-4xl max-h-[85vh] overflow-hidden border border-borderSubtle shadow-2xl">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}

      {showQuoteModal && (
        <div className="fixed inset-0 bg-espresso/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full border border-borderSubtle shadow-2xl p-6 md:p-8 relative">
            <button
              onClick={() => {
                setShowQuoteModal(false);
                setQuoteSuccess(false);
                setQuoteError('');
              }}
              className="absolute top-4 right-4 text-stone hover:text-espresso p-1.5 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X size={20} />
            </button>

            {quoteSuccess ? (
              <div className="text-center py-6 space-y-4">
                <CheckCircle className="text-emerald-500 mx-auto" size={48} />
                <h3 className="font-serif text-2xl font-bold text-espresso">Quote Request Sent!</h3>
                <p className="text-sm text-stone font-sans">
                  Thank you! We have received your specifications. Our craftsman team will contact you back shortly.
                </p>
                <button
                  onClick={() => {
                    setShowQuoteModal(false);
                    setQuoteSuccess(false);
                  }}
                  className="bg-teak text-cream px-6 py-2.5 text-xs font-sans font-bold tracking-widest uppercase hover:bg-walnut"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-4 text-left">
                <h3 className="font-serif text-2xl font-bold text-espresso leading-none mb-1">
                  Request Custom Quote
                </h3>
                <p className="text-stone font-sans text-xs mb-4">
                  Fill in your custom sizes, fabric type, or requests for **{product.name}**.
                </p>

                {quoteError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-sans">
                    {quoteError}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-stone font-sans">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={quoteFormData.name}
                    onChange={(e) => setQuoteFormData({ ...quoteFormData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-cream/40 border border-borderSubtle font-sans text-sm focus:outline-none focus:border-teak text-espresso"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-stone font-sans">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 098214 54706"
                    value={quoteFormData.phone}
                    onChange={(e) => setQuoteFormData({ ...quoteFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-cream/40 border border-borderSubtle font-sans text-sm focus:outline-none focus:border-teak text-espresso"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-stone font-sans">Custom Requirements (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="E.g., custom sizes, wood polish tone preference, cushion foam type..."
                    value={quoteFormData.note}
                    onChange={(e) => setQuoteFormData({ ...quoteFormData, note: e.target.value })}
                    className="w-full px-3 py-2 bg-cream/40 border border-borderSubtle font-sans text-sm focus:outline-none focus:border-teak text-espresso resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={quoteSubmitting}
                  className="w-full bg-teak text-cream py-3.5 text-xs font-sans font-bold tracking-widest uppercase hover:bg-walnut transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
                >
                  {quoteSubmitting ? 'Submitting Quote Request...' : 'Send Quote Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
