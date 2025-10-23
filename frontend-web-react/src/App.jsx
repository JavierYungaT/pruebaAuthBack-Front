import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import Navbar from './components/Navbar'
import 'bootstrap/dist/css/bootstrap.min.css'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

function App() {
  return (
    <Router>
      <Routes>
        {/* Login y Register sin Navbar ni container de Bootstrap */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Dashboard con Navbar y Bootstrap */}
        <Route path="/dashboard" element={
          <>
            <Navbar />
            <div className="container mt-4">
              <DashboardPage />
            </div>
          </>
        } />
      </Routes>
    </Router>
  )
}

export default App