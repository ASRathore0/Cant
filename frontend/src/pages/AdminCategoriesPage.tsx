import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FolderTree, CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { Toast, ToastMessage } from '../components/Toast';
import { ConfirmModal } from '../components/ConfirmModal';
import { adminApi, publicApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Category, Canteen } from '../types';

export const AdminCategoriesPage: React.FC = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin' || user?.role === 'superadmin';
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [selectedCanteenId, setSelectedCanteenId] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    sort_order: '0',
    is_active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  // Delete
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
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

  // Load canteens for Super Admin
  useEffect(() => {
    if (isSuperAdmin) {
      publicApi.getCanteens().then((list) => {
        setCanteens(list);
        if (!selectedCanteenId && list.length > 0) {
          const defaultCanteen = list.find((c) => c.is_default) || list[0];
          setSelectedCanteenId(defaultCanteen.id.toString());
        }
      }).catch((err) => console.error('Failed to load canteens for category selector:', err));
    }
  }, [isSuperAdmin]);

  const fetchCategories = async () => {
    setIsLoading(true);
    const activeCanteenId = isSuperAdmin ? selectedCanteenId : (user?.canteen_id?.toString() || undefined);
    try {
      const data = await adminApi.getCategories({ canteen_id: activeCanteenId || undefined });
      setCategories(data || []);
    } catch {
      addToast('error', 'Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [selectedCanteenId]);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      sort_order: (categories.length + 1).toString(),
      is_active: true,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      sort_order: cat.sort_order.toString(),
      is_active: cat.is_active,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    try {
      const payload: any = {
        name: formData.name,
        slug: formData.slug || undefined,
        description: formData.description || undefined,
        sort_order: parseInt(formData.sort_order || '0', 10),
        is_active: formData.is_active,
      };

      if (isSuperAdmin && selectedCanteenId) {
        payload.canteen_id = parseInt(selectedCanteenId, 10);
      }

      if (editingCategory) {
        const res = await adminApi.updateCategory(editingCategory.id, payload);
        addToast('success', res.message);
      } else {
        const res = await adminApi.createCategory(payload);
        addToast('success', res.message);
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.errors) {
        setFormErrors(err.response.data.errors);
      } else {
        addToast('error', err.response?.data?.message || 'Failed to save category');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);

    try {
      const res = await adminApi.deleteCategory(categoryToDelete.id);
      addToast('success', res.message);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (err: any) {
      addToast('error', err.response?.data?.message || 'Cannot delete category with active menu items');
      setCategoryToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout
      title="Category Management"
      subtitle={`Organise digital menu sections for ${
        isSuperAdmin
          ? canteens.find((c) => c.id.toString() === selectedCanteenId)?.name || 'restaurant'
          : user?.canteen?.name || 'restaurant'
      }`}
    >
      <Toast toasts={toasts} onDismiss={removeToast} />

      <ConfirmModal
        isOpen={!!categoryToDelete}
        title="Delete Category"
        message={`Are you sure you want to delete the category "${categoryToDelete?.name}"? You cannot delete categories that still have menu items assigned.`}
        confirmLabel="Delete Category"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setCategoryToDelete(null)}
      />

      {/* Super Admin Venue Selector */}
      {isSuperAdmin && (
        <div className="bg-[#062D1F] text-white p-3.5 rounded-2xl mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 border border-emerald-800 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#E8C928]">Managing Restaurant:</span>
            <span className="text-sm font-bold text-white">
              {canteens.find((c) => c.id.toString() === selectedCanteenId)?.name || 'All Venues'}
            </span>
          </div>
          <select
            value={selectedCanteenId}
            onChange={(e) => setSelectedCanteenId(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-1.5 bg-[#07402A] border border-white/20 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#E8C928]"
          >
            {canteens.map((c) => (
              <option key={c.id} value={c.id.toString()}>
                {c.name} {c.is_default ? '(Primary / Default)' : '(Outlet / Branch)'}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <p className="text-xs sm:text-sm text-[#72776F]">
          Total Categories: <strong className="text-[#063D29]">{categories.length}</strong>
        </p>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#075C35] hover:bg-[#063D29] text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 text-[#E8C928]" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-[#E3E0D6] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FAF8F1] text-[#72776F] border-b border-[#E3E0D6] font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Assigned Items</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E0D6]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#72776F]">
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#72776F]">
                    No categories found. Click "Add Category" to create one.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#075C35]">
                      #{cat.sort_order}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#063D29]">
                      {cat.name}
                      {cat.description && (
                        <p className="text-[11px] text-[#72776F] font-normal truncate max-w-sm mt-0.5">
                          {cat.description}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#72776F] font-mono text-xs">
                      {cat.slug}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#FAF8F1] border border-[#E3E0D6] text-[#063D29]">
                        {cat.items_count ?? 0} Items
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          cat.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${cat.is_active ? 'bg-green-600' : 'bg-stone-500'}`} />
                        {cat.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="p-1.5 text-stone-500 hover:text-[#075C35] hover:bg-stone-100 rounded-lg transition-colors"
                          title="Edit Category"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setCategoryToDelete(cat)}
                          className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Category"
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

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-modal border border-stone-200 overflow-hidden">
            <div className="p-5 border-b border-[#E3E0D6] flex items-center justify-between bg-[#FAF8F1]">
              <h3 className="font-serif font-bold text-lg text-[#063D29]">
                {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Add New Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#063D29] mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Breakfast Specials"
                  className="w-full px-3 py-2 bg-[#FAF8F1] border border-[#E3E0D6] rounded-xl text-[#20251F] focus:outline-none focus:ring-2 focus:ring-[#075C35]"
                />
                {formErrors.name && (
                  <p className="mt-1 text-[11px] text-red-600">{formErrors.name[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#063D29] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief summary of items in this category..."
                  className="w-full px-3 py-2 bg-[#FAF8F1] border border-[#E3E0D6] rounded-xl text-[#20251F] focus:outline-none focus:ring-2 focus:ring-[#075C35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#063D29] mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F1] border border-[#E3E0D6] rounded-xl text-[#20251F]"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4 text-[#075C35] rounded focus:ring-[#075C35]"
                    />
                    <span className="text-xs font-bold text-[#063D29]">Active on Public Menu</span>
                  </label>
                </div>
              </div>

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
                  {isSubmitting ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
