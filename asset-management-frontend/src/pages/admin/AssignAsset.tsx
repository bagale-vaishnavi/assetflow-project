import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Download } from 'lucide-react';
import { exportToExcel } from '../../utils/export';

export default function AssignAsset() {
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [selectedAsset, setSelectedAsset] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    console.log("🚀 Fetching Assign Asset data...");

    try {
      const [assetsRes, employeesRes] = await Promise.all([
        api.get('/assets'),
        api.get('/admin/users')
      ]);

      setAssets(assetsRes.data);
      setEmployees(employeesRes.data || []);
    } catch (error) {
      console.error("Error fetching assets/users", error);
    }

    // Assignment history (ignore error)
    try {
      const assignRes = await api.get('/asset-assignments');
      setAssignments(assignRes.data || []);
      console.log("✅ Assignments loaded:", assignRes.data.length);
    } catch (e) {
      console.log("⚠️ Assignment history not available yet (403 or missing)");
      setAssignments([]);
    }

    setLoading(false);
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset || !selectedEmployee) {
      alert("Please select both Asset and Employee");
      return;
    }

    try {
      await api.post(`/assets/assign?assetId=${selectedAsset}&empId=${selectedEmployee}`);
      alert("✅ Asset assigned successfully!");
      setSelectedAsset('');
      setSelectedEmployee('');
      fetchData();   // Force refresh
    } catch (error: any) {
      alert("❌ " + (error.response?.data || "Failed to assign asset"));
    }
  };

  if (loading) return <div className="p-12 text-center text-xl">Loading...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Assign Asset to Employee</h1>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-8 max-w-2xl">
        <form onSubmit={handleAssign} className="space-y-8">
          <div>
            <label className="block text-sm font-medium mb-2">Select Asset</label>
            <select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              className="w-full px-5 py-4 border dark:border-zinc-700 rounded-3xl focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Choose Asset --</option>
              {assets.map((asset: any) => (
                <option key={asset.assetId} value={asset.assetId}>
                  {asset.assetName} ({asset.assetTag}) - {asset.status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Select Employee</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full px-5 py-4 border dark:border-zinc-700 rounded-3xl focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Choose Employee --</option>
              {employees.map((emp: any) => (
                <option key={emp.userId} value={emp.userId}>
                  {emp.name} ({emp.email})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-3xl font-semibold text-lg transition"
          >
            Assign Asset
          </button>
        </form>
      </div>

      {/* Assignment History */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800">
        <div className="px-8 py-6 flex justify-between items-center border-b">
          <h2 className="font-semibold text-lg">Assignment History</h2>
          <button
            onClick={() => exportToExcel(assignments, "Asset_Assignments")}
            className="flex items-center gap-2 px-5 py-2 border border-zinc-300 dark:border-zinc-700 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Download size={18} /> Export to Excel
          </button>
        </div>

        {assignments.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            No assignments found yet.<br />
            Assign an asset above to see history here.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800 border-b">
                <th className="px-8 py-5 text-left">Asset</th>
                <th className="px-8 py-5 text-left">Assigned To</th>
                <th className="px-8 py-5 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-zinc-700">
              {assignments.map((assign: any) => (
                <tr key={assign.assignId} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="px-8 py-5 font-medium">{assign.asset?.assetName}</td>
                  <td className="px-8 py-5">{assign.user?.name || assign.employee?.name}</td>
                  <td className="px-8 py-5 text-sm text-zinc-500">
                    {new Date(assign.assignDate).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}