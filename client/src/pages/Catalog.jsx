import { useState, useEffect } from 'react';
import api from '../api/axiosClient';
import ToolCard from '../components/ToolCard';

export default function Catalog({ latestTool }) {
  const [tools, setTools] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');

  // READ tools from MongoDB
  useEffect(() => {
    const fetchTools = async () => {
      try {
        const res = await api.get('/tools');
        const list = Array.isArray(res.data) ? res.data : res.data.tools || [];
        setTools(list);
      } catch (err) {
        console.error('Failed to fetch tools:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTools();
  }, []);

  // Append newly created tool
  useEffect(() => {
    if (latestTool) {
      setTools((prev) => [latestTool, ...prev]);
      setFeedback(`Added "${latestTool.name}" to library.`);
      setTimeout(() => setFeedback(''), 3000);
    }
  }, [latestTool]);

  // BORROW request
  const handleBorrowRequest = async (tool) => {
    try {
      await api.post('/borrow-requests', { toolId: tool._id });
      setFeedback(`Borrow request sent for ${tool.name}!`);
    } catch (err) {
      setFeedback(err.response?.data?.message || 'Sign in first to request a tool.');
    }
    setTimeout(() => setFeedback(''), 3000);
  };

  // UPDATE tool
  const handleUpdateTool = async (id, updatedFields) => {
    try {
      const res = await api.put(`/tools/${id}`, updatedFields);
      const updated = res.data.tool || res.data;
      setTools((prev) => prev.map((t) => (t._id === id ? updated : t)));
      setFeedback('Tool updated.');
    } catch (err) {
      setFeedback(err.response?.data?.message || 'Only the tool owner can edit this item.');
    }
    setTimeout(() => setFeedback(''), 3000);
  };

  // DELETE tool
  const handleDeleteTool = async (id) => {
    try {
      await api.delete(`/tools/${id}`);
      setTools((prev) => prev.filter((t) => t._id !== id));
      setFeedback('Tool deleted.');
    } catch (err) {
      setFeedback(err.response?.data?.message || 'Only the tool owner can delete this item.');
    }
    setTimeout(() => setFeedback(''), 3000);
  };

  const filteredTools = tools.filter(
    (t) =>
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Tool Library</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Borrow equipment from neighbors in your community.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search drills, ladders, saws..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 px-3.5 py-2 text-sm border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-900"
        />
      </div>

      {feedback && (
        <div className="mt-6 p-3 text-sm bg-zinc-900 text-white rounded-md">{feedback}</div>
      )}

      {loading ? (
        <p className="mt-12 text-sm text-zinc-400">Loading inventory...</p>
      ) : filteredTools.length === 0 ? (
        <p className="mt-12 text-sm text-zinc-500">
          No tools in the library yet. Sign in and click "+ List a Tool" to add the first one!
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool._id}
              tool={tool}
              onBorrowClick={handleBorrowRequest}
              onUpdateTool={handleUpdateTool}
              onDeleteTool={handleDeleteTool}
            />
          ))}
        </div>
      )}
    </div>
  );
}