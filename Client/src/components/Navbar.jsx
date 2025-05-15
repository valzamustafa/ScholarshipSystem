import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light rounded-3 py-3 px-4 shadow-sm fixed-top">
      <div className="container-fluid">

      
        <Link className="navbar-brand" to="/" style={{ color: '#004D7C', fontWeight: 'bold' }}>
          Logo
        </Link>

        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

       
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav gap-4 mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/home" style={{ color: '#004D7C' }}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/scholarships" style={{ color: '#004D7C' }}>
                Scholarships
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contactus" style={{ color: '#004D7C' }}>
                ContactUs
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/aboutus" style={{ color: '#004D7C' }}>
                AboutUs
              </Link>
            </li>
          </ul>
        </div>

       
        <div className="d-flex align-items-center gap-3">
          <Link
            to="/login"
            className="btn rounded-pill px-4"
            style={{ backgroundColor: '#004D7C', color: 'white', borderColor: '#004D7C' }}
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="btn rounded-pill px-4"
            style={{ color: '#004D7C', borderColor: '#004D7C', borderWidth: '1px', borderStyle: 'solid', backgroundColor: 'transparent' }}
          >
            Sign Up
          </Link>

  
          <div className="dropdown">
            <a
              className="nav-link dropdown-toggle d-flex align-items-center"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ cursor: 'pointer', color: '#004D7C' }}
            >
             
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#004D7C"
                className="bi bi-person-circle me-1"
                viewBox="0 0 16 16"
              >
                <path d="M13.468 12.37C12.758 11.226 11.468 10.5 10 10.5s-2.758.726-3.468 1.87A6.987 6.987 0 0 1 2 8a6.987 6.987 0 0 1 4.532-6.37C7.242 2.774 8.532 3.5 10 3.5s2.758-.726 3.468-1.87A6.987 6.987 0 0 1 18 8a6.987 6.987 0 0 1-4.532 6.37zM8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
              </svg>
              Profile
            </a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li>
                <Link className="dropdown-item" to="/profile">
                  My Profile
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/settings">
                  Settings
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <Link className="dropdown-item" to="/logout">
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
