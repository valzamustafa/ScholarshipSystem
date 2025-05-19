import { useEffect, useState } from 'react';

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('https://localhost:7255/api/student/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!profile) return <div>No profile data found.</div>;

  return (
    <div>
      <h2>Welcome, {profile.fullName}</h2>
      <p>Email: {profile.email}</p>
      <p>School/University: {profile.schoolOrUniversityName}</p>
      <p>Field of Study: {profile.studyField}</p>
      <p>Level: {profile.studentLevelName}</p>

      <h3>Your Scholarship Applications</h3>
      {profile.applications && profile.applications.length > 0 ? (
        <ul>
          {profile.applications.map(app => (
            <li key={app.id}>
              {app.scholarshipTitle} - Status: {app.applicationStatusName}
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no scholarship applications.</p>
      )}
    </div>
  );
}
