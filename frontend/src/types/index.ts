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
  page_title?: string | null;
  slug: string;
  tagline: string | null;
  logo_url: string | null;
  full_logo_url?: string;
  favicon_url?: string | null;
  full_favicon_url?: string;
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
  billing_enabled?: boolean;
  digital_ebill_enabled?: boolean;
  whatsapp_billing_enabled?: boolean;
  whatsapp_auto_send_enabled?: boolean;
  whatsapp_api_phone_id?: string | null;
  whatsapp_api_token?: string | null;
  whatsapp_api_template?: string | null;
  is_default: boolean;
  managers?: Array<{ id: number; name: string; email: string; role: string; created_at?: string }>;
  categories_count?: number;
  menu_items_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface RestaurantSettings {
  restaurant_name: string;
  page_title?: string;
  tagline: string;
  pure_veg_label: string;
  dietary_type?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  bg_color?: string;
  theme_preset?: string;
  favicon_url?: string;
  full_favicon_url?: string;
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
  role: 'super_admin' | 'admin' | 'manager' | string;
  canteen_id?: number | null;
  canteen?: {
    id: number;
    name: string;
    slug: string;
    logo_url?: string;
    primary_color?: string;
    secondary_color?: string;
    accent_color?: string;
    bg_color?: string;
  } | null;
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

export interface OrderItem {
  id?: number;
  order_id?: number;
  menu_item_id?: number | null;
  item_name: string;
  variant?: string | null;
  unit_price: number;
  quantity: number;
  total_price: number;
  notes?: string | null;
  formatted_unit_price?: string;
  formatted_total_price?: string;
}

export interface Order {
  id: number;
  canteen_id: number;
  order_number: string;
  token_number?: string | null;
  order_type: 'dine_in' | 'takeaway' | 'delivery';
  table_number?: string | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  payment_status: 'unpaid' | 'paid' | 'partially_paid';
  payment_method: 'cash' | 'upi' | 'card' | 'online' | 'unspecified';
  subtotal: number;
  discount: number;
  tax: number;
  total_amount: number;
  notes?: string | null;
  billed_by?: string | null;
  source: 'qr_customer' | 'counter_pos';
  settled_at?: string | null;
  created_at: string;
  updated_at: string;
  formatted_total?: string;
  formatted_subtotal?: string;
  status_label?: string;
  items: OrderItem[];
  canteen?: Canteen;
}

export interface CartItem {
  id: string; // unique composite key: e.g. "item-12-half"
  menu_item_id: number;
  name: string;
  variant?: string;
  unit_price: number;
  quantity: number;
  image_url?: string | null;
}

export interface CreateOrderPayload {
  canteen_id?: number;
  canteen_slug?: string;
  order_type: 'dine_in' | 'takeaway' | 'delivery';
  table_number?: string;
  customer_name?: string;
  customer_phone?: string;
  payment_method?: string;
  payment_status?: string;
  discount?: number;
  tax?: number;
  notes?: string;
  items: {
    menu_item_id?: number | null;
    name: string;
    variant?: string | null;
    unit_price: number;
    quantity: number;
    notes?: string | null;
  }[];
}

export interface OrderStats {
  total_today: number;
  pending_count: number;
  active_kitchen: number;
  today_sales: number;
}

