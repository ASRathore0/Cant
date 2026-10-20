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
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { Toast, ToastMessage } from '../components/Toast';
import { adminApi } from '../services/api';
import { RestaurantSettings } from '../types';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

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
    qr_target_url: 'http://localhost:5173/menu',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // QR Canvas
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

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
      const data = await adminApi.getSettings();
      setSettings(data);
      setFormData({
        restaurant_name: data.restaurant_name || 'Annapoorna Canteen',
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
        qr_target_url: data.qr_target_url || `${window.location.origin}/menu`,
      });

      setLogoPreview(data.full_logo_url || data.logo_url || '/logo.png');
    } catch {
      addToast('error', 'Failed to load restaurant settings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Generate QR Code whenever qr_target_url changes
  useEffect(() => {
    const generateQr = async () => {
      const url = formData.qr_target_url || `${window.location.origin}/menu`;
      const urlWithParam = url.includes('?') ? `${url}&from_qr=1` : `${url}?from_qr=1`;
      try {
        const dataUrl = await QRCode.toDataURL(urlWithParam, {
          width: 512,
          margin: 2,
          color: {
            dark: '#063D29',
            light: '#FFFFFF',
          },
        });
        setQrDataUrl(dataUrl);
      } catch (err) {
        console.error('Failed to generate QR:', err);
      }
    };

    generateQr();
  }, [formData.qr_target_url]);

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
      payload.append('qr_target_url', formData.qr_target_url);

      if (logoFile) {
        payload.append('logo', logoFile);
      }

      const res = await adminApi.updateSettings(payload);
      addToast('success', res.message);
      setSettings(res.settings);
    } catch {
      addToast('error', 'Failed to update restaurant settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = 'Annapoorna_Canteen_Menu_QR.png';
    link.href = qrDataUrl;
    link.click();
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
          <div className="bg-white p-6 rounded-2xl border border-[#E3E0D6] shadow-sm">
            <h3 className="font-serif font-bold text-lg text-[#063D29] pb-3 border-b border-[#E3E0D6] flex items-center gap-2">
              <QrIcon className="w-5 h-5 text-[#075C35]" />
              <span>Official QR Standee</span>
            </h3>

            {/* Target URL input */}
            <div className="mt-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#063D29] mb-1">
                Permanent Public Menu URL
              </label>
              <input
                type="text"
                value={formData.qr_target_url}
                onChange={(e) => setFormData({ ...formData, qr_target_url: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF8F1] border border-[#E3E0D6] rounded-xl text-xs text-[#20251F] font-mono"
              />
              <p className="mt-1 text-[11px] text-[#72776F]">
                This QR code points permanently to this address. Changing menu items or prices will never invalidate printed standees.
              </p>
            </div>

            {/* Printable Preview Card */}
            <div
              id="printable-qr-card"
              className="mt-6 bg-[#FAF8F1] p-5 rounded-2xl border-2 border-[#063D29] text-center shadow-md flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white p-0.5 shadow-sm mb-2">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover rounded-full" />
              </div>
              <h4 className="font-serif font-extrabold text-base text-[#063D29] leading-tight">
                Annapoorna Canteen
              </h4>
              <p className="text-[10px] text-[#075C35] font-bold uppercase tracking-wider mt-0.5">
                Food With Respect • 100% Pure Veg
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

              <p className="text-xs font-bold text-[#063D29] uppercase tracking-wide">
                Scan To View Fresh Daily Menu
              </p>
              <p className="text-[10px] text-[#72776F] mt-0.5">
                Gaur City Mall Basement Parking, Sec 4, Noida
              </p>
            </div>

            {/* Action buttons: Download & Print */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleDownloadQr}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#075C35] hover:bg-[#063D29] text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG</span>
              </button>

              <button
                type="button"
                onClick={handlePrintQr}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#FAF8F1] hover:bg-[#F3EFE3] text-[#063D29] border border-[#E3E0D6] text-xs font-bold rounded-xl transition-all active:scale-95"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Standee</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
