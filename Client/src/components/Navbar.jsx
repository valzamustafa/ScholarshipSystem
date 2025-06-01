import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logoo from '../assets/logoo.png';
import LogoutButton from './LogoutButton';
import { useAuth } from '../context/useAuth';
import { Navigate } from 'react-router-dom';

function Navbar() {
    const { user } = useAuth();
    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            logout();
        }
    };
    return (
        <nav
            className="navbar navbar-expand-lg rounded-3 py-3 px-4 shadow-sm fixed-top"
            style={{ backgroundColor: '#004D7C', color: 'white', borderColor: '#004D7C' }}
        >
            <div className="container-fluid">
                <Link className="navbar-brand d-flex align-items-center" to="/" style={{ color: 'white', fontWeight: 'bold' }}>
                    <img src={Logoo} alt="Logoo" style={{ height: '40px', marginRight: '10px' }} />
                    ScholarHub
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                    style={{ filter: 'invert(1)' }}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                    <ul className="navbar-nav gap-4 mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" aria-current="page" to="/home" style={{ color: 'white' }}>
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/scholarships" style={{ color: 'white' }}>
                                Scholarships
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contactus" style={{ color: 'white' }}>
                                ContactUs
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about" style={{ color: 'white' }}>
                                AboutUs
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="d-flex align-items-center gap-3">
                    {!user ? (
                        <>
                            <Link
                                to="/login"
                                className="btn rounded-pill px-4"
                                style={{ backgroundColor: 'white', color: '#004D7C', fontWeight: 'bold' }}
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="btn rounded-pill px-4"
                                style={{
                                    color: 'white',
                                    borderColor: 'white',
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                    backgroundColor: 'transparent',
                                    fontWeight: 'bold',
                                }}
                            >
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <div className="dropdown">
                            {user?.role === 'admin' || user?.role === 'provider' ? (
                                <LogoutButton className="btn btn-outline-light" />
                            ) : (
                                <>
                                    <a
                                        className="nav-link dropdown-toggle d-flex align-items-center"
                                        href="#"
                                        id="navbarDropdown"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        style={{ cursor: 'pointer', color: 'white' }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            fill="white"
                                            className="bi bi-person-circle me-1"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M13.468 12.37C12.758 11.226 11.468 10.5 10 10.5s-2.758.726-3.468 1.87A6.987 6.987 0 0 1 2 8a6.987 6.987 0 0 1 4.532-6.37C7.242 2.774 8.532 3.5 10 3.5s2.758-.726 3.468-1.87A6.987 6.987 0 0 1 18 8a6.987 6.987 0 0 1-4.532 6.37zM8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
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
                                            <LogoutButton />
                                        </li>
                                    </ul>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;