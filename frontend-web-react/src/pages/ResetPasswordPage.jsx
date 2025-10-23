import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../services/api";

export default function ResetPasswordPage() {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const score = passwordScore(password);
    if (score < 2) {
      setError("La contraseña es demasiado débil");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ code: otp, newPassword: password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data || "Error al restablecer la contraseña");
    } finally {
      setLoading(false);
    }
  };

  const score = passwordScore(password);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(to bottom right, #f9fafb, #f3f4f6)", padding: "2rem" }}>
      <div style={{ display: "flex", background: "white", borderRadius: "3rem", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", overflow: "hidden", maxWidth: "80rem", width: "100%", minHeight: "600px" }}>
        
        {/* Left Panel */}
        <div style={{ width: "50%", background: "black", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <img
            src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80"
            alt="Space"
            style={{ width: "100%", height: "100%", objectFit: "contain", maxHeight: "500px" }}
          />
          <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem", right: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "white", fontSize: "0.875rem" }}>Copyright - Javier Yunga</span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button style={{ width: "2.25rem", height: "2.25rem", borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)", color: "white", cursor: "pointer" }}>←</button>
              <button style={{ width: "2.25rem", height: "2.25rem", borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)", color: "white", cursor: "pointer" }}>→</button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ width: "50%", padding: "3rem", position: "relative", background: "white" }}>
          <div style={{ maxWidth: "28rem", margin: "0 auto", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "3rem" }}>ETIKOS</h2>

            {success ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✅</div>
                <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>Contraseña restablecida</h1>
                <p style={{ color: "#6b7280", marginBottom: "2rem" }}>Redirigiendo al login...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* OTP Input */}
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "0.5rem" }}>
                    Código OTP
                  </label>
                  <input
                    type="text"
                    placeholder="Ingresa el código recibido"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem", fontSize: "0.875rem", outline: "none" }}
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "0.5rem" }}>
                    Nueva contraseña
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 8 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ width: "100%", padding: "0.75rem 3rem 0.75rem 1rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem", fontSize: "0.875rem", outline: "none" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem" }}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {password && (
                    <div style={{ marginTop: "0.5rem" }}>
                      <div style={{ height: "0.5rem", width: "100%", background: "#e5e7eb", borderRadius: "0.25rem", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${(score / 4) * 100}%`, background: strengthColor(score), transition: "all 0.3s ease" }} />
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Fortaleza: <strong style={{ color: strengthColor(score) }}>{strengthText(score)}</strong></span>
                    </div>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "0.5rem" }}>
                    Confirmar contraseña
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Repite la contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      style={{ width: "100%", padding: "0.75rem 3rem 0.75rem 1rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem", fontSize: "0.875rem", outline: "none" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem" }}
                    >
                      {showConfirm ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                {error && (
                  <div style={{ padding: "0.75rem", background: "#fee2e2", color: "#991b1b", borderRadius: "0.5rem", fontSize: "0.875rem" }}>
                    ⚠️ {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || score < 2}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: loading || score < 2 ? "#9ca3af" : "linear-gradient(to right, #ef4444, #dc2626)",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    fontWeight: "500",
                    cursor: loading || score < 2 ? "not-allowed" : "pointer",
                    boxShadow: loading || score < 2 ? "none" : "0 10px 15px -3px rgba(239, 68, 68, 0.25)",
                    marginTop: "0.5rem"
                  }}
                >
                  {loading ? "Restableciendo..." : "Restablecer contraseña"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "white",
                    color: "#6b7280",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    marginTop: "0.5rem"
                  }}
                >
                  ← Volver al login
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
