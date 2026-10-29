import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  Receipt,
  Utensils,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Bell,
  ChefHat,
  ChevronRight,
  User,
  History,
  X,
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { ThermalReceipt } from '../components/ThermalReceipt';
import { publicApi, ordersApi } from '../services/api';
import { Category, MenuItem, Order, CartItem, CreateOrderPayload, OrderStats } from '../types';
import { useAuth } from '../context/AuthContext';

export const AdminPosPage: React.FC = () => {
  const { user } = useAuth();
  const canteenSlug = user?.canteen?.slug || '';
  const canteenId = user?.canteen?.id;

  // Catalog State
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);

  // Variant Modal State (when dish has Half/Full)
  const [variantModalItem, setVariantModalItem] = useState<MenuItem | null>(null);

  // Active Billing Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway'>('dine_in');
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi' | 'card'>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live Orders State (from QR customers)
  const [liveOrders, setLiveOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats>({
    total_today: 0,
    pending_count: 0,
    active_kitchen: 0,
    today_sales: 0,
  });
  const [isOrdersDrawerOpen, setIsOrdersDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'pos' | 'live_orders'>('pos');

  // Thermal Printing State
  const [printingOrder, setPrintingOrder] = useState<Order | null>(null);
  const [printMode, setPrintMode] = useState<'bill' | 'kot'>('bill');
  const [paperWidth, setPaperWidth] = useState<58 | 80>(80);

  // Fetch Menu for current canteen
  const fetchMenu = async () => {
    setIsLoadingMenu(true);
    try {
      const res = await publicApi.getMenu(false, canteenSlug || canteenId || undefined);
      setCategories(res.categories || []);
    } catch (e) {
      console.error('Failed to load menu for POS:', e);
    } finally {
      setIsLoadingMenu(false);
    }
  };

  // Fetch Live Orders & Stats
  const fetchOrders = async () => {
    try {
      const res = await ordersApi.getOrders({
        canteen_id: canteenId,
        per_page: 20,
      });
      setLiveOrders(res.data?.data || []);
      if (res.stats) setStats(res.stats);
    } catch (e) {
      console.error('Failed to fetch orders:', e);
    }
  };

  useEffect(() => {
    fetchMenu();
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Polling for live QR customer orders
    return () => clearInterval(interval);
  }, [canteenSlug, canteenId]);

  // Flatten & filter items for fast POS search
  const filteredItems = useMemo(() => {
    let list: MenuItem[] = [];
    if (activeCategoryId === 'all') {
      categories.forEach((cat) => {
        if (cat.items) list.push(...cat.items);
      });
    } else {
      const currentCat = categories.find((c) => c.id === activeCategoryId);
      if (currentCat?.items) list = [...currentCat.items];
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (it) => it.name.toLowerCase().includes(q) || (it.category_name && it.category_name.toLowerCase().includes(q))
      );
    }

    return list;
  }, [categories, activeCategoryId, searchQuery]);

  // Add Item to Bill (or prompt for Half/Full if range)
  const handleItemClick = (item: MenuItem) => {
    if (item.price_type === 'range' && item.price_max && item.price_max > item.price) {
      setVariantModalItem(item);
      return;
    }
    addItemToCart(item, item.price, undefined);
  };

  const addItemToCart = (item: MenuItem, price: number, variant?: string) => {
    const cartId = `${item.id}-${variant || 'standard'}`;
    setCartItems((prev) => {
      const exists = prev.find((it) => it.id === cartId);
      if (exists) {
        return prev.map((it) => (it.id === cartId ? { ...it, quantity: it.quantity + 1 } : it));
      }
      return [
        ...prev,
        {
          id: cartId,
          menu_item_id: item.id,
          name: item.name,
          variant,
          unit_price: price,
          quantity: 1,
          image_url: item.image_url,
        },
      ];
    });
    setVariantModalItem(null);
  };

  const updateCartQty = (cartId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((it) => {
          if (it.id === cartId) {
            const newQty = it.quantity + delta;
            return newQty > 0 ? { ...it, quantity: newQty } : null;
          }
          return it;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeCartItem = (cartId: string) => {
    setCartItems((prev) => prev.filter((it) => it.id !== cartId));
  };

  const clearCart = () => {
    setCartItems([]);
    setDiscount(0);
    setTableNumber('');
    setCustomerName('');
    setCustomerPhone('');
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, it) => acc + it.unit_price * it.quantity, 0);
  const grandTotal = Math.max(0, subtotal - discount);

  // Settle Bill & Print
  const handleSettleAndPrint = async (mode: 'bill' | 'kot') => {
    if (cartItems.length === 0) {
      alert('Please add at least 1 item to the bill.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateOrderPayload = {
        canteen_id: canteenId,
        order_type: orderType,
        table_number: tableNumber.trim() || (orderType === 'dine_in' ? 'Table 1' : 'Takeaway Counter'),
        customer_name: customerName.trim() || undefined,
        customer_phone: customerPhone.trim() || undefined,
        payment_method: paymentMethod,
        payment_status: mode === 'bill' ? 'paid' : 'unpaid',
        discount: discount,
        items: cartItems.map((it) => ({
          menu_item_id: it.menu_item_id,
          name: it.name,
          variant: it.variant,
          unit_price: it.unit_price,
          quantity: it.quantity,
        })),
      };

      const res = await ordersApi.createPosOrder(payload);
      if (res.success && res.data) {
        setPrintingOrder(res.data);
        setPrintMode(mode);
        clearCart();
        fetchOrders();
      }
    } catch (e: any) {
      console.error('POS Checkout error:', e);
      alert(e?.response?.data?.message || 'Failed to complete order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Accept QR Order and Print KOT or Bill
  const handleActionOnLiveOrder = async (order: Order, action: 'accept_kot' | 'complete_bill') => {
    try {
      if (action === 'accept_kot') {
        await ordersApi.updateOrderStatus(order.id, { status: 'confirmed' });
        setPrintingOrder(order);
        setPrintMode('kot');
      } else {
        await ordersApi.updateOrderStatus(order.id, { status: 'completed', payment_status: 'paid' });
        setPrintingOrder(order);
        setPrintMode('bill');
      }
      fetchOrders();
    } catch (e) {
      console.error('Failed to update live order:', e);
    }
  };

  const isBillingActive = user?.role === 'super_admin' || (user?.canteen as any)?.billing_enabled !== false;

  if (!isBillingActive) {
    return (
      <AdminLayout
        title="POS Billing Terminal"
        subtitle={`${user?.canteen?.name || 'Restaurant'} — Feature Inactive`}
      >
        <div className="max-w-xl mx-auto my-12 bg-white rounded-3xl border border-stone-200 p-8 text-center shadow-lg space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto">
            <Receipt className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-black text-xl text-stone-900">
            Billing & POS Features Are Not Activated
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed max-w-md mx-auto">
            Billing, thermal receipt printing, KOT tickets, and online ordering are currently disabled for <strong>{user?.canteen?.name}</strong>. Please contact the Platform Super Admin to enable this module for your venue.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="POS Billing Terminal"
      subtitle={`${user?.canteen?.name || 'Restaurant'} — Instant Thermal Billing & KOT`}
    >
      {/* Top POS Toolbar & Quick Stats */}
      <div className="mb-4 bg-white rounded-2xl border border-stone-200 p-3 sm:p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-black">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-black text-stone-900 text-base sm:text-lg leading-tight">
              Front Counter POS & Billing
            </h2>
            <p className="text-xs text-stone-500">Billed by: {user?.name || 'Cashier'}</p>
          </div>
        </div>

        {/* Live Metrics & Quick Switches */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-xs">
            <span className="text-stone-500">Today's Sales: </span>
            <strong className="text-emerald-700 font-bold">₹{stats.today_sales.toFixed(2)}</strong>
          </div>

          <button
            onClick={() => setIsOrdersDrawerOpen(true)}
            className="relative px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-2 hover:bg-amber-100 transition-colors cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 text-amber-600" />
            <span>QR Orders ({stats.pending_count})</span>
            {stats.pending_count > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute -top-1 -right-1" />
            )}
          </button>

          {/* Paper Width Toggle */}
          <div className="flex items-center bg-stone-100 rounded-xl p-0.5 text-xs font-bold border border-stone-200">
            <button
              onClick={() => setPaperWidth(80)}
              className={`px-2.5 py-1 rounded-lg transition-colors ${paperWidth === 80 ? 'bg-white shadow text-stone-900' : 'text-stone-500'}`}
            >
              80mm
            </button>
            <button
              onClick={() => setPaperWidth(58)}
              className={`px-2.5 py-1 rounded-lg transition-colors ${paperWidth === 58 ? 'bg-white shadow text-stone-900' : 'text-stone-500'}`}
            >
              58mm
            </button>
          </div>
        </div>
      </div>

      {/* Main POS Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* ========================================================
            LEFT COLUMN (7 cols): Dish Catalog & Search
            ======================================================== */}
        <div className="lg:col-span-7 space-y-3">
          {/* Search & Categories Bar */}
          <div className="bg-white rounded-2xl border border-stone-200 p-3 shadow-sm space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dish name, dal, paneer, roti, thali..."
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveCategoryId('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  activeCategoryId === 'all'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                All Dishes
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    activeCategoryId === cat.id
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dish Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[620px] overflow-y-auto p-1">
            {isLoadingMenu ? (
              <div className="col-span-full py-12 text-center text-stone-400 text-xs">
                Loading menu catalog...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="col-span-full py-12 text-center text-stone-400 text-xs">
                No items match your search.
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="bg-white rounded-2xl border border-stone-200 p-2.5 shadow-xs hover:border-amber-500 hover:shadow-md active:scale-[0.98] transition-all cursor-pointer flex flex-col justify-between select-none"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                        Veg
                      </span>
                      {item.price_type === 'range' && (
                        <span className="text-[9px] font-bold text-amber-800 bg-amber-50 px-1 py-0.2 rounded">
                          Half / Full
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-xs text-stone-900 line-clamp-2 leading-tight">
                      {item.name}
                    </h4>
                  </div>

                  <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="font-serif font-black text-xs text-amber-900">
                      {item.formatted_price}
                    </span>
                    <button className="w-6 h-6 rounded-lg bg-stone-900 text-white flex items-center justify-center text-xs font-bold hover:bg-stone-700">
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN (5 cols): Active Bill & Print Actions
            ======================================================== */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-3 sm:p-4 shadow-sm flex flex-col space-y-3 sticky top-4">
          {/* Header Row: Table & Order Mode */}
          <div className="border-b border-stone-100 pb-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-amber-600" />
                Active Ticket
              </span>
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-stone-400 hover:text-red-500 font-semibold cursor-pointer"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOrderType('dine_in')}
                className={`py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  orderType === 'dine_in'
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                🍽️ Dine-In
              </button>
              <button
                type="button"
                onClick={() => setOrderType('takeaway')}
                className={`py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  orderType === 'takeaway'
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                🥡 Takeaway
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder={orderType === 'dine_in' ? 'Table No. (e.g. T-4)' : 'Token / Customer Name'}
                className="px-2.5 py-1.5 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Mobile (Optional)"
                className="px-2.5 py-1.5 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Running Items List */}
          <div className="max-h-[260px] overflow-y-auto space-y-1.5 divide-y divide-stone-100 pr-1">
            {cartItems.length === 0 ? (
              <div className="text-center py-10 text-stone-400 text-xs">
                Click any dish on the left to start billing.
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="pt-1.5 first:pt-0 flex items-center justify-between text-xs gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-stone-900 truncate">{item.name}</p>
                    <span className="text-[10px] text-stone-500">
                      {item.variant ? `(${item.variant}) ` : ''}₹{item.unit_price} each
                    </span>
                  </div>

                  {/* Qty +/- */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => updateCartQty(item.id, -1)}
                      className="w-6 h-6 rounded bg-stone-100 text-stone-700 flex items-center justify-center font-bold hover:bg-stone-200"
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQty(item.id, 1)}
                      className="w-6 h-6 rounded bg-stone-100 text-stone-700 flex items-center justify-center font-bold hover:bg-stone-200"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-black text-stone-900 shrink-0 w-14 text-right">
                    ₹{(item.unit_price * item.quantity).toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeCartItem(item.id)}
                    className="text-stone-300 hover:text-red-500 p-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Billing Calculation Box */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Items Total ({cartItems.reduce((acc, it) => acc + it.quantity, 0)}):</span>
              <span className="font-bold">₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-stone-600">
              <span>Discount (₹):</span>
              <input
                type="number"
                min="0"
                value={discount || ''}
                onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                placeholder="0"
                className="w-20 text-right px-2 py-0.5 border border-stone-300 rounded text-xs"
              />
            </div>

            <div className="border-t border-stone-200 pt-1.5 flex justify-between items-baseline font-black text-sm text-stone-900">
              <span>TOTAL PAYABLE:</span>
              <span className="text-base text-amber-900">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="grid grid-cols-3 gap-1.5">
            {(['cash', 'upi', 'card'] as const).map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`py-1.5 rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer border ${
                  paymentMethod === method
                    ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {method}
              </button>
            ))}
          </div>

          {/* Action Buttons: Print Bill / Settle & KOT */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleSettleAndPrint('kot')}
              disabled={isSubmitting || cartItems.length === 0}
              className="py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-extrabold flex items-center justify-center gap-1.5 border border-stone-300 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <ChefHat className="w-4 h-4 text-stone-600" />
              <span>Print KOT</span>
            </button>

            <button
              type="button"
              onClick={() => handleSettleAndPrint('bill')}
              disabled={isSubmitting || cartItems.length === 0}
              className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Settle & Print Bill</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          MODAL: Half / Full Selector
          ======================================================== */}
      {variantModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 border border-stone-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-base text-stone-900">{variantModalItem.name}</h3>
                <p className="text-xs text-stone-500">Select portion size for billing</p>
              </div>
              <button
                onClick={() => setVariantModalItem(null)}
                className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-500"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => addItemToCart(variantModalItem, variantModalItem.price, 'Half')}
                className="p-3.5 rounded-2xl border-2 border-stone-200 hover:border-amber-500 bg-stone-50 hover:bg-amber-50/50 text-left transition-colors cursor-pointer"
              >
                <span className="block text-xs font-bold text-stone-600">Half Plate</span>
                <span className="block text-base font-black text-amber-900 mt-1">₹{variantModalItem.price}</span>
              </button>

              <button
                type="button"
                onClick={() => addItemToCart(variantModalItem, variantModalItem.price_max!, 'Full')}
                className="p-3.5 rounded-2xl border-2 border-stone-200 hover:border-amber-500 bg-stone-50 hover:bg-amber-50/50 text-left transition-colors cursor-pointer"
              >
                <span className="block text-xs font-bold text-stone-600">Full Plate</span>
                <span className="block text-base font-black text-amber-900 mt-1">₹{variantModalItem.price_max}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          DRAWER: Live Incoming Orders (QR Customers)
          ======================================================== */}
      {isOrdersDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-base text-stone-900">Live Customer QR Orders</h3>
              </div>
              <button
                onClick={() => setIsOrdersDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {liveOrders.length === 0 ? (
                <div className="text-center py-12 text-stone-400 text-xs">
                  No orders placed yet today.
                </div>
              ) : (
                liveOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="border border-stone-200 rounded-2xl p-3.5 space-y-2 bg-stone-50/50 shadow-xs"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-black text-xs text-stone-900">Token: {ord.token_number}</span>
                        <p className="text-[11px] text-stone-500">
                          {ord.order_type === 'dine_in' ? `Table: ${ord.table_number || 'Dine'}` : 'Takeaway'} • {ord.order_number}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          ord.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {ord.status_label || ord.status}
                      </span>
                    </div>

                    <div className="border-t border-stone-200 pt-1.5 space-y-0.5 text-xs text-stone-700">
                      {ord.items?.map((it, i) => (
                        <div key={i} className="flex justify-between">
                          <span>{it.item_name} {it.variant ? `(${it.variant})` : ''} x {it.quantity}</span>
                          <span className="font-semibold">{it.formatted_total_price || `₹${it.total_price}`}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-stone-200 pt-2 flex items-center justify-between">
                      <span className="font-extrabold text-sm text-stone-900">
                        {ord.formatted_total || `₹${ord.total_amount}`}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleActionOnLiveOrder(ord, 'accept_kot')}
                          className="px-2.5 py-1 bg-stone-900 text-white rounded-lg text-xs font-bold hover:bg-stone-800"
                        >
                          🍳 KOT
                        </button>
                        <button
                          onClick={() => handleActionOnLiveOrder(ord, 'complete_bill')}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-500"
                        >
                          🖨️ Bill
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          THERMAL RECEIPT PRINT MODAL
          ======================================================== */}
      {printingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto">
            <ThermalReceipt
              order={printingOrder}
              mode={printMode}
              widthMm={paperWidth}
              autoPrint={true}
              onClose={() => setPrintingOrder(null)}
            />
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

