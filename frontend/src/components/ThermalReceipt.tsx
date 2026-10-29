import React, { useEffect } from 'react';
import { Order } from '../types';

interface ThermalReceiptProps {
  order: Order | null;
  mode?: 'bill' | 'kot';
  widthMm?: 58 | 80;
  onClose?: () => void;
  autoPrint?: boolean;
}

/**
 * Universal print helper: Writes receipt directly to an isolated iframe
 * to guarantee that Chrome/Edge/Firefox NEVER render a blank print preview!
 */
export const printThermalReceipt = (elementId: string, widthMm: 58 | 80 = 80) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  let iframe = document.getElementById('thermal-print-iframe') as HTMLIFrameElement;
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = 'thermal-print-iframe';
    iframe.style.position = 'fixed';
    iframe.style.top = '-9999px';
    iframe.style.left = '-9999px';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);
  }

  const doc = iframe.contentWindow?.document;
  if (!doc) return;

  const widthCss = widthMm === 58 ? '54mm' : '76mm';
  const pageSize = widthMm === 58 ? '58mm' : '80mm';

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Print Receipt</title>
        <style>
          @page {
            size: ${pageSize} auto;
            margin: 0;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: 'Courier New', Courier, monospace, -apple-system;
            font-size: 11px;
            line-height: 1.3;
            color: #000;
            background: #fff;
            width: ${widthCss};
            margin: 0 auto;
            padding: 3mm 2mm;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 2px 0;
            vertical-align: top;
          }
          .text-center { text-align: center; }
          .text-left { text-align: left; }
          .text-right { text-align: right; }
          .font-bold { font-weight: bold; }
          .font-black { font-weight: 900; }
          .uppercase { text-transform: uppercase; }
          .border-b { border-bottom: 1px solid #000; }
          .border-b-2 { border-bottom: 2px solid #000; }
          .border-t { border-top: 1px solid #000; }
          .border-t-2 { border-top: 2px solid #000; }
          .border-dashed { border-style: dashed; }
          .my-1 { margin-top: 4px; margin-bottom: 4px; }
          .my-2 { margin-top: 8px; margin-bottom: 8px; }
          .mt-05 { margin-top: 2px; }
          .mt-1 { margin-top: 4px; }
          .mt-2 { margin-top: 8px; }
          .mb-1 { margin-bottom: 4px; }
          .mb-2 { margin-bottom: 8px; }
          .py-05 { padding-top: 2px; padding-bottom: 2px; }
          .py-1 { padding-top: 4px; padding-bottom: 4px; }
          .pt-1 { padding-top: 4px; }
          .pt-2 { padding-top: 8px; }
          .pb-1 { padding-bottom: 4px; }
          .flex { display: flex; }
          .justify-between { justify-content: space-between; }
          .items-center { align-items: center; }
          .block { display: block; }
          .text-xs { font-size: 10px; }
          .text-sm { font-size: 12px; }
          .text-base { font-size: 14px; }
          .tracking-widest { letter-spacing: 0.1em; }
          .italic { font-style: italic; }
          .border-box { border: 1px solid #000; padding: 2px 4px; }
          img { max-width: 100%; height: auto; }
        </style>
      </head>
      <body>
        ${element.innerHTML}
      </body>
    </html>
  `);
  doc.close();

  // Give images & fonts 200ms to settle in iframe before invoking print
  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
  }, 250);
};

export const ThermalReceipt: React.FC<ThermalReceiptProps> = ({
  order,
  mode = 'bill',
  widthMm = 80,
  onClose,
  autoPrint = false,
}) => {
  if (!order) return null;

  const canteen = order.canteen;
  const isKot = mode === 'kot';

  // Dynamic UPI Payment QR
  const upiPhone = canteen?.phone ? canteen.phone.replace(/[^0-9]/g, '').slice(-10) : '';
  const upiId = upiPhone ? `${upiPhone}@upi` : '';
  const upiName = encodeURIComponent(canteen?.name || 'Restaurant');
  const upiQrUrl = upiId && !isKot
    ? `https://api.qrserver.com/v1/create-qr-code/?size=110x110&margin=1&data=${encodeURIComponent(
        `upi://pay?pa=${upiId}&pn=${upiName}&am=${order.total_amount}&cu=INR&tn=Bill-${order.order_number}`
      )}`
    : null;

  const totalQty = order.items.reduce((acc, it) => acc + (it.quantity || 1), 0);

  const handlePrint = () => {
    printThermalReceipt('thermal-receipt-printable-content', widthMm);
  };

  const handleWhatsAppDirect = () => {
    const phone = order.customer_phone ? order.customer_phone.replace(/[^0-9]/g, '') : '';
    const cleanPhone = phone.length === 10 ? `91${phone}` : phone;
    const origin = window.location.origin;
    const ebillUrl = `${origin}/receipt/${order.order_number}`;
    
    const text = `🧾 *BILL RECEIPT - ${canteen?.name || 'Restaurant'}*
━━━━━━━━━━━━━━━━━━━━
🔢 *Token #*: *${order.token_number || 'N/A'}*
📄 *Order #*: #${order.order_number}
📅 *Date*: ${new Date(order.created_at).toLocaleString()}
${order.table_number ? `🪑 Table: ${order.table_number}` : `🛍️ Type: ${order.order_type}`}
${order.customer_name ? `👤 Customer: ${order.customer_name}` : ''}
────────────────────
*ORDER ITEMS:*
${order.items.map(it => `• ${it.quantity}x ${it.item_name}${it.variant ? ` (${it.variant})` : ''} - ₹${Number(it.total_price).toFixed(2)}`).join('\n')}
────────────────────
Subtotal: ₹${Number(order.subtotal).toFixed(2)}
${Number(order.discount) > 0 ? `Discount: -₹${Number(order.discount).toFixed(2)}\n` : ''}${Number(order.tax) > 0 ? `Tax: ₹${Number(order.tax).toFixed(2)}\n` : ''}*TOTAL PAID*: *₹${Number(order.total_amount).toFixed(2)}*
Payment: ${order.payment_method?.toUpperCase()} (${order.payment_status?.toUpperCase()})
${canteen?.digital_ebill_enabled !== false ? `\n🌐 *Digital E-Bill Link*:\n${ebillUrl}` : ''}
━━━━━━━━━━━━━━━━━━━━
🙏 Thank you! Visit again. ✨`;

    const waUrl = cleanPhone 
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  useEffect(() => {
    if (autoPrint) {
      const timer = setTimeout(() => {
        handlePrint();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [autoPrint, order.id, mode, widthMm]);

  return (
    <div className="thermal-receipt-container">
      {/* Screen action toolbar (hidden on print) */}
      <div className="no-print bg-stone-900 text-white p-3 rounded-t-2xl flex items-center justify-between gap-3 shadow-lg max-w-sm mx-auto">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider">
            {isKot ? 'Kitchen Ticket (KOT)' : 'Thermal Bill Preview'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {!isKot && canteen?.whatsapp_billing_enabled !== false && (
            <button
              type="button"
              onClick={handleWhatsAppDirect}
              className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow transition-colors flex items-center gap-1 cursor-pointer active:scale-95"
              title="Send bill directly via WhatsApp"
            >
              💬 WhatsApp
            </button>
          )}
          {!isKot && canteen?.digital_ebill_enabled !== false && (
            <a
              href={`/receipt/${order.order_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1.5 bg-stone-700 hover:bg-stone-600 text-emerald-300 text-xs font-semibold rounded-lg shadow transition-colors flex items-center gap-1 cursor-pointer"
              title="Open customer digital e-receipt link"
            >
              🌐 E-Bill
            </a>
          )}
          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            🖨️ Print
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-2 py-1.5 bg-stone-700 hover:bg-stone-600 text-stone-200 text-xs rounded-lg transition-colors cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Screen Preview Container */}
      <div
        className="bg-white text-black font-mono text-xs p-4 shadow-xl border border-stone-200 mx-auto rounded-b-2xl max-w-sm"
        style={{
          width: widthMm === 58 ? '58mm' : '80mm',
          maxWidth: '100%',
          lineHeight: '1.3',
        }}
      >
        {/* Printable Source Element */}
        <div id="thermal-receipt-printable-content">
          {isKot ? (
            /* ========================================================
               KITCHEN ORDER TICKET (KOT)
               ======================================================== */
            <div className="text-center">
              <h2 className="text-sm font-black tracking-widest uppercase border-b-2 pb-1 mb-1">
                *** KITCHEN ORDER TICKET ***
              </h2>
              <div className="flex justify-between items-center font-bold my-1 text-xs">
                <span>TOKEN: <strong className="text-sm font-black">{order.token_number || `#${order.id}`}</strong></span>
                <span>{order.order_type === 'dine_in' ? `TABLE: ${order.table_number || 'Counter'}` : 'TAKEAWAY'}</span>
              </div>
              <div className="flex justify-between text-xs border-b pb-1 mb-2">
                <span>Bill: {order.order_number}</span>
                <span>{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              <table className="w-full text-left text-xs mb-2">
                <thead>
                  <tr className="border-b">
                    <th className="py-05">ITEM</th>
                    <th className="py-05 text-right">QTY</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((it, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-05 font-bold">
                        {it.item_name}
                        {it.variant && <span className="block text-xs font-normal">[{it.variant}]</span>}
                        {it.notes && <span className="block text-xs italic">Note: {it.notes}</span>}
                      </td>
                      <td className="py-05 text-right font-black text-sm">{it.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {order.notes && (
                <div className="border-box text-xs text-left font-bold mb-2">
                  Instruction: {order.notes}
                </div>
              )}

              <div className="border-t-2 border-dashed pt-1 text-center font-bold text-xs">
                Items: {order.items.length} | Total Qty: {totalQty}
              </div>
            </div>
          ) : (
            /* ========================================================
               CUSTOMER BILL / RECEIPT
               ======================================================== */
            <div>
              {/* Header */}
              <div className="text-center mb-1">
                <h1 className="text-sm font-black uppercase leading-tight">
                  {canteen?.name || 'RESTAURANT & DHABA'}
                </h1>
                {canteen?.tagline && (
                  <p className="text-xs font-medium italic mt-05">{canteen.tagline}</p>
                )}
                {canteen?.pure_veg_label && (
                  <p className="text-xs font-bold uppercase border-box inline-block my-1">
                    ● {canteen.pure_veg_label} ●
                  </p>
                )}
                {canteen?.address && (
                  <p className="text-xs leading-tight mt-05">{canteen.address}</p>
                )}
                {(canteen?.phone || canteen?.whatsapp) && (
                  <p className="text-xs font-semibold mt-05">
                    Ph: {canteen.phone || ''} {canteen.whatsapp && canteen.whatsapp !== canteen.phone ? `/ ${canteen.whatsapp}` : ''}
                  </p>
                )}
              </div>

              <div className="border-t border-b border-dashed py-1 my-1 text-xs">
                <div className="flex justify-between">
                  <span>Bill: <strong>{order.order_number}</strong></span>
                  <span>Token: <strong className="text-sm">{order.token_number || `#${order.id}`}</strong></span>
                </div>
                <div className="flex justify-between mt-05">
                  <span>Type: <strong>{order.order_type === 'dine_in' ? `Table: ${order.table_number || 'Dine'}` : 'Takeaway'}</strong></span>
                  <span>Date: {new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between mt-05">
                  <span>Cashier: {order.billed_by || 'Front Counter'}</span>
                  <span>Time: {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                {order.customer_name && (
                  <div className="flex justify-between mt-05">
                    <span>Customer: {order.customer_name}</span>
                    {order.customer_phone && <span>{order.customer_phone}</span>}
                  </div>
                )}
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-xs my-1">
                <thead>
                  <tr className="border-b">
                    <th className="py-05">ITEM</th>
                    <th className="py-05 text-center">QTY</th>
                    <th className="py-05 text-right">RATE</th>
                    <th className="py-05 text-right">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((it, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-05 font-semibold">
                        {it.item_name}
                        {it.variant && <span className="block text-xs font-normal">({it.variant})</span>}
                      </td>
                      <td className="py-05 text-center font-bold">{it.quantity}</td>
                      <td className="py-05 text-right">₹{Number(it.unit_price).toFixed(2)}</td>
                      <td className="py-05 text-right font-bold">₹{Number(it.total_price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="border-t border-dashed pt-1 text-xs">
                <div className="flex justify-between">
                  <span>Items / Total Qty:</span>
                  <span>{order.items.length} / {totalQty}</span>
                </div>
                <div className="flex justify-between mt-05">
                  <span>Subtotal:</span>
                  <span>₹{Number(order.subtotal).toFixed(2)}</span>
                </div>
                {Number(order.discount) > 0 && (
                  <div className="flex justify-between mt-05">
                    <span>Discount:</span>
                    <span>- ₹{Number(order.discount).toFixed(2)}</span>
                  </div>
                )}
                {Number(order.tax) > 0 && (
                  <div className="flex justify-between mt-05">
                    <span>Tax / GST:</span>
                    <span>+ ₹{Number(order.tax).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t-2 border-b-2 py-1 my-1 text-sm font-black">
                  <span>GRAND TOTAL:</span>
                  <span>₹{Number(order.total_amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Mode:</span>
                  <span className="font-bold uppercase">{order.payment_method} ({order.payment_status})</span>
                </div>
              </div>

              {/* Dynamic QR Code for Scan & Pay */}
              {upiQrUrl && (
                <div className="text-center my-2 pt-1 border-t border-dashed">
                  <p className="text-xs font-bold uppercase mb-1">Scan QR to Pay via GPay / PhonePe</p>
                  <img src={upiQrUrl} alt="UPI QR" className="w-24 h-24 mx-auto border p-0.5" />
                  <p className="text-xs mt-05">UPI ID: {upiId}</p>
                </div>
              )}

              {/* Footer */}
              <div className="text-center text-xs font-semibold border-t border-dashed pt-1 mt-1">
                {canteen?.digital_ebill_enabled !== false && (
                  <p className="font-normal text-[10px] mb-1">
                    E-Bill: {window.location.origin}/receipt/{order.order_number}
                  </p>
                )}
                <p>*** THANK YOU! VISIT AGAIN ***</p>
                <p>धन्यवाद! फिर पधारें!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
