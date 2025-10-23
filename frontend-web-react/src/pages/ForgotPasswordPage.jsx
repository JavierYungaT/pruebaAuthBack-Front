import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await forgotPassword(email);
      setSuccess(true);
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      console.error("Error:", err);
      if (err.response?.status === 404) {
        setError("No existe una cuenta con ese email.");
      } else {
        setError(err.response?.data?.message || "Error al enviar el email. Intenta nuevamente.");
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
            src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80"
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

            {success ? (
              <div>
                <div style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '1rem' }}>✅</div>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>Email Enviado</h1>
                <p style={{ color: '#6b7280', marginBottom: '2rem', textAlign: 'center' }}>
                  Hemos enviado las instrucciones para recuperar tu contraseña a <strong>{email}</strong>
                </p>
                <div style={{ padding: '1rem', background: '#dbeafe', borderRadius: '0.5rem', marginBottom: '2rem' }}>
                  <p style={{ fontSize: '0.875rem', color: '#1e40af', margin: 0 }}>
                    📧 Revisa tu bandeja de entrada y sigue los pasos del correo. El enlace expirará en 1 hora.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/login')}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    background: 'linear-gradient(to right, #ef4444, #dc2626)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '0.5rem', 
                    fontWeight: '500', 
                    cursor: 'pointer',
                    marginBottom: '1rem'
                  }}
                >
                  Volver al Login
                </button>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setEmail("");
                  }}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    background: 'white', 
                    color: '#6b7280', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '0.5rem', 
                    fontWeight: '500', 
                    cursor: 'pointer'
                  }}
                >
                  Enviar nuevamente
                </button>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '2rem' }}>
                  <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>¿Olvidaste tu contraseña?</h1>
                  <p style={{ color: '#6b7280' }}>
                    No te preocupes, te enviaremos instrucciones para restablecerla.
                  </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Correo electrónico
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>✉️</span>
                      <input
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        style={{ 
                          width: '100%', 
                          padding: '0.75rem 1rem 0.75rem 2.5rem', 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '0.5rem', 
                          fontSize: '0.875rem',
                          opacity: loading ? 0.6 : 1
                        }}
                      />
                    </div>
                  </div>

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
                      boxShadow: loading ? 'none' : '0 10px 15px -3px rgba(239, 68, 68, 0.25)',
                      marginTop: '0.5rem'
                    }}
                  >
                    {loading ? 'Enviando...' : 'Enviar instrucciones'}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem', 
                      background: 'white', 
                      color: '#6b7280', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '0.5rem', 
                      fontWeight: '500', 
                      cursor: 'pointer'
                    }}
                  >
                    ← Volver al login
                  </button>
                </form>
              </>
            )}

            {!success && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '2rem' }}>
                <a href="#" style={{ color: '#3b82f6' }}>📘</a>
                <a href="#" style={{ color: '#60a5fa' }}>🐦</a>
                <a href="#" style={{ color: '#ec4899' }}>📷</a>
                <a href="#" style={{ color: '#dc2626' }}>▶️</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}