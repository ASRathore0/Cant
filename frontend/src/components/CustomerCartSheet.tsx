import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, Utensils, Bike, CheckCircle2, Clock, Phone, User, MessageSquare } from 'lucide-react';
import { CartItem, CreateOrderPayload, Order } from '../types';
import { publicApi } from '../services/api';

interface CustomerCartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (cartId: string, delta: number) => void;
  onRemoveItem: (cartId: string) => void;
  onClearCart: () => void;
  canteenId?: number;
  canteenSlug?: string;
  restaurantName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export const CustomerCartSheet: React.FC<CustomerCartSheetProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  canteenId,
  canteenSlug,
  restaurantName = 'Restaurant',
  primaryColor = '#062D1F',
  secondaryColor = '#075C35',
  accentColor = '#E8C928',
}) => {
  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway'>('dine_in');
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, it) => acc + it.unit_price * it.quantity, 0);

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    if (orderType === 'dine_in' && !tableNumber.trim()) {
      setError('Please enter your Table Number so we can serve your order!');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const payload: CreateOrderPayload = {
        canteen_id: canteenId,
        canteen_slug: canteenSlug,
        order_type: orderType,
        table_number: orderType === 'dine_in' ? tableNumber.trim() : 'Takeaway Counter',
        customer_name: customerName.trim() || undefined,
        customer_phone: customerPhone.trim() || undefined,
        notes: notes.trim() || undefined,
        items: cartItems.map((it) => ({
          menu_item_id: it.menu_item_id,
          name: it.name,
          variant: it.variant,
          unit_price: it.unit_price,
          quantity: it.quantity,
        })),
      };

      const res = await publicApi.placeOrder(payload);
      if (res.success && res.data) {
        setPlacedOrder(res.data);
        onClearCart();
      } else {
        setError(res.message || 'Failed to place order. Please check with the counter.');
      }
    } catch (err: any) {
      console.error('Order error:', err);
      setError(err?.response?.data?.message || 'Could not place order. Please try again or order at the counter.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 animate-in slide-in-from-bottom duration-300">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: primaryColor }}>
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 leading-tight">
                {placedOrder ? 'Order Confirmed!' : 'Your Order Cart'}
              </h3>
              <p className="text-[11px] text-stone-500">{restaurantName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center hover:bg-stone-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {placedOrder ? (
            /* ========================================================
               ORDER CONFIRMATION VIEW
               ======================================================== */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  Order Sent to Kitchen
                </span>
                <h4 className="font-serif font-black text-2xl text-stone-900 mt-2">
                  Token: {placedOrder.token_number}
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">Order ID: {placedOrder.order_number}</p>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="text-stone-600">Table / Mode:</span>
                  <span className="font-bold text-stone-900">
                    {placedOrder.order_type === 'dine_in' ? `Table ${placedOrder.table_number}` : 'Takeaway'}
                  </span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-stone-600">Status:</span>
                  <span className="font-bold text-amber-700 uppercase flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Preparing
                  </span>
                </div>
                <div className="border-t border-stone-200 pt-2 space-y-1">
                  {placedOrder.items?.map((it, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{it.item_name} {it.variant ? `(${it.variant})` : ''} x {it.quantity}</span>
                      <span className="font-semibold">{it.formatted_total_price || `₹${it.total_price}`}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-stone-200 pt-2 flex justify-between font-extrabold text-sm text-stone-900">
                  <span>Grand Total:</span>
                  <span style={{ color: secondaryColor }}>{placedOrder.formatted_total || `₹${placedOrder.total_amount}`}</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 italic">
                Please show your Token number at the counter when collecting or paying!
              </p>

              <button
                onClick={() => {
                  setPlacedOrder(null);
                  onClose();
                }}
                className="w-full py-3 rounded-2xl text-white font-bold text-sm shadow-md transition-all active:scale-[0.98]"
                style={{ backgroundColor: primaryColor }}
              >
                Done / Back to Menu
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            /* Empty Cart */
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                <Utensils className="w-7 h-7" />
              </div>
              <h4 className="font-serif font-bold text-stone-800 text-lg">Your Cart is Empty</h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Explore our delicious dhaba curries, tandoori rotis, and thalis to add items to your cart.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow transition-all"
                style={{ backgroundColor: primaryColor }}
              >
                Browse Menu
              </button>
            </div>
          ) : (
            /* Items List & Checkout Form */
            <div className="space-y-4">
              {/* Order Mode Toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setOrderType('dine_in')}
                  className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    orderType === 'dine_in'
                      ? 'bg-white shadow text-stone-900'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5" /> Dine-In (Table)
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('takeaway')}
                  className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    orderType === 'takeaway'
                      ? 'bg-white shadow text-stone-900'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Bike className="w-3.5 h-3.5" /> Takeaway / Packing
                </button>
              </div>

              {/* Table Number Input if Dine-In */}
              {orderType === 'dine_in' && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Table Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="e.g. Table 4 or Counter"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}

              {/* Items Card List */}
              <div className="space-y-2 border border-stone-200 rounded-2xl p-3 divide-y divide-stone-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h5 className="font-semibold text-xs sm:text-sm text-stone-900 truncate">
                        {item.name}
                      </h5>
                      <div className="flex items-center gap-2 mt-0.5">
                        {item.variant && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            {item.variant}
                          </span>
                        )}
                        <span className="text-xs font-bold text-stone-600">
                          ₹{item.unit_price}
                        </span>
                      </div>
                    </div>

                    {/* Qty Selector */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 overflow-hidden shadow-xs">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-200 active:scale-95 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-bold text-xs text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-200 active:scale-95 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-stone-400 hover:text-red-500 p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Optional Customer Info */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Your Name (Optional)</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Aditya"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Mobile (Optional)</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="94114..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Cooking Notes */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Cooking Instruction (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Less spicy, extra butter"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* Bill Summary */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal ({cartItems.reduce((acc, it) => acc + it.quantity, 0)} items):</span>
                  <span className="font-bold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Taxes & Packaging:</span>
                  <span className="font-bold text-emerald-600">FREE</span>
                </div>
                <div className="border-t border-stone-200 pt-2 flex justify-between text-sm font-extrabold text-stone-900">
                  <span>To Pay:</span>
                  <span style={{ color: secondaryColor }}>₹{subtotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl text-white font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                style={{ backgroundColor: secondaryColor }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" style={{ color: accentColor }} />
                    Place Order (₹{subtotal.toFixed(2)})
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

