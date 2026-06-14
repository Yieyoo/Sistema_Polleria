import { useState }      from 'react';
import { useNavigate }   from 'react-router-dom';
import { adminLogin }    from '../services/api.js';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await adminLogin(form);
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user',  JSON.stringify({ username: data.username, full_name: data.full_name }));
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Error de conexión. Verifica que el servidor esté activo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-700 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-brand-700 px-6 py-8 text-center text-white">
          <div className="text-5xl mb-3">🐔</div>
          <h1 className="text-2xl font-extrabold">Panel Administrativo</h1>
          <p className="text-brand-200 text-sm mt-1">El Pollito Gus</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Usuario</label>
            <input
              type="text"
              autoComplete="username"
              placeholder="admin"
              value={form.username}
              onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5
                         focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contraseña</label>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5
                         focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300
                       text-white font-bold py-3 rounded-xl transition-colors mt-2"
          >
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>

          <a href="/" className="block text-center text-sm text-brand-600 hover:text-brand-700 mt-2">
            ← Volver al menú
          </a>
        </form>
      </div>
    </div>
  );
}
