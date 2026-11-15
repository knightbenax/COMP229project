import { useState } from 'react';
import api from '../api/axiosClient';

export default function AddToolModal({ isOpen, onClose, onToolAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Power Tools',
    condition: 'Good',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await api.post('/tools', formData);
      const created = res.data.tool || res.data;
      onToolAdded(created);
      setFormData({ name: '', category: 'Power Tools', condition: 'Good', description: '' });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add tool. Make sure you are signed in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 px-4">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <h2 className="text-lg font-semibold text-zinc-900">List a Tool</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-900 text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mt-4 p-2.5 text-xs bg-red-50 text-red-700 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Tool Name</label>
            <input
              type="text"
              required
              placeholder="e.g., DeWalt 20V Cordless Drill"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md bg-white focus:outline-none focus:border-zinc-900"
              >
                <option value="Power Tools">Power Tools</option>
                <option value="Hand Tools">Hand Tools</option>
                <option value="Lawn & Garden">Lawn & Garden</option>
                <option value="Ladders & Scaffolding">Ladders & Scaffolding</option>
                <option value="Automotive">Automotive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Condition</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md bg-white focus:outline-none focus:border-zinc-900"
              >
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Description</label>
            <textarea
              rows="3"
              required
              placeholder="Includes two batteries and charger. Pick up on weekends."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-900"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Publish Tool'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}