import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/api';


export default function DashboardPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Usuario");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        // Cambiar fullName por username
        setUserName(user.username || "Usuario");
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };
    fetchUser();
  }, []);



  const handleLogout = () => {

    localStorage.removeItem('token');
    navigate('/login');
  };

  const stats = [
    { label: 'Proyectos Activos', value: '12', icon: '📊', color: '#3b82f6' },
    { label: 'Tareas Completadas', value: '48', icon: '✅', color: '#10b981' },
    { label: 'En Progreso', value: '8', icon: '⏳', color: '#f59e0b' },
    { label: 'Pendientes', value: '15', icon: '📋', color: '#ef4444' },
  ];

  const recentActivity = [
    { id: 1, action: 'Proyecto "Web App" actualizado', time: 'Hace 2 horas', icon: '🔄' },
    { id: 2, action: 'Nueva tarea asignada', time: 'Hace 4 horas', icon: '📌' },
    { id: 3, action: 'Reunión programada', time: 'Hace 1 día', icon: '📅' },
    { id: 4, action: 'Documento compartido', time: 'Hace 2 días', icon: '📄' },
  ];

  const quickActions = [
    { label: 'Nuevo Proyecto', icon: '➕', color: '#3b82f6' },
    { label: 'Crear Tarea', icon: '📝', color: '#10b981' },
    { label: 'Ver Reportes', icon: '📈', color: '#8b5cf6' },
    { label: 'Configuración', icon: '⚙️', color: '#6b7280' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)' }}>
      {/* Header/Navbar */}
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>ETIKOS</h1>
            <span style={{ fontSize: '0.875rem', color: '#6b7280', padding: '0.25rem 0.75rem', background: '#f3f4f6', borderRadius: '1rem' }}>
              Dashboard
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'linear-gradient(to right, #ef4444, #dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>{userName}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>Administrador</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{ padding: '0.5rem 1rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseOver={(e) => e.target.style.background = '#dc2626'}
              onMouseOut={(e) => e.target.style.background = '#ef4444'}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
            ¡Bienvenido, {userName}! 👋
          </h2>
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>
            Aquí tienes un resumen de tu actividad reciente
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {stats.map((stat, index) => (
            <div
              key={index}
              style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '1rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #f3f4f6',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0, marginBottom: '0.5rem' }}>{stat.label}</p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>{stat.value}</p>
                </div>
                <div style={{ fontSize: '2rem', opacity: 0.8 }}>{stat.icon}</div>
              </div>
              <div style={{ height: '4px', background: '#f3f4f6', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '75%', background: stat.color, borderRadius: '2px' }}></div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
          {/* Quick Actions */}
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
              Acciones Rápidas
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  style={{
                    padding: '1rem',
                    background: 'white',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = action.color;
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <span style={{ fontSize: '2rem' }}>{action.icon}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
              Actividad Reciente
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  style={{
                    padding: '1rem',
                    background: '#f9fafb',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#f3f4f6'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#f9fafb'}
                >
                  <span style={{ fontSize: '1.5rem' }}>{activity.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                      {activity.action}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}