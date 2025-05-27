import React, { useEffect, useState } from "react";
import { 
  FiUser, FiBriefcase, FiBookOpen, FiMail, FiBell, FiUsers, FiAward 
} from "react-icons/fi";
import ScholarshipsSection from "../components/ScholarshipsSection";
import ApplicationsSection from "../components/ApplicationsSection";
import AwardedStudentsSection from "../components/AwardedStudentsSection";

function ProviderDashboard() {
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
  const [_loadingApplications, setLoadingApplications] = useState(false);
  const [_loadingAwards, setLoadingAwards] = useState(false);
  const [_error, setError] = useState(null);

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
        const [categoriesRes, typesRes] = await Promise.all([
          fetch("https://localhost:7255/api/scholarshipcategory"),
          fetch("https://localhost:7255/api/scholarshiptype")
        ]);
        setCategories(await categoriesRes.json());
        setTypes(await typesRes.json());
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setError("Failed to load initial data. Please try again later.");
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
  setLoadingApplications(true);
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`https://localhost:7255/api/application/byprovider/${providerId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    
  
    const transformedData = data.map(app => ({
      ...app,
      ApplicationDocument: app.ApplicationDocument || [] 
    }));
    
    setApplications(transformedData);
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
        headers: { Authorization: `Bearer ${token}` },
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
        await fetchAwardedStudents(currentProvider.id);
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
      if (!application) throw new Error("Application not found");
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
          <ScholarshipsSection
            scholarships={scholarships}
            categories={categories}
            types={types}
            currentProvider={currentProvider}
            showForm={showForm}
            editingScholarship={editingScholarship}
            onDelete={handleDeleteScholarship}
            onToggleAvailability={toggleAvailability}
            onSubmit={handleSubmitScholarship}
            onEdit={setEditingScholarship}
            onShowForm={setShowForm}
          />
        );
      case 'applications':
        return (
          <ApplicationsSection
            applications={applications}
            scholarships={scholarships}
            selectedScholarshipId={selectedScholarshipId}
            setSelectedScholarshipId={setSelectedScholarshipId}
            onStatusChange={handleApplicationStatusChange}
          />
        );
      case 'awarded':
        return <AwardedStudentsSection awardedStudents={awardedStudents} />;
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
                  setActiveTab('applications');
                  if (currentProvider?.id) {
                    fetchApplications(currentProvider.id);
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
                  <h3 className="mb-0">{applications.filter(a => a.applicationStatusId === 1).length}</h3>
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