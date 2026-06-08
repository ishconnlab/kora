import { useState, useEffect, useCallback } from 'react';
import { promotionService } from '../services/promotionService';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { useToast } from '../components/Toast';
import { formatDate, getStatusColor } from '../utils/format';
import { getErrorMessage } from '../utils/validation';
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineLink } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const emptyForm = { title: '', description: '', discountType: 'Percentage', discountValue: '', startDate: '', endDate: '', status: 'Active' };

export default function Promotions() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await promotionService.getAll({ search, page, limit: 10 });
      setPromotions(res.data.promotions);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      addToast(getErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  }, [search, page, addToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setForm(emptyForm);
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setForm({
      title: p.title,
      description: p.description,
      discountType: p.discountType,
      discountValue: p.discountValue,
      startDate: p.startDate ? p.startDate.split('T')[0] : '',
      endDate: p.endDate ? p.endDate.split('T')[0] : '',
      status: p.status,
    });
    setEditing(p._id);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.discountType || !form.discountValue || !form.startDate || !form.endDate) {
      addToast('All required fields must be filled', 'error');
      return;
    }
    setSubmitting(true);
    try {
      if (editing) {
        await promotionService.update(editing, form);
        addToast('Promotion updated successfully');
      } else {
        await promotionService.create(form);
        addToast('Promotion created successfully');
      }
      setModalOpen(false);
      setPage(1);
      fetchData();
    } catch (err) {
      addToast(getErrorMessage(err), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await promotionService.delete(deleteTarget);
      addToast('Promotion deleted successfully');
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      addToast(getErrorMessage(err), 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Promotions</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
          <HiOutlinePlus className="w-4 h-4" /> Add Promotion
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by title or discount type..." />
        </div>

        {loading ? <LoadingSpinner /> : promotions.length === 0 ? <EmptyState message="No promotions found" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Title</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Discount Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Value</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Start Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">End Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Created By</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {promotions.map((p) => (
                  <tr key={p._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{p.title}</td>
                    <td className="py-3 px-4">{p.discountType}</td>
                    <td className="py-3 px-4">{p.discountValue}</td>
                    <td className="py-3 px-4 text-gray-500">{formatDate(p.startDate)}</td>
                    <td className="py-3 px-4 text-gray-500">{formatDate(p.endDate)}</td>
                    <td className="py-3 px-4"><span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(p.status)}`}>{p.status}</span></td>
                    <td className="py-3 px-4 text-gray-500">{p.userId?.username}</td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => navigate(`/promotions/${p._id}/assign`)} className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg" title="Assign Vehicles"><HiOutlineLink className="w-4 h-4" /></button>
                      <button onClick={() => openEdit(p)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg ml-1"><HiOutlinePencil className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteTarget(p._id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg ml-1"><HiOutlineTrash className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-4 pb-4">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Promotion' : 'Add Promotion'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Discount Type *</label>
              <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none">
                <option value="Percentage">Percentage</option>
                <option value="FLAT_RATE">Flat Rate</option>
                <option value="FREE">Free</option>
                <option value="CASHBACK">Cashback</option>
                <option value="BUY_ONE_GET_ONE">Buy One Get One</option>
                <option value="Bundle">Bundle</option>
                <option value="Amount">Amount</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Discount Value *</label>
              <input type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Date *</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End Date *</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-50">{submitting ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Promotion" message="Are you sure you want to delete this promotion?" loading={deleting} />
    </div>
  );
}
