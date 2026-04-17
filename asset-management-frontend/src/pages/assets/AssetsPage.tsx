import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Plus, Edit2, Trash2, Download } from 'lucide-react';
import { exportToExcel } from '../../utils/export';

export default function AssetsPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add modal
  const [showAddModal, setShowAddModal] = useState(false);

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  const [newAsset, setNewAsset] = useState({
    assetName: '',
    assetTag: '',
    status: 'Available',
  });

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const res = await api.get('/assets');
      setAssets(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (assetId) => {
    if (!window.confirm("Are you sure you want to delete this asset? This action cannot be undone.")) return;

    try {
      await api.delete(`/assets/${assetId}`);
      alert("✅ Asset deleted successfully!");
      fetchAssets();
    } catch (error) {
      alert("❌ Failed to delete asset");
    }
  };

  const handleEditClick = (asset) => {
    setEditingAsset({ ...asset });
    setShowEditModal(true);
  };

  const handleUpdateAsset = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/assets/${editingAsset.assetId}`, editingAsset);
      alert("✅ Asset updated successfully!");
      setShowEditModal(false);
      fetchAssets();
    } catch (error) {
      alert("❌ Failed to update asset");
    }
  };

  const handleAddAsset = async (e) => {
    e.preventDefault();
    try {
      await api.post('/assets', newAsset);
      alert("✅ Asset added successfully!");
      setShowAddModal(false);
      setNewAsset({ assetName: '', assetTag: '', status: 'Available' });
      fetchAssets();
    } catch (error) {
      alert("❌ Failed to add asset");
    }
  };

  if (loading) return <div className="p-12 text-center text-xl">Loading assets...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-medium"
        >
          <Plus size={20} />
          Add Asset
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-800 border-b">
              <th className="px-8 py-5 text-left">Asset Name</th>
              <th className="px-8 py-5 text-left">Asset Tag</th>
              <th className="px-8 py-5 text-left">Status</th>
              <th className="px-8 py-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-zinc-700">
            {assets.map((asset: any) => (
              <tr key={asset.assetId} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                <td className="px-8 py-5 font-medium">{asset.assetName}</td>
                <td className="px-8 py-5">{asset.assetTag}</td>
                <td className="px-8 py-5">
                  <span className={`px-4 py-1 text-xs font-medium rounded-2xl ${
                    asset.status === 'Available'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {asset.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-center flex justify-center gap-4">
                  <button
                    onClick={() => handleEditClick(asset)}
                    className="text-blue-600 hover:text-blue-700 transition"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(asset.assetId)}
                    className="text-red-600 hover:text-red-700 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-md p-8">
            <h2 className="text-2xl font-semibold mb-6">Add New Asset</h2>
            <form onSubmit={handleAddAsset} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Asset Name</label>
                <input type="text" value={newAsset.assetName} onChange={(e) => setNewAsset({...newAsset, assetName: e.target.value})} className="w-full px-5 py-4 border dark:border-zinc-700 rounded-3xl focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Asset Tag</label>
                <input type="text" value={newAsset.assetTag} onChange={(e) => setNewAsset({...newAsset, assetTag: e.target.value})} className="w-full px-5 py-4 border dark:border-zinc-700 rounded-3xl focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 border dark:border-zinc-700 rounded-3xl font-medium">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-3xl font-semibold">Add Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Asset Modal */}
      {showEditModal && editingAsset && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-md p-8">
            <h2 className="text-2xl font-semibold mb-6">Edit Asset</h2>
            <form onSubmit={handleUpdateAsset} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Asset Name</label>
                <input type="text" value={editingAsset.assetName} onChange={(e) => setEditingAsset({...editingAsset, assetName: e.target.value})} className="w-full px-5 py-4 border dark:border-zinc-700 rounded-3xl focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Asset Tag</label>
                <input type="text" value={editingAsset.assetTag} onChange={(e) => setEditingAsset({...editingAsset, assetTag: e.target.value})} className="w-full px-5 py-4 border dark:border-zinc-700 rounded-3xl focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select value={editingAsset.status} onChange={(e) => setEditingAsset({...editingAsset, status: e.target.value})} className="w-full px-5 py-4 border dark:border-zinc-700 rounded-3xl focus:ring-2 focus:ring-blue-500">
                  <option value="Available">Available</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-4 border dark:border-zinc-700 rounded-3xl font-medium">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-3xl font-semibold">Update Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}