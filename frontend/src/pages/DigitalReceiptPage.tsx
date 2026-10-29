import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Receipt,
  CheckCircle2,
  Printer,
  Share2,
  ArrowLeft,
  UtensilsCrossed,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { publicApi } from '../services/api';
import { Order } from '../types';

export const DigitalReceiptPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderNumber) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await publicApi.getOrder(orderNumber);
        setOrder(data);
      } catch (err: any) {
        console.error('Error fetching digital receipt:', err);
        setError(err.response?.data?.message || 'Order receipt not found or expired.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    if (!order) return;
    const currentUrl = window.location.href;
    const canteenName = order.canteen?.name || 'Restaurant';
    const text = `🧾 *Digital Receipt from ${canteenName}*\nOrder #${order.order_number} | Token: *${order.token_number || 'N/A'}*\nTotal Amount: *₹${Number(order.total_amount).toFixed(2)}*\n\nView online receipt:\n${currentUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <div className="bg-stone-800/90 backdrop-blur rounded-2xl border border-stone-700/60 p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="w-14 h-14 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-stone-200 font-semibold text-lg">Fetching Digital E-Bill...</h2>
          <p className="text-stone-400 text-xs mt-1">Generating official electronic tax invoice</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <div className="bg-stone-800 rounded-2xl border border-red-500/30 p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-14 h-14 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-stone-100">Receipt Not Available</h2>
          <p className="text-stone-400 text-sm mt-2 mb-6">
            {error || 'Unable to load invoice details. Please verify your order number or check with the counter.'}
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all shadow-lg shadow-emerald-900/30"
          >
            <UtensilsCrossed className="w-4 h-4" />
            Go to Menu
          </Link>
        </div>
      </div>
    );
  }

  const canteen = order.canteen;

  // Check if Digital E-Bill feature is disabled by Super Admin for this canteen
  if (canteen && canteen.digital_ebill_enabled === false) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <div className="bg-stone-800 rounded-2xl border border-amber-500/30 p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-14 h-14 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
            <Receipt className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-stone-100">Digital E-Bill Feature Inactive</h2>
          <p className="text-stone-400 text-sm mt-2 mb-6">
            Digital E-Bill receipts are currently disabled for <span className="text-amber-300 font-semibold">{canteen.name}</span>. Please request a physical printed counter receipt.
          </p>
          <Link
            to={`/menu?canteen=${canteen.slug}`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm transition-all shadow-lg"
          >
            <UtensilsCrossed className="w-4 h-4" />
            Return to Menu
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = Number(order.subtotal || 0);
  const discount = Number(order.discount || 0);
  const tax = Number(order.tax || 0);
  const totalAmount = Number(order.total_amount || 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 text-stone-100 py-6 px-3 sm:px-6 flex flex-col items-center">
      {/* Top action nav (hidden when printing) */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 print:hidden">
        <Link
          to={`/menu?canteen=${canteen?.slug || ''}`}
          className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors bg-stone-800/80 hover:bg-stone-800 px-3 py-1.5 rounded-lg border border-stone-700/60"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Menu</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShareWhatsApp}
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg transition-all shadow-sm"
            title="Share via WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded-lg border border-stone-700 transition-all shadow-sm"
            title="Print or Save PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Main E-Bill Invoice Sheet */}
      <div className="w-full max-w-md bg-white text-stone-900 rounded-3xl shadow-2xl overflow-hidden border border-stone-200/80 relative print:shadow-none print:border-none print:rounded-none">
        {/* Receipt Header Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          <div className="relative z-10">
            {canteen?.logo_url && (
              <img
                src={canteen.logo_url}
                alt={canteen.name}
                className="w-14 h-14 object-contain rounded-full bg-white p-1 mx-auto mb-2.5 shadow-md border border-white/20"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            )}
            <h1 className="text-xl font-bold tracking-tight text-white">{canteen?.name || 'Restaurant'}</h1>
            {canteen?.tagline && (
              <p className="text-xs text-emerald-200/90 mt-0.5 italic">{canteen.tagline}</p>
            )}
            {canteen?.pure_veg_label && (
              <div className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full bg-emerald-700/60 border border-emerald-400/40 text-[10px] font-semibold text-emerald-200 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                {canteen.pure_veg_label}
              </div>
            )}
            {canteen?.address && (
              <p className="text-[11px] text-emerald-200/70 mt-2 flex items-center justify-center gap-1 max-w-xs mx-auto">
                <MapPin className="w-3 h-3 shrink-0" />
                <span>{canteen.address}</span>
              </p>
            )}
            {canteen?.phone && (
              <p className="text-[11px] text-emerald-200/70 mt-0.5 flex items-center justify-center gap-1">
                <Phone className="w-3 h-3 shrink-0" />
                <span>{canteen.phone}</span>
              </p>
            )}
          </div>
        </div>

        {/* Status bar */}
        <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Digital E-Bill Verified</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 font-medium">
            {order.payment_status === 'paid' ? 'PAID' : 'PENDING'}
          </span>
        </div>

        {/* Invoice Key Metas */}
        <div className="p-5 border-b border-stone-200 bg-stone-50/50">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-stone-500">Order Reference</div>
              <div className="text-base font-extrabold font-mono text-stone-900 tracking-tight">#{order.order_number}</div>
              <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" />
                <span>{new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
              </div>
            </div>

            {order.token_number && (
              <div className="bg-emerald-600 text-white px-3.5 py-1.5 rounded-2xl shadow-md text-center">
                <div className="text-[9px] uppercase tracking-wider font-semibold opacity-90">Token No.</div>
                <div className="text-xl font-black font-mono tracking-tight leading-none mt-0.5">{order.token_number}</div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-stone-200/70 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Service Type</span>
              <span className="font-semibold text-stone-800">
                {order.order_type === 'dine_in'
                  ? `Dine-In ${order.table_number ? `(Table ${order.table_number})` : ''}`
                  : order.order_type === 'takeaway'
                  ? 'Takeaway / Parcel'
                  : 'Delivery'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Customer</span>
              <span className="font-semibold text-stone-800 truncate block">
                {order.customer_name || 'Walk-in Guest'}
                {order.customer_phone ? ` (${order.customer_phone})` : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="p-5">
          <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-3">Itemized Invoice</h3>
          <div className="divide-y divide-stone-100">
            {order.items?.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex-1 pr-3">
                  <div className="font-bold text-stone-800 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-stone-100 font-mono text-center leading-5 text-[11px] font-bold text-stone-700 shrink-0">
                      {item.quantity}x
                    </span>
                    <span>{item.item_name}</span>
                  </div>
                  {item.variant && (
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium ml-6 inline-block mt-0.5">
                      {item.variant}
                    </span>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-stone-900 font-mono">₹{Number(item.total_price).toFixed(2)}</div>
                  <div className="text-[10px] text-stone-600">@ ₹{Number(item.unit_price).toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Calculations */}
          <div className="mt-4 pt-3 border-t-2 border-dashed border-stone-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span className="font-mono font-medium">₹{subtotal.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount / Offer</span>
                <span className="font-mono font-medium">-₹{discount.toFixed(2)}</span>
              </div>
            )}

            {tax > 0 && (
              <div className="flex justify-between text-stone-600">
                <span>Taxes & GST</span>
                <span className="font-mono font-medium">+₹{tax.toFixed(2)}</span>
              </div>
            )}

            <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
              <span className="text-sm font-black text-stone-900 uppercase">Total Amount</span>
              <span className="text-xl font-black text-emerald-700 font-mono">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method Pill */}
          <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
            <span className="text-stone-500">Payment Mode</span>
            <span className="font-bold text-stone-800 uppercase font-mono tracking-wide">
              {order.payment_method || 'CASH'} • {order.payment_status || 'PAID'}
            </span>
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-stone-50 px-5 py-4 border-t border-stone-200 text-center text-[11px] text-stone-500 space-y-1">
          <p className="font-semibold text-stone-700">Thank you for dining with us!</p>
          <p>This is a computer-generated official e-bill receipt.</p>
          <div className="pt-2 flex items-center justify-center gap-1 text-[10px] text-stone-400">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Powered by Cant Food & Beverage POS Engine</span>
          </div>
        </div>
      </div>

      {/* Floating Bottom Action for Customers (hidden in print) */}
      <div className="w-full max-w-md mt-5 space-y-2 print:hidden">
        <Link
          to={`/menu?canteen=${canteen?.slug || ''}`}
          className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-sm shadow-xl shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all"
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Explore Menu & Order Again</span>
        </Link>
      </div>
    </div>
  );
};
export default DigitalReceiptPage;

