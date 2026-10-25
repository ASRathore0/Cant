import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Save,
  QrCode as QrIcon,
  Download,
  Printer,
  Upload,
  Sparkles,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Award,
  Image as ImageIcon,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { Toast, ToastMessage } from '../components/Toast';
import { adminApi } from '../services/api';
import { RestaurantSettings } from '../types';
import { useAuth } from '../context/AuthContext';

// Canvas drawing helper functions for Standee generator
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawLogoImage(
  ctx: CanvasRenderingContext2D,
  url: string,
  cx: number,
  cy: number,
  r: number,
  borderColor: string,
  fallbackName: string
): Promise<void> {
  return new Promise((resolve) => {
    const drawFallbackMonogram = () => {
      ctx.save();
      // Outer border circle
      ctx.beginPath();
      ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = borderColor;
      ctx.stroke();

      // Inner fill circle
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = borderColor;
      ctx.fill();

      // Fallback Monogram text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const initials =
        fallbackName
          .split(' ')
          .map((w) => w[0])
          .slice(0, 2)
          .join('')
          .toUpperCase() || '🍽️';
      ctx.fillText(initials, cx, cy);
      ctx.restore();
      resolve();
    };

    if (!url || url === '/logo.png') {
      drawFallbackMonogram();
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        ctx.save();
        // White circular background & theme border
        ctx.beginPath();
        ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.lineWidth = 6;
        ctx.strokeStyle = borderColor;
        ctx.stroke();

        // Clipped circle for logo image
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, cx - r, cy - r, r * 2, r * 2);
        ctx.restore();
        resolve();
      } catch {
        drawFallbackMonogram();
      }
    };
    img.onerror = () => {
      drawFallbackMonogram();
    };
    img.src = url;
  });
}

function drawQrImage(
  ctx: CanvasRenderingContext2D,
  dataUrl: string,
  x: number,
  y: number,
  w: number,
  h: number
): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, x, y, w, h);
      resolve();
    };
    img.onerror = () => resolve();
    img.src = dataUrl;
  });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let curY = y;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, curY);
      line = words[n] + ' ';
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, curY);
}

export const AdminSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingStandee, setIsGeneratingStandee] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Entity visual & identity tokens
  const entitySlug = settings?.slug || user?.canteen?.slug || '';
  const primaryColor = settings?.primary_color || user?.canteen?.primary_color || '#063D29';
  const secondaryColor = settings?.secondary_color || user?.canteen?.secondary_color || '#075C35';
  const accentColor = settings?.accent_color || user?.canteen?.accent_color || '#E8C928';
  const bgColor = settings?.bg_color || user?.canteen?.bg_color || '#FAF8F1';

  // Automatically compute live URL based on current host and entity slug
  const autoEntityUrl = entitySlug
    ? `${window.location.origin}/menu?canteen=${entitySlug}`
    : `${window.location.origin}/menu`;

  // Form states
  const [formData, setFormData] = useState({
    restaurant_name: '',
    tagline: '',
    pure_veg_label: '',
    address: '',
    location_landmark: '',
    phone: '',
    whatsapp: '',
    opening_hours: '',
    hero_heading: '',
    hero_subheading: '',
    announcement_enabled: false,
    announcement_text: '',
    army_discount_enabled: false,
    army_discount_text: '',
    qr_target_url: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // QR Canvas
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getSettings(user?.canteen_id ? { canteen_id: user.canteen_id } : undefined);
      setSettings(data);

      const liveSlug = data.slug || user?.canteen?.slug;
      const expectedLiveUrl = liveSlug
        ? `${window.location.origin}/menu?canteen=${liveSlug}`
        : `${window.location.origin}/menu`;

      let targetUrl = data.qr_target_url;
      try {
        if (!targetUrl) {
          targetUrl = expectedLiveUrl;
        } else {
          const parsed = new URL(targetUrl);
          // Auto-detect and sync if hostname/port doesn't match current deployment, or points to outdated entity
          if (parsed.host !== window.location.host || (liveSlug && !targetUrl.includes(liveSlug))) {
            targetUrl = expectedLiveUrl;
          }
        }
      } catch {
        targetUrl = expectedLiveUrl;
      }

      setFormData({
        restaurant_name: data.restaurant_name || user?.canteen?.name || 'Restaurant Canteen',
        tagline: data.tagline || 'Good Food. Made Fresh. Served with Respect.',
        pure_veg_label: data.pure_veg_label || '100% Pure Vegetarian',
        address: data.address || '',
        location_landmark: data.location_landmark || '',
        phone: data.phone || '',
        whatsapp: data.whatsapp || '',
        opening_hours: data.opening_hours || '',
        hero_heading: data.hero_heading || '',
        hero_subheading: data.hero_subheading || '',
        announcement_enabled: data.announcement_enabled === '1' || data.announcement_enabled === true,
        announcement_text: data.announcement_text || '',
        army_discount_enabled: data.army_discount_enabled === '1' || data.army_discount_enabled === true,
        army_discount_text: data.army_discount_text || '',
        qr_target_url: targetUrl,
      });

      setLogoPreview(data.full_logo_url || data.logo_url || user?.canteen?.logo_url || '/logo.png');
    } catch {
      addToast('error', 'Failed to load restaurant settings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Generate QR Code whenever qr_target_url or primaryColor changes
  useEffect(() => {
    const generateQr = async () => {
      const url = formData.qr_target_url || autoEntityUrl;
      const urlWithParam = url.includes('?') ? `${url}&from_qr=1` : `${url}?from_qr=1`;
      try {
        const dataUrl = await QRCode.toDataURL(urlWithParam, {
          width: 600,
          margin: 2,
          color: {
            dark: primaryColor,
            light: '#FFFFFF',
          },
        });
        setQrDataUrl(dataUrl);
      } catch (err) {
        console.error('Failed to generate QR:', err);
      }
    };

    generateQr();
  }, [formData.qr_target_url, primaryColor, autoEntityUrl]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = new FormData();
      payload.append('restaurant_name', formData.restaurant_name);
      payload.append('tagline', formData.tagline);
      payload.append('pure_veg_label', formData.pure_veg_label);
      payload.append('address', formData.address);
      payload.append('location_landmark', formData.location_landmark);
      payload.append('phone', formData.phone);
      payload.append('whatsapp', formData.whatsapp);
      payload.append('opening_hours', formData.opening_hours);
      payload.append('hero_heading', formData.hero_heading);
      payload.append('hero_subheading', formData.hero_subheading);
      payload.append('announcement_enabled', formData.announcement_enabled ? '1' : '0');
      payload.append('announcement_text', formData.announcement_text);
      payload.append('army_discount_enabled', formData.army_discount_enabled ? '1' : '0');
      payload.append('army_discount_text', formData.army_discount_text);
      payload.append('qr_target_url', formData.qr_target_url || autoEntityUrl);

      if (settings?.id || user?.canteen_id) {
        payload.append('canteen_id', String(settings?.id || user?.canteen_id));
      }

      if (logoFile) {
        payload.append('logo', logoFile);
      }

      const res = await adminApi.updateSettings(payload);
      addToast('success', res.message || 'Settings updated successfully!');
      setSettings(res.settings);
    } catch {
      addToast('error', 'Failed to update restaurant settings');
    } finally {
      setIsSaving(false);
    }
  };

  // 1. Download Full Official Standee (PNG with all card details, logo, colors, address)
  const handleDownloadStandee = async () => {
    if (!qrDataUrl) return;
    setIsGeneratingStandee(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1750;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const pColor = primaryColor;
      const sColor = secondaryColor;
      const aColor = accentColor;
      const bg = bgColor || '#FAF8F1';
      const restName = formData.restaurant_name || settings?.restaurant_name || user?.canteen?.name || 'Restaurant';

      // 1. Canvas Outer Fill
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Card Background (Rounded)
      ctx.fillStyle = bg;
      drawRoundedRect(ctx, 40, 40, 1120, 1670, 48);
      ctx.fill();

      // Card Outer Border (Primary Theme Color)
      ctx.lineWidth = 14;
      ctx.strokeStyle = pColor;
      drawRoundedRect(ctx, 40, 40, 1120, 1670, 48);
      ctx.stroke();

      // Inner Accent Trim (Gold/Accent Color)
      ctx.lineWidth = 4;
      ctx.strokeStyle = aColor;
      drawRoundedRect(ctx, 56, 56, 1088, 1638, 40);
      ctx.stroke();

      // 2. Restaurant Logo
      const logoUrl = logoPreview || settings?.full_logo_url || settings?.logo_url || user?.canteen?.logo_url || '/logo.png';
      await drawLogoImage(ctx, logoUrl, 600, 200, 85, pColor, restName);

      // 3. Restaurant Name
      ctx.fillStyle = pColor;
      ctx.font = "bold 56px 'Playfair Display', Georgia, serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(restName, 600, 345);

      // 4. Tagline / Dietary Label
      ctx.fillStyle = sColor;
      ctx.font = "bold 26px -apple-system, BlinkMacSystemFont, sans-serif";
      const vegTag = (formData.pure_veg_label || formData.tagline || settings?.pure_veg_label || '100% PURE VEGETARIAN').toUpperCase();
      ctx.fillText(vegTag, 600, 410);

      // 5. White Rounded QR Container
      ctx.fillStyle = '#FFFFFF';
      drawRoundedRect(ctx, 225, 470, 750, 750, 40);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#E2E8F0';
      drawRoundedRect(ctx, 225, 470, 750, 750, 40);
      ctx.stroke();

      // 6. Draw QR Code
      if (qrDataUrl) {
        await drawQrImage(ctx, qrDataUrl, 260, 505, 680, 680);
      }

      // 7. Callout Heading
      ctx.fillStyle = pColor;
      ctx.font = "900 38px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText('SCAN TO VIEW FRESH DAILY MENU', 600, 1300);

      // 8. Location / Landmark (Dynamic from entity details!)
      ctx.fillStyle = '#57534E';
      ctx.font = "600 26px -apple-system, BlinkMacSystemFont, sans-serif";
      const addressText = formData.location_landmark || formData.address || settings?.location_landmark || settings?.address || 'Scan with any smartphone camera';
      wrapText(ctx, addressText, 600, 1365, 950, 36);

      // 9. Bottom Official Badge Pill
      ctx.fillStyle = pColor;
      drawRoundedRect(ctx, 300, 1530, 600, 64, 32);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = "bold 24px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText('✨ Official Table & Counter Standee', 600, 1562);

      // 10. Download Image
      const safeName = restName.replace(/[^a-zA-Z0-9_-]/g, '_');
      let dataUri: string;
      try {
        dataUri = canvas.toDataURL('image/png');
      } catch (corsErr) {
        console.warn('Canvas export triggered CORS security error, redrawing logo with monogram:', corsErr);
        // Clear logo circle area and redraw monogram
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(600, 200, 100, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.beginPath();
        ctx.arc(600, 200, 89, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.lineWidth = 6;
        ctx.strokeStyle = pColor;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(600, 200, 85, 0, Math.PI * 2);
        ctx.fillStyle = pColor;
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 50px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const initials = restName
          .split(' ')
          .map((w: string) => w[0])
          .slice(0, 2)
          .join('')
          .toUpperCase() || '🍽️';
        ctx.fillText(initials, 600, 200);
        ctx.restore();
        dataUri = canvas.toDataURL('image/png');
      }

      const link = document.createElement('a');
      link.download = `${safeName}_Official_QR_Standee.png`;
      link.href = dataUri;
      link.click();

      addToast('success', 'Official Standee Poster downloaded in high resolution (PNG)!');
    } catch (err) {
      console.error('Failed to generate standee:', err);
      addToast('error', 'Failed to generate standee poster.');
    } finally {
      setIsGeneratingStandee(false);
    }
  };

  // 2. Download QR Code Only
  const handleDownloadQrOnly = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    const safeName = (formData.restaurant_name || settings?.restaurant_name || 'Restaurant').replace(/[^a-zA-Z0-9_-]/g, '_');
    link.download = `${safeName}_Raw_QR.png`;
    link.href = qrDataUrl;
    link.click();
    addToast('info', 'QR code image downloaded.');
  };

  const handlePrintQr = () => {
    window.print();
  };

  return (
    <AdminLayout
      title="Restaurant Settings & QR Generation"
      subtitle="Control business information, contact channels, announcements, army honor discount, and permanent QR materials"
    >
      <Toast toasts={toasts} onDismiss={removeToast} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Form Column */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E3E0D6] shadow-sm space-y-6">
            <h3 className="font-serif font-bold text-lg text-[#063D29] pb-3 border-b border-[#E3E0D6] flex items-center justify-between">
              <span>General Information</span>
              <span className="text-xs font-sans font-medium text-[#72776F]">All changes reflect instantly on public menu</span>
            </h3>

            {/* Restaurant Name & Tagline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#063D29] mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.restaurant_name}
                  onChange={(e) => setFormData({ ...formData, restaurant_name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#FAF8F1] border border-[#E3E0D6] rounded-xl text-[#20251F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#063D29] mb-1">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#FAF8F1] border border-[#E3E0D6] rounded-xl text-[#20251F]"
                />
              </div>
            </div>

            {/* Address & Landmark */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#063D29] mb-1">
                  Full Physical Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#FAF8F1] border border-[#E3E0D6] rounded-xl text-[#20251F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#063D29] mb-1">
                  Mall Landmark / Floor Location
                </label>
                <input
                  type="text"
                  value={formData.location_landmark}
                  onChange={(e) => setFormData({ ...formData, location_landmark: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#FAF8F1] border border-[#E3E0D6] rounded-xl text-[#20251F]"
                />
              </div>
            </div>

            {/* Contact Phone & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#063D29] mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#FAF8F1] border border-[#E3E0D6] rounded-xl text-[#20251F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#063D29] mb-1">
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#FAF8F1] border border-[#E3E0D6] rounded-xl text-[#20251F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#063D29] mb-1">
                  Opening Hours
                </label>
                <input
                  type="text"
                  value={formData.opening_hours}
                  onChange={(e) => setFormData({ ...formData, opening_hours: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#FAF8F1] border border-[#E3E0D6] rounded-xl text-[#20251F]"
                />
              </div>
            </div>

            {/* Hero Heading & Subheading */}
            <div className="space-y-3 pt-3 border-t border-stone-100 text-xs sm:text-sm">
              <h4 className="font-bold text-[#063D29] uppercase tracking-wider text-xs">
                Public Menu Welcome Banner
              </h4>

              <div>
                <label className="block text-xs font-semibold text-[#72776F] mb-1">
                  Hero Headline
                </label>
                <input
                  type="text"
                  value={formData.hero_heading}
                  onChange={(e) => setFormData({ ...formData, hero_heading: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#FAF8F1] border border-[#E3E0D6] rounded-xl text-[#20251F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#72776F] mb-1">
                  Hero Subtext
                </label>
                <textarea
                  rows={2}
                  value={formData.hero_subheading}
                  onChange={(e) => setFormData({ ...formData, hero_subheading: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#FAF8F1] border border-[#E3E0D6] rounded-xl text-[#20251F]"
                />
              </div>
            </div>

            {/* Announcement Banner */}
            <div className="p-4 bg-[#FAF8F1] rounded-2xl border border-[#E3E0D6] space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#063D29] uppercase tracking-wider text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E8C928]" />
                  Notice / Announcement Banner
                </span>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.announcement_enabled}
                    onChange={(e) => setFormData({ ...formData, announcement_enabled: e.target.checked })}
                    className="w-4 h-4 text-[#075C35] rounded focus:ring-[#075C35]"
                  />
                  <span className="font-bold text-xs text-[#063D29]">Enable Banner</span>
                </label>
              </div>

              <input
                type="text"
                value={formData.announcement_text}
                onChange={(e) => setFormData({ ...formData, announcement_text: e.target.value })}
                placeholder="e.g. Special Breakfast Combos served till 11:30 AM daily!"
                className="w-full px-3.5 py-2 bg-white border border-[#E3E0D6] rounded-xl text-[#20251F]"
              />
            </div>

            {/* Indian Army Discount Notice */}
            <div className="p-4 bg-[#FAF8F1] rounded-2xl border border-[#E3E0D6] space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#063D29] uppercase tracking-wider text-xs flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#E8C928]" />
                  Indian Armed Forces Discount
                </span>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.army_discount_enabled}
                    onChange={(e) => setFormData({ ...formData, army_discount_enabled: e.target.checked })}
                    className="w-4 h-4 text-[#075C35] rounded focus:ring-[#075C35]"
                  />
                  <span className="font-bold text-xs text-[#063D29]">Honor Discount</span>
                </label>
              </div>

              <input
                type="text"
                value={formData.army_discount_text}
                onChange={(e) => setFormData({ ...formData, army_discount_text: e.target.value })}
                placeholder="e.g. 10% Discount for Indian Armed Forces personnel & veterans with valid ID."
                className="w-full px-3.5 py-2 bg-white border border-[#E3E0D6] rounded-xl text-[#20251F]"
              />
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#075C35] hover:bg-[#063D29] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-[#E8C928]" />
                <span>{isSaving ? 'Saving Settings...' : 'Save All Settings'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Permanent QR Code System Column */}
        <div className="space-y-6">
          {/* Print Isolation Stylesheet */}
          <style>{`
            @media print {
              body * {
                visibility: hidden !important;
              }
              #printable-qr-card, #printable-qr-card * {
                visibility: visible !important;
              }
              #printable-qr-card {
                position: fixed !important;
                left: 50% !important;
                top: 50% !important;
                transform: translate(-50%, -50%) scale(1.3) !important;
                width: 340px !important;
                margin: 0 !important;
                box-shadow: none !important;
                page-break-inside: avoid !important;
              }
            }
          `}</style>

          <div className="bg-white p-6 rounded-2xl border border-[#E3E0D6] shadow-sm">
            <h3 className="font-serif font-bold text-lg text-[#063D29] pb-3 border-b border-[#E3E0D6] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <QrIcon className="w-5 h-5 text-[#075C35]" />
                <span>Official QR Standee</span>
              </span>
              <span className="text-[11px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#075C35]">
                {entitySlug ? `Entity: ${entitySlug}` : 'Active Menu'}
              </span>
            </h3>

            {/* Target URL input */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#063D29]">
                  Permanent Public Menu URL
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, qr_target_url: autoEntityUrl }));
                    addToast('info', `Target URL set to live entity URL: ${autoEntityUrl}`);
                  }}
                  className="text-[11px] font-bold text-[#075C35] hover:text-[#063D29] bg-[#E8F5E9] hover:bg-[#C8E6C9] px-2 py-0.5 rounded-md transition-colors flex items-center gap-1 active:scale-95"
                  title="Auto-detect current domain & entity slug"
                >
                  <Sparkles className="w-3 h-3 text-[#E8C928]" />
                  <span>Auto-Detect Live URL</span>
                </button>
              </div>
              <input
                type="text"
                value={formData.qr_target_url}
                onChange={(e) => setFormData({ ...formData, qr_target_url: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF8F1] border border-[#E3E0D6] rounded-xl text-xs text-[#20251F] font-mono focus:ring-1 focus:ring-[#075C35] outline-none"
              />
              <p className="mt-1 text-[11px] text-[#72776F]">
                This QR code points permanently to this address. Changing menu items or prices will never invalidate printed standees.
              </p>
            </div>

            {/* Printable Preview Card matching exact Standee design */}
            <div
              id="printable-qr-card"
              style={{
                backgroundColor: bgColor || '#FAF8F1',
                borderColor: primaryColor || '#063D29',
              }}
              className="mt-6 p-5 rounded-2xl border-2 text-center shadow-md flex flex-col items-center transition-all"
            >
              <div
                style={{ borderColor: accentColor || '#E8C928' }}
                className="w-14 h-14 rounded-full overflow-hidden bg-white p-0.5 shadow-sm mb-2 border-2"
              >
                <img
                  src={logoPreview || settings?.full_logo_url || settings?.logo_url || user?.canteen?.logo_url || '/logo.png'}
                  alt={formData.restaurant_name || 'Logo'}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <h4
                style={{ color: primaryColor || '#063D29' }}
                className="font-serif font-extrabold text-base leading-tight"
              >
                {formData.restaurant_name || settings?.restaurant_name || user?.canteen?.name || 'Restaurant Canteen'}
              </h4>
              <p
                style={{ color: secondaryColor || '#075C35' }}
                className="text-[10px] font-bold uppercase tracking-wider mt-0.5"
              >
                {formData.pure_veg_label || formData.tagline || '100% PURE VEGETARIAN'}
              </p>

              {/* QR Image */}
              <div className="my-3 p-2 bg-white rounded-xl shadow-sm border border-stone-200">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Menu QR" className="w-44 h-44 object-contain" />
                ) : (
                  <div className="w-44 h-44 bg-stone-100 flex items-center justify-center text-xs text-stone-400">
                    Generating QR...
                  </div>
                )}
              </div>

              <p
                style={{ color: primaryColor || '#063D29' }}
                className="text-xs font-bold uppercase tracking-wide"
              >
                Scan To View Fresh Daily Menu
              </p>
              <p className="text-[10px] text-[#72776F] mt-0.5">
                {formData.location_landmark || formData.address || settings?.location_landmark || settings?.address || 'Scan with any smartphone camera'}
              </p>
            </div>

            {/* Action buttons: Download & Print */}
            <div className="mt-5 space-y-2">
              <button
                type="button"
                disabled={isGeneratingStandee || !qrDataUrl}
                onClick={handleDownloadStandee}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#075C35] hover:bg-[#063D29] text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-[#E8C928]" />
                <span>{isGeneratingStandee ? 'Generating High-Res Standee...' : 'Download PNG'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDownloadQrOnly}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#FAF8F1] hover:bg-[#F3EFE3] text-[#063D29] border border-[#E3E0D6] text-xs font-bold rounded-xl transition-all active:scale-95"
                >
                  <QrIcon className="w-3.5 h-3.5 text-[#075C35]" />
                  <span>QR Only (PNG)</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintQr}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#FAF8F1] hover:bg-[#F3EFE3] text-[#063D29] border border-[#E3E0D6] text-xs font-bold rounded-xl transition-all active:scale-95"
                >
                  <Printer className="w-3.5 h-3.5 text-[#075C35]" />
                  <span>Print Standee</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
