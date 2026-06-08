import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { promotionService } from '../services/promotionService';
import { vehicleService } from '../services/vehicleService';
import { promotionVehicleService } from '../services/promotionVehicleService';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { useToast } from '../components/Toast';
import { getErrorMessage } from '../utils/validation';
import { HiOutlineArrowLeft, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';

export default function Assignment() {
  const { promotionId } = useParams();
  const navigate = useNavigate();
  const [promotion, setPromotion] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignModal, setAssignModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [editingPerf, setEditingPerf] = useState(null);
  const [perfValue, setPerfValue] = useState(0);
  const [savingPerf, setSavingPerf] = useState(false);
  const { addToast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [promoRes, assignRes, vehRes] = await Promise.all([
        promotionService.getById(promotionId),
        promotionVehicleService.getByPromotion(promotionId),
        vehicleService.getAllVehicles(),
      ]);
      setPromotion(promoRes.data.promotion);
      setAssignments(assignRes.data.promotionVehicles);
      setVehicles(vehRes.data.vehicles);
    } catch (err) {
      addToast(getErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  }, [promotionId, addToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAssign = async () => {
    if (!selectedVehicle) {
      addToast('Please select a vehicle', 'error');
      return;
    }
    setAssigning(true);
    try {
      await promotionVehicleService.assign({ promotionId, vehicleId: selectedVehicle });
      addToast('Vehicle assigned successfully');
      setAssignModal(false);
      setSelectedVehicle('');
      fetchData();
    } catch (err) {
      addToast(getErrorMessage(err), 'error');
    } finally {
      setAssigning(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await promotionVehicleService.remove(id);
      addToast('Vehicle removed from promotion');
      fetchData();
    } catch (err) {
      addToast(getErrorMessage(err), 'error');
    }
  };

  const handlePerformanceSave = async (id) => {
    setSavingPerf(true);
    try {
      await promotionVehicleService.updatePerformance(id, { performance: perfValue });
      addToast('Performance updated');
      setEditingPerf(null);
      fetchData();
    } catch (err) {
      addToast(getErrorMessage(err), 'error');
    } finally {
      setSavingPerf(false);
    }
  };

  const availableVehicles = vehicles.filter(
    (v) => !assignments.some((a) => a.vehicleId?._id === v._id)
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/promotions')} className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
          <HiOutlineArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{promotion?.title}</h1>
          <p className="text-sm text-gray-500">Manage vehicle assignments</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700">Assigned Vehicles ({assignments.length})</p>
          <button onClick={() => setAssignModal(true)} className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">
            <HiOutlinePlus className="w-4 h-4" /> Assign Vehicle
          </button>
        </div>

        {assignments.length === 0 ? <EmptyState message="No vehicles assigned yet" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Plate Number</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Brand</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Model</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Performance</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((a) => (
                  <tr key={a._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{a.vehicleId?.plateNumber}</td>
                    <td className="py-3 px-4">{a.vehicleId?.brand}</td>
                    <td className="py-3 px-4">{a.vehicleId?.model}</td>
                    <td className="py-3 px-4">
                      {editingPerf === a._id ? (
                        <div className="flex items-center gap-2">
                          <input type="number" min="0" max="100" value={perfValue} onChange={(e) => setPerfValue(Number(e.target.value))} className="w-20 px-2 py-1 border border-gray-300 rounded text-sm" />
                          <button onClick={() => handlePerformanceSave(a._id)} disabled={savingPerf} className="text-xs px-2 py-1 bg-slate-900 text-white rounded hover:bg-slate-800">{savingPerf ? '...' : 'Save'}</button>
                          <button onClick={() => setEditingPerf(null)} className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => { setEditingPerf(a._id); setPerfValue(a.performance); }} className="hover:text-blue-600">
                          {a.performance}%
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => handleRemove(a._id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><HiOutlineTrash className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={assignModal} onClose={() => { setAssignModal(false); setSelectedVehicle(''); }} title="Assign Vehicle to Promotion">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Vehicle</label>
            <select value={selectedVehicle} onChange={(e) => setSelectedVehicle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none">
              <option value="">-- Select a vehicle --</option>
              {availableVehicles.map((v) => (
                <option key={v._id} value={v._id}>{v.plateNumber} - {v.brand} {v.model}</option>
              ))}
            </select>
            {availableVehicles.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">All available vehicles are already assigned.</p>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => { setAssignModal(false); setSelectedVehicle(''); }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={handleAssign} disabled={assigning || !selectedVehicle} className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-50">
              {assigning ? 'Assigning...' : 'Assign'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
