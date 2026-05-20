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

    // Validations
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
      
      // Përdorni PascalCase për property names (siç pritet nga C# backend)
      const payload = {
        FullName: formData.fullName,
        Email: formData.email,
        PhoneNumber: formData.phoneNumber || null,
        Password: formData.password,
        ConfirmPassword: formData.confirmPassword,
        OrganizationName: formData.organizationName,
        Description: formData.description
      };

      console.log('Sending payload:', payload);

      const response = await fetch('https://localhost:7255/api/auth/register/provider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();
      console.log('Server response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || responseData.title || 'Registration failed');
      }

      alert(responseData.message || 'Your request has been sent. Please wait for admin approval.');
      navigate('/login');
      
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light m-0 p-0 vw-100 overflow-x-hidden mt-5">
      <div className="row shadow-lg" style={{ maxWidth: '900px', width: '100%', borderRadius: '15px', overflow: 'hidden' }}>
        
        <div className="col-md-6 text-white d-flex flex-column justify-content-center align-items-center p-4" style={{ backgroundColor: '#004D7C' }}>
          <div className="text-center">
            <h2 className="fw-bold mb-3">Welcome!</h2>
            <p>Already have an account? Login to continue.</p>
            <button className="btn btn-outline-light mt-3" onClick={() => navigate('/login')}>SIGN IN</button>
          </div>
        </div>

        <div className="col-md-6 bg-white p-5">
          <h3 className="text-center fw-bold" style={{ color: '#004D7C' }}>Register as Provider</h3>
          <p className="text-center text-muted mb-4">Fill in the details to join ScholarshipHub</p>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                name="fullName"
                className="form-control rounded-pill"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="email"
                name="email"
                className="form-control rounded-pill"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="tel"
                name="phoneNumber"
                className="form-control rounded-pill"
                placeholder="Phone Number (Optional)"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                name="password"
                className="form-control rounded-pill"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                minLength="6"
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                name="confirmPassword"
                className="form-control rounded-pill"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                minLength="6"
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="text"
                name="organizationName"
                className="form-control rounded-pill"
                placeholder="Organization Name"
                value={formData.organizationName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <textarea
                name="description"
                className="form-control"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                required
              />
            </div>

            <div className="d-grid mt-3">
              <button 
                className="btn rounded-pill" 
                type="submit" 
                disabled={loading}
                style={{ backgroundColor: '#004D7C', color: 'white' }}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}