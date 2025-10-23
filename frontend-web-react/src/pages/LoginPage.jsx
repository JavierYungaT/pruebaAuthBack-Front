import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Llamar a la API de login
      const response = await login({ email, password });

      console.log("Login exitoso:", response);

      // Redirigir al dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Error de login:", err);

      // Manejar diferentes tipos de errores
      if (err.response?.status === 401) {
        setError("Credenciales incorrectas. Por favor verifica tu email y contraseña.");
      } else if (err.response?.status === 403) {
        setError("Tu cuenta está bloqueada. Contacta al administrador.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 403) {
        setError(err.response?.data || "Tu cuenta está bloqueada. Contacta al administrador.");
    } else {
      setError("Error al iniciar sesión. Por favor intenta nuevamente.");
    }
  } finally {
    setLoading(false);
  }
};

return (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)', padding: '2rem' }}>
    <div style={{ display: 'flex', background: 'white', borderRadius: '3rem', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', overflow: 'hidden', maxWidth: '80rem', width: '100%', minHeight: '600px' }}>

      {/* Left Panel */}
      <div style={{ width: '50%', background: 'black', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <img
          src="https://images.unsplash.com/photo-1614732414444-096e5f1122d5?auto=format&fit=crop&w=800&q=80"
          alt="Space"
          style={{ width: '100%', height: '100%', objectFit: 'contain', maxHeight: '500px' }}
        />
        <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: 'white', fontSize: '0.875rem' }}>Copyright - Javier Yunga</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer' }}>←</button>
            <button style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer' }}>→</button>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ width: '50%', padding: '3rem', position: 'relative', background: 'white' }}>
        <div style={{ maxWidth: '28rem', margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '3rem' }}>ETIKOS</h2>

          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>INICIAR SESIÓN</h1>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>BIENVENIDO</p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                opacity: loading ? 0.6 : 1
              }}
            />

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  opacity: loading ? 0.6 : 1
                }}
              />
              <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                <a
                  href="/forgot-password"
                  style={{ fontSize: '0.75rem', color: '#3b82f6', textDecoration: 'none' }}
                >
                  ¿Has olvidado tu contraseña?
                </a>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                padding: '0.75rem',
                background: '#fee2e2',
                color: '#991b1b',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                border: '1px solid #fecaca'
              }}>
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: loading ? '#9ca3af' : 'linear-gradient(to right, #ef4444, #dc2626)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 10px 15px -3px rgba(239, 68, 68, 0.25)'
              }}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', marginTop: '1.5rem' }}>
            ¿No tienes una cuenta? <a href="/register" style={{ color: '#3b82f6', fontWeight: '500', textDecoration: 'none' }}>Regístrate</a>
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '2rem' }}>
            <a href="#" style={{ color: '#3b82f6' }}>📘</a>
            <a href="#" style={{ color: '#60a5fa' }}>🐦</a>
            <a href="#" style={{ color: '#ec4899' }}>📷</a>
            <a href="#" style={{ color: '#dc2626' }}>▶️</a>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}