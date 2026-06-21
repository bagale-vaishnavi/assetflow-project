import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Download } from 'lucide-react';
import { exportToExcel } from '../../utils/export';

export default function AssignAsset() {
  const [assets, setAssets] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);

  const [selectedAsset, setSelectedAsset] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    try {
      const [assetsRes, employeesRes] = await Promise.all([
        api.get('/assets'),
        api.get('/admin/users')
      ]);

      setAssets(assetsRes.data || []);
      setEmployees(employeesRes.data || []);
    } catch (error) {
      console.error(error);
    }

    try {
      const assignRes = await api.get('/asset-assignments');
      setAssignments(assignRes.data || []);
    } catch (error) {
      setAssignments([]);
    }

    setLoading(false);
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAsset || !selectedEmployee) {
      alert('Please select both Asset and Employee');
      return;
    }

    try {
      await api.post(
        `/assets/assign?assetId=${selectedAsset}&empId=${selectedEmployee}`
      );

      alert('Asset assigned successfully!');
      setSelectedAsset('');
      setSelectedEmployee('');
      fetchData();
    } catch (error: any) {
      alert(error.response?.data || 'Failed to assign asset');
    }
  };

  // Only available assets
  const availableAssets = assets.filter(
    (asset: any) => asset.status === 'Available'
  );

  if (loading) {
    return <div className="p-12 text-center text-xl">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">
        Assign Asset to Employee
      </h1>

      {/* Available Assets Summary */}
      <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 p-8">
        <h2 className="text-xl font-semibold mb-6">
          Available Assets Stock
        </h2>

        {availableAssets.length === 0 ? (
          <p className="text-zinc-500">No available assets.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {availableAssets.map((asset: any) => (
              <div
                key={asset.assetId}
                className="border rounded-2xl p-5 bg-zinc-50"
              >
                <p className="font-semibold">{asset.assetName}</p>
                <p className="text-sm text-zinc-500 mt-1">
                  Tag: {asset.assetTag}
                </p>
                <p className="text-sm mt-2">
                  Qty:{' '}
                  <span className="font-semibold">
                    {asset.quantity || 1}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assign Form */}
      <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 p-8 max-w-2xl">
        <form onSubmit={handleAssign} className="space-y-8">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Asset
            </label>

            <select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              className="w-full px-5 py-4 border rounded-3xl focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Choose Asset --</option>

              {availableAssets.map((asset: any) => (
                <option
                  key={asset.assetId}
                  value={asset.assetId}
                >
                  {asset.assetName} ({asset.assetTag}) - Qty:
                  {asset.quantity || 1}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Select Employee
            </label>

            <select
              value={selectedEmployee}
              onChange={(e) =>
                setSelectedEmployee(e.target.value)
              }
              className="w-full px-5 py-4 border rounded-3xl focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Choose Employee --</option>

              {employees.map((emp: any) => (
                <option
                  key={emp.userId}
                  value={emp.userId}
                >
                  {emp.name} ({emp.email})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-3xl font-semibold text-lg"
          >
            Assign Asset
          </button>
        </form>
      </div>

      {/* Assignment History */}
      <div className="bg-white rounded-3xl shadow-sm border border-zinc-100">
        <div className="px-8 py-6 flex justify-between items-center border-b">
          <h2 className="font-semibold text-lg">
            Assignment History
          </h2>

          <button
            onClick={() =>
              exportToExcel(
                assignments,
                'Asset_Assignments'
              )
            }
            className="flex items-center gap-2 px-5 py-2 border border-zinc-300 rounded-2xl hover:bg-zinc-100"
          >
            <Download size={18} />
            Export to Excel
          </button>
        </div>

        {assignments.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            No assignments found yet.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-50 border-b">
                <th className="px-8 py-5 text-left">Asset</th>
                <th className="px-8 py-5 text-left">
                  Assigned To
                </th>
                <th className="px-8 py-5 text-left">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {assignments.map((assign: any) => (
                <tr
                  key={assign.assignId}
                  className="hover:bg-zinc-50"
                >
                  <td className="px-8 py-5 font-medium">
                    {assign.asset?.assetName}
                  </td>

                  <td className="px-8 py-5">
                    {assign.user?.name ||
                      assign.employee?.name}
                  </td>

                  <td className="px-8 py-5 text-sm text-zinc-500">
                    {new Date(
                      assign.assignDate
                    ).toLocaleString('en-IN')}
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