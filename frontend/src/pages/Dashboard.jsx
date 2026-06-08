import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate, getStatusColor } from '../utils/format';
import { HiOutlineTruck, HiOutlineUsers, HiOutlineSpeakerphone, HiOutlineBadgeCheck, HiOutlineEye } from 'react-icons/hi';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    dashboardService.getDashboard()
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={HiOutlineTruck} label="Total Vehicles" value={data?.stats?.totalVehicles || 0} color="slate" />
        <StatCard icon={HiOutlineUsers} label="Total Customers" value={data?.stats?.totalCustomers || 0} color="blue" />
        <StatCard icon={HiOutlineSpeakerphone} label="Total Promotions" value={data?.stats?.totalPromotions || 0} color="green" />
        <StatCard icon={HiOutlineBadgeCheck} label="Active Promotions" value={data?.stats?.activePromotions || 0} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Promotions</h2>
            <button onClick={() => navigate('/promotions')} className="text-sm text-slate-700 hover:text-slate-900 flex items-center gap-1">
              <HiOutlineEye className="w-4 h-4" /> View All
            </button>
          </div>
          <div className="space-y-3">
            {data?.recentPromotions?.length > 0 ? (
              data.recentPromotions.slice(0, 4).map((p) => (
                <div key={p._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{p.title}</p>
                    <p className="text-xs text-gray-500">{p.discountType} - {p.discountValue}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(p.status)}`}>{p.status}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent promotions</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Recent Vehicles</h2>
          <button onClick={() => navigate('/vehicles')} className="text-sm text-slate-700 hover:text-slate-900 flex items-center gap-1">
            <HiOutlineEye className="w-4 h-4" /> View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Plate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Brand</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Model</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentVehicles?.length > 0 ? (
                data.recentVehicles.map((v) => (
                  <tr key={v._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-slate-900">{v.plateNumber}</td>
                    <td className="py-3 px-4">{v.brand}</td>
                    <td className="py-3 px-4">{v.model}</td>
                    <td className="py-3 px-4"><span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(v.status)}`}>{v.status}</span></td>
                    <td className="py-3 px-4 text-gray-500">{formatDate(v.createdAt)}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="py-8 text-center text-gray-500">No vehicles found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
