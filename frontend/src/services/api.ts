import axios, { AxiosInstance } from 'axios';
import { Category, MenuItem, RestaurantSettings, User, DashboardMetrics, Canteen } from '../types';

const getBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    return envUrl;
  }
  // In production (on Hostinger or live domain), use same origin /api/v1
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `${window.location.origin}/api/v1`;
  }
  return 'http://localhost:8000/api/v1';
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Accept': 'application/json',
  },
});

// Interceptor to inject bearer token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('annapoorna_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor to handle unauthenticated response
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('annapoorna_token');
        localStorage.removeItem('annapoorna_user');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

/*
|--------------------------------------------------------------------------
| Public API Methods
|--------------------------------------------------------------------------
*/
export const publicApi = {
  getMenu: async (fromQr: boolean = false, canteen?: string | number) => {
    const params: Record<string, any> = { from_qr: fromQr ? 1 : 0 };
    if (canteen) {
      params.canteen = canteen;
    }
    const res = await apiClient.get<{
      categories: Category[];
      settings: RestaurantSettings;
      canteen?: Canteen;
      timestamp: string;
    }>('/menu', { params });
    return res.data;
  },

  getCanteens: async () => {
    const res = await apiClient.get<{ canteens: Canteen[] }>('/canteens');
    return res.data.canteens;
  },

  getCategories: async () => {
    const res = await apiClient.get<{ categories: Category[] }>('/categories');
    return res.data.categories;
  },

  getRestaurant: async () => {
    const res = await apiClient.get<{ settings: RestaurantSettings }>('/restaurant');
    return res.data.settings;
  },

  recordScan: async (source: string = 'qr_code') => {
    const res = await apiClient.post('/qr-scans', { source });
    return res.data;
  },
};

/*
|--------------------------------------------------------------------------
| Authentication API Methods
|--------------------------------------------------------------------------
*/
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await apiClient.post<{
      message: string;
      token: string;
      user: User;
    }>('/admin/login', credentials);
    return res.data;
  },

  logout: async () => {
    const res = await apiClient.post<{ message: string }>('/admin/logout');
    return res.data;
  },

  getMe: async () => {
    const res = await apiClient.get<{ user: User }>('/admin/me');
    return res.data.user;
  },
};

/*
|--------------------------------------------------------------------------
| Admin Management API Methods
|--------------------------------------------------------------------------
*/
export const adminApi = {
  getDashboard: async () => {
    const res = await apiClient.get<{
      metrics: DashboardMetrics;
      recent_items: MenuItem[];
    }>('/admin/dashboard');
    return res.data;
  },

  // Menu items
  getMenuItems: async (params?: {
    search?: string;
    category_id?: number | string;
    is_available?: boolean | string;
    is_featured?: boolean | string;
    sort_by?: string;
    sort_direction?: string;
  }) => {
    const res = await apiClient.get<{
      data: MenuItem[];
      pagination: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
      };
    }>('/admin/menu-items', { params });
    return res.data;
  },

  createMenuItem: async (formData: FormData) => {
    const res = await apiClient.post<{
      message: string;
      data: MenuItem;
    }>('/admin/menu-items', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  updateMenuItem: async (id: number, formData: FormData) => {
    const res = await apiClient.post<{
      message: string;
      data: MenuItem;
    }>(`/admin/menu-items/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteMenuItem: async (id: number) => {
    const res = await apiClient.delete<{ message: string }>(`/admin/menu-items/${id}`);
    return res.data;
  },

  toggleAvailability: async (id: number) => {
    const res = await apiClient.patch<{
      message: string;
      data: MenuItem;
    }>(`/admin/menu-items/${id}/availability`);
    return res.data;
  },

  toggleFeatured: async (id: number) => {
    const res = await apiClient.patch<{
      message: string;
      data: MenuItem;
    }>(`/admin/menu-items/${id}/featured`);
    return res.data;
  },

  // Categories
  getCategories: async () => {
    const res = await apiClient.get<{ data: Category[] }>('/admin/categories');
    return res.data.data;
  },

  createCategory: async (data: Partial<Category>) => {
    const res = await apiClient.post<{
      message: string;
      data: Category;
    }>('/admin/categories', data);
    return res.data;
  },

  updateCategory: async (id: number, data: Partial<Category>) => {
    const res = await apiClient.put<{
      message: string;
      data: Category;
    }>(`/admin/categories/${id}`, data);
    return res.data;
  },

  deleteCategory: async (id: number) => {
    const res = await apiClient.delete<{ message: string }>(`/admin/categories/${id}`);
    return res.data;
  },

  // Settings
  getSettings: async () => {
    const res = await apiClient.get<{ settings: RestaurantSettings }>('/admin/settings');
    return res.data.settings;
  },

  updateSettings: async (formData: FormData) => {
    const res = await apiClient.post<{
      message: string;
      settings: RestaurantSettings;
    }>('/admin/settings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // Canteens (Super Admin Multi-Tenancy & Theming)
  getCanteens: async () => {
    const res = await apiClient.get<{ canteens?: Canteen[]; data?: Canteen[] }>('/admin/canteens');
    return res.data.canteens || res.data.data || [];
  },

  getCanteen: async (id: number) => {
    const res = await apiClient.get<{ canteen?: Canteen; data?: Canteen }>(`/admin/canteens/${id}`);
    return (res.data.canteen || res.data.data) as Canteen;
  },

  createCanteen: async (formData: FormData) => {
    const res = await apiClient.post<{
      message: string;
      canteen?: Canteen;
      data?: Canteen;
    }>('/admin/canteens', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return {
      message: res.data.message,
      data: (res.data.canteen || res.data.data) as Canteen,
    };
  },

  updateCanteen: async (id: number, formData: FormData) => {
    const res = await apiClient.post<{
      message: string;
      canteen?: Canteen;
      data?: Canteen;
    }>(`/admin/canteens/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return {
      message: res.data.message,
      data: (res.data.canteen || res.data.data) as Canteen,
    };
  },

  deleteCanteen: async (id: number) => {
    const res = await apiClient.delete<{ message: string }>(`/admin/canteens/${id}`);
    return res.data;
  },

  setDefaultCanteen: async (id: number) => {
    const res = await apiClient.post<{
      message: string;
      data: Canteen;
    }>(`/admin/canteens/${id}/set-default`);
    return res.data;
  },

  cloneMenu: async (targetId: number, fromCanteenId: number) => {
    const res = await apiClient.post<{
      message: string;
      categories_cloned: number;
      items_cloned: number;
    }>(`/admin/canteens/${targetId}/clone-menu`, {
      from_canteen_id: fromCanteenId,
    });
    return res.data;
  },
};

