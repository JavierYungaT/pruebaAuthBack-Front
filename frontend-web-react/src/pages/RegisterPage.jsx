import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const passwordScore = (pw) => {
        if (!pw) return 0;
        let score = 0;
        if (pw.length >= 8) score += 1;
        if (/[A-Z]/.test(pw)) score += 1;
        if (/[0-9]/.test(pw)) score += 1;
        if (/[^A-Za-z0-9]/.test(pw)) score += 1;
        return score;
    };

    const strengthColor = (score) => {
        switch (score) {
            case 0:
            case 1:
                return "#ef4444";
            case 2:
                return "#fbbf24";
            case 3:
                return "#3b82f6";
            case 4:
                return "#10b981";
            default:
                return "#e5e7eb";
        }
    };

    const strengthText = (score) => {
        switch (score) {
            case 0:
            case 1:
                return "Débil";
            case 2:
                return "Media";
            case 3:
                return "Buena";
            case 4:
                return "Excelente";
            default:
                return "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const userData = { email, username: name, password };
            await register(userData);
            setSuccess(true);
            setTimeout(() => navigate("/login"), 1200);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Error al registrar el usuario");
        } finally {
            setLoading(false);
        }
    };

    const score = passwordScore(password);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)', padding: '2rem' }}>
            <div style={{ display: 'flex', background: 'white', borderRadius: '3rem', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', overflow: 'hidden', maxWidth: '80rem', width: '100%', minHeight: '600px' }}>
                
                {/* Left Panel */}
                <div style={{ width: '50%', background: 'black', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <img
                        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
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
                <div style={{ width: '50%', padding: '3rem', position: 'relative', background: 'white', overflowY: 'auto' }}>
                    <div style={{ maxWidth: '28rem', margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '2rem' }}>ETIKOS</h2>

                        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>CREAR CUENTA</h1>
                        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Únete a nosotros hoy</p>

                        {success ? (
                            <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '0.5rem', background: '#d1fae5', color: '#065f46', fontSize: '0.875rem' }}>
                                ✓ Registro exitoso. Redirigiendo al login...
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {/* Name Input */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                                        Nombre completo
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>👤</span>
                                        <input
                                            type="text"
                                            placeholder="Tu nombre completo"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none' }}
                                        />
                                    </div>
                                </div>

                                {/* Email Input */}
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
                                            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none' }}
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                                        Contraseña
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>🔒</span>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Mínimo 8 caracteres"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            style={{ width: '100%', padding: '0.75rem 3rem 0.75rem 2.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '0.875rem', outline: 'none' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                                        >
                                            {showPassword ? '🙈' : '👁️'}
                                        </button>
                                    </div>

                                    {/* Password Strength */}
                                    {password && (
                                        <div style={{ marginTop: '0.75rem' }}>
                                            <div style={{ height: '0.5rem', width: '100%', background: '#e5e7eb', borderRadius: '0.25rem', overflow: 'hidden' }}>
                                                <div
                                                    style={{
                                                        height: '100%',
                                                        width: `${(score / 4) * 100}%`,
                                                        background: strengthColor(score),
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                />
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                                                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                                    Fortaleza: <strong style={{ color: strengthColor(score) }}>{strengthText(score)}</strong>
                                                </span>
                                                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                                    {score}/4
                                                </span>
                                            </div>
                                            <p style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                                                Usa mayúsculas, números y símbolos especiales
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div style={{ padding: '0.75rem', background: '#fee2e2', color: '#991b1b', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
                                        ⚠️ {error}
                                    </div>
                                )}

                                {/* Buttons */}
                                <button
                                    type="submit"
                                    disabled={loading || score < 2}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: loading || score < 2 ? '#9ca3af' : 'linear-gradient(to right, #ef4444, #dc2626)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '0.5rem',
                                        fontWeight: '500',
                                        cursor: loading || score < 2 ? 'not-allowed' : 'pointer',
                                        boxShadow: loading || score < 2 ? 'none' : '0 10px 15px -3px rgba(239, 68, 68, 0.25)',
                                        marginTop: '0.5rem'
                                    }}
                                >
                                    {loading ? 'Creando cuenta...' : 'Registrarme'}
                                </button>

                                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                                    Al registrarte aceptas nuestros <a href="#" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Términos y Condiciones</a>
                                </p>
                            </form>
                        )}

                        {/* Login Link */}
                        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', marginTop: '1.5rem' }}>
                            ¿Ya tienes una cuenta? <a href="/login" style={{ color: '#3b82f6', fontWeight: '500', textDecoration: 'none' }}>Inicia sesión</a>
                        </p>

                        {/* Social Icons */}
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