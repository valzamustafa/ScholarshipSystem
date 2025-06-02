import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

function LogoutButton() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to log out?')) {
            try {
                await logout();
                navigate('/login');
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
    };

    return (
        <button className="dropdown-item" onClick={handleLogout}>
            Logout
        </button>
    );
}

export default LogoutButton;