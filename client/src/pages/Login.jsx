import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosClient';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isRegister ? '/auth/signup' : '/auth/signin';
      const payload = isRegister
        ? formData
        : { email: formData.email, password: formData.password };
      const res = await api.post(endpoint, payload);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Backend not connected yet—use Demo Mode below to test UI.');
    } finally {
      setLoading(false);
    }
  };

  const handleMockLogin = () => {
    localStorage.setItem('token', 'mock-demo-token');
    navigate('/');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm border border-zinc-200 bg-white p-8 rounded-lg">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900">
          {isRegister ? 'Create an account' : 'Welcome back'}
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          {isRegister ? 'Join your local tool lending library.' : 'Sign in to borrow or list tools.'}
        </p>

        {error && (
          <div className="mt-4 p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Kenneth Villanueva"
                className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-900"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md focus:outline-none focus:border-zinc-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-sm font-medium bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Please wait...' : isRegister ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleMockLogin}
          className="mt-3 w-full py-2 text-xs font-medium border border-zinc-300 text-zinc-700 rounded-md hover:border-zinc-900 transition cursor-pointer"
        >
          Preview UI (Mock Sign In)
        </button>

        <div className="mt-6 pt-4 border-t border-zinc-100 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-xs text-zinc-500 hover:text-zinc-900 transition cursor-pointer"
          >
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}