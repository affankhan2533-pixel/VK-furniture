import React from 'react';
import { Truck, RotateCcw, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import SEO from '../components/SEO';

const ShippingReturns = () => {
  return (
    <div className="bg-cream py-12 text-espresso font-sans fade-in">
      <SEO
        title="Shipping & Returns Policy | V.K. Furniture"
        description="Verify delivery timelines, logistics options, custom carving exemptions, and ready-made item return policies."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">
        
        {/* Header */}
        <div className="border-b border-borderSubtle pb-6">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-espresso leading-none">
            Shipping & Returns Policy
          </h1>
          <span className="font-devanagari text-lg text-brass mt-1 block tracking-wider font-semibold">
            शिपिंग और वापसी नीति
          </span>
        </div>

        {/* Shipping details */}
        <div className="bg-white border border-borderSubtle p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-cream pb-4">
            <Truck className="text-teak" size={28} />
            <div>
              <h3 className="font-serif text-xl font-bold text-espresso">Shipping & Logistics Guidelines</h3>
              <span className="text-[10px] text-stone uppercase tracking-wider font-bold block">Delivery timelines & options</span>
            </div>
          </div>

          <div className="space-y-4 text-sm text-stone leading-relaxed">
            <p>
              V.K. Furniture values safe and secure transport of heavy solid wood masterpiece articles. All pieces are wrapped in multi-layered heavy-gauge bubble sheets and corrugated sheets to prevent polishing scratches during transit.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="border border-cream p-4 bg-parchment/10">
                <h4 className="font-bold text-espresso text-xs uppercase tracking-wider mb-2">Mumbai Local Shipping</h4>
                <p className="text-xs">
                  We deploy private tempo logistics from our workshop in Dharavi, Mumbai. Local delivery within Mumbai is typically fulfilled within 24-48 hours once fabrication is complete. Free pick-up option is always available directly from our workshop.
                </p>
              </div>
              <div className="border border-cream p-4 bg-parchment/10">
                <h4 className="font-bold text-espresso text-xs uppercase tracking-wider mb-2">Interstate Cargo Delivery</h4>
                <p className="text-xs">
                  Heavy logistics freight carriers deliver to major cities outside Maharashtra. Transit times vary from 5 to 10 working days depending on destination. Extra octroi/freight charges are calculated during checkout.
                </p>
              </div>
            </div>

            <div className="flex gap-2 items-start bg-cream/40 p-4 border-l-4 border-brass">
              <ShieldCheck className="text-brass flex-shrink-0 mt-0.5" size={16} />
              <p className="text-xs text-stone-700">
                All transit freights are fully insured. Customers are advised to inspect items upon receipt and report any transit damage immediately for replacement claims.
              </p>
            </div>
          </div>
        </div>

        {/* Returns details */}
        <div className="bg-white border border-borderSubtle p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-cream pb-4">
            <RotateCcw className="text-teak" size={28} />
            <div>
              <h3 className="font-serif text-xl font-bold text-espresso">Refunds & Cancellation Policy</h3>
              <span className="text-[10px] text-stone uppercase tracking-wider font-bold block">Exemptions & claim procedures</span>
            </div>
          </div>

          <div className="space-y-4 text-sm text-stone leading-relaxed">
            
            <div className="space-y-2">
              <h4 className="font-bold text-espresso text-sm">Ready-Stock Catalog Items:</h4>
              <p className="text-xs">
                We accept returns for stock catalog items within **7 days** of delivery. Items must be in original unused condition and packaging. A standard 15% restocking log charge applies, and return shipping costs are covered by the buyer.
              </p>
            </div>

            <div className="space-y-2 border-t border-cream pt-4">
              <h4 className="font-bold text-espresso text-sm flex items-center gap-1.5">
                <AlertTriangle className="text-amber-500" size={16} /> Custom Fabrication Exemptions:
              </h4>
              <p className="text-xs text-stone-700">
                Please note that all custom orders, personalized modifications (e.g. customized sizing widths, density selections, special carving engravings, specific varnish polish shades) are **non-returnable and non-refundable** once carving starts. These are built bespoke to customer specifications.
              </p>
            </div>

            <div className="space-y-2 border-t border-cream pt-4">
              <h4 className="font-bold text-espresso text-sm flex items-center gap-1.5">
                <HelpCircle className="text-teak" size={16} /> How to Initiate a Return or Claim?
              </h4>
              <p className="text-xs">
                To file a claim or report transit damages, please contact us over call at **+91 99306 68406** or email us at **riteshsharma9930@gmail.com** with your order number, photos of the invoice sheet, and detailed images showing the concerns. We resolve claims within 3 working days.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ShippingReturns;
