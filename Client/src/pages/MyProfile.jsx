/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('info');
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
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload failed:", errorText);
        return;
      }

      const data = await response.json();
      setProfile(prev => ({ ...prev, imageUrl: data.url }));
    } catch (error) {
      console.error("Gabim në ngarkim:", error);
    }
  };

  const handleIconClick = () => {
    inputRef.current.click();
  };

  if (loading) return <div className="text-center mt-5">Duke u ngarkuar profili...</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  if (!profile) return <div className="text-center mt-4">Nuk u gjetën të dhëna për profilin.</div>;

  return (
    <div className="container-fluid py-4 mt-5 m-0 p-0 vw-100 overflow-x-hidden">
      <div className="row">
    
        <div className="col-md-3 mb-4">
          <div className="card shadow-sm border-0 text-center">
            <div className="card-body">
              <div className="position-relative mx-auto mb-3" style={{ width: '120px' }}>
                <img
                  src={profile.imageUrl || "/88b6a298-53ef-4c73-a89a-7a0116d4e7ee.png"}
                  alt="Profile"
                  className="rounded-circle border border-3 border-primary img-fluid"
                  style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={inputRef}
                  onChange={handleImageUpload}
                  className="d-none"
                />
                <button
                  className="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle"
                  onClick={handleIconClick}
                  style={{ width: '28px', height: '28px' }}
                  title="Ndrysho foton"
                >
                  <i className="bi bi-pencil"></i>
                </button>
              </div>
              <h5>{profile.fullName}</h5>
              <p className="text-muted small">{profile.email}</p>
              <span className="badge bg-primary">{profile.role}</span>
              <hr />
              <div className="d-grid gap-2">
                <button
                  className={`btn ${activeTab === 'info' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setActiveTab('info')}
                >
                  🧍‍♂️ Të Dhënat Personale
                </button>
                <button
                  className={`btn ${activeTab === 'apps' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setActiveTab('apps')}
                >
                  🎓 Aplikimet për Bursa
                </button>
              </div>
            </div>
          </div>
        </div>

       
        <div className="col-md-9">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              {activeTab === 'info' && (
                <>
                  <h5 className="mb-3">📄 Të Dhënat Personale</h5>
                  <div className="row mb-2"><div className="col-5 fw-semibold">Emri:</div><div className="col-7">{profile.fullName}</div></div>
                  <div className="row mb-2"><div className="col-5 fw-semibold">Email:</div><div className="col-7">{profile.email}</div></div>
                  <div className="row mb-2"><div className="col-5 fw-semibold">Shkolla:</div><div className="col-7">{profile.schoolOrUniversityName}</div></div>
                  <div className="row mb-2"><div className="col-5 fw-semibold">Drejtimi:</div><div className="col-7">{profile.studyField}</div></div>
                  <div className="row"><div className="col-5 fw-semibold">Niveli:</div><div className="col-7">{profile.studentLevelName}</div></div>
                </>
              )}

              {activeTab === 'apps' && (
                <>
                  <h5 className="mb-3">🎓 Aplikimet për Bursa</h5>
                  {profile.applications && profile.applications.length > 0 ? (
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Bursa</th>
                          <th>Data</th>
                          <th>Statusi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profile.applications.map(app => (
                          <tr key={app.id}>
                            <td>{app.scholarshipTitle}</td>
                            <td>{new Date(app.applicationDate).toLocaleDateString()}</td>
                            <td>
                              <span className={`badge ${
                                app.applicationStatusName === "Approved" ? "bg-success" :
                                app.applicationStatusName === "Pending" ? "bg-warning text-dark" :
                                app.applicationStatusName === "Not Approved" ? "bg-danger" : "bg-secondary"
                              }`}>
                                {app.applicationStatusName}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-muted">Nuk keni aplikime për bursa.</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;