import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, CheckCircle, ShieldCheck, Heart, Share2, Download, Maximize2, FileText, X, ShoppingBag, Star, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [customSize, setCustomSize] = useState('Standard');
  const [customFinish, setCustomFinish] = useState('Natural');
  const [customFabric, setCustomFabric] = useState('Linen');
  const [customPolish, setCustomPolish] = useState('Matte');
  const [activeFaq, setActiveFaq] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const API = `${BACKEND_URL}/api`;


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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowZoom(false);
        setShowQuoteModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
  const whatsappUrl = `https://wa.me/919930668406?text=${encodeURIComponent(queryText)}`;

  const relatedProducts = productsData
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const woodType = product.material.toLowerCase().includes("teak") || product.material.toLowerCase().includes("sagwan") 
    ? "Genuine Seasoned Teak (Sagwan) Wood" 
    : "Premium Solid Hardwood";

  const dimensions = product.specs["Dimensions"] || product.specs["Dimensions (Large)"] || product.specs["Size"] || "Custom Sized to Order";

  const faqs = [
    { q: "How does delivery work?", a: "We provide expert in-house white-glove delivery across the Mumbai region. Delivery is fully handled by our craftsman staff to avoid handling damage." },
    { q: "What is the warranty policy?", a: "All V.K. Furniture structures are covered under our 5-year solid wood structure warranty. This covers cracking, joint split, or warping." },
    { q: "Can I customize the sizing?", a: "Yes, since we manufacture everything in our Dharavi facility, you can customize the height, width, and depth to match your specific layout requirements." },
    { q: "What are the payment options?", a: "We accept digital bank transfers, cards, UPI, and customized billing accounts for hotel developers or commercial B2B dealers." },
    { q: "How do I maintain Sagwan wood?", a: "Simply wipe down with a soft damp lint-free cloth. Avoid harsh chemical cleaners. Apply natural wood oils once a year to keep the polish fresh." }
  ];

  const reviewsList = [
    { name: "Rajesh M.", date: "June 2026", text: "The Sagwan frame quality is exceptional. Heavy wood and precise handcrafting. Highly recommend VK Furniture for bulk hotel projects.", rating: 5 },
    { name: "Priya S.", date: "May 2026", text: "Customized our L-shape sofa size to fit our corner window. Fabric options are premium, and white glove delivery was seamless.", rating: 5 }
  ];

  const productGraphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
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
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://vk-furniture.vercel.app"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Catalog",
            "item": "https://vk-furniture.vercel.app/catalog"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": product.name,
            "item": `https://vk-furniture.vercel.app/product/${product.id}`
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
          }
        }))
      }
    ]
  };

  return (
    <div className="bg-light py-16 text-dark fade-in transition-colors duration-300">
      <SEO
        title={`${product.name} Specs & Custom Pricing | V.K. Furniture`}
        description={`Get detailed dimensions, wood finish types, cushion foam densities, and B2B wholesale pricing for ${product.name}. Handcrafted in premium Sagwan teak.`}
        ogImage={productImages[0]}
        schema={productGraphSchema}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation & Share utility bar */}
        <div className="flex justify-between items-center mb-8 border-b border-borderSubtle pb-4">
          <Link
            to="/catalog"
            data-testid="back-to-catalog"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors text-xs uppercase tracking-widest font-bold"
          >
            <ArrowLeft size={16} />
            Back to Catalog
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleWishlist}
              data-testid="wishlist-btn"
              className={`p-2.5 border transition-all rounded-full cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center ${
                isWishlisted 
                  ? 'bg-red-50 dark:bg-red-950/20 border-red-200 text-red-500' 
                  : 'bg-white dark:bg-[#3A3028] border-borderSubtle text-gray-500 hover:text-primary'
              }`}
              title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>

            <button
              onClick={handleShare}
              data-testid="share-btn"
              className="p-2.5 border bg-white dark:bg-[#3A3028] border-borderSubtle text-gray-500 hover:text-primary transition-all rounded-full cursor-pointer relative min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Share Product"
              aria-label="Share Product Link"
            >
              <Share2 size={18} />
              {showShareTooltip && (
                <span className="absolute bottom-full right-0 mb-2 px-2.5 py-1 bg-dark text-white text-[10px] uppercase tracking-widest font-sans whitespace-nowrap shadow-md">
                  Link Copied!
                </span>
              )}
            </button>

            <a
              href="/catalogue.pdf"
              download="VK_Furniture_Catalogue.pdf"
              data-testid="download-catalogue-btn"
              className="p-2.5 border bg-white dark:bg-[#3A3028] border-borderSubtle text-gray-500 hover:text-primary transition-all rounded-full cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Download Catalogue PDF"
              aria-label="Download Product Catalogue PDF"
            >
              <Download size={18} />
            </a>
          </div>
        </div>

        {/* 2-Column Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Gallery Column */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="h-[360px] sm:h-[450px] md:h-[520px] rounded-[20px] border border-borderSubtle bg-parchment overflow-hidden relative shadow-sm group">
              {show3D ? (
                <Furniture3DViewer category={product.category} />
              ) : (
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover scale-100 group-hover:scale-[1.05] transition-transform duration-500 ease-out brightness-[1.03]"
                  fetchPriority="high"
                  loading="eager"
                />
              )}
              
              {/* Image Controls Overlay */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <button
                  onClick={() => setShow3D(!show3D)}
                  data-testid="toggle-3d-btn"
                  className="bg-espresso text-cream hover:bg-primary hover:text-white transition-all duration-300 py-2.5 px-4 text-[10px] font-sans font-bold tracking-widest uppercase border border-white/10 shadow-lg cursor-pointer rounded-full min-h-[44px]"
                >
                  {show3D ? 'View Photos' : 'Interactive 3D'}
                </button>
                {!show3D && (
                  <button
                    onClick={() => setShowZoom(true)}
                    data-testid="zoom-btn"
                    className="p-2.5 bg-white text-espresso hover:bg-parchment border border-borderSubtle shadow-md transition-colors rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center"
                    title="Zoom Image"
                    aria-label="Zoom Product Image"
                  >
                    <Maximize2 size={16} />
                  </button>
                )}
              </div>
            </div>
            
            {/* Thumbnails list - Swipe Friendly on Mobile */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveImage(img);
                    setShow3D(false);
                  }}
                  data-testid={`thumb-${index}`}
                  className={`w-20 h-20 md:w-24 md:h-24 rounded-[12px] border overflow-hidden bg-parchment flex-shrink-0 snap-align-start transition-all cursor-pointer ${
                    activeImage === img && !show3D ? 'border-primary border-2 scale-95 shadow-md shadow-primary/10' : 'border-borderSubtle opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Product Information Column (Sticky for Desktop Viewports) */}
          <div className="lg:col-span-5 flex flex-col text-left space-y-6 lg:sticky lg:top-24 h-fit">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-primary font-bold font-sans block mb-1">
                {product.category}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-espresso dark:text-light leading-tight">
                {product.name}
              </h1>
            </div>

            <div className="text-sm font-semibold text-[#5B5048] dark:text-[#FAF7F2] font-sans pb-4 border-b border-borderSubtle">
              Pricing: <span className="text-2xl font-bold text-primary font-serif ml-1.5">{product.price}</span>
            </div>

            <p className="text-[#5B5048] dark:text-gray-300 font-sans text-sm leading-relaxed">
              {product.description}
            </p>

            {/* Customization Options Section */}
            <div className="space-y-4 py-6 border-y border-borderSubtle">
              <h3 className="font-serif text-lg font-bold text-espresso dark:text-light">Showroom Options</h3>
              
              <div className="space-y-2.5">
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Size Configurations</span>
                <div className="flex gap-2 flex-wrap">
                  {['Standard', 'Compact', 'Grand'].map(sz => (
                    <button
                      key={sz}
                      onClick={() => setCustomSize(sz)}
                      className={`px-4 py-2 text-xs font-sans font-semibold rounded-full border transition-all cursor-pointer ${
                        customSize === sz ? 'bg-primary text-white border-primary' : 'bg-transparent text-gray-500 border-borderSubtle'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Wood Finish Tone</span>
                <div className="flex gap-2 flex-wrap">
                  {['Natural', 'Honey', 'Walnut', 'Charcoal'].map(fn => (
                    <button
                      key={fn}
                      onClick={() => setCustomFinish(fn)}
                      className={`px-4 py-2 text-xs font-sans font-semibold rounded-full border transition-all cursor-pointer ${
                        customFinish === fn ? 'bg-primary text-white border-primary' : 'bg-transparent text-gray-500 border-borderSubtle'
                      }`}
                    >
                      {fn}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Upholstery Fabric</span>
                <div className="flex gap-2 flex-wrap">
                  {['Linen', 'Velvet', 'Cotton'].map(fb => (
                    <button
                      key={fb}
                      onClick={() => setCustomFabric(fb)}
                      className={`px-4 py-2 text-xs font-sans font-semibold rounded-full border transition-all cursor-pointer ${
                        customFabric === fb ? 'bg-primary text-white border-primary' : 'bg-transparent text-gray-500 border-borderSubtle'
                      }`}
                    >
                      {fb}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">Polish Gloss Level</span>
                <div className="flex gap-2 flex-wrap">
                  {['Matte', 'Glossy', 'Satin'].map(pl => (
                    <button
                      key={pl}
                      onClick={() => setCustomPolish(pl)}
                      className={`px-4 py-2 text-xs font-sans font-semibold rounded-full border transition-all cursor-pointer ${
                        customPolish === pl ? 'bg-primary text-white border-primary' : 'bg-transparent text-gray-500 border-borderSubtle'
                      }`}
                    >
                      {pl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                onClick={() => setShowQuoteModal(true)}
                data-testid="request-quote-detail"
                className="w-full bg-[#B08D57] hover:bg-[#8C6A3F] text-white py-4 text-center text-xs uppercase tracking-widest font-bold font-sans transition-all flex items-center justify-center gap-2 cursor-pointer border-none rounded-[12px] min-h-[48px] shadow-lg shadow-primary/10 active:scale-95"
              >
                <FileText size={16} />
                Request Quote
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                data-testid="enquire-whatsapp-detail"
                className="bg-espresso text-white hover:bg-espresso/90 border border-borderSubtle dark:bg-light dark:text-espresso py-4 text-center text-xs uppercase tracking-widest font-bold font-sans transition-all flex items-center justify-center gap-2 rounded-[12px] min-h-[48px] active:scale-95"
              >
                <MessageSquare size={16} className="fill-current stroke-none" />
                Chat on WhatsApp
              </a>
            </div>

            {/* General Specs Summary Grid */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 pt-4 text-xs font-sans border-t border-borderSubtle">
              <div className="flex flex-col space-y-1">
                <span className="text-gray-400 uppercase tracking-widest text-[9px] font-bold">Wood Material</span>
                <span className="font-bold text-espresso dark:text-light">{woodType}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-gray-400 uppercase tracking-widest text-[9px] font-bold">Dimensions</span>
                <span className="font-bold text-espresso dark:text-light">{dimensions}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-gray-400 uppercase tracking-widest text-[9px] font-bold">Availability</span>
                <span className="font-bold text-emerald-500">In Stock (Made-to-order)</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-gray-400 uppercase tracking-widest text-[9px] font-bold">Estimated Delivery</span>
                <span className="font-bold text-espresso dark:text-light">10-14 Days (Mumbai Region)</span>
              </div>
            </div>

          </div>
        </div>

        {/* Feature Highlights Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 py-8 border-y border-borderSubtle my-16 bg-[#2B2621]/5 dark:bg-[#2B2621]/30">
          <div className="flex flex-col items-center text-center p-3">
            <ShieldCheck className="text-primary mb-2" size={24} />
            <span className="text-[10px] uppercase font-bold tracking-wider text-espresso dark:text-light">100% Sagwan Wood</span>
          </div>
          <div className="flex flex-col items-center text-center p-3">
            <CheckCircle className="text-primary mb-2" size={24} />
            <span className="text-[10px] uppercase font-bold tracking-wider text-espresso dark:text-light">Handcrafted Stamp</span>
          </div>
          <div className="flex flex-col items-center text-center p-3">
            <Maximize2 className="text-primary mb-2" size={24} />
            <span className="text-[10px] uppercase font-bold tracking-wider text-espresso dark:text-light">Custom Sizing</span>
          </div>
          <div className="flex flex-col items-center text-center p-3">
            <ShoppingBag className="text-primary mb-2" size={24} />
            <span className="text-[10px] uppercase font-bold tracking-wider text-espresso dark:text-light">Factory Direct Price</span>
          </div>
          <div className="flex flex-col items-center text-center p-3">
            <ShieldCheck className="text-primary mb-2" size={24} />
            <span className="text-[10px] uppercase font-bold tracking-wider text-espresso dark:text-light">Lifetime Durability</span>
          </div>
        </div>

        {/* Dynamic Detail Sections: Specs Table, Reviews, Accordion */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 text-left items-start">
          
          {/* Specifications Table */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="font-serif text-2xl font-bold text-espresso dark:text-light">Technical Specifications</h3>
            <div className="border border-borderSubtle overflow-hidden rounded-[14px] bg-white dark:bg-[#3A3028]">
              <table className="min-w-full divide-y divide-borderSubtle font-sans text-sm">
                <tbody className="divide-y divide-borderSubtle bg-transparent">
                  <tr className="bg-parchment/30">
                    <td className="px-4 py-3.5 font-bold text-espresso dark:text-light w-1/3">Material Base</td>
                    <td className="px-4 py-3.5 text-[#5B5048] dark:text-gray-300">{product.material}</td>
                  </tr>
                  {Object.entries(product.specs).map(([key, val]) => (
                    <tr key={key}>
                      <td className="px-4 py-3.5 font-bold text-espresso dark:text-light">{key}</td>
                      <td className="px-4 py-3.5 text-[#5B5048] dark:text-gray-300">{val}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="px-4 py-3.5 font-bold text-espresso dark:text-light">Assembly Required</td>
                    <td className="px-4 py-3.5 text-[#5B5048] dark:text-gray-300">Free In-home assembly provided</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3.5 font-bold text-espresso dark:text-light">Care Instructions</td>
                    <td className="px-4 py-3.5 text-[#5B5048] dark:text-gray-300">Wipe clean with a damp lint-free cloth.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Customer Reviews block */}
            <div className="space-y-6 pt-6">
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-2xl font-bold text-espresso dark:text-light">Verified Reviews</h3>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#B08D57] bg-primary/10 py-1 px-3.5 rounded-full">Google Verified 4.9 ★</span>
              </div>

              <div className="space-y-4">
                {reviewsList.map((rev, idx) => (
                  <div key={idx} className="bg-white dark:bg-[#3A3028] border border-borderSubtle p-6 rounded-[16px] shadow-sm flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex text-primary gap-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={14} fill="currentColor" />
                        ))}
                      </div>
                      <p className="font-sans text-sm leading-relaxed text-[#5B5048] dark:text-gray-300 italic">"{rev.text}"</p>
                    </div>
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-gray-500 font-bold border-t border-borderSubtle pt-3 mt-4">
                      <span>{rev.name}</span>
                      <span className="text-primary">{rev.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Elegant FAQ Accordion Column */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <h3 className="font-serif text-2xl font-bold text-espresso dark:text-light">Showroom FAQs</h3>
            
            <div className="divide-y divide-borderSubtle border-y border-borderSubtle bg-white dark:bg-[#3A3028] rounded-[16px] p-2">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div key={idx} className="py-3">
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full flex justify-between items-center text-left py-2.5 font-sans font-bold text-sm text-espresso dark:text-light hover:text-primary transition-all bg-transparent border-none cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 max-h-0 ${isOpen ? 'max-h-[140px] mt-2' : ''}`}>
                      <p className="text-xs font-sans leading-relaxed text-[#5B5048] dark:text-gray-300 pb-2">{faq.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Related Collections Horizontal Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 text-left border-t border-borderSubtle pt-12">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-espresso dark:text-light mb-8">Related Collections</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map(p => (
                <div key={p.id} className="bg-white dark:bg-[#3A3028] border border-borderSubtle flex flex-col group overflow-hidden rounded-[20px] shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300">
                  <div className="h-[240px] overflow-hidden relative border-b border-borderSubtle bg-parchment">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover scale-100 group-hover:scale-[1.05] transition-transform duration-500 ease-out" />
                  </div>
                  <div className="p-6 flex flex-col flex-grow text-left space-y-2.5">
                    <h3 className="font-serif text-xl font-bold text-espresso dark:text-light">{p.name}</h3>
                    <p className="text-xs text-primary font-bold uppercase tracking-wider">{p.material}</p>
                    <Link to={`/product/${p.id}`} className="mt-4 bg-primary text-cream py-3 text-center text-xs uppercase tracking-widest font-bold font-sans hover:bg-[#8C6A3F] transition-all rounded-[10px] min-h-[44px] flex items-center justify-center shadow-md shadow-primary/10">
                      View Specs
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Click-to-Enlarge Fullscreen Image Viewer Modal */}
      {showZoom && (
        <div className="fixed inset-0 bg-espresso/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setShowZoom(false)}
            className="absolute top-6 right-6 text-cream/80 hover:text-white p-2 hover:bg-white/10 transition-colors cursor-pointer rounded-full"
            title="Close Zoom"
          >
            <X size={28} />
          </button>
          <div className="max-w-4xl max-h-[85vh] overflow-hidden border border-borderSubtle shadow-2xl rounded-[14px]">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-auto max-h-[80vh] object-contain transition-all duration-300 active:scale-125"
            />
          </div>
        </div>
      )}

      {/* Request Custom Quote Modal Form */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-[#2B2621]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#3A3028] max-w-md w-full border border-borderSubtle shadow-2xl p-6 md:p-8 relative rounded-[20px] text-[#2B2B2B] dark:text-[#F7F3EC]">
            <button
              onClick={() => {
                setShowQuoteModal(false);
                setQuoteSuccess(false);
                setQuoteError('');
              }}
              className="absolute top-4 right-4 text-gray hover:text-espresso dark:hover:text-light p-1.5 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X size={20} />
            </button>

            {quoteSuccess ? (
              <div className="text-center py-6 space-y-4">
                <CheckCircle className="text-emerald-500 mx-auto" size={48} />
                <h3 className="font-serif text-2xl font-bold text-espresso dark:text-light">Quote Request Sent!</h3>
                <p className="text-sm text-stone font-sans">
                  Thank you! We have received your specifications. Our craftsman team will contact you back shortly.
                </p>
                <button
                  onClick={() => {
                    setShowQuoteModal(false);
                    setQuoteSuccess(false);
                  }}
                  className="bg-primary text-white px-6 py-3.5 text-xs font-sans font-bold tracking-widest uppercase hover:bg-primary-dark rounded-full min-h-[44px]"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-4 text-left">
                <h3 className="font-serif text-2xl font-bold text-espresso dark:text-light leading-none mb-1">
                  Request Custom Quote
                </h3>
                <p className="text-gray-500 dark:text-gray-300 font-sans text-xs mb-4">
                  Fill in your custom sizes, fabric type, or requests for **{product.name}**.
                </p>

                {quoteError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-sans">
                    {quoteError}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-[#B08D57] font-sans">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={quoteFormData.name}
                    onChange={(e) => setQuoteFormData({ ...quoteFormData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-cream/40 border border-borderSubtle font-sans text-sm focus:outline-none focus:border-primary text-[#2B2B2B] dark:text-[#F7F3EC] rounded-[10px]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-[#B08D57] font-sans">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 99306 68406"
                    value={quoteFormData.phone}
                    onChange={(e) => setQuoteFormData({ ...quoteFormData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-cream/40 border border-borderSubtle font-sans text-sm focus:outline-none focus:border-primary text-[#2B2B2B] dark:text-[#F7F3EC] rounded-[10px]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-[#B08D57] font-sans">Custom Requirements (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="E.g., custom sizes, wood polish tone preference, cushion fabric choice..."
                    value={quoteFormData.note}
                    onChange={(e) => setQuoteFormData({ ...quoteFormData, note: e.target.value })}
                    className="w-full px-4 py-3 bg-cream/40 border border-borderSubtle font-sans text-sm focus:outline-none focus:border-primary text-[#2B2B2B] dark:text-[#F7F3EC] resize-none rounded-[10px]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={quoteSubmitting}
                  className="w-full bg-[#B08D57] hover:bg-[#8C6A3F] text-white py-3.5 text-xs font-sans font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer border-none rounded-[12px] min-h-[48px]"
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
