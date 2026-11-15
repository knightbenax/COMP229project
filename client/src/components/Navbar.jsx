import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ onOpenAddModal }) {
  const navigate = useNavigate();
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="border-b border-zinc-200 bg-white">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold tracking-tight text-zinc-900">
          ToolShare<span className="text-zinc-400 font-normal">.local</span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <button
                onClick={onOpenAddModal}
                className="px-3.5 py-1.5 text-sm font-medium bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition cursor-pointer"
              >
                + List a Tool
              </button>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition cursor-pointer"
              >
                Log Out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-3.5 py-1.5 text-sm font-medium border border-zinc-300 text-zinc-900 rounded-md hover:border-zinc-900 transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}