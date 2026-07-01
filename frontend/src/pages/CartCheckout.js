import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ShoppingBag, Trash2, Heart, ArrowRight, Percent, ShieldCheck, 
  Printer, CreditCard, CheckCircle2, Truck, RefreshCw, Plus, Minus
} from 'lucide-react';
import SEO from '../components/SEO';

const CartCheckout = () => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  
  // Checkout Form states
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', city: '', pincode: '', shipping: 1500 });
  const [payStep, setPayStep] = useState(0); // 0: Idle, 1: Connecting, 2: Processing, 3: Completed
  const [placedOrder, setPlacedOrder] = useState(null);
  
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

  useEffect(() => {
    // Load Cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem('vk_cart') || '[]');
    setCart(savedCart);
    
    // Load Wishlist from localStorage
    const savedWishlist = JSON.parse(localStorage.getItem('vk_wishlist') || '[]');
    setWishlist(savedWishlist);
  }, []);

  const saveCartToStorage = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem('vk_cart', JSON.stringify(updatedCart));
  };

  // Quantity updates
  const updateQty = (id, delta) => {
    const updated = cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    });
    saveCartToStorage(updated);
  };

  const removeCartItem = (id) => {
    const filtered = cart.filter(item => item.id !== id);
    saveCartToStorage(filtered);
  };

  // Wishlist to Cart operations
  const moveToCart = (item) => {
    // Check if already in cart
    const exists = cart.find(c => c.id === item.id);
    let updatedCart = [...cart];
    if (exists) {
      updatedCart = cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
    } else {
      // Find matching item details or use defaults
      updatedCart.push({
        id: item.id,
        name: item.name || 'Premium Teak Furniture',
        price: 35000, // mock price estimate for standard catalog
        image: item.image || item.src || '/images/workshop.png',
        quantity: 1
      });
    }
    saveCartToStorage(updatedCart);
    
    // Remove from wishlist
    const filteredWish = wishlist.filter(w => w !== item.id);
    setWishlist(filteredWish);
    localStorage.setItem('vk_wishlist', JSON.stringify(filteredWish));
  };

  const applyCheckoutCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    setAppliedCoupon('');
    setDiscountPercent(0);
    const code = couponCode.trim().toUpperCase();
    if (code === 'VKWELCOME10') {
      setDiscountPercent(10);
      setAppliedCoupon('VKWELCOME10');
    } else if (code === 'FESTIVE15') {
      setDiscountPercent(15);
      setAppliedCoupon('FESTIVE15');
    } else {
      setCouponError('Invalid coupon code.');
    }
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const finalTotal = subtotal - discountAmount + Number(form.shipping);

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setPayStep(1);
    
    // Step 1: Simulated Secure Payment handshakes
    setTimeout(() => {
      setPayStep(2);
      
      // Step 2: Simulated Auth Handshake
      setTimeout(async () => {
        try {
          const orderPayload = {
            name: form.name,
            phone: form.phone,
            email: form.email || null,
            address: form.address,
            city: form.city,
            pincode: form.pincode,
            items: cart.map(c => ({ id: c.id, name: c.name, price: c.price, quantity: c.quantity })),
            subtotal,
            shipping: Number(form.shipping),
            discount: discountAmount,
            total: finalTotal,
            coupon: appliedCoupon || null
          };

          const response = await axios.post(`${BACKEND_URL}/api/orders`, orderPayload);
          setPlacedOrder(response.data);
          
          // Clear Cart
          saveCartToStorage([]);
          setPayStep(3);
        } catch (err) {
          console.error(err);
          setPayStep(0);
          alert("Order placement failed. Check database connectivity.");
        }
      }, 2500);
    }, 1500);
  };

  return (
    <div className="bg-cream py-12 text-espresso font-sans fade-in">
      <SEO
        title="Checkout Secure Payment | V.K. Furniture"
        description="Verify shopping cart items, apply voucher codes, select shipping destinations, and complete payments."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-left border-b border-borderSubtle pb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-espresso leading-none">
            E-commerce Cart & Checkout
          </h1>
          <span className="font-devanagari text-lg text-brass mt-1 block tracking-wider font-semibold">
            शॉपिंग कार्ट और भुगतान
          </span>
        </div>

        {payStep === 3 && placedOrder ? (
          /* Payment success screen */
          <div className="bg-white border border-borderSubtle p-8 md:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-md fade-in">
            <CheckCircle2 size={64} className="text-emerald-500 mx-auto animate-bounce" />
            <div className="space-y-2">
              <h2 className="font-serif text-3xl font-bold text-espresso">Payment Successful!</h2>
              <p className="text-sm text-stone">Order reference: <strong className="font-mono">{placedOrder.id}</strong></p>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Thank you for shopping with V.K. Furniture. We have received your payment. Our workshop carpenters in Dharavi are choosing A-Grade Teak blocks for your order.
              </p>
            </div>

            {/* Printable Receipt Panel */}
            <div id="ecommerce-receipt" className="border border-dashed border-borderSubtle p-6 bg-parchment/30 text-left font-mono text-xs space-y-4">
              <div className="text-center border-b border-dashed border-borderSubtle pb-3">
                <h4 className="font-serif font-bold text-sm">V.K. Furniture Showroom</h4>
                <span className="text-[10px] text-stone">Dharavi, L.B.S Marg, Mumbai | +91 99306 68406</span>
              </div>
              <div className="space-y-1 text-stone-700">
                <div>Client: {placedOrder.name}</div>
                <div>Phone: {placedOrder.phone}</div>
                <div>Delivery Address: {placedOrder.address}, {placedOrder.city}</div>
                <div>Transaction Stamp: {new Date(placedOrder.timestamp).toLocaleString()}</div>
              </div>
              <div className="border-t border-dashed border-borderSubtle pt-3 space-y-2">
                {placedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{item.name} x{item.quantity}</span>
                    <span>₹ {(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-borderSubtle pt-3 text-right font-bold space-y-1">
                <div className="flex justify-between font-normal text-stone">
                  <span>Shipping Cost:</span>
                  <span>₹ {placedOrder.shipping.toLocaleString('en-IN')}</span>
                </div>
                {placedOrder.discount > 0 && (
                  <div className="flex justify-between font-normal text-emerald-600">
                    <span>Coupon Discount:</span>
                    <span>- ₹ {placedOrder.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-stone pt-2 text-teak text-sm">
                  <span>TOTAL PAID RECEIPT:</span>
                  <span>₹ {placedOrder.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.print()}
                className="bg-white border border-borderSubtle hover:bg-cream text-espresso py-3.5 px-6 text-xs uppercase tracking-widest font-bold flex items-center gap-2 cursor-pointer"
              >
                <Printer size={14} />
                Save Invoice
              </button>
              <Link
                to="/catalog"
                className="bg-teak text-cream hover:bg-espresso py-3.5 px-6 text-xs uppercase tracking-widest font-bold text-center"
              >
                Continue Browsing
              </Link>
            </div>
          </div>
        ) : (
          /* Cart and Checkout layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Cart details & Wishlist */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Cart List Card */}
              <div className="bg-white border border-borderSubtle p-6 md:p-8 space-y-6 text-left shadow-sm">
                <div className="flex items-center gap-3 border-b border-cream pb-4">
                  <ShoppingBag className="text-teak" size={24} />
                  <div>
                    <h3 className="font-serif text-xl font-bold text-espresso">Your Shopping Cart</h3>
                    <span className="text-[10px] text-stone uppercase tracking-wider font-bold block">Ready for production fabrication</span>
                  </div>
                </div>

                {cart.length > 0 ? (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 py-4 border-b border-cream last:border-0">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover bg-parchment border border-borderSubtle" />
                        <div className="flex-grow text-center sm:text-left">
                          <h4 className="font-serif text-base font-bold text-espresso">{item.name}</h4>
                          <span className="text-xs text-teak font-semibold">₹ {item.price.toLocaleString('en-IN')} each</span>
                        </div>
                        <div className="flex items-center gap-2 border border-borderSubtle">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="p-2 hover:bg-cream text-stone border-none cursor-pointer bg-transparent"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-3 font-mono font-bold text-xs">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="p-2 hover:bg-cream text-stone border-none cursor-pointer bg-transparent"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeCartItem(item.id)}
                          className="p-2 border border-red-100 text-red-500 hover:bg-red-50 cursor-pointer bg-transparent"
                          title="Remove Item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-stone">
                    <p>Your shopping cart is empty.</p>
                    <Link
                      to="/catalog"
                      className="mt-4 inline-block bg-teak text-cream px-6 py-2.5 text-xs font-bold tracking-widest uppercase hover:bg-espresso"
                    >
                      Browse catalog
                    </Link>
                  </div>
                )}
              </div>

              {/* Wishlist quick-link Drawer */}
              {wishlist.length > 0 && (
                <div className="bg-white border border-borderSubtle p-6 md:p-8 space-y-6 text-left shadow-sm">
                  <div className="flex items-center gap-3 border-b border-cream pb-4">
                    <Heart className="text-teak fill-teak" size={20} />
                    <h3 className="font-serif text-lg font-bold text-espresso">Saved Wishlist Items</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlist.map(pid => (
                      <div key={pid} className="border border-borderSubtle p-3.5 flex items-center justify-between gap-4">
                        <div>
                          <h4 className="font-serif text-xs font-bold text-espresso capitalize">{pid.replace(/-/g, ' ')}</h4>
                          <span className="text-[10px] text-stone uppercase tracking-wider font-bold">Standard Teak Finish</span>
                        </div>
                        <button
                          onClick={() => moveToCart({ id: pid, name: pid.replace(/-/g, ' ').toUpperCase() })}
                          className="bg-espresso text-cream hover:bg-teak px-3 py-1.5 text-[9px] uppercase tracking-wider font-bold flex items-center gap-1 cursor-pointer border-none"
                        >
                          Add to Cart
                          <ArrowRight size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Checkout Billing & Shipping */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Checkout Form Card */}
              <div className="bg-white border border-borderSubtle p-6 md:p-8 space-y-6 text-left shadow-sm">
                <div className="flex items-center gap-3 border-b border-cream pb-4">
                  <CreditCard className="text-teak" size={24} />
                  <div>
                    <h3 className="font-serif text-xl font-bold text-espresso">Secure Checkout</h3>
                    <span className="text-[10px] text-stone uppercase tracking-wider font-bold block">Submit Delivery & Payment specs</span>
                  </div>
                </div>

                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone">Full Name</label>
                    <input
                      type="text" required placeholder="Full Name"
                      value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3 py-2 bg-cream/40 border border-borderSubtle text-sm focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-stone">Phone</label>
                      <input
                        type="tel" required placeholder="Phone"
                        value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-cream/40 border border-borderSubtle text-sm focus:outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-stone">Email (Optional)</label>
                      <input
                        type="email" placeholder="Email"
                        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-3 py-2 bg-cream/40 border border-borderSubtle text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone">Street Address</label>
                    <input
                      type="text" required placeholder="Showroom / Apartment address"
                      value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full px-3 py-2 bg-cream/40 border border-borderSubtle text-sm focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-stone">City</label>
                      <input
                        type="text" required placeholder="Mumbai"
                        value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className="w-full px-3 py-2 bg-cream/40 border border-borderSubtle text-sm focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-stone">Pincode</label>
                      <input
                        type="text" required placeholder="400070"
                        value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                        className="w-full px-3 py-2 bg-cream/40 border border-borderSubtle text-sm focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Shipping Options selector */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone font-sans flex items-center gap-1">
                      <Truck size={12} /> Shipping Cargo Option
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center justify-between p-2.5 border border-borderSubtle bg-cream/20 text-xs font-semibold cursor-pointer">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio" name="shipping" value="1500" checked={form.shipping === 1500}
                            onChange={() => setForm({ ...form, shipping: 1500 })}
                            className="accent-teak"
                          />
                          <span>Mumbai Local Tempo Cargo</span>
                        </div>
                        <span>₹ 1,500</span>
                      </label>
                      <label className="flex items-center justify-between p-2.5 border border-borderSubtle bg-cream/20 text-xs font-semibold cursor-pointer">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio" name="shipping" value="3500" checked={form.shipping === 3500}
                            onChange={() => setForm({ ...form, shipping: 3500 })}
                            className="accent-teak"
                          />
                          <span>Interstate Heavy Freight</span>
                        </div>
                        <span>₹ 3,500</span>
                      </label>
                      <label className="flex items-center justify-between p-2.5 border border-borderSubtle bg-cream/20 text-xs font-semibold cursor-pointer">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio" name="shipping" value="0" checked={form.shipping === 0}
                            onChange={() => setForm({ ...form, shipping: 0 })}
                            className="accent-teak"
                          />
                          <span>Self-Pick from Dharavi Workshop</span>
                        </div>
                        <span className="text-emerald-600 uppercase font-bold tracking-wider text-[10px]">Free</span>
                      </label>
                    </div>
                  </div>

                  {/* Checkout Subtotals */}
                  <div className="border-t border-cream pt-4 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-stone">Cart Subtotal:</span>
                      <span className="font-bold text-espresso font-mono">₹ {subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>Coupon Discount ({appliedCoupon}):</span>
                        <span>- ₹ {discountAmount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-stone">Shipping:</span>
                      <span className="font-bold text-espresso font-mono">₹ {Number(form.shipping).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between border-t border-borderSubtle pt-2.5 text-sm font-bold text-teak">
                      <span>Total Payable:</span>
                      <span>₹ {finalTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Submit checkout button */}
                  <button
                    type="submit"
                    disabled={cart.length === 0 || payStep > 0}
                    className="w-full bg-espresso text-cream hover:bg-teak hover:text-white py-4 text-xs font-sans font-bold tracking-widest uppercase transition-all cursor-pointer border-none"
                  >
                    Pay & Place Order (Simulate UPI/Card)
                  </button>
                </form>

                {/* Promo Code field */}
                <form onSubmit={applyCheckoutCoupon} className="flex gap-2 items-end border-t border-cream pt-4">
                  <div className="flex-grow space-y-1 text-left">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-stone">Discount Coupon</label>
                    <input
                      type="text" placeholder="E.g. VKWELCOME10"
                      value={couponCode} onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full px-3 py-2 border border-borderSubtle font-mono text-xs focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-espresso text-cream hover:bg-teak px-4 py-2 text-xs font-bold tracking-wider uppercase border-none cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
                {couponError && <p className="text-red-500 text-[10px] font-sans text-left">{couponError}</p>}
                {appliedCoupon && (
                  <p className="text-emerald-600 text-[10px] font-bold text-left flex items-center gap-1">
                    <Percent size={12} /> Voucher `{appliedCoupon}` Applied! {discountPercent}% Discount applied.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Simulated Secure Payment Gateway HANDSHAKES Overlay Modals */}
      {payStep > 0 && payStep < 3 && (
        <div className="fixed inset-0 bg-espresso/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-borderSubtle p-8 max-w-sm w-full text-center space-y-6 shadow-2xl scale-in">
            {payStep === 1 ? (
              <div className="space-y-4">
                <RefreshCw className="animate-spin text-teak mx-auto" size={36} />
                <h3 className="font-serif text-lg font-bold text-espresso">Securing handshakes...</h3>
                <p className="text-xs text-stone font-sans">Connecting with Razorpay payment terminal gateway API...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <ShieldCheck className="text-emerald-500 mx-auto animate-pulse" size={40} />
                <h3 className="font-serif text-lg font-bold text-espresso">Authorizing Transaction</h3>
                <p className="text-xs text-stone font-sans">Simulating UPI 3D-Secure authorization pins...</p>
                <div className="w-full bg-cream h-1 overflow-hidden">
                  <div className="bg-teak h-full animate-[progress_2s_ease-in-out_infinite]" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartCheckout;
