import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any>(null);

  const [form, setForm] = useState({
    assetName: '',
    assetTag: '',
    category: 'Hardware',
    status: 'Available',
    quantity: 1,
    purchaseDate: ''
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

  const resetForm = () => {
    setForm({
      assetName: '',
      assetTag: '',
      category: 'Hardware',
      status: 'Available',
      quantity: 1,
      purchaseDate: ''
    });
    setEditingAsset(null);
    setShowModal(false);
  };

 const saveAsset = async (e: any) => {
   e.preventDefault();

   try {
     const categoryMap: any = {
       Hardware: 1,
       Furniture: 2,
       Software: 3,
       Networking: 4
     };

     const payload = {
       assetName: form.assetName,
       assetTag: form.assetTag,
       assetType: form.category,
       quantity: Number(form.quantity),
       status: form.status || 'Available',
       purchaseDate: form.purchaseDate || null,

       category: {
         categoryId: categoryMap[form.category]
       }
     };

     if (editingAsset) {
       await api.put(`/assets/${editingAsset.assetId}`, payload);
       alert('Asset updated successfully');
     } else {
       await api.post('/assets', payload);
       alert('Asset added successfully');
     }

     await fetchAssets();
     resetForm();
   } catch (error: any) {
     console.error();
     alert(error.response?.data || 'Failed to save asset');
   }
 };

  const deleteAsset = async (id: number) => {
    if (!window.confirm('Delete this asset?')) return;

    try {
      await api.delete(`/assets/${id}`);
      alert('Asset deleted successfully');
      await fetchAssets();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data || 'Failed to delete asset');
    }
  };

  if (loading) {
    return <div className="p-12 text-center">Loading assets...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Assets Management</h1>
          <p className="text-zinc-500">Manage company assets and stock</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl"
        >
          <Plus size={20} />
          Add Asset
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-50 border-b">
              <th className="px-6 py-4 text-left">Asset Name</th>
              <th className="px-6 py-4 text-left">Tag</th>
              <th className="px-6 py-4 text-left">Category</th>
              <th className="px-6 py-4 text-left">Qty</th>
              <th className="px-6 py-4 text-left">Purchase Date</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {assets.map((asset: any) => (
              <tr key={asset.assetId} className="hover:bg-zinc-50">
                <td className="px-6 py-4 font-medium">{asset.assetName}</td>

                <td className="px-6 py-4">{asset.assetTag}</td>

                <td className="px-6 py-4">
                  {asset.category?.categoryName ||
                    asset.assetCategory?.categoryName ||
                    asset.categoryName ||
                    'Hardware'}
                </td>

                <td className="px-6 py-4">
                  {asset.quantity ||
                    asset.qty ||
                    asset.totalQuantity ||
                    1}
                </td>

                <td className="px-6 py-4">
                  {asset.purchaseDate || '—'}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      asset.status === 'Available'
                        ? 'bg-green-100 text-green-700'
                        : asset.status === 'Assigned'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {asset.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setEditingAsset(asset);

                        setForm({
                          assetName: asset.assetName || '',
                          assetTag: asset.assetTag || '',
                          category: asset.category?.categoryName || 'Hardware',
                          status: asset.status || 'Available',
                          quantity: asset.quantity || 1,
                          purchaseDate: asset.purchaseDate || ''
                        });

                        setShowModal(true);
                      }}
                      className="text-blue-600"
                    >
                      <Edit2 size={18} />
                    </button>

                    <button
                      onClick={() => deleteAsset(asset.assetId)}
                      className="text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-6">
              {editingAsset ? 'Edit Asset' : 'Add New Asset'}
            </h2>

            <form onSubmit={saveAsset} className="space-y-5">
              <input
                type="text"
                placeholder="Asset Name"
                value={form.assetName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    assetName: e.target.value
                  })
                }
                className="w-full px-5 py-4 border rounded-2xl"
                required
              />

              <input
                type="text"
                placeholder="Asset Tag"
                value={form.assetTag}
                onChange={(e) =>
                  setForm({
                    ...form,
                    assetTag: e.target.value
                  })
                }
                className="w-full px-5 py-4 border rounded-2xl"
                required
              />

              <select
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value
                  })
                }
                className="w-full px-5 py-4 border rounded-2xl"
              >
                <option>Hardware</option>
                <option>Software</option>
                <option>Furniture</option>
                <option>Networking</option>
              </select>

              <input
                type="number"
                min="1"
                value={form.quantity}
                onChange={(e) =>
                  setForm({
                    ...form,
                    quantity: parseInt(e.target.value)
                  })
                }
                className="w-full px-5 py-4 border rounded-2xl"
                required
              />

              <input
                type="date"
                value={form.purchaseDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    purchaseDate: e.target.value
                  })
                }
                className="w-full px-5 py-4 border rounded-2xl"
              />



              {/* Buttons */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="py-4 rounded-2xl border font-semibold hover:bg-zinc-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="py-4 rounded-2xl bg-blue-600 text-white font-semibold"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}