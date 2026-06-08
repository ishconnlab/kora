import { useState, useEffect, useCallback } from 'react';
import { reportService } from '../services/reportService';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { formatDate } from '../utils/format';
import { getErrorMessage } from '../utils/validation';
import { useToast } from '../components/Toast';
import { HiOutlineDocumentText } from 'react-icons/hi';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { addToast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reportService.getReport({ search });
      setReports(res.data.reports);
    } catch (err) {
      addToast(getErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  }, [search, addToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleExportPDF = () => {
    const win = window.open('', '_blank');
    const styles = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules || []).map((r) => r.cssText).join('');
        } catch { return ''; }
      }).join('');

    win.document.write(`
      <html><head><title>PMS Report</title><style>${styles}</style><style>
        body { padding: 40px; font-family: system-ui, sans-serif; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #e5e7eb; }
        th { background: #f8fafc; font-weight: 600; color: #64748b; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; }
        .header { text-align: center; margin-bottom: 32px; }
        .header h1 { font-size: 24px; color: #0f172a; margin: 0; }
        .header p { color: #64748b; margin: 4px 0 0 0; }
        .footer { margin-top: 32px; text-align: center; color: #94a3b8; font-size: 12px; }
        @media print { body { padding: 20px; } }
      </style></head><body>
        <div class="header"><h1>SwiftWheels Enterprises</h1><p>Promotion & Marketing System - Performance Report</p></div>
        <table>
          <thead><tr><th>Customer</th><th>Brand</th><th>Model</th><th>Promotion</th><th>Discount Value</th><th>Performance</th></tr></thead>
          <tbody>${reports.map((r) => `<tr><td>${r.customerName}</td><td>${r.vehicleBrand}</td><td>${r.vehicleModel}</td><td>${r.promotionTitle}</td><td>${r.discountValue}</td><td>${r.performance}%</td></tr>`).join('')}</tbody>
        </table>
        <div class="footer">Generated on ${new Date().toLocaleDateString()} | SwiftWheels PMS</div>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <div className="flex items-center gap-2">
          <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800">
            <HiOutlineDocumentText className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <SearchBar value={search} onChange={setSearch} placeholder="Search reports..." />
        </div>

        {loading ? <LoadingSpinner /> : reports.length === 0 ? <EmptyState message="No report data found" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Customer Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Vehicle Brand</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Vehicle Model</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Promotion Title</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Discount Value</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Performance</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{r.customerName}</td>
                    <td className="py-3 px-4">{r.vehicleBrand}</td>
                    <td className="py-3 px-4">{r.vehicleModel}</td>
                    <td className="py-3 px-4">{r.promotionTitle}</td>
                    <td className="py-3 px-4">{r.discountValue}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-slate-900 h-2 rounded-full" style={{ width: `${r.performance}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">{r.performance}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
