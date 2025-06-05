import React, { useEffect, useState } from "react";
import {
  FiUser,
  FiBarChart2,
  FiBell,
  FiCalendar,
  FiUsers,
  FiAward,
  FiFileText,
  FiMail,
  FiMessageSquare,
  FiSettings,
  FiClock,
  FiInfo
} from "react-icons/fi";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import AboutUsSection from "../components/AboutUsSection.jsx";
import AboutUsManagement from "../components/AboutUsManagement.jsx";
import ApplicationsSection from "../components/ApplicationsSectionAdmin.jsx";
import StudentManager from "../components/StudentManager";
import ProviderManager from "../components/ProviderManager.jsx";
import ScholarshipsManagement from "../components/ScholarshipsManagement";
import ContactMessages from "../components/ContactMessages";
import FeedbackComponent from "../components/FeedbackComponent";
import NotificationsDropdown from "../components/NotificationsDropdown.jsx";
import NotificationsPanel from "../components/NotificationsPanel.jsx";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminDashboard() {
 

  const [activePage, setActivePage] = useState("dashboard");
  const [requests, setRequests] = useState([]);
  const [adminNotifications, setAdminNotifications] = useState([]);
const [adminUnreadCount, setAdminUnreadCount] = useState(0);


  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [contactMessage, setContactMessage] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [_loadingApplications, setLoadingApplications] = useState(false);
  const [_errorApplications, setErrorApplications] = useState(null);
  const [providers, setProviders] = useState([]);
  const [selectedApplicationsTab, setSelectedApplicationsTab] = useState('all');
  const [scholarships, setScholarships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedScholarshipId, setSelectedScholarshipId] = useState(null);
  const [newStudent, setNewStudent] = useState({
    fullName: "",
    email: "",
    schoolOrUniversityName: "",
    studyField: "",
    studentLevelId: 1,
    roleId: 1,
    password: "",
  });
     const [recentActivity, setRecentActivity] = useState([]);

 
  const [newProvider, setNewProvider] = useState({
    fullName: "",
    email: "",
    organizationName: "",
    phoneNumber: "",
    password: "",
  });
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [showAddProviderForm, setShowAddProviderForm] = useState(false);
  const [editingProviderId, setEditingProviderId] = useState(null);
  const [providerEditData, setProviderEditData] = useState({});
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackData.scholarshipId) {
        alert("Please select a scholarship");
        return;
    }

    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/feedback`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(feedbackData)
        });

        if (!response.ok) throw new Error("Failed to submit feedback");
        
        // Nëse dëshiron të tregosh një mesazh suksesi
        alert("Feedback submitted successfully!");
        onClose();
    } catch (error) {
        console.error("Error submitting feedback:", error);
        alert(`Error: ${error.message}`);
    }
};



  useEffect(() => {
    if (activePage === "dashboard") {
      fetchRequests();
      fetchStats();
    }
    if (activePage === "students") {
      fetchStudents();
      setShowAddStudentForm(false);
    }
    if (activePage === "providers") {
      fetchProviders();
      setShowAddProviderForm(false);
    }
    if (activePage === "scholarships") {
      fetchScholarships();
    }
    if (activePage === "feedback") {
      fetchFeedbacks();
    }
    if (activePage === "settings") {
      fetchAdmins();
    }
  }, [activePage]);
  useEffect(() => {
    if (activePage === "dashboard") {
      fetchRequests();
      fetchStats();
      fetchRecentActivity();
    }}, [activePage]);
  useEffect(() => {
    if (activePage === "applications") {
      fetchApplications();
      fetchScholarships();
    }
  }, [activePage]);

  useEffect(() => {
    if (activePage === "contactMessages") {
      fetchContactMessage();
    }
  }, [activePage]);
  useEffect(() => {
    const loadAdminNotifications = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("https://localhost:7255/api/notification/admin", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Failed to fetch admin notifications");
            const data = await res.json();
            setAdminNotifications(Array.isArray(data) ? data : []);
            setAdminUnreadCount(data.filter(n => !n.isRead).length);
        } catch (err) {
            console.error("Error fetching admin notifications:", err);
        }
    };

    loadAdminNotifications();
}, []);

  async function fetchAdmins() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://localhost:7255/api/admin/users/admins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch admins");
      const data = await res.json();
      setAdmins(data);
    } catch (error) {
      console.error("Fetch admins error:", error);
      alert(`Error: ${error.message}`);
    }
  }

  async function searchUsers() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://localhost:7255/api/admin/users/search?term=${searchTerm}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to search users");
      const data = await res.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search users error:", error);
      alert(`Error: ${error.message}`);
    }
  }

  async function grantAdminAccess(id) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://localhost:7255/api/admin/users/${id}/grant-admin`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to grant admin access");
      fetchAdmins();
      searchUsers();
    } catch (error) {
      console.error("Grant admin error:", error);
      alert(`Error: ${error.message}`);
    }
  }

  async function revokeAdminAccess(id) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://localhost:7255/api/admin/users/${id}/revoke-admin`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to revoke admin access");
      fetchAdmins();
    } catch (error) {
      console.error("Revoke admin error:", error);
      alert(`Error: ${error.message}`);
    }
  }

  async function fetchFeedbacks() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://localhost:7255/api/feedback", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch feedback");
      const data = await res.json();
      setFeedbacks(data);
    } catch (error) {
      console.error("Fetch feedback error:", error);
      alert(`Error: ${error.message}`);
    }
  }

  async function handleDeleteFeedback(id) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://localhost:7255/api/feedback/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete feedback");
      setFeedbacks(feedbacks.filter(f => f.id !== id));
    } catch (error) {
      console.error("Delete feedback error:", error);
      alert(`Error: ${error.message}`);
    }
  }

  async function fetchRequests() {
    try {
      const res = await fetch("https://localhost:7255/api/provider/unapproved");
      if (!res.ok) throw new Error("Gabim gjatë marrjes së kërkesave");
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error(error);
      setRequests([]);
    }
  }

  async function fetchApplications() {
    setLoadingApplications(true);
    setErrorApplications(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://localhost:7255/api/application/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch applications");
      const data = await res.json();
      setApplications(data);
    } catch (error) {
      console.error("Fetch applications error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoadingApplications(false);
    }
  }

async function fetchStats() {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch("https://localhost:7255/api/admin/statistics", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Gabim gjatë marrjes së statistikave");
    const data = await res.json();
    console.log("Stats data:", data);
    setStats(data);
  } catch (error) {
    console.error(error);
    setStats(null);
  }
}

  async function fetchStudents() {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const res = await fetch("https://localhost:7255/api/admin/students", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error("Fetch students error:", error);
      alert(`Error: ${error.message}`);
    }
  }

  async function fetchProviders() {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const res = await fetch("https://localhost:7255/api/admin/providers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch providers");
      const data = await res.json();
      setProviders(data);
    } catch (error) {
      console.error("Fetch providers error:", error);
      alert(`Error: ${error.message}`);
    }
  }

  async function fetchScholarships() {
    try {
      const token = localStorage.getItem("token");
      console.log("Token in fetchScholarships:", token);
      if (!token) throw new Error("No authentication token found");

      const res = await fetch("https://localhost:7255/api/scholarship", {
        headers: { 
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to fetch scholarships");
      }

      const data = await res.json();
      setScholarships(data);
    } catch (error) {
      console.error("Fetch scholarships error:", error);
      alert(`Error fetching scholarships: ${error.message}`);
    }
  }

  async function fetchContactMessage() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://localhost:7255/api/contact", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch contact messages");
      const data = await res.json();
      setContactMessage(data);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      alert(`Error: ${error.message}`);
    }
  }

  async function handleAddStudent(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authorized");

      const studentToAdd = {
        ...newStudent,
        Role: { id: newStudent.roleId },
        StudentLevel: { id: newStudent.studentLevelId },
        isApproved: true,
        phoneNumber: "",
        passwordHash: "",
      };

      const res = await fetch("https://localhost:7255/api/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(studentToAdd),
      });

      if (!res.ok) throw new Error("Failed to add student");
      const addedStudent = await res.json();
      setStudents([...students, addedStudent]);

      setNewStudent({
        fullName: "",
        email: "",
        schoolOrUniversityName: "",
        studyField: "",
        studentLevelId: 1,
        roleId: 1,
        password: "",
      });
      setShowAddStudentForm(false);
    } catch (error) {
      console.error("Error adding student:", error);
      alert(`Error: ${error.message}`);
    }
  }

  async function deleteStudent(id) {
    try {
      const res = await fetch(`https://localhost:7255/api/student/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) setStudents((prev) => prev.filter((s) => s.id !== id));
      else throw new Error("Failed to delete student");
    } catch (error) {
      console.error("Delete student error:", error);
      alert(`Error: ${error.message}`);
    }
  }

  async function handleAddProvider(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authorized");

      const providerToAdd = {
        ...newProvider,
        isLocal: true,
        roleId: 2,
      };

      const res = await fetch("https://localhost:7255/api/provider", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(providerToAdd),
      });

      if (!res.ok) throw new Error("Failed to add provider");
      const data = await res.json();
      setProviders([...providers, data]);

      setNewProvider({
        fullName: "",
        email: "",
        organizationName: "",
        phoneNumber: "",
        password: "",
      });
      setShowAddProviderForm(false);
    } catch (error) {
      console.error("Error adding provider:", error);
      alert(`Error: ${error.message}`);
    }
  }

  async function deleteProvider(id) {
    try {
      const res = await fetch(`https://localhost:7255/api/provider/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) setProviders((prev) => prev.filter((p) => p.id !== id));
      else throw new Error("Failed to delete provider");
    } catch (error) {
      console.error("Delete provider error:", error);
      alert(`Error: ${error.message}`);
    }
  }

  function startEditProvider(provider) {
    setEditingProviderId(provider.id);
    setProviderEditData({
      fullName: provider.fullName,
      email: provider.email,
      organizationName: provider.organizationName || "",
      phoneNumber: provider.phoneNumber || ""
    });
  }

  function cancelEditProvider() {
    setEditingProviderId(null);
    setProviderEditData({});
  }

  async function saveEditProvider(id) {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authorized");

      const res = await fetch(`https://localhost:7255/api/provider/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, ...providerEditData }),
      });

      if (!res.ok) throw new Error("Failed to update provider");
      setProviders((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...providerEditData } : p))
      );
      cancelEditProvider();
    } catch (error) {
      console.error("Error updating provider:", error);
      alert(`Error: ${error.message}`);
    }
  }

  async function approveRequest(id) {
    await fetch(`https://localhost:7255/api/provider/approve/${id}`, {
      method: "PUT",
    });
    setRequests((prev) => prev.filter((r) => r.id !== id));
  }

  async function handleToggleFeatured(id) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://localhost:7255/api/feedback/${id}/feature`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to toggle featured status");
      
      setFeedbacks(prev => prev.map(f => 
        f.id === id ? {...f, isFeatured: !f.isFeatured} : f
      ));
    } catch (error) {
      console.error("Toggle featured error:", error);
      alert(`Error: ${error.message}`);
    }
  }

    async function fetchRecentActivity() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://localhost:7255/api/admin/recent-activity", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch recent activity");
      const data = await res.json();
      setRecentActivity(data);
    } catch (error) {
      console.error("Fetch recent activity error:", error);
    }
  }

  async function rejectRequest(id) {
    await fetch(`https://localhost:7255/api/provider/${id}`, {
      method: "DELETE",
    });
    setRequests((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="container-fluid g-0 min-vh-100 bg-light m-0 p-0 vw-100 overflow-x-hidden">
      <div className="row g-0">
        <div className="col-md-2 text-white p-3 min-vh-100" style={{ backgroundColor: "#004D7C" }}>
          <h4 className="text-center mb-4">Admin Panel</h4>
          <ul className="nav flex-column">
            <li className="nav-item mb-3">
              <button className={`nav-link text-white btn btn-link text-start ${activePage === "dashboard" ? "fw-bold" : ""}`} onClick={() => setActivePage("dashboard")}> <FiBarChart2 className="me-2" /> Dashboard </button>
            </li>
            <li className="nav-item mb-3">
              <button className={`nav-link text-white btn btn-link text-start ${activePage === "students" ? "fw-bold" : ""}`} onClick={() => setActivePage("students")}> <FiUser className="me-2" /> Students </button>
            </li>
            <li className="nav-item mb-3">
              <button 
                className={`nav-link text-white btn btn-link text-start ${activePage === "applications" ? "fw-bold" : ""}`} 
                onClick={() => setActivePage("applications")}
              >
                <FiFileText className="me-2" /> Applications
              </button>
            </li>
            <li className="nav-item mb-3">
              <button className={`nav-link text-white btn btn-link text-start ${activePage === "providers" ? "fw-bold" : ""}`} onClick={() => setActivePage("providers")}> <FiUsers className="me-2" /> Providers </button>
            </li>
            <li className="nav-item mb-3">
              <button className={`nav-link text-white btn btn-link text-start ${activePage === "scholarships" ? "fw-bold" : ""}`} onClick={() => setActivePage("scholarships")}> <FiAward className="me-2" /> Scholarships </button>
            </li>
            <li className="nav-item mb-3">
              <button 
                className={`nav-link text-white btn btn-link text-start ${activePage === "feedback" ? "fw-bold" : ""}`} 
                onClick={() => setActivePage("feedback")}
              >
                <FiMessageSquare className="me-2" /> Feedback
              </button>
            </li>
            <li className="nav-item mb-3">
              <button 
                className={`nav-link text-white btn btn-link text-start ${activePage === "contactMessages" ? "fw-bold" : ""}`} 
                onClick={() => setActivePage("contactMessages")}
              >
                <FiMail className="me-2" /> Contact Messages
              </button>
            </li>
            <li className="nav-item mb-3">
  <button 
    className={`nav-link text-white btn btn-link text-start ${activePage === "aboutUs" ? "fw-bold" : ""}`} 
    onClick={() => setActivePage("aboutUs")}
  >
    <FiInfo className="me-2" /> About Us Management
  </button>
</li>
            
            <li className="nav-item mb-3">
              <button 
                className={`nav-link text-white btn btn-link text-start ${activePage === "settings" ? "fw-bold" : ""}`} 
                onClick={() => setActivePage("settings")}
              >
                <FiSettings className="me-2" /> Settings
              </button>
            </li>
          </ul>
        </div>
         <div className="col-md-10 p-4">
          {activePage === "dashboard" && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Admin Dashboard</h3>
                <div>
  <FiBell className="me-2" />
  {new Date().toDateString()}
  {adminUnreadCount > 0 && (
    <span className="badge bg-danger ms-2">{adminUnreadCount}</span>
  )}
</div>

              </div>
              {stats && (
                <div className="row mb-4">
                  {["Students", "Providers", "Scholarships", "Applications"].map((label, i) => (
                    <div className="col-md-3" key={i}>
                      <div className="card"><div className="card-body"><h6>{label}</h6><h3>{Object.values(stats)[i]}</h3></div></div>
                    </div>
                    
                  ))}
                </div>
                
              )}
         
              <div className="card mb-4">
                <div className="card-header"><h5>Overview Chart</h5></div>
                <div className="card-body">
                 <Bar
  data={{
    labels: ["Students", "Providers", "Scholarships", "Applications"],
    datasets: [
      {
        label: "Total",
        data: [
          stats?.totalStudents || 0,
          stats?.totalProviders || 0,
          stats?.totalScholarships || 0,
          stats?.totalApplications || 0
        ],
        backgroundColor: "#A78BFA",
        borderRadius: 8
      },
      {
        label: "Last Month",
        data: [
          stats?.newStudents || 0,
          stats?.newProviders || 0,
          stats?.newScholarships || 0,
          stats?.newApplications || 0
        ],
        backgroundColor: "#F9A8D4",
        borderRadius: 8
      }
    ],
  }}
  options={{
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: {
        display: true,
        text: "Overview",
        font: { size: 18 },
      },
    },
    scales: {
      y: { beginAtZero: true }
    }
  }}
/>

                </div>
              
               <div className="row mb-4">
  {stats && [
    { label: "Students", value: stats.totalStudents, monthly: stats.newStudents, color: "primary" },
    { label: "Providers", value: stats.totalProviders, monthly: stats.newProviders, color: "success" },
    { label: "Scholarships", value: stats.totalScholarships, monthly: stats.newScholarships, color: "warning" },
    { label: "Applications", value: stats.totalApplications, monthly: stats.newApplications, color: "info" }
  ].map((item, i) => (
    <div className="col-md-3 mb-4" key={i}>
      <div className={`card shadow-sm text-white bg-${item.color} bg-gradient rounded-4`}>
        <div className="card-body d-flex flex-column align-items-start">
          <span className="badge bg-light text-dark mb-2 px-3 py-2 rounded-pill">{item.label}</span>
          <h2 className="fw-bold">{item.value ?? 0}</h2>
          <small className="text-white-50">+{item.monthly ?? 0} this month</small>
        </div>
      </div>
    </div>
  ))}
</div>





                <div className="col-md-4">
                   <NotificationsPanel />
                 <div className="card h-100 shadow-sm">
  <div className="card-header bg-light d-flex align-items-center">
    <FiClock className="me-2 text-primary" />
    <h6 className="mb-0 fw-semibold">Recent Activity</h6>
  </div>
  <div className="card-body p-0">
    {recentActivity.length === 0 ? (
      <p className="p-3">No recent activity</p>
    ) : (
      <ul className="list-group list-group-flush">
        {recentActivity.map((activity, index) => (
          <li key={index} className="list-group-item">
            <div className="d-flex justify-content-between">
              <span className="fw-semibold">{activity.action}</span>
              <small className="text-muted">{new Date(activity.timestamp).toLocaleTimeString()}</small>
            </div>
            <small className="text-muted">{activity.details}</small>
          </li>
        ))}
      </ul>
    )}
  </div>
</div>

                </div>
              </div>

              
              <div className="card">
                <div className="card-header"><h5>Provider Approval Requests</h5></div>
                <div className="card-body">
                  {requests.length === 0 ? (
                    <p>No pending requests.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Organization</th>
                            <th>Request Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {requests.map((req) => (
                            <tr key={req.id}>
                              <td>{req.fullName}</td>
                              <td>{req.email}</td>
                              <td>{req.organizationName || 'N/A'}</td>
                              <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                              <td>
                                <button className="btn btn-success me-2" onClick={() => approveRequest(req.id)}>
                                  Approve
                                </button>
                                <button className="btn btn-danger" onClick={() => rejectRequest(req.id)}>
                                  Reject
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}


          {activePage === "students" && (
            <StudentManager
              students={students}
              newStudent={newStudent}
              setNewStudent={setNewStudent}
              showAddStudentForm={showAddStudentForm}
              setShowAddStudentForm={setShowAddStudentForm}
              handleAddStudent={handleAddStudent}
              deleteStudent={deleteStudent}
            />
          )}
          {activePage === "feedback" && (
            <FeedbackComponent 
              feedbacks={feedbacks}
              onDeleteFeedback={handleDeleteFeedback}
              onToggleFeatured={handleToggleFeatured}
            />
          )}
          {activePage ==="aboutUs" && <AboutUsManagement />}
          {activePage === "applications" && (
            <div>
              <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${selectedApplicationsTab === 'admin' ? 'active' : ''}`}
                    onClick={() => setSelectedApplicationsTab('admin')}
                  >
                    Admin Scholarships Applications
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${selectedApplicationsTab === 'providers' ? 'active' : ''}`}
                    onClick={() => setSelectedApplicationsTab('providers')}
                  >
                    Providers' Applications
                  </button>
                </li>
              </ul>

              {selectedApplicationsTab === 'admin' ? (
                <ApplicationsSection
                  applications={applications.filter(app => {
                    const s = scholarships.find(s => s.id === app.scholarshipId);
                    return !s?.providerId; 
                  })}
                  scholarships={scholarships.filter(s => !s.providerId)}
                  selectedScholarshipId={selectedScholarshipId}
                  setSelectedScholarshipId={setSelectedScholarshipId}
                  onStatusChange={async (applicationId, newStatusId) => {
                    try {
                      const token = localStorage.getItem("token");
                      const res = await fetch(
                        `https://localhost:7255/api/application/${applicationId}/status`,
                        {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({ statusId: newStatusId }),
                        }
                      );
                      if (!res.ok) throw new Error("Failed to update status");
                      fetchApplications();
                    } catch (error) {
                      console.error("Error updating status:", error);
                      alert(`Error: ${error.message}`);
                    }
                  }}
                  showActions={true}
                  showDocuments={true}
                />
              ) : (
                <ApplicationsSection
                  applications={applications.filter(app => {
                    const s = scholarships.find(s => s.Id === app.ScholarshipId);
                    return s && s.ProviderId !== null;
                  })}
                  scholarships={scholarships.filter(s => s.ProviderId !== null)}
                  selectedScholarshipId={selectedScholarshipId}
                  setSelectedScholarshipId={setSelectedScholarshipId}
                  showActions={false}
                  showDocuments={false}
                />
              )}
            </div>
          )}


          {activePage === "providers" && (
            <ProviderManager
              providers={providers}
              newProvider={newProvider}
              setNewProvider={setNewProvider}
              showAddProviderForm={showAddProviderForm}
              setShowAddProviderForm={setShowAddProviderForm}
              handleAddProvider={handleAddProvider}
              editingProviderId={editingProviderId}
              providerEditData={providerEditData}
              setProviderEditData={setProviderEditData}
              startEditProvider={startEditProvider}
              cancelEditProvider={cancelEditProvider}
              saveEditProvider={saveEditProvider}
              deleteProvider={deleteProvider}
            />
          )}

          {activePage === "scholarships" && (
            <ScholarshipsManagement 
              scholarships={scholarships}
              fetchScholarships={fetchScholarships}
            />
          )}

          {activePage === "contactMessages" && (
            <ContactMessages 
              messages={contactMessage} 
              fetchMessages={fetchContactMessage}
            />
          )}

          {activePage === "settings" && (
            <div>
              <h3>Admin Access Management</h3>
              
              <div className="card mb-4 mt-5" >
                <div className="card-header mt-5">
                  <h5>Grant Admin Access</h5>
                </div>
                <div className="card-body">
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search users by name or email"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={searchUsers}>
                      Search
                    </button>
                  </div>
                  
                  {searchResults.length > 0 && (
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Type</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {searchResults.map((user) => (
                            <tr key={`${user.type}-${user.id}`}>
                              <td>{user.fullName}</td>
                              <td>{user.email}</td>
                              <td>{user.type}</td>
                              <td>
                                <button 
                                  className="btn btn-success"
                                  onClick={() => grantAdminAccess(user.id)}
                                >
                                  Grant Admin
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="card">
                <div className="card-header">
                  <h5>Current Admins</h5>
                </div>
                <div className="card-body">
                  {admins.length === 0 ? (
                    <p>No admins found.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Type</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {admins.map((admin) => (
                            <tr key={`${admin.type}-${admin.id}`}>
                              <td>{admin.fullName}</td>
                              <td>{admin.email}</td>
                              <td>{admin.type}</td>
                              <td>
                                <button 
                                  className="btn btn-danger"
                                  onClick={() => revokeAdminAccess(admin.id)}
                                >
                                  Revoke Admin
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

         
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard; 