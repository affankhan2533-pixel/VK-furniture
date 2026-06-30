import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Phone, CheckCircle, ShieldCheck, Truck } from 'lucide-react';

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

  useEffect(() => {
    const foundProduct = productsData.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setActiveImage(foundProduct.images[0]);
    }
  }, [id]);

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

  const queryText = `Hi V.K. Furniture, I am interested in details and pricing for "${product.name}" (ID: ${product.id}). Can you please share the lead times and custom specifications?`;
  const whatsappUrl = `https://wa.me/919821454706?text=${encodeURIComponent(queryText)}`;

  return (
    <div className="bg-cream py-12 fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="text-left mb-8">
          <Link
            to="/catalog"
            data-testid="back-to-catalog"
            className="inline-flex items-center gap-2 text-stone hover:text-teak transition-colors text-sm uppercase tracking-wider font-bold"
          >
            <ArrowLeft size={16} />
            Back to Catalog
          </Link>
        </div>

        {/* Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white border border-borderSubtle p-6 md:p-12">
          
          {/* Gallery Column */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            <div className="h-[400px] md:h-[500px] border border-borderSubtle bg-parchment overflow-hidden">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-4">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img)}
                  data-testid={`thumb-${index}`}
                  className={`w-24 h-24 border overflow-hidden bg-parchment transition-all ${
                    activeImage === img ? 'border-teak scale-95 border-2' : 'border-borderSubtle opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details Column */}
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

            {/* Specs Table */}
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

            {/* B2B Badges */}
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

            {/* Call to Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                data-testid="enquire-whatsapp-detail"
                className="bg-[#25D366] text-white py-4 text-center text-sm uppercase tracking-widest font-bold font-sans hover:bg-[#20ba5a] transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare size={18} className="fill-white stroke-none" />
                Enquire via WhatsApp
              </a>
              <a
                href="tel:09821454706"
                data-testid="call-now-detail"
                className="bg-teak text-cream py-4 text-center text-sm uppercase tracking-widest font-bold font-sans hover:bg-walnut transition-all flex items-center justify-center gap-2"
              >
                <Phone size={18} />
                Call 098214 54706
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
