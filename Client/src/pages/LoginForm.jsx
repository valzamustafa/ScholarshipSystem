/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const originalFetch = window.fetch;

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'Student'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, logout } = useAuth();

  const refreshToken = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!token || !refreshToken) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        return null;
      }

      const response = await originalFetch('https://localhost:7255/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, refreshToken })
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      login(user, data.token, data.refreshToken);
      
      return data.token;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return null;
    }
  }, [login]);

  useEffect(() => {
    const fetchInterceptor = async (url, options = {}) => {
      const token = localStorage.getItem('token');
      if (token) {
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${token}`
        };
      }

      let response = await originalFetch(url, options);
      
      if (response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${newToken}`
          };
          response = await originalFetch(url, options);
        } else {
          await logout();
          navigate('/login');
          return response;
        }
      }
      
      return response;
    };

    window.fetch = fetchInterceptor;

    return () => {
      window.fetch = originalFetch;
    };
  }, [navigate, refreshToken, logout]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({ ...prev, role }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  try {
    setLoading(true);
    const response = await fetch('https://localhost:7255/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Email: formData.email,
        Password: formData.password,
        Role: formData.role
      })
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(text || 'Login failed');
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Login failed with status: ${response.status}`);
    }

   
    const roleRaw = data.user?.Role || data.user?.role || null;
    const approved = data.user?.approved ?? true;

    if (!roleRaw) {
      throw new Error('User role is undefined or missing');
    }

    let role = '';
    if (typeof roleRaw === 'string') {
      role = roleRaw.charAt(0).toUpperCase() + roleRaw.slice(1).toLowerCase();
    } else if (typeof roleRaw === 'object' && roleRaw.emri) {
      role = roleRaw.emri.charAt(0).toUpperCase() + roleRaw.emri.slice(1).toLowerCase();
    } else {
      throw new Error('User role is not a string or valid object');
    }


    login(
      {
        ...data.user,
        role: role.toLowerCase(), 
        approved
      },
      data.token,
      data.refreshToken
    );

    localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify({
        ...data.user,
        role: role.toLowerCase(),
        approved
      }));

    console.log('User role:', role, 'Approved:', approved);

    if (role === 'Admin') {
      navigate('/admin');
    } else if (role === 'Provider') {
      navigate(approved ? '/provider' : '/pending-approval');
    } else if (role === 'Student') {
      let studentId =
        data.user?.id ||
        data.user?.studentId ||
        data.user?.student?.id ||
        data.user?.StudentId ||
        data.user?.Student?.id;

      if (studentId) {
        localStorage.setItem("studentId", studentId);
      } else {
        console.warn("Nuk u gjet studentId në objektin e userit:", data.user);
      }

      navigate('/home');
    } else {
      throw new Error('Unknown user role');
    }

  } catch (err) {
    setError(err.message || 'Login error');
  } finally {
    setLoading(false);
  }
};

 return (
  <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light m-0 p-0 vw-100 overflow-x-hidden pt-5">
    <div className="row shadow-lg" style={{ maxWidth: '900px', width: '100%', borderRadius: '15px', overflow: 'hidden' }}>
      
 
      <div
        className="col-md-6 d-flex flex-column justify-content-center align-items-center p-4"
        style={{ backgroundColor: '#004D7C', color: 'white' }}
      >
        <div className="text-center">
          <h2 className="fw-bold mb-3">Welcome Back!</h2>
          <p>To stay connected with us, please login with your personal info</p>
          <button
            className="btn btn-outline-light mt-3 rounded-pill px-4"
            onClick={() => navigate('/')}
          >
            SIGN IN
          </button>
        </div>
      </div>

     
      <div className="col-md-6 bg-white p-5">
        <h3 className="text-center fw-bold" style={{ color: '#004D7C' }}>Welcome</h3>
        <p className="text-center text-muted mb-4">Login to your account to continue</p>

    
        <div className="d-flex justify-content-center mb-3">
          {['Student', 'Provider', 'Admin'].map((role) => (
            <button
              key={role}
              type="button"
              className={`btn mx-1 rounded-pill px-3 fw-semibold ${
                formData.role === role ? 'btn-primary text-white' : 'btn-outline-secondary'
              }`}
              style={formData.role === role ? { backgroundColor: '#004D7C', borderColor: '#004D7C' } : {}}
              onClick={() => handleRoleChange(role)}
            >
              {role}
            </button>
          ))}
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control rounded-pill"
              placeholder="Email..."
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control rounded-pill"
              placeholder="Password..."
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <div className="text-end small mt-1">
              <a href="#" className="text-decoration-none text-secondary">Forgot your password?</a>
            </div>
          </div>

          <div className="d-grid mt-3">
            <button
              className="btn rounded-pill fw-semibold text-white"
              type="submit"
              disabled={loading}
              style={{ backgroundColor: '#004D7C' }}
            >
              {loading ? 'Logging in...' : `Login as ${formData.role}`}
            </button>
          </div>
        </form>

        <p className="text-center mt-4 text-muted">
          Don't have an account?{' '}
          <Link
            to={formData.role === 'Provider' ? '/register/provider' : '/register'}
            className="fw-semibold"
            style={{ color: '#004D7C', textDecoration: 'none' }}
          >
            Sign up
          </Link>
          <br />
          <small className="text-secondary">Current role: {formData.role}</small>
        </p>
      </div>
    </div>
  </div>
);
}