import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterProviderForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    description: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  if (formData.password.length < 6) {
    setError('Password must be at least 6 characters');
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    setError('Passwords do not match');
    return;
  }

  try {
    setLoading(true);

    const response = await fetch('https://localhost:7255/api/auth/register/provider', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        FullName: formData.fullName,
        Email: formData.email,
        PhoneNumber: formData.phoneNumber,
        Password: formData.password,
        OrganizationName: formData.organizationName,
        Description: formData.description
      })
    });

    const contentType = response.headers.get('content-type');
    const data = contentType && contentType.includes('application/json')
      ? await response.json()
      : { message: await response.text() };

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

   


    alert('Your request has been sent. Please wait for admin approval.');

   
    navigate('/login');

  } catch (err) {
    setError(err.message || 'An error occurred during registration');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card p-4 shadow" style={{ maxWidth: '500px', width: '100%' }}>
        <h3 className="text-center">Register as Provider</h3>
        <p className="text-center text-muted">Fill in the details to join ScholarshipHub</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              className="form-control"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone Number (Optional)</label>
            <input
              type="tel"
              name="phoneNumber"
              className="form-control"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+383 44 123 456"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              value={formData.confirmPassword}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Organization Name</label>
            <input
              type="text"
              name="organizationName"
              className="form-control"
              value={formData.organizationName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              required
            ></textarea>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>

        <p className="text-center mt-3 text-muted">
          Already have an account? <a href="/login" className="text-decoration-none">Login</a>
        </p>
      </div>
    </div>
  );
}
