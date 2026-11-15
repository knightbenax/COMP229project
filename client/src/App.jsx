import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AddToolModal from './components/AddToolModal';
import Catalog from './pages/Catalog';
import Login from './pages/Login';

export default function App() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [latestTool, setLatestTool] = useState(null);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-50 text-zinc-900">
        <Navbar onOpenAddModal={() => setIsAddModalOpen(true)} />

        <Routes>
          <Route path="/" element={<Catalog latestTool={latestTool} />} />
          <Route path="/login" element={<Login />} />
        </Routes>

        <AddToolModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onToolAdded={(tool) => setLatestTool(tool)}
        />
      </div>
    </BrowserRouter>
  );
}