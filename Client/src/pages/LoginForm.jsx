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