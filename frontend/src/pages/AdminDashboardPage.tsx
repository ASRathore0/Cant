import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Utensils,
  CheckCircle,
  XCircle,
  FolderTree,
  QrCode,
  TrendingUp,
  Plus,
  RefreshCw,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { Toast, ToastMessage } from '../components/Toast';
import { adminApi } from '../services/api';
import { DashboardMetrics, MenuItem } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentItems, setRecentItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

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

  const fetchDashboard = async (showToast = false) => {
    setIsRefreshing(true);
    try {
      const data = await adminApi.getDashboard();
      setMetrics(data.metrics);
      setRecentItems(data.recent_items || []);
      if (showToast) addToast('success', 'Dashboard metrics updated');
    } catch (err) {
      console.error(err);
      addToast('error', 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleToggleAvailability = async (id: number) => {
    try {
      const res = await adminApi.toggleAvailability(id);
      addToast('success', res.message);
      // update item locally
      setRecentItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, is_available: res.data.is_available } : item))
      );
      // reload metrics
      fetchDashboard(false);
    } catch {
      addToast('error', 'Failed to update item availability');
    }
  };

  return (
    <AdminLayout
      title="Restaurant Operations Overview"
      subtitle="Real-time menu status, availability, and recorded customer QR scans"
    >
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Quick Actions Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Link
            to="/admin/menu?action=new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#075C35] hover:bg-[#063D29] text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#E8C928]" />
            <span>Add Menu Item</span>
          </Link>

          <Link
            to="/admin/settings"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-stone-50 border border-[#E3E0D6] text-xs sm:text-sm font-semibold text-[#063D29] rounded-xl shadow-sm transition-all"
          >
            <QrCode className="w-4 h-4 text-[#075C35]" />
            <span>QR Setup</span>
          </Link>
        </div>

        <button
          onClick={() => fetchDashboard(true)}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-stone-50 border border-[#E3E0D6] text-xs sm:text-sm font-semibold text-[#063D29] rounded-xl shadow-sm transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#075C35]' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {/* Total Menu Items */}
        <div className="bg-white p-5 rounded-2xl border border-[#E3E0D6] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-[#FAF8F1] border border-[#E3E0D6] rounded-xl text-[#075C35]">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#72776F] font-semibold uppercase tracking-wider">Total Items</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-serif text-[#063D29] mt-0.5">
              {metrics ? metrics.total_items : '...'}
            </h3>
          </div>
        </div>

        {/* Available Items */}
        <div className="bg-white p-5 rounded-2xl border border-[#E3E0D6] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#72776F] font-semibold uppercase tracking-wider">Ready to Serve</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-serif text-green-800 mt-0.5">
              {metrics ? metrics.available_items : '...'}
            </h3>
          </div>
        </div>

        {/* Unavailable Items */}
        <div className="bg-white p-5 rounded-2xl border border-[#E3E0D6] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#72776F] font-semibold uppercase tracking-wider">Sold Out</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-serif text-red-700 mt-0.5">
              {metrics ? metrics.unavailable_items : '...'}
            </h3>
          </div>
        </div>

        {/* Real QR Scans */}
        <div className="bg-white p-5 rounded-2xl border border-[#E3E0D6] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-[#FAF8F1] border border-[#E8C928] rounded-xl text-[#063D29]">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#72776F] font-semibold uppercase tracking-wider">Verified Scans</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-serif text-[#063D29] mt-0.5">
              {metrics ? metrics.total_scans : '...'}
            </h3>
          </div>
        </div>
      </div>

      {/* Recently Updated Items Table */}
      <div className="bg-white rounded-2xl border border-[#E3E0D6] shadow-sm overflow-hidden mb-8">
        <div className="p-4 sm:p-5 border-b border-[#E3E0D6] flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#063D29]">
              Recently Updated Menu Items
            </h3>
            <p className="text-xs text-[#72776F]">
              Quickly toggle availability or review recent changes
            </p>
          </div>

          <Link
            to="/admin/menu"
            className="text-xs font-bold text-[#075C35] hover:text-[#063D29] flex items-center gap-1"
          >
            <span>Manage All Items</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FAF8F1] text-[#72776F] border-b border-[#E3E0D6] font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Availability</th>
                <th className="py-3 px-4 text-right">Quick Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E0D6]">
              {recentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#72776F]">
                    No items found.
                  </td>
                </tr>
              ) : (
                recentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-serif text-stone-400 font-bold">
                              {item.name[0]}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[#20251F]">{item.name}</p>
                          {item.serving_info && (
                            <p className="text-[11px] text-[#72776F]">{item.serving_info}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#72776F]">
                      <span className="bg-[#FAF8F1] px-2 py-1 rounded-md border border-[#E3E0D6] font-medium text-xs">
                        {item.category_name || 'General'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-serif font-bold text-[#075C35]">
                      {item.formatted_price}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          item.is_available
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${item.is_available ? 'bg-green-600' : 'bg-red-600'}`} />
                        {item.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleAvailability(item.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 ${
                          item.is_available
                            ? 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                            : 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200'
                        }`}
                      >
                        Mark as {item.is_available ? 'Sold Out' : 'Available'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
