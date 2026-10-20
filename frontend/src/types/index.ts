export interface MenuItem {
  id: number;
  category_id: number;
  category_name?: string;
  name: string;
  slug: string;
  description: string | null;
  price_type: 'fixed' | 'range' | 'mrp';
  price: number;
  price_max: number | null;
  formatted_price: string;
  pricing_note: string | null;
  image_path: string | null;
  image_url: string | null;
  serving_info: string | null;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  items_count?: number;
  items?: MenuItem[];
  created_at?: string;
  updated_at?: string;
}

export interface Canteen {
  id: number;
  name: string;
  slug: string;
  tagline: string | null;
  logo_url: string | null;
  full_logo_url?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  bg_color: string;
  theme_preset: string;
  dietary_type: 'pure_veg' | 'veg_nonveg' | 'jain_available' | 'custom';
  pure_veg_label: string;
  address: string | null;
  location_landmark: string | null;
  phone: string | null;
  whatsapp: string | null;
  opening_hours: string | null;
  hero_heading: string | null;
  hero_subheading: string | null;
  hero_badge?: string | null;
  hero_trio?: HeroTrioItem[] | null;
  announcement_enabled: boolean;
  announcement_text: string | null;
  discount_badge_enabled: boolean;
  discount_badge_title: string;
  discount_badge_text: string | null;
  qr_target_url: string | null;
  is_active: boolean;
  is_default: boolean;
  categories_count?: number;
  menu_items_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface RestaurantSettings {
  restaurant_name: string;
  tagline: string;
  pure_veg_label: string;
  dietary_type?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  bg_color?: string;
  theme_preset?: string;
  address: string;
  location_landmark: string;
  phone: string;
  whatsapp: string;
  opening_hours: string;
  hero_heading: string;
  hero_subheading: string;
  hero_badge?: string;
  hero_trio?: HeroTrioItem[];
  logo_url: string;
  full_logo_url?: string;
  announcement_enabled: string | boolean;
  announcement_text: string;
  army_discount_enabled: string | boolean;
  army_discount_text: string;
  discount_badge_enabled?: string | boolean;
  discount_badge_title?: string;
  discount_badge_text?: string;
  qr_target_url: string;
  canteen_id?: number;
  slug?: string;
  [key: string]: any;
}

export interface HeroTrioItem {
  id: string;
  name: string;
  price: string;
  searchTerm: string;
  stickerUrl: string;
  showSteam?: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface DashboardMetrics {
  total_items: number;
  available_items: number;
  unavailable_items: number;
  total_categories: number;
  active_categories: number;
  featured_items: number;
  total_scans: number;
  today_scans: number;
}
