import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Auth System</Link>
        <div>
          <Link className="nav-link d-inline text-light me-2" to="/login">Login</Link>
          <Link className="nav-link d-inline text-light" to="/register">Register</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
