import React, { useEffect, useState } from "react";
import { FiUser, FiBriefcase, FiBookOpen, FiMail, FiBell, FiCalendar, FiDollarSign, FiEdit, FiTrash2, FiPlus, FiCheck, FiX } from "react-icons/fi";
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

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch('https://localhost:7255/api/provider/current', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentProvider(data);
          fetchProviderScholarships(data.id);
        }
      } catch (error) {
        console.error("Error fetching provider data:", error);
      }
    };

    const fetchTasks = async () => {
      setLoadingTasks(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch('https://localhost:7255/api/provider/tasks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch tasks');
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingTasks(false);
      }
    };

    const fetchCategoriesAndTypes = async () => {
      try {
        const [categoriesRes, typesRes] = await Promise.all([
          fetch("https://localhost:7255/api/scholarshipcategory"),
          fetch("https://localhost:7255/api/scholarshiptype")
        ]);
        
        const categoriesData = await categoriesRes.json();
        const typesData = await typesRes.json();
        
        setCategories(categoriesData);
        setTypes(typesData);
      } catch (error) {
        console.error("Error fetching categories or types:", error);
      }
    };

    fetchProviderData();
    fetchTasks();
    fetchCategoriesAndTypes();
  }, []);

  const fetchProviderScholarships = async (providerId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://localhost:7255/api/scholarship/byprovider/${providerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setScholarships(data);
    } catch (error) {
      console.error("Error fetching provider scholarships:", error);
      setError("Failed to load scholarships. Please try again later.");
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
  return (
    <div className="container-fluid g-0 min-vh-100 bg-light m-0 p-0 vw-100 overflow-x-hidden">
      <div className="row g-0">
        
        <div className="col-md-2 text-white p-3 min-vh-100" style={{ backgroundColor: '#004D7C', color: 'white' }}>
          <h4 className="text-center mb-4">Provider Panel</h4>
          <ul className="nav flex-column">
            <li className="nav-item mb-3">
              <a className="nav-link text-white active" href="#"><FiBriefcase className="me-2" />My Tasks</a>
            </li>
            <li className="nav-item mb-3">
              <a className="nav-link text-white" href="#"><FiBookOpen className="me-2" />My Scholarships</a>
            </li>
            <li className="nav-item mb-3">
              <a className="nav-link text-white" href="#"><FiMail className="me-2" />Messages</a>
            </li>
            <li className="nav-item mb-3">
              <a className="nav-link text-white" href="#"><FiCalendar className="me-2" />Schedule</a>
            </li>
            <li className="nav-item mb-3">
              <a className="nav-link text-white" href="#"><FiUser className="me-2" />Profile</a>
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
                  <h6 className="text-muted">Active Tasks</h6>
                  <h3 className="mb-0">{tasks.length}</h3>
                </div>
              </div>
            </div>
          </div>

          
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
        </div>
      </div>
    </div>
  );
}

export default ProviderDashboard;