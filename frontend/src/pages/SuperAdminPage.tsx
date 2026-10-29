import React, { useState, useEffect, useRef } from 'react';
import {
  Building2,
  Building,
  Plus,
  Palette,
  Sparkles,
  Check,
  CheckCircle2,
  CheckCheck,
  Copy,
  ExternalLink,
  Trash2,
  Edit3,
  Image as ImageIcon,
  Upload,
  Globe,
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  Eye,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  Sliders,
  Layers,
  ArrowRight,
  ArrowLeft,
  Search,
  Info,
  X,
  FileText,
  UtensilsCrossed,
  Users,
  Receipt,
  Key,
  Lock,
  User as UserIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SuperAdminLayout } from '../components/SuperAdminLayout';
import { Toast, ToastMessage } from '../components/Toast';
import { adminApi, publicApi } from '../services/api';
import { Canteen, HeroTrioItem } from '../types';
import { DEFAULT_HERO_TRIO } from '../components/Hero';

const STICKER_PRESETS = [
  { id: 'burger', label: 'Burger', url: '/stickers/burger.jpg' },
  { id: 'tea', label: 'Hot Chai', url: '/stickers/tea.jpg' },
  { id: 'coffee', label: 'Filter Kaapi', url: '/stickers/coffee.jpg' },
  { id: 'samosa', label: 'Samosa', url: '/stickers/samosa.jpg' },
  { id: 'pizza', label: 'Cheesy Pizza', url: '/stickers/pizza.jpg' },
  { id: 'thali', label: 'Royal Thali', url: '/stickers/thali.jpg' },
];

// Theme Presets for fast onboarding
interface ThemePreset {
  id: string;
  name: string;
  description: string;
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
}

const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'emerald_heritage',
    name: 'Annapoorna Heritage',
    description: 'Deep forest green, warm gold & cream for authentic traditional pure-veg dining',
    primary: '#063D29',
    secondary: '#075C35',
    accent: '#E8C928',
    bg: '#FAF8F1',
  },
  {
    id: 'chai_bytes',
    name: 'Chai & Bytes (Tech Park)',
    description: 'Modern slate navy, vibrant electric cyan & cool gray for corporate campuses',
    primary: '#0F172A',
    secondary: '#1E293B',
    accent: '#06B6D4',
    bg: '#F8FAFC',
  },
  {
    id: 'spice_royale',
    name: 'Spice Royale (North Indian)',
    description: 'Regal maroon, amber saffron & warm ivory for rich tandoori & curry houses',
    primary: '#881337',
    secondary: '#9F1239',
    accent: '#F59E0B',
    bg: '#FFFBEB',
  },
  {
    id: 'urban_bistro',
    name: 'Urban Bistro & Grill',
    description: 'Matte charcoal, fiery orange & clean silver for youth cafes and burgers',
    primary: '#18181B',
    secondary: '#27272A',
    accent: '#EA580C',
    bg: '#F4F4F5',
  },
  {
    id: 'green_leaf',
    name: 'Fresh Organic Leaf',
    description: 'Lush meadow green, crisp lime & mint tint for healthy bowls and juice bars',
    primary: '#166534',
    secondary: '#15803D',
    accent: '#84CC16',
    bg: '#F0FDF4',
  },
  {
    id: 'midnight_luxe',
    name: 'Midnight Luxe Lounge',
    description: 'Onyx black, deep gold & sleek pearl for premium multi-cuisine hubs',
    primary: '#09090B',
    secondary: '#18181B',
    accent: '#D97706',
    bg: '#FAFAFA',
  },
];

export type SuperAdminTab = 'network' | 'onboard' | 'studio' | 'managers';

export const SuperAdminPage: React.FC = () => {
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [selectedCanteen, setSelectedCanteen] = useState<Canteen | null>(null);
  const [activeTab, setActiveTab] = useState<SuperAdminTab>('network');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedPass, setCopiedPass] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [emulatingCanteenId, setEmulatingCanteenId] = useState<number | null>(null);

  // Modals
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);
  const [cloneTargetCanteen, setCloneTargetCanteen] = useState<Canteen | null>(null);
  const [cloneSourceId, setCloneSourceId] = useState<number | ''>('');
  const [isCloning, setIsCloning] = useState(false);

  // New Canteen Form
  const [newCanteenForm, setNewCanteenForm] = useState({
    name: '',
    page_title: '',
    slug: '',
    tagline: '',
    favicon_url: '',
    dietary_type: 'pure_veg' as Canteen['dietary_type'],
    pure_veg_label: '100% Pure Vegetarian',
    manager_name: '',
    manager_email: '',
    manager_password: '',
    address: '',
    location_landmark: '',
    phone: '',
    whatsapp: '',
    opening_hours: '08:00 AM – 10:30 PM',
    hero_heading: 'Freshly Cooked & Brewed Daily',
    hero_badge: "Today's Specials",
    hero_trio: DEFAULT_HERO_TRIO,
    hero_subheading: '',
    primary_color: '#063D29',
    secondary_color: '#075C35',
    accent_color: '#E8C928',
    bg_color: '#FAF8F1',
    theme_preset: 'emerald_heritage',
    billing_enabled: true,
    digital_ebill_enabled: true,
    whatsapp_billing_enabled: true,
    whatsapp_auto_send_enabled: false,
    whatsapp_api_phone_id: '',
    whatsapp_api_token: '',
    whatsapp_api_template: '',
    clone_from_default: true,
  });
  const [newLogoFile, setNewLogoFile] = useState<File | null>(null);
  const [newLogoPreview, setNewLogoPreview] = useState<string | null>(null);
  const [newFaviconFile, setNewFaviconFile] = useState<File | null>(null);
  const [newFaviconPreview, setNewFaviconPreview] = useState<string | null>(null);

  // Manager Credentials Modal State
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const [managerTargetCanteen, setManagerTargetCanteen] = useState<Canteen | null>(null);
  const [managerForm, setManagerForm] = useState({
    manager_id: undefined as number | undefined,
    name: '',
    email: '',
    password: '',
  });
  const [isSavingManager, setIsSavingManager] = useState(false);

  // Studio Edit Form
  const [editForm, setEditForm] = useState<Partial<Canteen>>({});
  const [editLogoFile, setEditLogoFile] = useState<File | null>(null);
  const [editLogoPreview, setEditLogoPreview] = useState<string | null>(null);
  const [editFaviconFile, setEditFaviconFile] = useState<File | null>(null);
  const [editFaviconPreview, setEditFaviconPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const newFileInputRef = useRef<HTMLInputElement | null>(null);
  const faviconInputRef = useRef<HTMLInputElement | null>(null);
  const newFaviconInputRef = useRef<HTMLInputElement | null>(null);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const fetchCanteens = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getCanteens();
      setCanteens(data || []);
      if (data && data.length > 0) {
        // Keep current selected if exists, else pick default or first
        const found = selectedCanteen ? data.find((c) => c.id === selectedCanteen.id) : null;
        const active = found || data.find((c) => c.is_default) || data[0];
        setSelectedCanteen(active);
        populateEditForm(active);
      }
    } catch (err: any) {
      console.error('Failed to load canteens:', err);
      addToast('error', 'Unable to fetch canteens list.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCanteens();
  }, []);

  const populateEditForm = (canteen: Canteen) => {
    let trio = canteen.hero_trio;
    if (typeof trio === 'string') {
      try {
        trio = JSON.parse(trio);
      } catch (e) {
        trio = DEFAULT_HERO_TRIO;
      }
    }
    if (!Array.isArray(trio) || trio.length < 3) {
      trio = DEFAULT_HERO_TRIO;
    }

    setEditForm({
      ...canteen,
      hero_badge: canteen.hero_badge || "Today's Specials",
      hero_heading: canteen.hero_heading || 'Freshly Cooked & Brewed Daily',
      hero_trio: trio,
    });
    setEditLogoFile(null);
    setEditLogoPreview(canteen.full_logo_url || canteen.logo_url || null);
    setEditFaviconFile(null);
    setEditFaviconPreview(canteen.full_favicon_url || canteen.favicon_url || null);
  };

  const handleUpdateTrioItem = (
    index: number,
    field: keyof HeroTrioItem,
    value: any
  ) => {
    setEditForm((prev) => {
      const currentTrio = Array.isArray(prev.hero_trio) && prev.hero_trio.length >= 3
        ? [...prev.hero_trio]
        : [...DEFAULT_HERO_TRIO];

      currentTrio[index] = {
        ...currentTrio[index],
        [field]: value,
      };

      return {
        ...prev,
        hero_trio: currentTrio,
      };
    });
  };

  const [uploadingTrioIdx, setUploadingTrioIdx] = useState<number | null>(null);
  const trioFileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleTrioFileUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      addToast('error', 'Image file must be under 5MB.');
      return;
    }

    setUploadingTrioIdx(idx);
    try {
      const res = await adminApi.uploadMedia(file, 'stickers');
      handleUpdateTrioItem(idx, 'stickerUrl', res.url);
      addToast('success', `Icon/Sticker for Item ${idx + 1} uploaded successfully!`);
    } catch (err: any) {
      console.error('Failed to upload sticker:', err);
      const msg = err.response?.data?.message || 'Failed to upload image.';
      addToast('error', msg);
    } finally {
      setUploadingTrioIdx(null);
      e.target.value = '';
    }
  };

  const handleSelectCanteenForStudio = (canteen: Canteen) => {
    setSelectedCanteen(canteen);
    populateEditForm(canteen);
    setActiveTab('studio');
  };

  const handleApplyPresetToEdit = (preset: ThemePreset) => {
    setEditForm((prev) => ({
      ...prev,
      primary_color: preset.primary,
      secondary_color: preset.secondary,
      accent_color: preset.accent,
      bg_color: preset.bg,
      theme_preset: preset.id,
    }));
    addToast('info', `Applied ${preset.name} theme palette.`);
  };

  const handleApplyPresetToNew = (preset: ThemePreset) => {
    setNewCanteenForm((prev) => ({
      ...prev,
      primary_color: preset.primary,
      secondary_color: preset.secondary,
      accent_color: preset.accent,
      bg_color: preset.bg,
      theme_preset: preset.id,
    }));
  };

  const handleEditLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        addToast('error', 'Logo image file must be under 2MB.');
        return;
      }
      setEditLogoFile(file);
      const reader = new FileReader();
      reader.onload = () => setEditLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleNewLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        addToast('error', 'Logo image file must be under 2MB.');
        return;
      }
      setNewLogoFile(file);
      const reader = new FileReader();
      reader.onload = () => setNewLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleEditFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        addToast('error', 'Favicon file must be under 2MB.');
        return;
      }
      setEditFaviconFile(file);
      const reader = new FileReader();
      reader.onload = () => setEditFaviconPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleNewFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        addToast('error', 'Favicon file must be under 2MB.');
        return;
      }
      setNewFaviconFile(file);
      const reader = new FileReader();
      reader.onload = () => setNewFaviconPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const [isSavingTheme, setIsSavingTheme] = useState(false);

  const handleSaveThemeOnly = async () => {
    if (!selectedCanteen) return;
    setIsSavingTheme(true);
    try {
      const payload = {
        name: editForm.name || selectedCanteen.name,
        primary_color: editForm.primary_color || '#063D29',
        secondary_color: editForm.secondary_color || '#075C35',
        accent_color: editForm.accent_color || '#E8C928',
        bg_color: editForm.bg_color || '#FAF8F1',
        theme_preset: editForm.theme_preset || 'emerald_heritage',
      };

      const res = await adminApi.updateCanteen(selectedCanteen.id, payload);
      addToast('success', `Theme palette updated & saved for "${selectedCanteen.name}"!`);
      const updatedCanteen = res.data || (res as any).canteen;
      if (updatedCanteen) {
        setSelectedCanteen(updatedCanteen);
        populateEditForm(updatedCanteen);
      }
      const updatedList = await adminApi.getCanteens();
      setCanteens(updatedList);
    } catch (err: any) {
      console.error('Failed to update theme palette:', err);
      const msg = err.response?.data?.message || 'Failed to save theme palette.';
      addToast('error', msg);
    } finally {
      setIsSavingTheme(false);
    }
  };

  const handleToggleBilling = async (canteen: Canteen, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextState = canteen.billing_enabled === false ? true : false;
    try {
      const formData = new FormData();
      formData.append('billing_enabled', nextState ? '1' : '0');
      const res = await adminApi.updateCanteen(canteen.id, formData);
      addToast(
        'success',
        `Billing & POS feature ${nextState ? 'ACTIVATED' : 'DEACTIVATED'} for "${canteen.name}"!`
      );
      const updatedList = await adminApi.getCanteens();
      setCanteens(updatedList);
      if (selectedCanteen?.id === canteen.id) {
        const fresh = updatedList.find((c) => c.id === canteen.id);
        if (fresh) {
          setSelectedCanteen(fresh);
          populateEditForm(fresh);
        }
      }
    } catch (err: any) {
      console.error('Failed to toggle billing:', err);
      addToast('error', 'Failed to update billing feature status.');
    }
  };

  const handleToggleFeature = async (
    canteen: Canteen,
    feature: 'billing_enabled' | 'digital_ebill_enabled' | 'whatsapp_billing_enabled' | 'whatsapp_auto_send_enabled',
    label: string,
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation();
    const currentState = feature === 'whatsapp_auto_send_enabled'
      ? (canteen as any)[feature] === true
      : (canteen as any)[feature] !== false;
    const nextState = !currentState;
    try {
      const formData = new FormData();
      formData.append(feature, nextState ? '1' : '0');
      await adminApi.updateCanteen(canteen.id, formData);
      addToast(
        'success',
        `${label} ${nextState ? 'ACTIVATED' : 'DEACTIVATED'} for "${canteen.name}"!`
      );
      const updatedList = await adminApi.getCanteens();
      setCanteens(updatedList);
      if (selectedCanteen?.id === canteen.id) {
        const fresh = updatedList.find((c) => c.id === canteen.id);
        if (fresh) {
          setSelectedCanteen(fresh);
          populateEditForm(fresh);
        }
      }
    } catch (err: any) {
      console.error(`Failed to toggle ${feature}:`, err);
      addToast('error', `Failed to update ${label.toLowerCase()} status.`);
    }
  };

  const handleSaveStudioChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCanteen) return;

    setIsSaving(true);
    try {
      const formData = new FormData();
      const IGNORED_KEYS = [
        'id',
        'logo_url',
        'full_logo_url',
        'managers',
        'categories',
        'categories_count',
        'menu_items_count',
        'created_at',
        'updated_at',
        'deleted_at',
      ];

      Object.entries(editForm).forEach(([key, val]) => {
        if (IGNORED_KEYS.includes(key)) return;
        if (val !== undefined && val !== null) {
          if (typeof val === 'boolean') {
            formData.append(key, val ? '1' : '0');
          } else if (key === 'hero_trio' || typeof val === 'object') {
            formData.append(key, JSON.stringify(val));
          } else {
            formData.append(key, String(val));
          }
        }
      });

      if (editLogoFile) {
        formData.append('logo', editLogoFile);
      }
      if (editFaviconFile) {
        formData.append('favicon', editFaviconFile);
      }

      const res = await adminApi.updateCanteen(selectedCanteen.id, formData);
      addToast('success', res.message || 'Canteen branding & theme saved!');
      const updatedCanteen = res.data || (res as any).canteen;
      if (updatedCanteen) {
        setSelectedCanteen(updatedCanteen);
        populateEditForm(updatedCanteen);
      }
      // Refresh list in background
      const updatedList = await adminApi.getCanteens();
      setCanteens(updatedList);
    } catch (err: any) {
      console.error('Failed to update canteen:', err);
      const msg = err.response?.data?.message || 'Failed to save changes.';
      addToast('error', msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateCanteen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCanteenForm.name.trim()) {
      addToast('error', 'Canteen name is required.');
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      Object.entries(newCanteenForm).forEach(([key, val]) => {
        if (key === 'clone_from_default') return;
        if (typeof val === 'boolean') {
          formData.append(key, val ? '1' : '0');
        } else if (key === 'hero_trio' || typeof val === 'object') {
          formData.append(key, JSON.stringify(val));
        } else {
          formData.append(key, String(val));
        }
      });

      if (newLogoFile) {
        formData.append('logo', newLogoFile);
      }
      if (newFaviconFile) {
        formData.append('favicon', newFaviconFile);
      }

      const res = await adminApi.createCanteen(formData);
      const newCanteen = res.data;
      addToast('success', `Canteen "${newCanteen.name}" onboarded successfully!`);

      // If clone menu requested, trigger menu clone from default
      if (newCanteenForm.clone_from_default) {
        const defaultCanteen = canteens.find((c) => c.is_default) || canteens[0];
        if (defaultCanteen) {
          try {
            await adminApi.cloneMenu(newCanteen.id, defaultCanteen.id);
            addToast('info', `Cloned ${defaultCanteen.name} categories & dishes into new canteen!`);
          } catch (cloneErr) {
            console.warn('Auto-clone failed:', cloneErr);
          }
        }
      }

      setIsOnboardModalOpen(false);
      // Reset form
      setNewCanteenForm({
        name: '',
        page_title: '',
        slug: '',
        tagline: '',
        favicon_url: '',
        dietary_type: 'pure_veg',
        pure_veg_label: '100% Pure Vegetarian',
        manager_name: '',
        manager_email: '',
        manager_password: '',
        address: '',
        location_landmark: '',
        phone: '',
        whatsapp: '',
        opening_hours: '08:00 AM – 10:30 PM',
        hero_heading: 'Freshly Cooked & Brewed Daily',
        hero_badge: "Today's Specials",
        hero_trio: DEFAULT_HERO_TRIO,
        hero_subheading: '',
        primary_color: '#063D29',
        secondary_color: '#075C35',
        accent_color: '#E8C928',
        bg_color: '#FAF8F1',
        theme_preset: 'emerald_heritage',
        billing_enabled: true,
        digital_ebill_enabled: true,
        whatsapp_billing_enabled: true,
        whatsapp_auto_send_enabled: false,
        whatsapp_api_phone_id: '',
        whatsapp_api_token: '',
        whatsapp_api_template: '',
        clone_from_default: true,
      });
      setNewLogoFile(null);
      setNewLogoPreview(null);
      setNewFaviconFile(null);
      setNewFaviconPreview(null);

      // Refresh list and select the new canteen
      await fetchCanteens();
      handleSelectCanteenForStudio(newCanteen);
    } catch (err: any) {
      console.error('Failed to create canteen:', err);
      const msg = err.response?.data?.message || 'Failed to onboard new canteen.';
      addToast('error', msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenManagerModal = (canteen: Canteen) => {
    setManagerTargetCanteen(canteen);
    const existingManager = canteen.managers && canteen.managers.length > 0 ? canteen.managers[0] : null;
    setManagerForm({
      manager_id: existingManager ? existingManager.id : undefined,
      name: existingManager ? existingManager.name : (canteen.name + ' Manager'),
      email: existingManager ? existingManager.email : '',
      password: '',
    });
    setIsManagerModalOpen(true);
  };

  const handleSaveManager = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managerTargetCanteen) return;
    setIsSavingManager(true);
    try {
      const res = await adminApi.upsertCanteenManager(managerTargetCanteen.id, managerForm);
      addToast('success', res.message || 'Manager credentials updated successfully!');
      setIsManagerModalOpen(false);
      await fetchCanteens();
    } catch (err: any) {
      console.error('Failed to save manager:', err);
      const msg = err.response?.data?.message || 'Failed to save manager credentials.';
      addToast('error', msg);
    } finally {
      setIsSavingManager(false);
    }
  };

  const handleEmulateManager = async (canteen: Canteen) => {
    setEmulatingCanteenId(canteen.id);
    try {
      // 1. Back up current Super Admin session to restore later
      const currentToken = localStorage.getItem('annapoorna_token');
      const currentUser = localStorage.getItem('annapoorna_user');
      if (currentToken && currentUser) {
        localStorage.setItem(
          'emulating_from_super_admin',
          JSON.stringify({
            token: currentToken,
            user: JSON.parse(currentUser),
            emulating_canteen_id: canteen.id,
            emulating_canteen_name: canteen.name,
          })
        );
      }

      // 2. Obtain manager session without password
      const res = await adminApi.emulateCanteenManager(canteen.id);

      // 3. Switch active user context to manager
      login(res.token, res.user);

      addToast('success', `Emulating ${res.user.name} for ${canteen.name}. Opening Manager Dashboard...`);

      // 4. Navigate to manager dashboard
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 350);
    } catch (err: any) {
      console.error('Failed to emulate manager:', err);
      localStorage.removeItem('emulating_from_super_admin');
      const msg = err.response?.data?.message || 'Failed to emulate manager account.';
      addToast('error', msg);
    } finally {
      setEmulatingCanteenId(null);
    }
  };

  const handleSetDefault = async (canteen: Canteen) => {
    try {
      await adminApi.setDefaultCanteen(canteen.id);
      addToast('success', `"${canteen.name}" is now the primary default canteen!`);
      await fetchCanteens();
    } catch (err: any) {
      addToast('error', 'Failed to update default canteen.');
    }
  };

  const handleDeleteCanteen = async (canteen: Canteen) => {
    if (canteen.is_default) {
      addToast('error', 'Cannot delete the default canteen. Please set another canteen as default first.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${canteen.name}"? This will permanently remove its specific menu items and branding.`)) {
      return;
    }

    try {
      await adminApi.deleteCanteen(canteen.id);
      addToast('success', `Canteen "${canteen.name}" deleted.`);
      await fetchCanteens();
    } catch (err: any) {
      addToast('error', 'Failed to delete canteen.');
    }
  };

  const handleOpenCloneModal = (canteen: Canteen) => {
    setCloneTargetCanteen(canteen);
    const otherCanteen = canteens.find((c) => c.id !== canteen.id);
    setCloneSourceId(otherCanteen ? otherCanteen.id : '');
    setIsCloneModalOpen(true);
  };

  const handleExecuteClone = async () => {
    if (!cloneTargetCanteen || !cloneSourceId) return;
    setIsCloning(true);
    try {
      const res = await adminApi.cloneMenu(cloneTargetCanteen.id, Number(cloneSourceId));
      addToast('success', `Cloned ${res.categories_cloned} categories & ${res.items_cloned} items into ${cloneTargetCanteen.name}!`);
      setIsCloneModalOpen(false);
      await fetchCanteens();
    } catch (err: any) {
      addToast('error', 'Menu clone failed.');
    } finally {
      setIsCloning(false);
    }
  };

  // Live preview helpers
  const previewName = editForm.name || selectedCanteen?.name || 'Canteen Name';
  const previewTagline = editForm.tagline || selectedCanteen?.tagline || 'Fresh Food & Beverages';
  const previewPrimary = editForm.primary_color || '#063D29';
  const previewSecondary = editForm.secondary_color || '#075C35';
  const previewAccent = editForm.accent_color || '#E8C928';
  const previewBg = editForm.bg_color || '#FAF8F1';
  const previewDietary = editForm.pure_veg_label || '100% Pure Vegetarian';
  const previewHeroHeading = editForm.hero_heading || 'Good Food. Made Fresh. Served with Respect.';
  const previewAddress = editForm.location_landmark || editForm.address || 'Basement Parking, City Food Mall';

  const filteredCanteens = canteens.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      (c.address && c.address.toLowerCase().includes(q)) ||
      (c.tagline && c.tagline.toLowerCase().includes(q))
    );
  });

  return (
    <SuperAdminLayout
      activeSection={
        activeTab === 'network'
          ? 'directory'
          : activeTab === 'onboard'
          ? 'onboard'
          : activeTab === 'studio'
          ? 'studio'
          : 'managers'
      }
      onSelectSection={(s) => {
        if (s === 'directory') {
          setActiveTab('network');
          setIsOnboardModalOpen(false);
        } else if (s === 'onboard') {
          setActiveTab('onboard');
          setIsOnboardModalOpen(false);
        } else if (s === 'studio') {
          setActiveTab('studio');
          setIsOnboardModalOpen(false);
        } else if (s === 'managers') {
          setActiveTab('managers');
          setIsOnboardModalOpen(false);
        }
      }}
      title="Super Admin Master Control Hub"
      subtitle="Onboard new venues, generate manager accounts, customize themes, body styles and live slidable hero stickers"
    >
      <Toast toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* Top Search & Filter Bar (shown on Directory tab) */}
      {activeTab === 'network' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search establishments by name, slug or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white text-stone-800 rounded-2xl border border-[#E3E0D6] focus:outline-none focus:ring-2 focus:ring-[#10B981] text-xs sm:text-sm placeholder:text-stone-400 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-stone-500 bg-white px-3 py-2 rounded-xl border border-[#E3E0D6] shadow-2xs">
              {filteredCanteens.length} of {canteens.length} Outlets
            </span>
            <button
              onClick={() => setActiveTab('onboard')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#063D29] to-[#075C35] hover:from-[#04281B] hover:to-[#063D29] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 text-[#E8C928]" />
              <span>Onboard New Establishment</span>
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-[#E3E0D6]">
          <div className="w-10 h-10 border-4 border-[#075C35] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-stone-500">Loading canteens & branding profiles...</p>
        </div>
      ) : activeTab === 'network' ? (
        /* ========================================================================= */
        /* TAB 1: CANTEEN NETWORK HUB                                                */
        /* ========================================================================= */
        <div className="space-y-6">
          {/* Quick Info Hero */}
          <div className="bg-gradient-to-r from-[#063D29] via-[#075C35] to-[#062D1F] text-white rounded-3xl p-5 sm:p-7 shadow-sm border border-[#0B3B29] relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#E8C928] text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Multi-Tenant Architecture Ready
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif">
                Manage, Brand & Expand Food Locations
              </h2>
              <p className="text-xs sm:text-sm text-stone-200 mt-1 leading-relaxed">
                Each canteen gets its own tailored theme, colors, logo, dietary guidelines, and menu catalog. Share custom links or QR codes that automatically adapt to each branch's branding.
              </p>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-10 translate-y-10">
              <Building2 className="w-64 h-64 text-white" />
            </div>
          </div>

          {/* Canteen Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCanteens.map((canteen) => {
              const isSelected = selectedCanteen?.id === canteen.id;
              return (
                <div
                  key={canteen.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md flex flex-col justify-between ${
                    isSelected ? 'ring-2 ring-[#075C35] border-[#075C35]' : 'border-[#E3E0D6]'
                  }`}
                >
                  {/* Card Header with Theme Strip */}
                  <div>
                    <div
                      className="h-3 w-full"
                      style={{
                        background: `linear-gradient(90deg, ${canteen.primary_color} 0%, ${canteen.secondary_color} 50%, ${canteen.accent_color} 100%)`,
                      }}
                    />

                    <div className="p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-stone-100 p-0.5 border border-stone-200 shrink-0 flex items-center justify-center">
                            {canteen.full_logo_url || canteen.logo_url ? (
                              <img
                                src={canteen.full_logo_url || canteen.logo_url!}
                                alt={canteen.name}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <UtensilsCrossed className="w-6 h-6 text-stone-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-serif font-bold text-base text-[#20251F] truncate leading-tight">
                              {canteen.name}
                            </h3>
                            <p className="text-xs text-[#72776F] truncate">{canteen.tagline || 'Digital Food Menu'}</p>
                          </div>
                        </div>

                        {canteen.is_default ? (
                          <span className="inline-flex items-center gap-1 bg-[#E8C928]/20 text-[#063D29] border border-[#E8C928]/40 text-[10px] font-black px-2 py-0.5 rounded-full shrink-0">
                            <CheckCircle2 className="w-3 h-3 text-[#063D29]" />
                            PRIMARY
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider shrink-0">
                            BRANCH
                          </span>
                        )}
                      </div>

                      {/* Details summary */}
                      <div className="space-y-1.5 text-xs text-[#72776F] my-3 border-y border-stone-100 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#075C35] shrink-0" />
                          <span className="truncate">{canteen.location_landmark || canteen.address || 'Address not configured'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#E8C928] shrink-0" />
                          <span className="truncate font-medium text-stone-700">{canteen.pure_veg_label}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] pt-1">
                          <span className="text-stone-500">Categories: <strong>{canteen.categories_count ?? 0}</strong></span>
                          <span className="text-stone-500">Dishes: <strong>{canteen.menu_items_count ?? 0}</strong></span>
                          <span className="text-stone-400 font-mono text-[10px]">/{canteen.slug}</span>
                        </div>
                      </div>

                      {/* Theme Swatch Preview */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-[11px] text-stone-500">Theme Palette</span>
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded-full border border-black/10 shadow-2xs" style={{ backgroundColor: canteen.primary_color }} title="Primary" />
                          <div className="w-4 h-4 rounded-full border border-black/10 shadow-2xs" style={{ backgroundColor: canteen.secondary_color }} title="Secondary" />
                          <div className="w-4 h-4 rounded-full border border-black/10 shadow-2xs" style={{ backgroundColor: canteen.accent_color }} title="Accent" />
                          <div className="w-4 h-4 rounded-full border border-black/10 shadow-2xs" style={{ backgroundColor: canteen.bg_color }} title="Background" />
                        </div>
                      </div>

                      {/* Billing & POS Feature Toggle Pill */}
                      <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                        <span className="text-stone-500 font-medium flex items-center gap-1">
                          <Receipt className="w-3 h-3 text-stone-400" />
                          POS & Billing:
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleToggleBilling(canteen, e)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                            canteen.billing_enabled !== false
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 shadow-2xs'
                              : 'bg-stone-100 text-stone-500 border-stone-300 hover:bg-stone-200'
                          }`}
                          title="Click to enable or disable billing & ordering features for this restaurant"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${canteen.billing_enabled !== false ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
                          <span>{canteen.billing_enabled !== false ? 'Active' : 'Off'}</span>
                        </button>
                      </div>

                      {/* WhatsApp & Digital E-Bill Options Pill */}
                      <div className="mt-1.5 pt-1.5 border-t border-stone-100 flex items-center justify-between text-[11px]">
                        <span className="text-stone-500 font-medium flex items-center gap-1">
                          <MessageCircle className="w-3 h-3 text-emerald-600" />
                          WhatsApp & E-Bill:
                        </span>
                        <div className="flex items-center gap-1">
                          {/* Option 1: Digital E-Bill */}
                          <button
                            type="button"
                            onClick={(e) => handleToggleFeature(canteen, 'digital_ebill_enabled', 'Digital E-Bill', e)}
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                              canteen.digital_ebill_enabled !== false
                                ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                                : 'bg-stone-100 text-stone-400 border-stone-200 hover:bg-stone-200'
                            }`}
                            title="Option 1: Digital E-Bill Webpage (/receipt/:orderNumber)"
                          >
                            E-Bill
                          </button>

                          {/* Option 2: 1-Click WhatsApp Direct */}
                          <button
                            type="button"
                            onClick={(e) => handleToggleFeature(canteen, 'whatsapp_billing_enabled', 'WhatsApp 1-Click Bill', e)}
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                              canteen.whatsapp_billing_enabled !== false
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-stone-100 text-stone-400 border-stone-200 hover:bg-stone-200'
                            }`}
                            title="Option 2: 1-Click WhatsApp Direct Bill (wa.me)"
                          >
                            wa.me
                          </button>

                          {/* Option 3: Auto WhatsApp Cloud API */}
                          <button
                            type="button"
                            onClick={(e) => handleToggleFeature(canteen, 'whatsapp_auto_send_enabled', 'Auto WhatsApp API', e)}
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                              canteen.whatsapp_auto_send_enabled
                                ? 'bg-teal-700 text-white border-teal-800 shadow-2xs animate-pulse'
                                : 'bg-stone-100 text-stone-400 border-stone-200 hover:bg-stone-200'
                            }`}
                            title="Option 3: Automated WhatsApp Cloud API Dispatch"
                          >
                            Auto API
                          </button>
                        </div>
                      </div>

                      {/* Assigned Manager */}
                      <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                        <span className="text-stone-400 font-medium">Manager:</span>
                        {canteen.managers && canteen.managers.length > 0 ? (
                          <button
                            onClick={() => handleOpenManagerModal(canteen)}
                            className="inline-flex items-center gap-1 text-[#075C35] font-semibold hover:underline"
                            title="Manage manager account"
                          >
                            <UserIcon className="w-3 h-3 text-[#075C35]" />
                            <span className="truncate max-w-[130px]">{canteen.managers[0].email}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenManagerModal(canteen)}
                            className="inline-flex items-center gap-1 text-amber-600 font-semibold hover:underline"
                            title="Assign a manager account"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Manager</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="bg-stone-50 px-4 py-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEmulateManager(canteen)}
                        disabled={emulatingCanteenId === canteen.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] shadow-2xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                        title={`Login without password as manager of ${canteen.name}`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-100" />
                        <span>{emulatingCanteenId === canteen.id ? 'Connecting...' : 'Emulate'}</span>
                      </button>

                      <button
                        onClick={() => handleSelectCanteenForStudio(canteen)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#075C35] hover:text-[#04281B] transition-colors px-2 py-1.5 rounded-lg hover:bg-white"
                      >
                        <Palette className="w-3.5 h-3.5" />
                        <span>Studio</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenManagerModal(canteen)}
                        className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-stone-200"
                        title="Manage Manager Credentials (Email & Password)"
                      >
                        <Key className="w-3.5 h-3.5 text-stone-600 hover:text-emerald-700" />
                      </button>

                      <a
                        href={`/c/${canteen.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-stone-500 hover:text-[#063D29] hover:bg-white rounded-lg transition-colors border border-transparent hover:border-stone-200"
                        title={`Open Customer Menu (/c/${canteen.slug})`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => {
                          const url = `${window.location.origin}/c/${canteen.slug}`;
                          navigator.clipboard.writeText(url);
                          addToast('info', `Copied link: ${url}`);
                        }}
                        className="p-1.5 text-stone-500 hover:text-[#063D29] hover:bg-white rounded-lg transition-colors border border-transparent hover:border-stone-200"
                        title="Copy Customer Menu Link"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleOpenCloneModal(canteen)}
                        className="p-1.5 text-stone-500 hover:text-blue-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-stone-200"
                        title="Clone Menu from Another Canteen"
                      >
                        <Copy className="w-3.5 h-3.5 text-blue-500" />
                      </button>

                      {!canteen.is_default && (
                        <>
                          <button
                            onClick={() => handleSetDefault(canteen)}
                            className="p-1.5 text-stone-500 hover:text-amber-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-stone-200"
                            title="Set as Default Canteen"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteCanteen(canteen)}
                            className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-stone-200"
                            title="Delete Canteen"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredCanteens.length === 0 && (
              <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-[#E3E0D6] p-8">
                <Building2 className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-stone-700">No establishments found</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                  {searchQuery ? `No establishments match your search "${searchQuery}".` : 'No outlets have been created yet.'}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveTab('onboard');
                  }}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-[#063D29] hover:bg-[#04281B] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-[#E8C928]" />
                  <span>Onboard New Establishment</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'onboard' ? (
        /* ========================================================================= */
        /* TAB 2: DEDICATED FULL-PAGE ONBOARDING STUDIO                             */
        /* ========================================================================= */
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] border border-slate-700/60 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#047857] flex items-center justify-center text-white shadow-lg shadow-[#10B981]/25 ring-1 ring-white/20">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
                      Onboard New Establishment
                    </h2>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30">
                      Multi-Tenant Engine
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                    Configure restaurant & cafe branding, URL slug, dedicated manager credentials, and optionally duplicate the full starter menu catalog.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('network')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Directory</span>
              </button>
            </div>
          </div>

          {/* Form & Live Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Cols: The Form */}
            <div className="lg:col-span-7 space-y-6">
              <form onSubmit={handleCreateCanteen} className="space-y-6">
                {/* 1. Basic Info */}
                <div className="bg-white rounded-3xl border border-[#E3E0D6] p-5 sm:p-7 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
                    <Building className="w-5 h-5 text-[#075C35]" />
                    <h3 className="font-serif font-bold text-base text-[#20251F]">
                      1. Establishment Identity & Location
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Outlet / Restaurant Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Chai & Bytes Cafe"
                        value={newCanteenForm.name}
                        onChange={(e) => {
                          const name = e.target.value;
                          const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
                          setNewCanteenForm({ ...newCanteenForm, name, slug });
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#075C35] text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        URL Identifier Slug *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. chai-bytes-cafe"
                        value={newCanteenForm.slug}
                        onChange={(e) => setNewCanteenForm({ ...newCanteenForm, slug: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#075C35] text-sm font-mono"
                      />
                      <p className="text-[10px] text-stone-400 mt-1">Customer access link: /c/{newCanteenForm.slug || '...'}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Tagline / Identity
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Gourmet Tea, Espresso & Quick Bites"
                      value={newCanteenForm.tagline}
                      onChange={(e) => setNewCanteenForm({ ...newCanteenForm, tagline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#075C35] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Browser Tab Title & Meta Title
                    </label>
                    <input
                      type="text"
                      placeholder={`e.g. ${newCanteenForm.name || 'Restaurant'} | Gourmet Tea, Espresso & Quick Bites`}
                      value={newCanteenForm.page_title}
                      onChange={(e) => setNewCanteenForm({ ...newCanteenForm, page_title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#075C35] text-sm"
                    />
                    <p className="text-[10px] text-stone-400 mt-1">Title shown in browser tabs, bookmarks, and search results</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Dietary Mode
                      </label>
                      <select
                        value={newCanteenForm.dietary_type}
                        onChange={(e) => setNewCanteenForm({ ...newCanteenForm, dietary_type: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm bg-white"
                      >
                        <option value="pure_veg">100% Pure Vegetarian</option>
                        <option value="veg_nonveg">Veg & Non-Veg Multi-Cuisine</option>
                        <option value="jain_available">Pure Veg + Jain Food</option>
                        <option value="custom">Custom Badge</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Dietary Badge Label
                      </label>
                      <input
                        type="text"
                        value={newCanteenForm.pure_veg_label}
                        onChange={(e) => setNewCanteenForm({ ...newCanteenForm, pure_veg_label: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Physical Address / Mall Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tower B Food Court, Cyber Hub, Gurugram"
                      value={newCanteenForm.address}
                      onChange={(e) => setNewCanteenForm({ ...newCanteenForm, address: e.target.value, location_landmark: e.target.value.split(',')[0] })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm"
                    />
                  </div>
                </div>

                {/* 2. Visual Theme & Branding */}
                <div className="bg-white rounded-3xl border border-[#E3E0D6] p-5 sm:p-7 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
                    <Palette className="w-5 h-5 text-[#075C35]" />
                    <h3 className="font-serif font-bold text-base text-[#20251F]">
                      2. Visual Theme & Color Palette
                    </h3>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-2">
                      Select Theme Preset
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {THEME_PRESETS.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleApplyPresetToNew(p)}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            newCanteenForm.theme_preset === p.id
                              ? 'border-[#075C35] bg-emerald-50/50 ring-2 ring-[#075C35]'
                              : 'border-stone-200 bg-white hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <div className="w-3.5 h-3.5 rounded-full shadow-xs" style={{ backgroundColor: p.primary }} />
                            <div className="w-3.5 h-3.5 rounded-full shadow-xs" style={{ backgroundColor: p.secondary }} />
                            <div className="w-3.5 h-3.5 rounded-full shadow-xs" style={{ backgroundColor: p.accent }} />
                          </div>
                          <p className="text-xs font-bold text-stone-800 truncate">{p.name}</p>
                          <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">{p.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Granular Color Pickers for New Canteen */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Fine-Tune Theme Colors
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {/* Primary Color */}
                      <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                        <label className="block text-[11px] font-bold text-stone-600 mb-1">
                          Primary Brand
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={newCanteenForm.primary_color || '#063D29'}
                            onChange={(e) => setNewCanteenForm({ ...newCanteenForm, primary_color: e.target.value })}
                            className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                          />
                          <input
                            type="text"
                            value={newCanteenForm.primary_color || '#063D29'}
                            onChange={(e) => setNewCanteenForm({ ...newCanteenForm, primary_color: e.target.value })}
                            className="w-full text-xs font-mono font-bold text-stone-800 uppercase bg-white px-2 py-1 rounded border border-stone-300"
                          />
                        </div>
                      </div>

                      {/* Secondary Color */}
                      <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                        <label className="block text-[11px] font-bold text-stone-600 mb-1">
                          Secondary Tone
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={newCanteenForm.secondary_color || '#075C35'}
                            onChange={(e) => setNewCanteenForm({ ...newCanteenForm, secondary_color: e.target.value })}
                            className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                          />
                          <input
                            type="text"
                            value={newCanteenForm.secondary_color || '#075C35'}
                            onChange={(e) => setNewCanteenForm({ ...newCanteenForm, secondary_color: e.target.value })}
                            className="w-full text-xs font-mono font-bold text-stone-800 uppercase bg-white px-2 py-1 rounded border border-stone-300"
                          />
                        </div>
                      </div>

                      {/* Accent Color */}
                      <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                        <label className="block text-[11px] font-bold text-stone-600 mb-1">
                          Highlight Accent
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={newCanteenForm.accent_color || '#E8C928'}
                            onChange={(e) => setNewCanteenForm({ ...newCanteenForm, accent_color: e.target.value })}
                            className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                          />
                          <input
                            type="text"
                            value={newCanteenForm.accent_color || '#E8C928'}
                            onChange={(e) => setNewCanteenForm({ ...newCanteenForm, accent_color: e.target.value })}
                            className="w-full text-xs font-mono font-bold text-stone-800 uppercase bg-white px-2 py-1 rounded border border-stone-300"
                          />
                        </div>
                      </div>

                      {/* Background Color */}
                      <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                        <label className="block text-[11px] font-bold text-stone-600 mb-1">
                          Page Canvas Bg
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={newCanteenForm.bg_color || '#FAF8F1'}
                            onChange={(e) => setNewCanteenForm({ ...newCanteenForm, bg_color: e.target.value })}
                            className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                          />
                          <input
                            type="text"
                            value={newCanteenForm.bg_color || '#FAF8F1'}
                            onChange={(e) => setNewCanteenForm({ ...newCanteenForm, bg_color: e.target.value })}
                            className="w-full text-xs font-mono font-bold text-stone-800 uppercase bg-white px-2 py-1 rounded border border-stone-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Logo Upload Box */}
                  <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-white p-1 border-2 border-stone-200 shrink-0 flex items-center justify-center">
                      {newLogoPreview ? (
                        <img src={newLogoPreview} alt="Logo" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-stone-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-stone-700">Circular Outlet Logo</p>
                      <p className="text-[11px] text-stone-500">PNG, JPG or WebP (transparent or solid)</p>
                    </div>
                    <input
                      type="file"
                      ref={newFileInputRef}
                      accept="image/*"
                      onChange={handleNewLogoChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => newFileInputRef.current?.click()}
                      className="px-3.5 py-2 bg-white text-xs font-bold text-[#075C35] border border-stone-300 rounded-xl hover:bg-stone-100 shadow-2xs"
                    >
                      Browse File
                    </button>
                  </div>

                  {/* Favicon Upload Box */}
                  <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-white p-1 border-2 border-stone-300 shrink-0 flex items-center justify-center">
                      {newFaviconPreview ? (
                        <img src={newFaviconPreview} alt="Favicon" className="w-full h-full object-contain" />
                      ) : (
                        <Globe className="w-6 h-6 text-stone-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-stone-700">Browser Favicon Icon</p>
                      <p className="text-[11px] text-stone-500">.ico, .png or .svg icon shown next to title on browser tab</p>
                    </div>
                    <input
                      type="file"
                      ref={newFaviconInputRef}
                      accept=".ico,.png,.svg,.jpg,.jpeg,.webp"
                      onChange={handleNewFaviconChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => newFaviconInputRef.current?.click()}
                      className="px-3.5 py-2 bg-white text-xs font-bold text-[#075C35] border border-stone-300 rounded-xl hover:bg-stone-100 shadow-2xs"
                    >
                      Browse Favicon
                    </button>
                  </div>
                </div>

                {/* 3. Manager Credentials */}
                <div className="bg-[#0F172A] text-white p-5 sm:p-7 rounded-3xl border border-slate-700/80 shadow-lg space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-5 h-5 text-[#10B981]" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#34D399]">
                        3. Dedicated Manager Login Credentials
                      </h3>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
                      Single Outlet Access
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    This manager will log in at <code className="text-[#34D399] bg-slate-800 px-1.5 py-0.5 rounded">/admin/login</code> to manage only this venue's items, pricing, and live orders.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Manager Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        value={newCanteenForm.manager_name}
                        onChange={(e) => setNewCanteenForm({ ...newCanteenForm, manager_name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-[#10B981] text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Manager Login Email *
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. manager@chaibytes.com"
                        value={newCanteenForm.manager_email}
                        onChange={(e) => setNewCanteenForm({ ...newCanteenForm, manager_email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-[#10B981] text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Initial Login Password *
                      </label>
                      <div className="flex items-center gap-2">
                        {newCanteenForm.manager_password && (
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(newCanteenForm.manager_password);
                              setCopiedPass(true);
                              setTimeout(() => setCopiedPass(false), 2000);
                              addToast('info', 'Password copied to clipboard!');
                            }}
                            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                          >
                            {copiedPass ? <CheckCheck className="w-3 h-3 text-[#34D399]" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedPass ? 'Copied' : 'Copy'}</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const randomPass = 'Cafe@' + Math.floor(1000 + Math.random() * 9000);
                            setNewCanteenForm({ ...newCanteenForm, manager_password: randomPass });
                          }}
                          className="text-[11px] text-[#34D399] hover:underline font-bold"
                        >
                          Generate Password
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Cafe@2026"
                      value={newCanteenForm.manager_password}
                      onChange={(e) => setNewCanteenForm({ ...newCanteenForm, manager_password: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-[#10B981] text-xs text-white font-mono"
                    />
                  </div>
                </div>

                {/* 4. Starter Menu Catalog */}
                <div className="p-4 bg-emerald-50 rounded-3xl border border-emerald-200 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="clone_default_page"
                    checked={newCanteenForm.clone_from_default}
                    onChange={(e) => setNewCanteenForm({ ...newCanteenForm, clone_from_default: e.target.checked })}
                    className="mt-1 w-4 h-4 text-[#075C35] rounded focus:ring-[#075C35]"
                  />
                  <div>
                    <label htmlFor="clone_default_page" className="text-xs font-bold text-emerald-950 cursor-pointer">
                      Clone Starter Menu Catalog from Default Canteen (Annapoorna)
                    </label>
                    <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                      Automatically copies all 5 categories and 29 dishes so the new establishment starts with a complete catalog ready for customization.
                    </p>
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab('network')}
                    className="px-5 py-2.5 rounded-xl text-stone-600 hover:bg-stone-100 text-xs sm:text-sm font-bold transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#063D29] hover:bg-[#04281B] text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-[#063D29]/20 transition-all disabled:opacity-60 transform active:scale-95"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Provisioning Establishment...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#E8C928]" />
                        <span>Complete Onboarding & Provision Outlet</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right 5 Cols: Live Real-Time Preview Card */}
            <div className="lg:col-span-5 sticky top-24 space-y-6">
              {/* Preview Card */}
              <div className="bg-white rounded-3xl border border-[#E3E0D6] overflow-hidden shadow-lg">
                <div className="p-4 bg-stone-100 border-b border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#075C35]" />
                    <span className="text-xs font-bold text-stone-700">Live Appearance Preview</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-stone-500 bg-white px-2 py-0.5 rounded-full border border-stone-200">
                    Auto Updates
                  </span>
                </div>

                {/* Simulated Browser Bar with Tab showing Favicon and Title */}
                <div className="bg-stone-200/90 px-3 pt-2 border-b border-stone-300 flex items-center gap-2">
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                    <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  </div>
                  <div className="bg-white rounded-t-lg px-2.5 py-1 flex items-center gap-1.5 shadow-2xs border-t border-x border-stone-300 text-[10px] max-w-[200px] truncate">
                    <div className="w-3.5 h-3.5 rounded shrink-0 overflow-hidden flex items-center justify-center">
                      {newFaviconPreview ? (
                        <img src={newFaviconPreview} alt="Favicon" className="w-full h-full object-contain" />
                      ) : newLogoPreview ? (
                        <img src={newLogoPreview} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <Globe className="w-3.5 h-3.5 text-stone-400" />
                      )}
                    </div>
                    <span className="truncate font-semibold text-stone-700">
                      {newCanteenForm.page_title || `${newCanteenForm.name || 'New Outlet'} | Digital Menu`}
                    </span>
                  </div>
                </div>

                {/* Simulated Customer Header */}
                <div
                  className="p-5 text-white transition-colors duration-300"
                  style={{ backgroundColor: newCanteenForm.primary_color }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-white p-0.5 border-2 border-[#E8C928] shrink-0 flex items-center justify-center">
                      {newLogoPreview ? (
                        <img src={newLogoPreview} alt="Logo" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <UtensilsCrossed className="w-6 h-6 text-stone-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-serif font-bold text-base truncate">
                        {newCanteenForm.name || 'New Outlet Name'}
                      </h4>
                      <p className="text-[11px] opacity-90 truncate">
                        {newCanteenForm.tagline || 'Gourmet Cuisine & Quick Bites'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                      {newCanteenForm.pure_veg_label || '100% Pure Vegetarian'}
                    </span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: newCanteenForm.accent_color, color: '#000' }}
                    >
                      Open Now
                    </span>
                  </div>
                </div>

                {/* Simulated Menu Strip */}
                <div className="p-4 space-y-3 bg-stone-50/50">
                  <div className="flex items-center justify-between text-xs text-stone-500 border-b border-stone-200 pb-2">
                    <span className="font-mono text-[11px]">/c/{newCanteenForm.slug || 'url-slug'}</span>
                    <span className="text-[10px] text-emerald-700 font-bold">QR Ready</span>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-stone-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
                      <UtensilsCrossed className="w-5 h-5 text-stone-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-stone-800 truncate">Special South Indian Thali</p>
                      <p className="text-[10px] text-stone-500">Includes 2 curries, rice, sambar, papad</p>
                    </div>
                    <span
                      className="text-xs font-black px-2 py-1 rounded-lg text-white shrink-0"
                      style={{ backgroundColor: newCanteenForm.primary_color }}
                    >
                      ₹120
                    </span>
                  </div>
                </div>
              </div>

              {/* Manager Credentials Quick Info */}
              <div className="bg-[#0F172A] rounded-3xl p-5 border border-slate-700 text-white space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#34D399]">
                  <Key className="w-4 h-4 text-[#10B981]" />
                  <span>Provisioned Manager Account</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Portal:</span>
                    <span className="font-mono text-[11px] text-white">/admin/login</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-semibold text-white truncate max-w-[180px]">
                      {newCanteenForm.manager_email || 'Not configured'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Password:</span>
                    <span className="font-mono text-[11px] text-[#34D399]">
                      {newCanteenForm.manager_password || 'Not generated'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'managers' ? (
        /* ========================================================================= */
        /* TAB 3: OUTLET MANAGERS & CREDENTIALS DIRECTORY                            */
        /* ========================================================================= */
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] border border-slate-700/60 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#047857] flex items-center justify-center text-white shadow-lg shadow-[#10B981]/25 ring-1 ring-white/20">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
                  Establishment Managers & Credentials
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                  Manage login accounts, reset passwords, and inspect which manager administers each dining outlet.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('onboard')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-black bg-[#10B981] hover:bg-[#059669] shadow-lg shadow-[#10B981]/25 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Onboard New Establishment</span>
            </button>
          </div>

          {/* Managers List Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {canteens.map((canteen) => {
              const manager = canteen.managers && canteen.managers.length > 0 ? canteen.managers[0] : null;
              return (
                <div
                  key={canteen.id}
                  className="bg-white rounded-3xl border border-[#E3E0D6] p-5 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center overflow-hidden border border-stone-200 shrink-0">
                          {canteen.full_logo_url || canteen.logo_url ? (
                            <img src={canteen.full_logo_url || canteen.logo_url!} alt={canteen.name} className="w-full h-full object-cover" />
                          ) : (
                            <UtensilsCrossed className="w-5 h-5 text-stone-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-serif font-bold text-sm text-stone-800 truncate">{canteen.name}</h4>
                          <p className="text-[11px] text-stone-500 font-mono">/c/{canteen.slug}</p>
                        </div>
                      </div>
                      {canteen.is_default && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          Default
                        </span>
                      )}
                    </div>

                    <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-500">Manager:</span>
                        <span className="font-bold text-stone-800 truncate max-w-[150px]">
                          {manager?.name || 'No manager assigned'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-500">Email:</span>
                        <span className="font-mono text-[11px] text-stone-700 truncate max-w-[150px]">
                          {manager?.email || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-500">Role:</span>
                        <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Outlet Manager
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 space-y-2">
                    <button
                      onClick={() => handleEmulateManager(canteen)}
                      disabled={emulatingCanteenId === canteen.id}
                      className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] hover:from-[#059669] hover:to-[#065F46] shadow-sm hover:shadow transition-all active:scale-98 disabled:opacity-60 cursor-pointer"
                      title={`Login without password as manager of ${canteen.name}`}
                    >
                      {emulatingCanteenId === canteen.id ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Emulating Manager...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4 text-emerald-100" />
                          <span>Emulate Manager (Login Without Password)</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleOpenManagerModal(canteen)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#075C35] hover:bg-emerald-50 border border-emerald-200 transition-colors"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>{manager ? 'Reset Password' : 'Add Manager'}</span>
                      </button>

                      <button
                        onClick={() => handleSelectCanteenForStudio(canteen)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
                      >
                        <Palette className="w-3.5 h-3.5" />
                        <span>Studio</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* TAB 4: LIVE THEME & BRANDING STUDIO                                      */
        /* ========================================================================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Customizer Controls (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Active Canteen Selector */}
            <div className="bg-white rounded-2xl border border-[#E3E0D6] p-4 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#063D29] text-white flex items-center justify-center font-bold font-serif text-sm">
                  {selectedCanteen?.name.charAt(0) || 'C'}
                </div>
                <div>
                  <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                    Currently Editing
                  </label>
                  <select
                    value={selectedCanteen?.id || ''}
                    onChange={(e) => {
                      const found = canteens.find((c) => c.id === Number(e.target.value));
                      if (found) {
                        setSelectedCanteen(found);
                        populateEditForm(found);
                      }
                    }}
                    className="font-serif font-bold text-base text-[#063D29] bg-transparent border-0 focus:ring-0 p-0 cursor-pointer"
                  >
                    {canteens.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.is_default ? '(Default)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <a
                href={`/menu?canteen=${selectedCanteen?.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-[#075C35]" />
                <span>Test Live Link</span>
                <ExternalLink className="w-3 h-3 text-stone-400" />
              </a>
            </div>

            <form onSubmit={handleSaveStudioChanges} className="space-y-6">
              {/* SECTION: Theme Presets & Color Studio */}
              <div className="bg-white rounded-3xl border border-[#E3E0D6] p-5 sm:p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-[#075C35]" />
                    <h3 className="font-serif font-bold text-base text-[#20251F]">
                      Theme Palette & Color Studio
                    </h3>
                  </div>
                  <span className="text-xs text-stone-500 font-medium">Instant Visual Preview</span>
                </div>

                {/* Preset Themes Carousel / Grid */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-2">
                    Quick-Start Theme Presets
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {THEME_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleApplyPresetToEdit(preset)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          editForm.theme_preset === preset.id
                            ? 'border-[#075C35] bg-emerald-50/50 ring-1 ring-[#075C35]'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-1 mb-1.5">
                          <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.primary }} />
                          <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.secondary }} />
                          <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.accent }} />
                          <div className="w-3.5 h-3.5 rounded-full border border-stone-200" style={{ backgroundColor: preset.bg }} />
                        </div>
                        <p className="text-xs font-bold text-stone-800 leading-tight truncate">{preset.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Granular Color Pickers */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {/* Primary Color */}
                  <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">
                      Primary Brand
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editForm.primary_color || '#063D29'}
                        onChange={(e) => setEditForm({ ...editForm, primary_color: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={editForm.primary_color || '#063D29'}
                        onChange={(e) => setEditForm({ ...editForm, primary_color: e.target.value })}
                        className="w-full text-xs font-mono font-bold text-stone-800 uppercase bg-white px-2 py-1 rounded border border-stone-300"
                      />
                    </div>
                  </div>

                  {/* Secondary Color */}
                  <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">
                      Secondary Tone
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editForm.secondary_color || '#075C35'}
                        onChange={(e) => setEditForm({ ...editForm, secondary_color: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={editForm.secondary_color || '#075C35'}
                        onChange={(e) => setEditForm({ ...editForm, secondary_color: e.target.value })}
                        className="w-full text-xs font-mono font-bold text-stone-800 uppercase bg-white px-2 py-1 rounded border border-stone-300"
                      />
                    </div>
                  </div>

                  {/* Accent Color */}
                  <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">
                      Highlight Accent
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editForm.accent_color || '#E8C928'}
                        onChange={(e) => setEditForm({ ...editForm, accent_color: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={editForm.accent_color || '#E8C928'}
                        onChange={(e) => setEditForm({ ...editForm, accent_color: e.target.value })}
                        className="w-full text-xs font-mono font-bold text-stone-800 uppercase bg-white px-2 py-1 rounded border border-stone-300"
                      />
                    </div>
                  </div>

                  {/* Background Color */}
                  <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">
                      Page Canvas Bg
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editForm.bg_color || '#FAF8F1'}
                        onChange={(e) => setEditForm({ ...editForm, bg_color: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={editForm.bg_color || '#FAF8F1'}
                        onChange={(e) => setEditForm({ ...editForm, bg_color: e.target.value })}
                        className="w-full text-xs font-mono font-bold text-stone-800 uppercase bg-white px-2 py-1 rounded border border-stone-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Direct Save Action for Theme Palette */}
                <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-stone-500">
                    Selected: <span className="font-bold text-[#075C35]">{editForm.theme_preset || 'Custom'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveThemeOnly}
                    disabled={isSavingTheme}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#063D29] hover:bg-[#04281B] text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-60 active:scale-95 cursor-pointer"
                  >
                    {isSavingTheme ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving Theme...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#E8C928]" />
                        <span>Apply & Save Theme Palette</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* SECTION: Identity, Logo & Dietary */}
              <div className="bg-white rounded-3xl border border-[#E3E0D6] p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                  <Building2 className="w-5 h-5 text-[#075C35]" />
                  <h3 className="font-serif font-bold text-base text-[#20251F]">
                    Identity, Logo & Brand Name
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Canteen / Restaurant Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#075C35] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      URL Slug (Permanent identifier) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.slug || ''}
                      onChange={(e) => setEditForm({ ...editForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '-') })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#075C35] text-sm font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Tagline / Sub-Brand Title
                  </label>
                  <input
                    type="text"
                    value={editForm.tagline || ''}
                    onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })}
                    placeholder="e.g. Pure Vegetarian Kitchen • Food With Respect"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#075C35] text-sm"
                  />
                </div>

                {/* Entity Browser Title */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-stone-700">
                      Browser Tab Title & Meta Title
                    </label>
                    <span className="text-[10px] text-stone-400 font-medium">Customer Browser Tab</span>
                  </div>
                  <input
                    type="text"
                    value={editForm.page_title || ''}
                    onChange={(e) => setEditForm({ ...editForm, page_title: e.target.value })}
                    placeholder={`e.g. ${editForm.name || 'Restaurant'} | Gourmet Dining & Quick Bites`}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#075C35] text-sm"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">
                    Custom title displayed on browser tabs, bookmarks, and search result headers.
                  </p>
                </div>

                {/* Favicon Upload Box */}
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white p-2 border-2 border-stone-300 shadow-xs shrink-0 flex items-center justify-center">
                    {editFaviconPreview ? (
                      <img src={editFaviconPreview} alt="Favicon" className="w-full h-full object-contain" />
                    ) : editLogoPreview ? (
                      <img src={editLogoPreview} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <Globe className="w-7 h-7 text-stone-400" />
                    )}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-xs font-bold text-stone-800">Browser Favicon Icon</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Square icon shown on customer browser tabs (.ico, .png, .svg). Recommended 32x32 or 64x64px.
                    </p>
                    {editForm.favicon_url && (
                      <p className="text-[10px] text-stone-400 font-mono truncate max-w-xs mt-0.5">
                        Current: {editForm.favicon_url}
                      </p>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={faviconInputRef}
                    accept=".ico,.png,.svg,.jpg,.jpeg,.webp"
                    onChange={handleEditFaviconChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => faviconInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-stone-100 text-[#075C35] border border-stone-300 rounded-xl text-xs font-bold transition-colors shrink-0 shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Favicon</span>
                  </button>
                </div>

                {/* Logo Upload Box */}
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-white p-1 border-2 border-[#E8C928] shadow-xs shrink-0 flex items-center justify-center">
                    {editLogoPreview ? (
                      <img src={editLogoPreview} alt="Logo" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <ImageIcon className="w-7 h-7 text-stone-400" />
                    )}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-xs font-bold text-stone-800">Canteen Round Logo</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">Recommended 500x500px PNG/JPG transparent or circular asset.</p>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleEditLogoChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-stone-100 text-[#075C35] border border-stone-300 rounded-xl text-xs font-bold transition-colors shrink-0 shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Logo</span>
                  </button>
                </div>

                {/* Dietary Classification */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Dietary Mode
                    </label>
                    <select
                      value={editForm.dietary_type || 'pure_veg'}
                      onChange={(e) => setEditForm({ ...editForm, dietary_type: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#075C35] text-sm bg-white"
                    >
                      <option value="pure_veg">100% Pure Vegetarian (Green dot)</option>
                      <option value="veg_nonveg">Veg & Non-Veg Multi-Cuisine</option>
                      <option value="jain_available">Pure Veg + Jain Options Available</option>
                      <option value="custom">Custom Badge</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Dietary Badge Text (Displayed in Header)
                    </label>
                    <input
                      type="text"
                      value={editForm.pure_veg_label || ''}
                      onChange={(e) => setEditForm({ ...editForm, pure_veg_label: e.target.value })}
                      placeholder="e.g. 100% Shudh Shakahari"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#075C35] text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: Location, Contacts & Timings */}
              <div className="bg-white rounded-3xl border border-[#E3E0D6] p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                  <MapPin className="w-5 h-5 text-[#075C35]" />
                  <h3 className="font-serif font-bold text-base text-[#20251F]">
                    Location, Address & Ordering Contacts
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Short Landmark (Header display)
                    </label>
                    <input
                      type="text"
                      value={editForm.location_landmark || ''}
                      onChange={(e) => setEditForm({ ...editForm, location_landmark: e.target.value })}
                      placeholder="e.g. Basement Parking, Gaur City Mall"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#075C35] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Opening & Service Hours
                    </label>
                    <input
                      type="text"
                      value={editForm.opening_hours || ''}
                      onChange={(e) => setEditForm({ ...editForm, opening_hours: e.target.value })}
                      placeholder="08:00 AM – 10:30 PM (Daily)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#075C35] text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Full Physical Address
                  </label>
                  <textarea
                    rows={2}
                    value={editForm.address || ''}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    placeholder="Shop / Unit number, Floor, Building, Sector, City, State, PIN"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#075C35] text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Counter Phone Number
                    </label>
                    <input
                      type="text"
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#075C35] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      WhatsApp Order Number
                    </label>
                    <input
                      type="text"
                      value={editForm.whatsapp || ''}
                      onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#075C35] text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: Hero & Delicacies Studio */}
              <div className="bg-white rounded-3xl border border-[#E3E0D6] p-5 sm:p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#075C35]" />
                    <h3 className="font-serif font-bold text-base text-[#20251F]">
                      Hero Section & Delicacies Showcase
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Live Reactive
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Hero Headline
                    </label>
                    <input
                      type="text"
                      value={editForm.hero_heading || ''}
                      onChange={(e) => setEditForm({ ...editForm, hero_heading: e.target.value })}
                      placeholder="Freshly Cooked & Brewed Daily"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#075C35] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Hero Badge Text
                    </label>
                    <input
                      type="text"
                      value={editForm.hero_badge || ''}
                      onChange={(e) => setEditForm({ ...editForm, hero_badge: e.target.value })}
                      placeholder="Today's Specials"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#075C35] text-sm"
                    />
                  </div>
                </div>

                {/* THE 3 HERO DELICACY ITEMS (LEFT, CENTER, RIGHT) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-stone-800">
                      Trio Delicacies (Left, Center, Right Showcase)
                    </label>
                    <span className="text-[10px] text-stone-500 font-medium">Clicking an item filters menu</span>
                  </div>

                  {(() => {
                    const trio = Array.isArray(editForm.hero_trio) && editForm.hero_trio.length >= 3
                      ? editForm.hero_trio
                      : DEFAULT_HERO_TRIO;

                    const slots = [
                      { label: 'Item 1 (Left Delicacy)', key: 'left', defaultName: 'Burger' },
                      { label: 'Item 2 (Center Delicacy — Steaming)', key: 'center', defaultName: 'Hot Chai' },
                      { label: 'Item 3 (Right Delicacy)', key: 'right', defaultName: 'Samosa' },
                    ];

                    return (
                      <div className="space-y-3">
                        {slots.map((slot, idx) => {
                          const item = trio[idx] || DEFAULT_HERO_TRIO[idx];
                          return (
                            <div key={slot.key} className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-full bg-[#063D29] text-white flex items-center justify-center text-[10px] font-black">
                                    {idx + 1}
                                  </span>
                                  <span className="text-xs font-bold text-stone-800">{slot.label}</span>
                                </div>
                                {idx === 1 && (
                                  <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                    <input
                                      type="checkbox"
                                      checked={item.showSteam !== false}
                                      onChange={(e) => handleUpdateTrioItem(idx, 'showSteam', e.target.checked)}
                                      className="w-3.5 h-3.5 text-amber-600 rounded"
                                    />
                                    <span>Rising Steam Animation</span>
                                  </label>
                                )}
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                <div>
                                  <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Item Name / Title</label>
                                  <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => handleUpdateTrioItem(idx, 'name', e.target.value)}
                                    placeholder={slot.defaultName}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Price Tag</label>
                                  <input
                                    type="text"
                                    value={item.price}
                                    onChange={(e) => handleUpdateTrioItem(idx, 'price', e.target.value)}
                                    placeholder="e.g. ₹85 or ₹25 / pc"
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Search Query / Craving Tag</label>
                                  <input
                                    type="text"
                                    value={item.searchTerm}
                                    onChange={(e) => handleUpdateTrioItem(idx, 'searchTerm', e.target.value)}
                                    placeholder="e.g. burger, tea, samosa"
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                                  />
                                </div>
                              </div>

                              {/* Sticker Icon Picker with Manual Upload & Custom URL */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <label className="block text-[10px] font-bold text-stone-700">
                                    Icon / Delicacy Sticker or Image
                                  </label>
                                  <span className="text-[10px] text-stone-500 font-medium">Presets or upload custom image</span>
                                </div>

                                {/* Preset Badges */}
                                <div className="flex flex-wrap items-center gap-1.5">
                                  {STICKER_PRESETS.map((sticker) => {
                                    const isSelected = item.stickerUrl === sticker.url;
                                    return (
                                      <button
                                        key={sticker.id}
                                        type="button"
                                        onClick={() => handleUpdateTrioItem(idx, 'stickerUrl', sticker.url)}
                                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11px] font-medium transition-all ${
                                          isSelected
                                            ? 'border-[#075C35] bg-emerald-50 text-[#063D29] ring-1 ring-[#075C35] font-bold'
                                            : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700'
                                        }`}
                                      >
                                        <img src={sticker.url} alt={sticker.label} className="w-4 h-4 rounded object-cover" />
                                        <span>{sticker.label}</span>
                                      </button>
                                    );
                                  })}
                                </div>

                                {/* Manual Upload & Current Active Preview Card */}
                                <div className="p-2.5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-2">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    {/* Current Thumbnail Preview */}
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0 flex items-center justify-center shadow-2xs">
                                        {item.stickerUrl ? (
                                          <img
                                            src={item.stickerUrl}
                                            alt={item.name || 'Sticker'}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              (e.target as HTMLElement).style.display = 'none';
                                            }}
                                          />
                                        ) : (
                                          <ImageIcon className="w-4 h-4 text-stone-400" />
                                        )}
                                      </div>
                                      <div>
                                        <p className="text-[11px] font-bold text-stone-800 leading-tight">
                                          {item.stickerUrl ? 'Active Delicacy Image' : 'No image / sticker selected'}
                                        </p>
                                        <p className="text-[10px] text-stone-400 font-mono truncate max-w-[170px] sm:max-w-[260px]">
                                          {item.stickerUrl || 'Choose preset or upload file'}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Upload Button */}
                                    <div>
                                      <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                                        ref={(el) => {
                                          trioFileInputRefs.current[idx] = el;
                                        }}
                                        onChange={(e) => handleTrioFileUpload(idx, e)}
                                        className="hidden"
                                      />
                                      <button
                                        type="button"
                                        disabled={uploadingTrioIdx === idx}
                                        onClick={() => trioFileInputRefs.current[idx]?.click()}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#075C35] hover:bg-[#063D29] text-white text-xs font-bold rounded-lg shadow-2xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                                      >
                                        {uploadingTrioIdx === idx ? (
                                          <>
                                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Uploading...</span>
                                          </>
                                        ) : (
                                          <>
                                            <Upload className="w-3.5 h-3.5 text-[#E8C928]" />
                                            <span>Upload Image / Sticker</span>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  </div>

                                  {/* Custom URL Input Field */}
                                  <div className="flex items-center gap-2 pt-1.5 border-t border-stone-100">
                                    <span className="text-[10px] text-stone-500 font-mono flex-shrink-0">
                                      Custom URL / Path:
                                    </span>
                                    <input
                                      type="text"
                                      value={item.stickerUrl || ''}
                                      onChange={(e) => handleUpdateTrioItem(idx, 'stickerUrl', e.target.value)}
                                      placeholder="/stickers/burger.jpg or https://..."
                                      className="flex-1 px-2 py-1 rounded-lg border border-stone-200 text-xs font-mono bg-stone-50 focus:bg-white text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#075C35]"
                                    />
                                    {item.stickerUrl && (
                                      <button
                                        type="button"
                                        onClick={() => handleUpdateTrioItem(idx, 'stickerUrl', '')}
                                        className="text-[10px] font-bold text-red-500 hover:text-red-700 px-1.5 py-0.5 rounded hover:bg-red-50 transition-colors"
                                        title="Clear Image"
                                      >
                                        Clear
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                {/* Promotional Offers & Discount */}
                <div className="border-t border-stone-100 pt-3">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Hero Description Paragraph (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={editForm.hero_subheading || ''}
                    onChange={(e) => setEditForm({ ...editForm, hero_subheading: e.target.value })}
                    placeholder="Authentic recipes, hot parathas, wholesome thalis prepared fresh daily..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#075C35] text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <input
                      type="checkbox"
                      id="discount_badge_enabled"
                      checked={Boolean(editForm.discount_badge_enabled)}
                      onChange={(e) => setEditForm({ ...editForm, discount_badge_enabled: e.target.checked })}
                      className="w-4 h-4 text-[#075C35] rounded focus:ring-[#075C35]"
                    />
                    <label htmlFor="discount_badge_enabled" className="text-xs font-bold text-stone-700 cursor-pointer">
                      Enable Promo / Discount Badge
                    </label>
                  </div>

                  <div>
                    <input
                      type="text"
                      disabled={!editForm.discount_badge_enabled}
                      value={editForm.discount_badge_title || ''}
                      onChange={(e) => setEditForm({ ...editForm, discount_badge_title: e.target.value })}
                      placeholder="e.g. Armed Forces 10% Off"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#075C35] text-xs disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Billing, Digital E-Bill & WhatsApp Options Multi-Switch Center */}
                <div className="border-t border-stone-200 pt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-[#075C35]" />
                        <span>Billing, Receipts & WhatsApp Integrations</span>
                      </h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Configure POS billing and choose between 3 WhatsApp & digital receipt modes per restaurant demand.
                      </p>
                    </div>
                  </div>

                  {/* Main POS Switch */}
                  <div className="flex items-center justify-between p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-800 flex items-center justify-center shrink-0">
                        <Receipt className="w-5 h-5" />
                      </div>
                      <div>
                        <label htmlFor="edit_billing_enabled" className="text-xs font-bold text-stone-900 cursor-pointer block leading-tight">
                          Counter POS Terminal & Billing Module
                        </label>
                        <span className="text-[11px] text-stone-600 block mt-0.5">
                          Enables Counter POS terminal at <code className="text-stone-700 bg-stone-100 px-1 py-0.5 rounded font-mono">/admin/pos</code>, thermal receipt printing, KOT tickets, and live ordering.
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      id="edit_billing_enabled"
                      checked={editForm.billing_enabled !== false}
                      onChange={(e) => setEditForm({ ...editForm, billing_enabled: e.target.checked })}
                      className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer shrink-0"
                    />
                  </div>

                  {/* The 3 WhatsApp & Receipt Options */}
                  <div className="grid grid-cols-1 gap-3.5 pl-2 sm:pl-4 border-l-2 border-emerald-500/30">
                    {/* Option 1: Digital E-Bill Webpage */}
                    <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 hover:border-emerald-200 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200 mt-0.5">
                            <Globe className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <label htmlFor="edit_digital_ebill" className="text-xs font-bold text-stone-900 cursor-pointer">
                                Option 1: Public Digital E-Bill Webpage
                              </label>
                              <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">
                                /receipt/:orderNumber
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                              Provides customer mobile e-bill page with live order status, itemized invoice, and print/PDF download button.
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          id="edit_digital_ebill"
                          checked={editForm.digital_ebill_enabled !== false}
                          onChange={(e) => setEditForm({ ...editForm, digital_ebill_enabled: e.target.checked })}
                          className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer shrink-0 mt-1"
                        />
                      </div>
                    </div>

                    {/* Option 2: 1-Click WhatsApp Direct Bill */}
                    <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 hover:border-emerald-200 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200 mt-0.5">
                            <MessageCircle className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <label htmlFor="edit_whatsapp_billing" className="text-xs font-bold text-stone-900 cursor-pointer">
                                Option 2: 1-Click WhatsApp Direct Bill
                              </label>
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                                100% Free (wa.me)
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                              Enables one-tap WhatsApp button on Cashier POS and Thermal Print preview modal. Generates pre-formatted bill text with token, items, and e-bill link with zero API costs.
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          id="edit_whatsapp_billing"
                          checked={editForm.whatsapp_billing_enabled !== false}
                          onChange={(e) => setEditForm({ ...editForm, whatsapp_billing_enabled: e.target.checked })}
                          className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer shrink-0 mt-1"
                        />
                      </div>
                    </div>

                    {/* Option 3: Automated WhatsApp Cloud API */}
                    <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 hover:border-emerald-200 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-200 mt-0.5">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <label htmlFor="edit_whatsapp_auto_send" className="text-xs font-bold text-stone-900 cursor-pointer">
                                Option 3: Automated WhatsApp Cloud API Gateway
                              </label>
                              <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-semibold">
                                Background Auto-Dispatch
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                              Automatically dispatches official WhatsApp bill receipt to customer's mobile number in background upon checkout/settlement using Meta WhatsApp Cloud API credentials.
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          id="edit_whatsapp_auto_send"
                          checked={Boolean(editForm.whatsapp_auto_send_enabled)}
                          onChange={(e) => setEditForm({ ...editForm, whatsapp_auto_send_enabled: e.target.checked })}
                          className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer shrink-0 mt-1"
                        />
                      </div>

                      {/* Expandable Meta Cloud API Inputs */}
                      {editForm.whatsapp_auto_send_enabled && (
                        <div className="mt-3 pt-3 border-t border-stone-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-teal-100">
                          <div>
                            <label className="block text-[11px] font-bold text-stone-700 mb-1">
                              WhatsApp Phone Number ID
                            </label>
                            <input
                              type="text"
                              value={editForm.whatsapp_api_phone_id || ''}
                              onChange={(e) => setEditForm({ ...editForm, whatsapp_api_phone_id: e.target.value })}
                              placeholder="e.g. 104829104829104"
                              className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-mono focus:ring-1 focus:ring-teal-600 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-stone-700 mb-1">
                              WhatsApp Message Template (Optional)
                            </label>
                            <input
                              type="text"
                              value={editForm.whatsapp_api_template || ''}
                              onChange={(e) => setEditForm({ ...editForm, whatsapp_api_template: e.target.value })}
                              placeholder="e.g. bill_receipt_v1 (or leave blank for text)"
                              className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs focus:ring-1 focus:ring-teal-600 focus:outline-none"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-bold text-stone-700 mb-1">
                              Meta System User Permanent Token
                            </label>
                            <input
                              type="password"
                              value={editForm.whatsapp_api_token || ''}
                              onChange={(e) => setEditForm({ ...editForm, whatsapp_api_token: e.target.value })}
                              placeholder="EAABw..."
                              className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-mono focus:ring-1 focus:ring-teal-600 focus:outline-none"
                            />
                            <p className="text-[10px] text-stone-400 mt-1">
                              Kept securely on backend for sending automated WhatsApp receipts for this restaurant.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => selectedCanteen && populateEditForm(selectedCanteen)}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 text-xs sm:text-sm font-bold transition-colors"
                >
                  Discard Changes
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#063D29] to-[#075C35] hover:from-[#04281B] hover:to-[#063D29] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-60"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving Theme...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-[#E8C928]" />
                      <span>Save Canteen Theme & Branding</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Live Mockup Preview Studio (5 Cols) */}
          <div className="lg:col-span-5 sticky top-20 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Live Customer UI Preview
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Dynamic Reactivity
              </span>
            </div>

            {/* Mobile Device Mockup */}
            <div
              className="rounded-[36px] p-3 shadow-2xl border-4 border-stone-800 transition-colors duration-300 overflow-hidden"
              style={{ backgroundColor: previewBg }}
            >
              <div className="relative rounded-[28px] overflow-hidden bg-white shadow-inner min-h-[580px] flex flex-col justify-between">
                {/* Simulated Browser Bar with Tab showing Favicon and Title */}
                <div className="bg-stone-200/90 px-3 pt-2 border-b border-stone-300 flex items-center gap-2">
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                    <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  </div>
                  <div className="bg-white rounded-t-lg px-2.5 py-1 flex items-center gap-1.5 shadow-2xs border-t border-x border-stone-300 text-[10px] max-w-[200px] truncate">
                    <div className="w-3.5 h-3.5 rounded shrink-0 overflow-hidden flex items-center justify-center">
                      {editFaviconPreview ? (
                        <img src={editFaviconPreview} alt="Favicon" className="w-full h-full object-contain" />
                      ) : editLogoPreview ? (
                        <img src={editLogoPreview} alt="Logo" className="w-full h-full object-contain" />
                      ) : (
                        <Globe className="w-3.5 h-3.5 text-stone-400" />
                      )}
                    </div>
                    <span className="truncate font-semibold text-stone-700">
                      {editForm.page_title || `${previewName} | Digital Menu`}
                    </span>
                  </div>
                </div>

                {/* Simulated Header */}
                <div
                  className="px-4 py-3 text-white transition-colors duration-300 border-b border-black/10"
                  style={{ backgroundColor: previewPrimary }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-white p-0.5 overflow-hidden shrink-0 shadow-xs border" style={{ borderColor: previewAccent }}>
                        {editLogoPreview ? (
                          <img src={editLogoPreview} alt="Logo" className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <UtensilsCrossed className="w-5 h-5 text-stone-500 m-auto" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-serif font-black text-sm text-white truncate">
                            {previewName}
                          </span>
                          <span
                            className="text-[9px] font-black px-1.5 py-0.2 rounded uppercase shrink-0 text-white"
                            style={{ backgroundColor: previewSecondary }}
                          >
                            {editForm.dietary_type === 'pure_veg' ? 'Pure Veg' : 'Active'}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-300 truncate">{previewAddress}</p>
                      </div>
                    </div>

                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                </div>

                {/* Simulated Content Area */}
                <div className="p-3.5 space-y-3 flex-1 overflow-y-auto">
                  {/* Hero Stage Mini Trio Live Preview */}
                  {(() => {
                    const trio = Array.isArray(editForm.hero_trio) && editForm.hero_trio.length >= 3
                      ? editForm.hero_trio
                      : DEFAULT_HERO_TRIO;
                    const left = trio[0] || DEFAULT_HERO_TRIO[0];
                    const center = trio[1] || DEFAULT_HERO_TRIO[1];
                    const right = trio[2] || DEFAULT_HERO_TRIO[2];
                    const headline = editForm.hero_heading || 'Freshly Cooked & Brewed Daily';
                    const badge = editForm.hero_badge || "Today's Specials";

                    return (
                      <div
                        className="rounded-2xl p-2.5 text-white shadow-md relative overflow-hidden transition-all duration-300 border border-white/10"
                        style={{
                          background: `radial-gradient(ellipse at 50% 40%, rgba(245, 158, 11, 0.22) 0%, ${previewPrimary} 75%, #041F15 100%)`,
                        }}
                      >
                        {/* Top Bar */}
                        <div className="flex items-center justify-between text-[9px] mb-2 text-stone-300">
                          <div className="flex items-center gap-1 font-serif font-bold uppercase truncate">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="truncate">{headline}</span>
                          </div>
                          {badge && (
                            <span className="text-amber-300 font-bold bg-white/10 px-1.5 py-0.2 rounded-full text-[8px] shrink-0 border border-white/10">
                              {badge}
                            </span>
                          )}
                        </div>

                        {/* Delicacies Trio */}
                        <div className="flex items-center justify-around gap-1 py-1">
                          {/* Left */}
                          <div className="flex flex-col items-center">
                            <div className="w-11 h-11 rounded-xl bg-black/40 border border-white/15 p-0.5 overflow-hidden shadow-md flex items-center justify-center">
                              <img src={left.stickerUrl || '/stickers/burger.jpg'} alt={left.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="mt-1 text-[8px] font-bold text-amber-300 bg-white/10 px-1.5 py-0.2 rounded-full border border-white/10 truncate max-w-[70px]">
                              {left.price} • {left.name}
                            </span>
                          </div>

                          {/* Center */}
                          <div className="flex flex-col items-center -mt-1">
                            <div className="relative w-12 h-12 rounded-xl bg-black/50 border border-amber-400/50 p-0.5 overflow-hidden shadow-lg ring-1 ring-amber-400/30 flex items-center justify-center">
                              {center.showSteam !== false && (
                                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 flex items-center justify-center gap-0.5 pointer-events-none">
                                  <span className="w-0.5 h-2.5 bg-white/70 rounded-full blur-[0.5px] animate-pulse" />
                                  <span className="w-0.5 h-3.5 bg-amber-100/70 rounded-full blur-[0.5px] animate-pulse" />
                                </div>
                              )}
                              <img src={center.stickerUrl || '/stickers/tea.jpg'} alt={center.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="mt-1 text-[8px] font-extrabold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 px-2 py-0.2 rounded-full shadow-xs truncate max-w-[85px]">
                              {center.price} • {center.name}
                            </span>
                          </div>

                          {/* Right */}
                          <div className="flex flex-col items-center">
                            <div className="w-11 h-11 rounded-xl bg-black/40 border border-white/15 p-0.5 overflow-hidden shadow-md flex items-center justify-center">
                              <img src={right.stickerUrl || '/stickers/samosa.jpg'} alt={right.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="mt-1 text-[8px] font-bold text-amber-300 bg-white/10 px-1.5 py-0.2 rounded-full border border-white/10 truncate max-w-[70px]">
                              {right.price} • {right.name}
                            </span>
                          </div>
                        </div>

                        {/* Promo / Discount Badge if enabled */}
                        {editForm.discount_badge_enabled && (
                          <div className="mt-1.5 text-center">
                            <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/20 inline-block">
                              {editForm.discount_badge_title || 'Armed Forces 10% Off'}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Category Chips Bar */}
                  <div className="flex items-center gap-1.5 overflow-x-hidden pt-1">
                    <span
                      className="px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-2xs"
                      style={{ backgroundColor: previewPrimary }}
                    >
                      All Items (12)
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-stone-100 text-stone-600 border border-stone-200">
                      Parathas & Rolls
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-stone-100 text-stone-600 border border-stone-200">
                      Beverages
                    </span>
                  </div>

                  {/* Simulated Dishes Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="bg-white rounded-xl p-2.5 border border-stone-200 shadow-2xs space-y-1.5">
                      <div className="w-full h-16 rounded-lg bg-stone-100 overflow-hidden relative">
                        <div className="absolute top-1 left-1 w-3 h-3 border border-emerald-600 flex items-center justify-center bg-white">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        </div>
                        <img
                          src="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=300"
                          alt="Dish"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-stone-800 truncate">Aloo Paratha</span>
                        <span className="text-[11px] font-extrabold" style={{ color: previewPrimary }}>₹60</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-2.5 border border-stone-200 shadow-2xs space-y-1.5">
                      <div className="w-full h-16 rounded-lg bg-stone-100 overflow-hidden relative">
                        <div className="absolute top-1 left-1 w-3 h-3 border border-emerald-600 flex items-center justify-center bg-white">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        </div>
                        <img
                          src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300"
                          alt="Dish"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-stone-800 truncate">Special Thali</span>
                        <span className="text-[11px] font-extrabold" style={{ color: previewPrimary }}>₹140</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Footer */}
                <div
                  className="px-4 py-3 text-white text-[10px] flex items-center justify-between"
                  style={{ backgroundColor: previewPrimary }}
                >
                  <span className="truncate">{previewName} • {previewTagline}</span>
                  <span className="font-bold" style={{ color: previewAccent }}>Open</span>
                </div>
              </div>
            </div>

            {/* Quick Link Helper */}
            <div className="p-3 bg-white rounded-2xl border border-stone-200 text-xs text-stone-600 flex items-center justify-between gap-2">
              <span className="truncate font-mono text-[11px] text-stone-500">
                /menu?canteen={selectedCanteen?.slug}
              </span>
              <button
                onClick={() => {
                  const url = `${window.location.origin}/menu?canteen=${selectedCanteen?.slug}`;
                  navigator.clipboard.writeText(url);
                  addToast('info', 'Customer link copied to clipboard!');
                }}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#075C35] hover:underline shrink-0"
              >
                <Copy className="w-3 h-3" />
                <span>Copy URL</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {isOnboardModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md overflow-y-auto p-4 sm:p-6 lg:p-8 flex items-start justify-center">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8 sm:my-12 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-white z-10 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 p-6 sm:p-8 pb-4 mb-5 border-b border-stone-100 rounded-t-3xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#063D29] text-white flex items-center justify-center shadow-xs">
                  <Building2 className="w-5 h-5 text-[#E8C928]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#20251F]">
                    Onboard New Establishment
                  </h3>
                  <p className="text-xs text-stone-500">Quick setup for new cafe, restaurant or food counter</p>
                </div>
              </div>
              <button
                onClick={() => setIsOnboardModalOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCanteen} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Canteen / Outlet Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chai & Bytes Cafe"
                    value={newCanteenForm.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
                      setNewCanteenForm({ ...newCanteenForm, name, slug });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#075C35] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    URL Identifier Slug *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. chai-bytes-cafe"
                    value={newCanteenForm.slug}
                    onChange={(e) => setNewCanteenForm({ ...newCanteenForm, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#075C35] text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Tagline / Identity
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gourmet Tea, Espresso & Quick Bites"
                  value={newCanteenForm.tagline}
                  onChange={(e) => setNewCanteenForm({ ...newCanteenForm, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#075C35] text-sm"
                />
              </div>

              {/* Theme Preset Choice for new canteen */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Select Initial Theme Palette
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {THEME_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleApplyPresetToNew(p)}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        newCanteenForm.theme_preset === p.id
                          ? 'border-[#075C35] bg-emerald-50/50 ring-1 ring-[#075C35]'
                          : 'border-stone-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.primary }} />
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.secondary }} />
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.accent }} />
                      </div>
                      <p className="text-[11px] font-bold text-stone-800 truncate">{p.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Logo Upload for new */}
              <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white p-0.5 border border-stone-200 shrink-0 flex items-center justify-center">
                  {newLogoPreview ? (
                    <img src={newLogoPreview} alt="Logo" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-stone-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-stone-700">Canteen Logo</p>
                  <p className="text-[10px] text-stone-500">Optional (can be uploaded later)</p>
                </div>
                <input
                  type="file"
                  ref={newFileInputRef}
                  accept="image/*"
                  onChange={handleNewLogoChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => newFileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-white text-xs font-bold text-[#075C35] border border-stone-300 rounded-xl hover:bg-stone-100"
                >
                  Browse File
                </button>
              </div>

              {/* Dietary & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Dietary Type
                  </label>
                  <select
                    value={newCanteenForm.dietary_type}
                    onChange={(e) => setNewCanteenForm({ ...newCanteenForm, dietary_type: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm bg-white"
                  >
                    <option value="pure_veg">Pure Vegetarian</option>
                    <option value="veg_nonveg">Veg & Non-Veg Multi-Cuisine</option>
                    <option value="jain_available">Pure Veg + Jain Food</option>
                    <option value="custom">Custom Label</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Dietary Badge Label
                  </label>
                  <input
                    type="text"
                    value={newCanteenForm.pure_veg_label}
                    onChange={(e) => setNewCanteenForm({ ...newCanteenForm, pure_veg_label: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Physical Address / Mall Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tower B Food Court, Cyber Hub, Gurugram"
                  value={newCanteenForm.address}
                  onChange={(e) => setNewCanteenForm({ ...newCanteenForm, address: e.target.value, location_landmark: e.target.value.split(',')[0] })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm"
                />
              </div>

              {/* Manager Account Setup */}
              <div className="bg-[#0F172A] text-white p-4 rounded-2xl border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-[#10B981]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#34D399]">
                      Restaurant / Cafe Manager Account
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
                    Dedicated Login
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Create manager login credentials. This manager will log in at <code className="text-emerald-400">/admin/login</code> to manage only this venue's dishes & categories.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Manager Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={newCanteenForm.manager_name}
                      onChange={(e) => setNewCanteenForm({ ...newCanteenForm, manager_name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-[#10B981] text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Manager Email *
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. manager@chaibytes.com"
                      value={newCanteenForm.manager_email}
                      onChange={(e) => setNewCanteenForm({ ...newCanteenForm, manager_email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-[#10B981] text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-slate-300">
                      Initial Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const randomPass = 'Cafe@' + Math.floor(1000 + Math.random() * 9000);
                        setNewCanteenForm({ ...newCanteenForm, manager_password: randomPass });
                      }}
                      className="text-[10px] text-[#34D399] hover:underline font-bold"
                    >
                      Generate Password
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Cafe@2026"
                    value={newCanteenForm.manager_password}
                    onChange={(e) => setNewCanteenForm({ ...newCanteenForm, manager_password: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-[#10B981] text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Clone Menu Option */}
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="clone_default"
                  checked={newCanteenForm.clone_from_default}
                  onChange={(e) => setNewCanteenForm({ ...newCanteenForm, clone_from_default: e.target.checked })}
                  className="mt-0.5 w-4 h-4 text-[#075C35] rounded focus:ring-[#075C35]"
                />
                <div>
                  <label htmlFor="clone_default" className="text-xs font-bold text-emerald-950 cursor-pointer">
                    Clone Starter Menu from Default Canteen (Annapoorna)
                  </label>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Automatically copies all 5 categories and 29 dishes so the new canteen starts with a fully populated menu catalog ready for editing.
                  </p>
                </div>
              </div>

              {/* Billing System Option */}
              <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="onboard_billing"
                  checked={newCanteenForm.billing_enabled}
                  onChange={(e) => setNewCanteenForm({ ...newCanteenForm, billing_enabled: e.target.checked })}
                  className="mt-0.5 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <div>
                  <label htmlFor="onboard_billing" className="text-xs font-bold text-stone-900 cursor-pointer flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-amber-700" />
                    <span>Enable POS Billing & Counter Terminal</span>
                  </label>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    Allows the manager to use the Counter POS terminal, print thermal receipts/KOT, and accept mobile customer orders.
                  </p>
                </div>
              </div>

              {/* 3 WhatsApp & Receipt Options on Onboarding */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2.5">
                <span className="text-xs font-bold text-stone-900 block flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Customer WhatsApp & E-Bill Options (Configurable on Demand)</span>
                </span>

                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCanteenForm.digital_ebill_enabled}
                      onChange={(e) => setNewCanteenForm({ ...newCanteenForm, digital_ebill_enabled: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span className="font-semibold text-stone-800">1. Digital E-Bill Webpage</span>
                    <span className="text-[10px] text-stone-500">(/receipt/:orderNumber)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCanteenForm.whatsapp_billing_enabled}
                      onChange={(e) => setNewCanteenForm({ ...newCanteenForm, whatsapp_billing_enabled: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span className="font-semibold text-stone-800">2. Free 1-Click WhatsApp Direct Bill</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">100% Free wa.me</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCanteenForm.whatsapp_auto_send_enabled}
                      onChange={(e) => setNewCanteenForm({ ...newCanteenForm, whatsapp_auto_send_enabled: e.target.checked })}
                      className="w-4 h-4 text-teal-600 rounded"
                    />
                    <span className="font-semibold text-stone-800">3. Automated WhatsApp Cloud API Gateway</span>
                    <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200 font-bold">Auto Background</span>
                  </label>
                </div>
              </div>

              {/* Submit Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsOnboardModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#063D29] hover:bg-[#04281B] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all disabled:opacity-60"
                >
                  {isSaving ? 'Onboarding...' : 'Complete Onboarding'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CLONE MENU TEMPLATE                                                */}
      {/* ========================================================================= */}
      {isCloneModalOpen && cloneTargetCanteen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Copy className="w-5 h-5 text-[#075C35]" />
                <h3 className="font-serif font-bold text-base text-[#20251F]">
                  Clone Menu Catalog
                </h3>
              </div>
              <button
                onClick={() => setIsCloneModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600 mb-4">
              You are cloning dishes & categories into <strong>{cloneTargetCanteen.name}</strong>. Choose the source canteen to copy from:
            </p>

            <div className="space-y-3 mb-5">
              <label className="block text-xs font-bold text-stone-700">Source Canteen</label>
              <select
                value={cloneSourceId}
                onChange={(e) => setCloneSourceId(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm bg-white font-medium"
              >
                {canteens
                  .filter((c) => c.id !== cloneTargetCanteen.id)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.menu_items_count ?? 0} dishes)
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCloneModalOpen(false)}
                className="px-4 py-2 text-stone-600 text-xs font-bold hover:bg-stone-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteClone}
                disabled={isCloning || !cloneSourceId}
                className="px-4 py-2 bg-[#063D29] hover:bg-[#04281B] text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-60"
              >
                {isCloning ? 'Cloning dishes...' : 'Confirm & Duplicate Menu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: MANAGE MANAGER CREDENTIALS                                         */}
      {/* ========================================================================= */}
      {isManagerModalOpen && managerTargetCanteen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#10B981]/20 flex items-center justify-center">
                  <Key className="w-4 h-4 text-[#075C35]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#20251F]">
                    Manager Account
                  </h3>
                  <p className="text-[11px] text-stone-500">{managerTargetCanteen.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsManagerModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveManager} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Manager Name *
                </label>
                <input
                  type="text"
                  required
                  value={managerForm.name}
                  onChange={(e) => setManagerForm({ ...managerForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#075C35]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Login Email *
                </label>
                <input
                  type="email"
                  required
                  value={managerForm.email}
                  onChange={(e) => setManagerForm({ ...managerForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#075C35]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-700">
                    {managerForm.manager_id ? 'Reset Password (Leave blank to keep current)' : 'Initial Password *'}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const randomPass = 'Cafe@' + Math.floor(1000 + Math.random() * 9000);
                      setManagerForm({ ...managerForm, password: randomPass });
                    }}
                    className="text-[10px] text-[#075C35] hover:underline font-bold"
                  >
                    Generate
                  </button>
                </div>
                <input
                  type="text"
                  placeholder={managerForm.manager_id ? 'Enter new password to change' : 'e.g. Cafe@2026'}
                  value={managerForm.password}
                  onChange={(e) => setManagerForm({ ...managerForm, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#075C35]"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-500">
                This manager logs in at <strong className="text-stone-800">/admin/login</strong> and has administrative control strictly over <strong>{managerTargetCanteen.name}</strong>.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsManagerModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingManager}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#075C35] hover:bg-[#063D29] transition-all disabled:opacity-50"
                >
                  {isSavingManager ? 'Saving...' : 'Save Credentials'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
};
