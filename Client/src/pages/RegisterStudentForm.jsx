import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
export default function RegisterStudentForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    schoolOrUniversityName: '',
    studyField: '',
    studentLevelId: ''
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

    if (!formData.studentLevelId || isNaN(parseInt(formData.studentLevelId))) {
      setError('Please select a valid student level');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('https://localhost:7255/api/auth/register/student', {
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
          SchoolOrUniversityName: formData.schoolOrUniversityName,
          StudyField: formData.studyField,
          StudentLevelId: parseInt(formData.studentLevelId)
        })
      });

      const contentType = response.headers.get('content-type');
      const data = contentType && contentType.includes('application/json')
        ? await response.json()
        : { message: await response.text() };

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

     
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

     
const role = data.user?.role;

if (!role) {
  throw new Error('User role is undefined or missing');
}

if (role === 'Student') {
  navigate('/student/home');
} else if (role === 'Admin') {
  navigate('/admin');
} else {
  navigate('/');
}

    } catch (err) {
      setError(err.message || 'An error occurred during registration');
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

      
        <div className="col-md-5 bg-white p-5 ">
          <h3 className="text-center fw-bold" style={{ color: '#004D7C' }}>Register as Student</h3>
          <p className="text-center text-muted mb-4">Fill in the details to join ScholarshipHub</p>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input type="text" name="fullName" className="form-control rounded-pill" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <input type="email" name="email" className="form-control rounded-pill" placeholder="Email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <input type="tel" name="phoneNumber" className="form-control rounded-pill" placeholder="Phone Number (Optional)" value={formData.phoneNumber} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <input type="password" name="password" className="form-control rounded-pill" placeholder="Password" value={formData.password} onChange={handleChange} minLength="6" required />
            </div>

            <div className="mb-3">
              <input type="password" name="confirmPassword" className="form-control rounded-pill" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} minLength="6" required />
            </div>

            <div className="mb-3">
              <input type="text" name="schoolOrUniversityName" className="form-control rounded-pill" placeholder="School or University Name" value={formData.schoolOrUniversityName} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <input type="text" name="studyField" className="form-control rounded-pill" placeholder="Field of Study" value={formData.studyField} onChange={handleChange} required />
            </div>

            <div className="mb-4">
              <select name="studentLevelId" className="form-select rounded-pill" value={formData.studentLevelId} onChange={handleChange} required>
                <option value="">Select Student Level</option>
                <option value="1">Bachelor</option>
                <option value="2">Master</option>
                <option value="3">PhD</option>
                <option value="4">High School Graduate</option>
                <option value="5">Training Participant</option>
              </select>
            </div>

            <div className="d-grid mt-3">
             <button className="btn rounded-pill" type="submit"  disabled={loading}
                 style={{ backgroundColor: '#004D7C', color: 'white' }}>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}