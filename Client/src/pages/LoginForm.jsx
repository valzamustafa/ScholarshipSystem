import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'Student'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      const roleRaw = data.user?.Role || data.user?.role || null;
      const approved = data.user?.approved ?? true;

      if (!roleRaw) {
        throw new Error('User role is undefined or missing');
      }

      let role = '';
      if (typeof roleRaw === 'string') {
        role = roleRaw.trim();
      } else if (typeof roleRaw === 'object' && roleRaw.emri) {
        role = roleRaw.emri.trim();
      } else {
        throw new Error('User role is not a string or valid object');
      }

      console.log('User role:', role, 'Approved:', approved);

      if (role === 'Admin') {
        navigate('/admin');
      } else if (role === 'Provider') {
        if (!approved) {
          navigate('/pending-approval');
        } else {
          navigate('/provider');
        }
      } else if (role === 'Student') {
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
    <div className="container mt-5 d-flex justify-content-center overflow-x-hidden">
      <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="text-center">Welcome Back</h3>
        <p className="text-center text-muted">Choose your role to continue to ScholarshipHub</p>

        {/* Role buttons */}
        <div className="d-flex justify-content-center mb-3">
          <button
            type="button"
            className={`btn me-2 ${formData.role === 'Student' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => handleRoleChange('Student')}
          >
            Student
          </button>
          <button
            type="button"
            className={`btn me-2 ${formData.role === 'Provider' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => handleRoleChange('Provider')}
          >
            Provider
          </button>
          <button
            type="button"
            className={`btn ${formData.role === 'Admin' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => handleRoleChange('Admin')}
          >
            Admin
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              placeholder="m@example.com"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label d-flex justify-content-between">
              <span>Password</span>
              <a href="#" className="text-decoration-none small">Forgot your password?</a>
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="d-grid mt-3">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : `Login as ${formData.role}`}
            </button>
          </div>
        </form>

        <p className="text-center mt-3 text-muted">
          Don't have an account?{' '}
          <Link
            to={formData.role === 'Provider' ? '/register/provider' : '/register'}
            className="text-decoration-none"
          >
            Sign up
          </Link>
          <br />
          <small>Current role: {formData.role}</small>
        </p>
      </div>
    </div>
  );
}
