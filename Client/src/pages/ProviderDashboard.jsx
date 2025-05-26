import React, { useEffect, useState } from "react";
import { 
  FiUser, FiBriefcase, FiBookOpen, FiMail, FiBell, FiCalendar, 
  FiDollarSign, FiEdit, FiTrash2, FiPlus, FiCheck, FiX,
  FiUsers, FiCheckCircle, FiXCircle, FiFileText, FiAward
} from "react-icons/fi";
import ScholarshipForm from "../components/ScholarshipForm";

function ProviderDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [error, setError] = useState(null);
  const [scholarships, setScholarships] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState(null);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [currentProvider, setCurrentProvider] = useState(null);
  const [applications, setApplications] = useState([]);
  const [awardedStudents, setAwardedStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('scholarships');
  const [selectedScholarshipId, setSelectedScholarshipId] = useState(null);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [loadingAwards, setLoadingAwards] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      const token = localStorage.getItem("token");
      
      try {
      
        const providerRes = await fetch('https://localhost:7255/api/provider/current', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (providerRes.ok) {
          const providerData = await providerRes.json();
          setCurrentProvider(providerData);
          fetchProviderScholarships(providerData.id);
        }

     
        setLoadingTasks(true);
        const tasksRes = await fetch('https://localhost:7255/api/provider/tasks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setTasks(tasksData);
        }

        
        const [categoriesRes, typesRes] = await Promise.all([
          fetch("https://localhost:7255/api/scholarshipcategory"),
          fetch("https://localhost:7255/api/scholarshiptype")
        ]);
        setCategories(await categoriesRes.json());
        setTypes(await typesRes.json());

      } catch (error) {
        console.error("Error fetching initial data:", error);
        setError("Failed to load initial data. Please try again later.");
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchInitialData();
  }, []);

  const fetchProviderScholarships = async (providerId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://localhost:7255/api/scholarship/byprovider/${providerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const data = await res.json();
      setScholarships(data);
    } catch (error) {
      console.error("Error fetching provider scholarships:", error);
      setError("Failed to load scholarships. Please try again later.");
    }
  };

 const fetchApplications = async (providerId) => {
  console.log("Fetching applications for providerId:", providerId); 
  setLoadingApplications(true);
  try {
    const token = localStorage.getItem("token");
    console.log("Using token:", token);

    const res = await fetch(`https://localhost:7255/api/application/byprovider/${providerId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log("Response status:", res.status); 
    
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
    const data = await res.json();
    console.log("Applications data received:", data); 
    setApplications(data);
  } catch (error) {
    console.error("Error fetching applications:", error);
    setError(error.message || "Failed to load applications. Please try again later.");
  } finally {
    setLoadingApplications(false);
  }
};

  const fetchAwardedStudents = async (providerId) => {
  setLoadingAwards(true);
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`https://localhost:7255/api/scholarshipaward/byprovider/${providerId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
    const data = await res.json();
    console.log("Të dhënat e API-së për awarded students:", data); 
    setAwardedStudents(data);
  } catch (error) {
    console.error("Error fetching awarded students:", error);
    setError("Failed to load awarded students. Please try again later.");
  } finally {
    setLoadingAwards(false);
  }
};

  const handleDeleteScholarship = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://localhost:7255/api/scholarship/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setScholarships(scholarships.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error("Error deleting scholarship:", error);
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://localhost:7255/api/scholarship/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...scholarships.find(s => s.id === id),
          isAvailable: !currentStatus,
        }),
      });
      if (res.ok) {
        setScholarships(
          scholarships.map(s =>
            s.id === id ? { ...s, isAvailable: !currentStatus } : s
          )
        );
      }
    } catch (error) {
      console.error("Error updating scholarship:", error);
    }
  };

  const handleSubmitScholarship = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const url = editingScholarship 
        ? `https://localhost:7255/api/scholarship/${editingScholarship.id}`
        : "https://localhost:7255/api/scholarship";
      
      const method = editingScholarship ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save scholarship");
      }

      await fetchProviderScholarships(currentProvider.id);
      setShowForm(false);
      setEditingScholarship(null);
    } catch (error) {
      console.error("Error saving scholarship:", error);
      setError(error.message || "Failed to save scholarship. Please try again.");
    }
  };

  const handleApplicationStatusChange = async (applicationId, newStatusId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`https://localhost:7255/api/application/${applicationId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ statusId: newStatusId }),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to update status");
    }

    setApplications(applications.map(app => 
      app.id === applicationId ? { ...app, applicationStatusId: newStatusId } : app
    ));
    
   if (newStatusId === 3) {
  await createScholarshipAward(applicationId);
  await fetchApplications(currentProvider.id); 
  await fetchAwardedStudents(currentProvider.id); // 
}
  } catch (error) {
    console.error("Error updating application status:", error);
    alert(`Error updating status: ${error.message}`);
  }
};

 const createScholarshipAward = async (applicationId) => {
  try {
    const token = localStorage.getItem("token");
    const application = applications.find(a => a.id === applicationId);
    
    if (!application) {
      throw new Error("Application not found");
    }

    const res = await fetch(`https://localhost:7255/api/scholarshipaward`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        scholarshipId: application.scholarshipId,
        studentId: application.studentId,
        awardDate: new Date().toISOString()
      }),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to create award");
    }
  } catch (error) {
    console.error("Error creating award:", error);
  }
};

  const renderTabContent = () => {
    switch (activeTab) {
      case 'scholarships':
        return (
          <>
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">My Scholarships</h5>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setEditingScholarship(null);
                    setShowForm(true);
                  }}
                >
                  <FiPlus className="me-1" /> Add Scholarship
                </button>
              </div>
              <div className="card-body">
                {showForm && (
                  <ScholarshipForm
                    scholarship={editingScholarship}
                    categories={categories}
                    types={types}
                    providerId={currentProvider?.id}
                    onClose={() => setShowForm(false)}
                    onSubmit={handleSubmitScholarship}
                  />
                )}

                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Application Link</th>
                        <th>Deadline</th>
                        <th>Available</th>
                        <th>Provider</th>
                        <th>Category</th>
                        <th>Type</th>
                        <th>Image</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scholarships.map((scholarship) => (
                        <tr key={scholarship.id}>
                          <td>{scholarship.title}</td>
                          <td>
                            {scholarship.description.length > 50
                              ? `${scholarship.description.substring(0, 50)}...`
                              : scholarship.description}
                          </td>
                          <td>
                            <a
                              href={scholarship.applyLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Apply Link
                            </a>
                          </td>
                          <td>
                            {scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : 'N/A'}
                          </td>
                          <td>
                            <span className={`badge ${scholarship.isAvailable ? "bg-success" : "bg-secondary"}`}>
                              {scholarship.isAvailable ? "Yes" : "No"}
                            </span>
                          </td>
                          <td>{currentProvider?.organizationName || currentProvider?.fullName || 'N/A'}</td>
                          <td>{scholarship.scholarshipCategory?.name || "N/A"}</td>
                          <td>{scholarship.scholarshipType?.name || "N/A"}</td>
                          <td>
                            {scholarship.imageFile ? (
                              <img
                                src={`https://localhost:7255/${scholarship.imageFile.replace(/^\.?\/?/, '')}`}
                                alt={scholarship.title}
                                style={{ width: "100px", height: "auto", objectFit: "cover" }}
                                className="img-thumbnail"
                              />
                            ) : (
                              "No image"
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => {
                                  setEditingScholarship({ 
                                    ...scholarship,
                                    scholarshipCategoryId: scholarship.scholarshipCategory?.id,
                                    scholarshipTypeId: scholarship.scholarshipType?.id
                                  });
                                  setShowForm(true);
                                }}
                              >
                                <FiEdit />
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteScholarship(scholarship.id)}
                              >
                                <FiTrash2 />
                              </button>
                              <button
                                className={`btn btn-sm ${
                                  scholarship.isAvailable
                                    ? "btn-outline-warning"
                                    : "btn-outline-success"
                                }`}
                                onClick={() =>
                                  toggleAvailability(scholarship.id, scholarship.isAvailable)
                                }
                              >
                                {scholarship.isAvailable ? <FiX /> : <FiCheck />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">My Active Tasks</h5>
              </div>
              <div className="card-body">
                {loadingTasks && <p>Loading tasks...</p>}
                {error && <p className="text-danger">{error}</p>}
                {!loadingTasks && tasks.length === 0 && <p>No active tasks.</p>}
                <ul className="list-group">
                  {tasks.map(task => (
                    <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{task.title}</strong> <br />
                        {task.description}
                      </div>
                      <div>
                        <span className="badge bg-primary">{task.status}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        );
      case 'applications':
        return (
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Student Applications</h5>
              <div className="form-group mb-0">
                <select 
                  className="form-select form-select-sm" 
                  value={selectedScholarshipId || ''}
                  onChange={(e) => setSelectedScholarshipId(e.target.value || null)}
                >
                  <option value="">All Scholarships</option>
                  {scholarships.map(s => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="card-body">
              {loadingApplications ? (
                <p>Loading applications...</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Scholarship</th>
                        <th>Application Date</th>
                        <th>Status</th>
                        <th>Documents</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
  {applications
    .filter(app => selectedScholarshipId ? app.scholarshipId === parseInt(selectedScholarshipId) : true)
    .map(application => (
      <tr key={application.id}>
        <td>{application.studentName || 'N/A'}</td>
        <td>{application.scholarshipTitle || 'N/A'}</td>
        <td>{new Date(application.applicationDate).toLocaleDateString()}</td>
        <td>
          <span className={`badge ${
            application.applicationStatusId === 1 ? 'bg-secondary' : 
            application.applicationStatusId === 2 ? 'bg-danger' : 
            'bg-success'
          }`}>
            {application.applicationStatusName || 'N/A'}
          </span>
        </td>
                            <td>
                              {application.applicationDocument?.length > 0 ? (
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => {
                                    
                                    console.log(application.applicationDocument);
                                  }}
                                >
                                  <FiFileText /> View ({application.applicationDocument.length})
                                </button>
                              ) : 'No documents'}
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                {application.applicationStatusId !== 3 && (
                                  <button
                                    className="btn btn-sm btn-success"
                                    onClick={() => handleApplicationStatusChange(application.id, 3)}
                                    disabled={application.applicationStatusId === 3}
                                  >
                                    <FiCheckCircle /> Approve
                                  </button>
                                )}
                                {application.applicationStatusId !== 2 && (
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleApplicationStatusChange(application.id, 2)}
                                    disabled={application.applicationStatusId === 2}
                                  >
                                    <FiXCircle /> Decline
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
      case 'awarded':
        return (
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Awarded Students</h5>
            </div>
            <div className="card-body">
              {loadingAwards ? (
                <p>Loading awarded students...</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Scholarship</th>
                        <th>Award Date</th>
                        <th>Contact Email</th>
                        <th>Contact Phone</th>
                      </tr>
                    </thead>
                 <tbody>
  {awardedStudents.length === 0 ? (
    <tr>
      <td colSpan="5" className="text-center">No awarded students found.</td>
    </tr>
  ) : (
    awardedStudents.map(award => (
      <tr key={award.id}>
        <td>{award.studentName || 'N/A'}</td>
        <td>{award.scholarshipTitle || 'N/A'}</td>
        <td>{new Date(award.awardDate).toLocaleDateString()}</td>
        <td>{award.studentEmail || 'N/A'}</td>
        <td>{award.studentPhone || 'N/A'}</td> 
      </tr>
    ))
  )}
</tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container-fluid g-0 min-vh-100 bg-light m-0 p-0 vw-100 overflow-x-hidden">
      <div className="row g-0">
        <div className="col-md-2 text-white p-3 min-vh-100" style={{ backgroundColor: '#004D7C', color: 'white' }}>
          <h4 className="text-center mb-4">Provider Panel</h4>
          <ul className="nav flex-column">
            <li className="nav-item mb-3">
              <button 
                className={`nav-link text-white btn btn-link p-0 text-start ${activeTab === 'tasks' ? 'active' : ''}`}
                onClick={() => setActiveTab('tasks')}
              >
                <FiBriefcase className="me-2" />My Tasks
              </button>
            </li>
            <li className="nav-item mb-3">
              <button 
                className={`nav-link text-white btn btn-link p-0 text-start ${activeTab === 'scholarships' ? 'active' : ''}`}
                onClick={() => setActiveTab('scholarships')}
              >
                <FiBookOpen className="me-2" />My Scholarships
              </button>
            </li>
            <li className="nav-item mb-3">
             <button 
  className={`nav-link text-white btn btn-link p-0 text-start ${activeTab === 'applications' ? 'active' : ''}`}
  onClick={() => {
    console.log("Applications tab clicked"); 
    setActiveTab('applications');
    if (currentProvider?.id) {
      console.log("Calling fetchApplications with providerId:", currentProvider.id);
      fetchApplications(currentProvider.id);
    } else {
      console.error("currentProvider.id is missing!");
    }
  }}
>
  <FiUsers className="me-2" />Applications
</button>
            </li>
            <li className="nav-item mb-3">
              <button 
                className={`nav-link text-white btn btn-link p-0 text-start ${activeTab === 'awarded' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('awarded');
                  fetchAwardedStudents(currentProvider?.id);
                }}
              >
                <FiAward className="me-2" />Awarded Students
              </button>
            </li>
            <li className="nav-item mb-3">
              <button className="nav-link text-white btn btn-link p-0 text-start">
                <FiMail className="me-2" />Messages
              </button>
            </li>
            <li className="nav-item mb-3">
              <button className="nav-link text-white btn btn-link p-0 text-start">
                <FiUser className="me-2" />Profile
              </button>
            </li>
          </ul>
        </div>

        <div className="col-md-10 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>Welcome, {currentProvider?.fullName || 'Provider'}!</h3>
            <div className="d-flex align-items-center">
              <FiBell className="me-3" size={20} />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-4 mb-3">
              <div className="card border-start-primary h-100">
                <div className="card-body">
                  <h6 className="text-muted">Active Scholarships</h6>
                  <h3 className="mb-0">{scholarships.length}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card border-start-success h-100">
                <div className="card-body">
                  <h6 className="text-muted">Available Scholarships</h6>
                  <h3 className="mb-0">{scholarships.filter(s => s.isAvailable).length}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card border-start-warning h-100">
                <div className="card-body">
                  <h6 className="text-muted">Pending Applications</h6>
                  <h3 className="mb-0">
                    {applications.filter(a => a.applicationStatusId === 1).length}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

export default ProviderDashboard;