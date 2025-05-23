import React, { useEffect, useState } from "react";
import {
  FiUser,
  FiBarChart2,
  FiBell,
  FiCalendar,
  FiUsers,
  FiAward,
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

import StudentManager from "../components/StudentManager";
import ProviderManager from "../components/ProviderManager.jsx";
import ScholarshipsManagement from "../components/ScholarshipsManagement";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [providers, setProviders] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  
  const [newStudent, setNewStudent] = useState({
    fullName: "",
    email: "",
    schoolOrUniversityName: "",
    studyField: "",
    studentLevelId: 1,
    roleId: 1,
    password: "",
  });
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
  }, [activePage]);
  

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

  async function fetchStats() {
    try {
      const res = await fetch("https://localhost:7255/api/admin/statistics");
      if (!res.ok) throw new Error("Gabim gjatë marrjes së statistikave");
      const data = await res.json();
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
              <button className={`nav-link text-white btn btn-link text-start ${activePage === "providers" ? "fw-bold" : ""}`} onClick={() => setActivePage("providers")}> <FiUsers className="me-2" /> Providers </button>
            </li>
            <li className="nav-item mb-3">
              <button className={`nav-link text-white btn btn-link text-start ${activePage === "scholarships" ? "fw-bold" : ""}`} onClick={() => setActivePage("scholarships")}> <FiAward className="me-2" /> Scholarships </button>
            </li>
            <li className="nav-item mb-3">
              <button className={`nav-link text-white btn btn-link text-start ${activePage === "reports" ? "fw-bold" : ""}`} onClick={() => setActivePage("reports")}> <FiCalendar className="me-2" /> Reports </button>
            </li>
          </ul>
        </div>
        <div className="col-md-10 p-4">
          {activePage === "dashboard" && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Admin Dashboard</h3>
                <div><FiBell className="me-2" /> {new Date().toDateString()}</div>
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
                      datasets: [{
                        label: "Total",
                        data: [stats?.totalStudents || 0, stats?.totalProviders || 0, stats?.totalScholarships || 0, stats?.totalApplications || 0],
                        backgroundColor: "rgba(0,77,124,0.7)",
                      }],
                    }}
                    options={{ responsive: true, plugins: { legend: { position: "top" }, title: { display: true, text: "System Overview" } } }}
                  />
                </div>
              </div>
              <div className="card">
                <div className="card-header"><h5>Provider Approval Requests</h5></div>
                <div className="card-body">
                  {requests.length === 0 ? (<p>No pending requests.</p>) : (
                    <table className="table table-bordered">
                      <thead><tr><th>Name</th><th>Email</th><th>Actions</th></tr></thead>
                      <tbody>
                        {requests.map((req) => (
                          <tr key={req.id}>
                            <td>{req.fullName}</td>
                            <td>{req.email}</td>
                            <td>
                              <button className="btn btn-success me-2" onClick={() => approveRequest(req.id)}>Approve</button>
                              <button className="btn btn-danger" onClick={() => rejectRequest(req.id)}>Reject</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

          {activePage === "reports" && (
            <div><h3>Reports Page</h3><p>Coming soon...</p></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;