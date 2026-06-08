import { useState, useEffect, useCallback } from 'react';
import { vehicleService } from '../services/vehicleService';
import { customerService } from '../services/customerService';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { useToast } from '../components/Toast';
import { formatCurrency, formatDate, getStatusColor } from '../utils/format';
import { getErrorMessage } from '../utils/validation';
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';

const emptyForm = { plateNumber: '', brand: '', model: '', year: '', vehicleType: '', purchasePrice: '', status: 'Available', customerId: '' };

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
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
  const [customers, setCustomers] = useState([]);
  const { addToast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await vehicleService.getAll({ search, page, limit: 10 });
      setVehicles(res.data.vehicles);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      addToast(getErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  }, [search, page, addToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    customerService.getAllCustomers().then((res) => setCustomers(res.data.customers)).catch(() => {});
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (v) => {
    setForm({ plateNumber: v.plateNumber, brand: v.brand, model: v.model, year: v.year, vehicleType: v.vehicleType, purchasePrice: v.purchasePrice, status: v.status, customerId: v.customerId?._id || '' });
    setEditing(v._id);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.plateNumber || !form.brand || !form.model || !form.year || !form.vehicleType || !form.purchasePrice) {
      addToast('All required fields must be filled', 'error');
      return;
    }
    setSubmitting(true);
    try {
      if (editing) {
        await vehicleService.update(editing, form);
        addToast('Vehicle updated successfully');
      } else {
        await vehicleService.create(form);
        addToast('Vehicle created successfully');
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
      await vehicleService.delete(deleteTarget);
      addToast('Vehicle deleted successfully');
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
        <h1 className="text-2xl font-bold text-slate-900">Vehicles</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
          <HiOutlinePlus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by plate, brand, or model..." />
        </div>

        {loading ? <LoadingSpinner /> : vehicles.length === 0 ? <EmptyState message="No vehicles found" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Plate Number</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Brand</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Model</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Year</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Price</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr key={v._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{v.plateNumber}</td>
                    <td className="py-3 px-4">{v.brand}</td>
                    <td className="py-3 px-4">{v.model}</td>
                    <td className="py-3 px-4">{v.year}</td>
                    <td className="py-3 px-4">{formatCurrency(v.purchasePrice)}</td>
                    <td className="py-3 px-4">{v.customerId ? `${v.customerId.firstName} ${v.customerId.lastName}` : <span className="text-gray-400">N/A</span>}</td>
                    <td className="py-3 px-4"><span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(v.status)}`}>{v.status}</span></td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => openEdit(v)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><HiOutlinePencil className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteTarget(v._id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg ml-1"><HiOutlineTrash className="w-4 h-4" /></button>
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Vehicle' : 'Add Vehicle'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Plate Number *</label>
              <input type="text" value={form.plateNumber} onChange={(e) => setForm({ ...form, plateNumber: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Brand *</label>
              <input type="text" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Model *</label>
              <input type="text" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Year *</label>
              <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Type *</label>
              <input type="text" value={form.vehicleType} onChange={(e) => setForm({ ...form, vehicleType: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Price *</label>
              <input type="number" value={form.purchasePrice} onChange={(e) => setForm({ ...form, purchasePrice: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none">
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
                <option value="Rented">Rented</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Customer</label>
              <select value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none">
                <option value="">No customer</option>
                {customers.map((c) => <option key={c._id} value={c._id}>{c.firstName} {c.lastName}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-50">{submitting ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Vehicle" message="Are you sure you want to delete this vehicle? This action cannot be undone." loading={deleting} />
    </div>
  );
}
