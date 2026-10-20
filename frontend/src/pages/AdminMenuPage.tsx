import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Star,
  CheckCircle,
  XCircle,
  Upload,
  Image as ImageIcon,
  X,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { Toast, ToastMessage } from '../components/Toast';
import { ConfirmModal } from '../components/ConfirmModal';
import { adminApi } from '../services/api';
import { Category, MenuItem } from '../types';

export const AdminMenuPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  // Form Fields
  const [formData, setFormData] = useState({
    category_id: '',
    name: '',
    description: '',
    price_type: 'fixed' as 'fixed' | 'range' | 'mrp',
    price: '',
    price_max: '',
    pricing_note: '',
    serving_info: '',
    is_available: true,
    is_featured: false,
    sort_order: '0',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Delete Modal
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [itemsRes, catsRes] = await Promise.all([
        adminApi.getMenuItems({
          search: searchQuery || undefined,
          category_id: categoryFilter || undefined,
          is_available: availabilityFilter !== '' ? availabilityFilter : undefined,
        }),
        adminApi.getCategories(),
      ]);

      setItems(itemsRes.data || []);
      setCategories(catsRes || []);
    } catch (err) {
      console.error(err);
      addToast('error', 'Failed to load menu items');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [categoryFilter, availabilityFilter]);

  // Open modal if URL has ?action=new
  useEffect(() => {
    if (searchParams.get('action') === 'new' && categories.length > 0) {
      handleOpenCreate();
      setSearchParams({});
    }
  }, [categories]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      category_id: categories.length > 0 ? categories[0].id.toString() : '',
      name: '',
      description: '',
      price_type: 'fixed',
      price: '',
      price_max: '',
      pricing_note: '',
      serving_info: '',
      is_available: true,
      is_featured: false,
      sort_order: (items.length + 1).toString(),
    });
    setImageFile(null);
    setImagePreview(null);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      category_id: item.category_id.toString(),
      name: item.name,
      description: item.description || '',
      price_type: item.price_type,
      price: item.price !== null ? item.price.toString() : '',
      price_max: item.price_max !== null ? item.price_max.toString() : '',
      pricing_note: item.pricing_note || '',
      serving_info: item.serving_info || '',
      is_available: item.is_available,
      is_featured: item.is_featured,
      sort_order: item.sort_order.toString(),
    });
    setImageFile(null);
    setImagePreview(item.image_url || null);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    try {
      const payload = new FormData();
      payload.append('category_id', formData.category_id);
      payload.append('name', formData.name);
      payload.append('description', formData.description || '');
      payload.append('price_type', formData.price_type);

      if (formData.price_type === 'fixed') {
        payload.append('price', formData.price || '0');
      } else if (formData.price_type === 'range') {
        payload.append('price', formData.price || '0');
        payload.append('price_max', formData.price_max || '0');
      } else {
        payload.append('price', '0');
      }

      payload.append('pricing_note', formData.pricing_note || '');
      payload.append('serving_info', formData.serving_info || '');
      payload.append('is_available', formData.is_available ? '1' : '0');
      payload.append('is_featured', formData.is_featured ? '1' : '0');
      payload.append('sort_order', formData.sort_order || '0');

      if (imageFile) {
        payload.append('image', imageFile);
      }

      if (editingItem) {
        const res = await adminApi.updateMenuItem(editingItem.id, payload);
        addToast('success', res.message);
      } else {
        const res = await adminApi.createMenuItem(payload);
        addToast('success', res.message);
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.errors) {
        setFormErrors(err.response.data.errors);
      } else {
        addToast('error', err.response?.data?.message || 'Failed to save menu item');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAvailability = async (id: number) => {
    try {
      const res = await adminApi.toggleAvailability(id);
      addToast('success', res.message);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, is_available: res.data.is_available } : item))
      );
    } catch {
      addToast('error', 'Failed to toggle availability');
    }
  };

  const handleToggleFeatured = async (id: number) => {
    try {
      const res = await adminApi.toggleFeatured(id);
      addToast('success', res.message);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, is_featured: res.data.is_featured } : item))
      );
    } catch {
      addToast('error', 'Failed to toggle featured status');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const res = await adminApi.deleteMenuItem(itemToDelete.id);
      addToast('success', res.message);
      setItemToDelete(null);
      fetchData();
    } catch {
      addToast('error', 'Failed to delete menu item');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout
      title="Menu Items Management"
      subtitle="Create, edit, price, and control live availability of Annapoorna menu items"
    >
      <Toast toasts={toasts} onDismiss={removeToast} />

      <ConfirmModal
        isOpen={!!itemToDelete}
        title="Delete Menu Item"
        message={`Are you sure you want to permanently delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Yes, Delete Item"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setItemToDelete(null)}
      />

      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E3E0D6] shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#72776F]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchData()}
            placeholder="Search items..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F1] border border-[#E3E0D6] rounded-xl text-xs sm:text-sm text-[#20251F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#075C35]"
          />
        </div>

        {/* Filters and Add Action */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF8F1] border border-[#E3E0D6] rounded-xl text-xs font-semibold text-[#063D29] focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Availability Dropdown */}
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF8F1] border border-[#E3E0D6] rounded-xl text-xs font-semibold text-[#063D29] focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="1">Available Only</option>
            <option value="0">Unavailable (Sold Out)</option>
          </select>

          {/* Search Trigger */}
          <button
            onClick={fetchData}
            className="p-2 bg-stone-100 hover:bg-stone-200 text-[#063D29] rounded-xl"
            title="Refresh Search"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Add Item Button */}
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#075C35] hover:bg-[#063D29] text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#E8C928]" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-2xl border border-[#E3E0D6] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FAF8F1] text-[#72776F] border-b border-[#E3E0D6] font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Item & Image</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Pricing</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4">Live Availability</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E0D6]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#72776F]">
                    Loading menu items...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#72776F]">
                    No menu items found. Click "Add Item" to create one.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                    {/* Item & Image */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-serif text-stone-400 font-bold bg-[#FAF8F1]">
                              {item.name[0]}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[#20251F] text-sm">{item.name}</p>
                          {item.serving_info && (
                            <p className="text-[11px] text-[#72776F]">{item.serving_info}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-[#72776F]">
                      <span className="bg-[#FAF8F1] px-2 py-1 rounded-md border border-[#E3E0D6] font-medium text-xs">
                        {item.category_name || 'General'}
                      </span>
                    </td>

                    {/* Pricing */}
                    <td className="py-3 px-4">
                      <div className="font-serif font-bold text-[#075C35] text-sm">
                        {item.formatted_price}
                      </div>
                      {item.pricing_note && (
                        <p className="text-[10px] text-[#72776F] truncate max-w-xs">{item.pricing_note}</p>
                      )}
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(item.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          item.is_featured
                            ? 'text-[#063D29] bg-[#E8C928]/40 hover:bg-[#E8C928]'
                            : 'text-stone-300 hover:text-stone-500'
                        }`}
                        title="Toggle Bestseller Badge"
                      >
                        <Star className={`w-4 h-4 ${item.is_featured ? 'fill-current text-[#063D29]' : ''}`} />
                      </button>
                    </td>

                    {/* Live Availability Toggle Switch */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleAvailability(item.id)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
                          item.is_available
                            ? 'bg-green-100 hover:bg-green-200 text-green-800'
                            : 'bg-red-100 hover:bg-red-200 text-red-800'
                        }`}
                        title="Click to toggle availability"
                      >
                        <span className={`w-2 h-2 rounded-full ${item.is_available ? 'bg-green-600' : 'bg-red-600'}`} />
                        <span>{item.is_available ? 'Available' : 'Sold Out'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-stone-500 hover:text-[#075C35] hover:bg-stone-100 rounded-lg transition-colors"
                          title="Edit Item"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setItemToDelete(item)}
                          className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-modal border border-stone-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#E3E0D6] flex items-center justify-between bg-[#FAF8F1]">
              <h3 className="font-serif font-bold text-lg text-[#063D29]">
                {editingItem ? `Edit Item: ${editingItem.name}` : 'Add New Menu Item'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              {/* Category & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#063D29] mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F1] border border-[#E3E0D6] rounded-xl text-xs sm:text-sm text-[#20251F] focus:outline-none focus:ring-2 focus:ring-[#075C35]"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.category_id && (
                    <p className="mt-1 text-[11px] text-red-600">{formErrors.category_id[0]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#063D29] mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Deluxe Thali"
                    className="w-full px-3 py-2 bg-[#FAF8F1] border border-[#E3E0D6] rounded-xl text-xs sm:text-sm text-[#20251F] focus:outline-none focus:ring-2 focus:ring-[#075C35]"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-[11px] text-red-600">{formErrors.name[0]}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#063D29] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ingredients, preparation style, and sides included..."
                  className="w-full px-3 py-2 bg-[#FAF8F1] border border-[#E3E0D6] rounded-xl text-xs sm:text-sm text-[#20251F] focus:outline-none focus:ring-2 focus:ring-[#075C35]"
                />
              </div>

              {/* Price Type & Values */}
              <div className="p-3.5 bg-[#FAF8F1] rounded-2xl border border-[#E3E0D6] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#063D29]">
                    Pricing Model
                  </span>
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center gap-1 text-xs cursor-pointer">
                      <input
                        type="radio"
                        name="price_type"
                        value="fixed"
                        checked={formData.price_type === 'fixed'}
                        onChange={() => setFormData({ ...formData, price_type: 'fixed' })}
                        className="text-[#075C35] focus:ring-[#075C35]"
                      />
                      <span>Fixed Price</span>
                    </label>

                    <label className="inline-flex items-center gap-1 text-xs cursor-pointer">
                      <input
                        type="radio"
                        name="price_type"
                        value="range"
                        checked={formData.price_type === 'range'}
                        onChange={() => setFormData({ ...formData, price_type: 'range' })}
                        className="text-[#075C35] focus:ring-[#075C35]"
                      />
                      <span>Price Range</span>
                    </label>

                    <label className="inline-flex items-center gap-1 text-xs cursor-pointer">
                      <input
                        type="radio"
                        name="price_type"
                        value="mrp"
                        checked={formData.price_type === 'mrp'}
                        onChange={() => setFormData({ ...formData, price_type: 'mrp' })}
                        className="text-[#075C35] focus:ring-[#075C35]"
                      />
                      <span>MRP (Packaged)</span>
                    </label>
                  </div>
                </div>

                {formData.price_type === 'fixed' && (
                  <div>
                    <label className="block text-xs font-bold text-[#72776F] mb-1">
                      Price (₹ INR) *
                    </label>
                    <input
                      type="number"
                      step="1"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="e.g. 50"
                      className="w-full px-3 py-2 bg-white border border-[#E3E0D6] rounded-xl text-xs sm:text-sm text-[#20251F]"
                    />
                    {formErrors.price && (
                      <p className="mt-1 text-[11px] text-red-600">{formErrors.price[0]}</p>
                    )}
                  </div>
                )}

                {formData.price_type === 'range' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#72776F] mb-1">
                        Min Price (₹) *
                      </label>
                      <input
                        type="number"
                        step="1"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="e.g. 40"
                        className="w-full px-3 py-2 bg-white border border-[#E3E0D6] rounded-xl text-xs sm:text-sm text-[#20251F]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#72776F] mb-1">
                        Max Price (₹) *
                      </label>
                      <input
                        type="number"
                        step="1"
                        required
                        value={formData.price_max}
                        onChange={(e) => setFormData({ ...formData, price_max: e.target.value })}
                        placeholder="e.g. 70"
                        className="w-full px-3 py-2 bg-white border border-[#E3E0D6] rounded-xl text-xs sm:text-sm text-[#20251F]"
                      />
                    </div>
                  </div>
                )}

                {/* Optional pricing note */}
                <div>
                  <label className="block text-xs font-bold text-[#72776F] mb-1">
                    Pricing Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.pricing_note}
                    onChange={(e) => setFormData({ ...formData, pricing_note: e.target.value })}
                    placeholder="e.g. Special Chai ₹15 / Coffee ₹25 or Sold on printed MRP"
                    className="w-full px-3 py-2 bg-white border border-[#E3E0D6] rounded-xl text-xs sm:text-sm text-[#20251F]"
                  />
                </div>
              </div>

              {/* Serving Info & Sort Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#063D29] mb-1">
                    Serving Portion
                  </label>
                  <input
                    type="text"
                    value={formData.serving_info}
                    onChange={(e) => setFormData({ ...formData, serving_info: e.target.value })}
                    placeholder="e.g. 2 Pcs with Sabji"
                    className="w-full px-3 py-2 bg-[#FAF8F1] border border-[#E3E0D6] rounded-xl text-xs sm:text-sm text-[#20251F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#063D29] mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F1] border border-[#E3E0D6] rounded-xl text-xs sm:text-sm text-[#20251F]"
                  />
                </div>
              </div>

              {/* Food Image Upload & Live Preview */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#063D29] mb-1.5">
                  Food Photography (JPG, PNG, WebP — Max 5MB)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#FAF8F1] border border-[#E3E0D6] flex-shrink-0 flex items-center justify-center">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-stone-300" />
                    )}
                  </div>

                  <label className="flex-1 flex flex-col items-center justify-center px-4 py-3 bg-[#FAF8F1] hover:bg-[#F3EFE3] border-2 border-dashed border-[#E3E0D6] rounded-2xl cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-[#075C35] mb-1" />
                    <span className="text-xs font-semibold text-[#063D29]">Choose image file</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {formErrors.image && (
                  <p className="mt-1 text-[11px] text-red-600">{formErrors.image[0]}</p>
                )}
              </div>

              {/* Toggles: Availability & Featured */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_available}
                    onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                    className="w-4 h-4 text-[#075C35] rounded focus:ring-[#075C35]"
                  />
                  <span className="text-xs font-bold text-[#063D29]">Mark as Ready to Serve</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 text-[#E8C928] rounded focus:ring-[#E8C928]"
                  />
                  <span className="text-xs font-bold text-[#063D29]">Highlight as Bestseller</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-[#E3E0D6]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-[#20251F] bg-stone-100 hover:bg-stone-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#075C35] hover:bg-[#063D29] rounded-xl shadow-sm active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving Item...' : editingItem ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
