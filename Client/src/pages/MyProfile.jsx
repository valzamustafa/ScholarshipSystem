import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("https://localhost:7255/api/student/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          setError("Nuk u mor profili. Provoni përsëri më vonë.");
        }
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Gabim gjatë marrjes së profilit.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

const handleImageUpload = async (event) => {
  event.preventDefault();

  const file = event.target.files[0]; 
  const formData = new FormData();
  formData.append("file", file);

  try {
    const token = localStorage.getItem("token");

    const response = await fetch("https://localhost:7255/api/student/upload-profile-picture", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
  
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upload failed:", errorText);
      return;
    }

    const data = await response.json();
    console.log("Foto u ngarkua me sukses:", data.url);

 
    setProfile(prev => ({
      ...prev,
      imageUrl: data.url
    }));

  } catch (error) {
    console.error("Gabim në ngarkim:", error);
  }
};


  const handleIconClick = () => {
    inputRef.current.click();
  };

  if (loading) return <div className="text-center mt-4">Loading profile...</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  if (!profile) return <div className="text-center mt-4">Nuk u gjetën të dhëna për profilin.</div>;

  return (
    <div className="container-fluid px-5 mt-2 m-0 p-0 vw-100 overflow-x-hidden">
      <div className="row justify-content-center" style={{ marginTop: '120px' }}>
        <div className="col-lg-4 mb-4">
          <div className="card shadow-lg rounded-4 border-0">
            <div className="card-body text-center">
              <div className="position-relative d-inline-block mb-3" style={{ width: 120, height: 120 }}>
 
  <img
   src={profile.imageUrl || "/default-profile.png"}

    alt="Profile"
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',   
      borderRadius: '50%',
      border: '3px solid #0d6efd',  
      display: 'block',
    }}
  />

  <input
    type="file"
    accept="image/*"
    ref={inputRef}
    onChange={handleImageUpload}
    className="d-none"
  />

 
  <button
    type="button"
    className="btn btn-sm btn-primary position-absolute bottom-0 end-0 translate-middle rounded-circle border border-white"
    onClick={handleIconClick}
    style={{ width: '30px', height: '30px', padding: 0, lineHeight: '30px', fontSize: '20px' }}
  >
    +
  </button>
</div>

              <h5 className="card-title mt-2">{profile.fullName}</h5>
              <p className="card-text text-muted">{profile.email}</p>
              <span className="badge bg-primary mb-3">{profile.role}</span>
              <hr />
              <p className="mb-1"><strong>Shkolla:</strong> {profile.schoolOrUniversityName}</p>
              <p className="mb-1"><strong>Drejtimi:</strong> {profile.studyField}</p>
              <p><strong>Niveli:</strong> {profile.studentLevelName}</p>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
      
          <div className="card mb-4 shadow-sm rounded-4 border-0">
            <div className="card-header bg-light fw-bold">Të Dhënat Bazë</div>
            <div className="card-body">
              <table className="table table-bordered">
                <tbody>
                  <tr><th>Emri</th><td>{profile.fullName}</td></tr>
                  <tr><th>Email</th><td>{profile.email}</td></tr>
                  <tr><th>Shkolla/Universiteti</th><td>{profile.schoolOrUniversityName}</td></tr>
                  <tr><th>Drejtimi</th><td>{profile.studyField}</td></tr>
                  <tr><th>Niveli</th><td>{profile.studentLevelName}</td></tr>
                  <tr><th>Roli</th><td>{profile.role}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

        
          <div className="card shadow-sm rounded-4 border-0">
            <div className="card-header bg-light fw-bold">Aplikimet për Bursa</div>
            <div className="card-body">
              {profile.applications && profile.applications.length > 0 ? (
                <table className="table table-hover table-bordered mt-2">
                  <thead className="table-light">
                    <tr>
                      <th>Bursa</th>
                      <th>Data e Aplikimit</th>
                      <th>Statusi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.applications.map(app => (
                      <tr key={app.id}>
                        <td>{app.scholarshipTitle}</td>
                        <td>{new Date(app.applicationDate).toLocaleDateString()}</td>
                        <td>
                          {app.applicationStatusName === "Approved" && (
                            <span className="badge bg-success">Approved</span>
                          )}
                          {app.applicationStatusName === "Pending" && (
                            <span className="badge bg-warning text-dark">Pending</span>
                          )}
                          {app.applicationStatusName === "Not Approved" && (
                            <span className="badge bg-danger">Not Approved</span>
                          )}
                          {!["Approved", "Pending", "Not Approved"].includes(app.applicationStatusName) && (
                            <span className="badge bg-secondary">{app.applicationStatusName}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-muted">Nuk keni aplikime për bursa.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
