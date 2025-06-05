import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setMessage('');

  if (!email) {
    setError('Please enter your email');
    return;
  }

  try {
    setLoading(true);
    const response = await fetch('https://localhost:7255/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to send reset link');
    }

    const data = await response.json();
    setMessage(data.message || 'If your email exists, you will receive a password reset link shortly.');
  } catch (err) {
    setError(err.message || 'An unexpected error occurred. Please try again.');
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light m-0 p-0 vw-100 overflow-x-hidden mt-5">
      <div className="row shadow-lg" style={{ maxWidth: '500px', width: '100%', borderRadius: '15px', overflow: 'hidden' }}>
        <div className="col-md-12 bg-white p-5">
          <h3 className="text-center fw-bold" style={{ color: '#004D7C' }}>Forgot Password</h3>
          <p className="text-center text-muted mb-4">Enter your email to receive a reset link</p>

          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control rounded-pill"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="d-grid mt-3">
              <button
                className="btn rounded-pill fw-semibold text-white"
                type="submit"
                disabled={loading}
                style={{ backgroundColor: '#004D7C' }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          </form>

          <p className="text-center mt-4 text-muted">
            Remember your password?{' '}
            <button
              onClick={() => navigate('/login')}
              className="fw-semibold"
              style={{ color: '#004D7C', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}