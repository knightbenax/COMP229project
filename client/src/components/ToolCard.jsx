import { useState } from 'react';

export default function ToolCard({ tool, onBorrowClick, onUpdateTool, onDeleteTool }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: tool.name,
    category: tool.category,
    condition: tool.condition || 'Good',
    description: tool.description,
  });

  const isAvailable = tool.isAvailable !== false;

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateTool(tool._id, editData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <form
        onSubmit={handleSave}
        className="flex flex-col justify-between border border-zinc-900 bg-white p-5 rounded-lg space-y-3"
      >
        <input
          type="text"
          required
          value={editData.name}
          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          className="w-full px-2.5 py-1.5 text-sm font-semibold border border-zinc-300 rounded"
        />
        <div className="grid grid-cols-2 gap-2">
          <select
            value={editData.category}
            onChange={(e) => setEditData({ ...editData, category: e.target.value })}
            className="w-full px-2 py-1.5 text-xs border border-zinc-300 rounded bg-white"
          >
            <option value="Power Tools">Power Tools</option>
            <option value="Hand Tools">Hand Tools</option>
            <option value="Lawn & Garden">Lawn & Garden</option>
            <option value="Ladders & Scaffolding">Ladders & Scaffolding</option>
            <option value="Automotive">Automotive</option>
          </select>
          <select
            value={editData.condition}
            onChange={(e) => setEditData({ ...editData, condition: e.target.value })}
            className="w-full px-2 py-1.5 text-xs border border-zinc-300 rounded bg-white"
          >
            <option value="Like New">Like New</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
          </select>
        </div>
        <textarea
          rows="2"
          required
          value={editData.description}
          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
          className="w-full px-2.5 py-1.5 text-xs border border-zinc-300 rounded"
        />
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-2.5 py-1 text-xs text-zinc-500 hover:text-zinc-900 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1 text-xs font-medium bg-zinc-900 text-white rounded cursor-pointer"
          >
            Save
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex flex-col justify-between border border-zinc-200 bg-white p-5 rounded-lg transition hover:border-zinc-400">
      <div>
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            {tool.category} · {tool.condition || 'Good'}
          </span>
          <span
            className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
              isAvailable
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
            }`}
          >
            {isAvailable ? 'Available' : 'Checked Out'}
          </span>
        </div>

        <h3 className="mt-2 text-lg font-semibold text-zinc-900">{tool.name}</h3>
        <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{tool.description}</p>
      </div>

      <div className="mt-6 pt-4 border-t border-zinc-100 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">Owner: {tool.owner?.name || 'Neighbor'}</span>
          <button
            disabled={!isAvailable}
            onClick={() => onBorrowClick(tool)}
            className={`px-3.5 py-1.5 text-sm font-medium rounded-md transition ${
              isAvailable
                ? 'bg-zinc-900 text-white hover:bg-zinc-800 cursor-pointer'
                : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
            }`}
          >
            {isAvailable ? 'Request Tool' : 'Unavailable'}
          </button>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-50 text-xs">
          <button
            onClick={() => setIsEditing(true)}
            className="text-zinc-500 hover:text-zinc-900 cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={() => onDeleteTool(tool._id)}
            className="text-red-500 hover:text-red-700 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}