import React, { useEffect, useState } from "react";
import {
  FiUser,
  FiBarChart2,
  FiBell,
  FiCalendar,
  FiUsers,
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminDashboard() {
  const [activePage, setActivePage] = useState("dashboard");

  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [providers, setProviders] = useState([]);

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch students");
      }

      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error("Fetch students error:", error);
      alert(`Error: ${error.message}`);
      if (error.message.includes("401")) {
        window.location.href = "/login";
      }
    }
  }

  async function fetchProviders() {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const res = await fetch("https://localhost:7255/api/admin/providers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch providers");
      }

      const data = await res.json();
      setProviders(data);
    } catch (error) {
      console.error("Fetch providers error:", error);
      alert(`Error: ${error.message}`);
      if (error.message.includes("401")) {
        window.location.href = "/login";
      }
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

  async function handleAddStudent(e) {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authorized");

      const studentToAdd = {
        fullName: newStudent.fullName,
        email: newStudent.email,
        schoolOrUniversityName: newStudent.schoolOrUniversityName || "Not specified",
        studyField: newStudent.studyField || "Not specified",
        studentLevelId: newStudent.studentLevelId,
        roleId: newStudent.roleId,
        password: newStudent.password,
        Role: { id: newStudent.roleId },
        StudentLevel: { id: newStudent.studentLevelId },
        isApproved: true,
        phoneNumber: "",
        passwordHash: ""
      };

      const res = await fetch("https://localhost:7255/api/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(studentToAdd),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.title || "Failed to add student");
      }

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
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        setStudents((prev) => prev.filter((s) => s.id !== id));
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete student");
      }
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
      fullName: newProvider.fullName,
      email: newProvider.email,
      organizationName: newProvider.organizationName,
      phoneNumber: newProvider.phoneNumber,
      password: newProvider.password,
      isLocal: true,
      roleId: 2 
    };

    const res = await fetch("https://localhost:7255/api/provider", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(providerToAdd),
    });


    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      throw new Error(text || "Serveri ktheu përgjigje jo-JSON");
    }

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.title || data.message || "Dështoi shtimi i providerit");
    }

   
    setProviders([...providers, data]);
   
    setNewProvider({
      fullName: "",
      email: "",
      organizationName: "",
      phoneNumber: "",
      password: "",
    });
  
    setShowAddProviderForm(false);
    
    alert("Provideri u shtua me sukses!");

  } catch (error) {
    console.error("Gabim gjatë shtimit të providerit:", error);
    alert(`Gabim: ${error.message}`);
  }
}
  async function deleteProvider(id) {
    try {
      const res = await fetch(`https://localhost:7255/api/provider/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        setProviders((prev) => prev.filter((p) => p.id !== id));
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete provider");
      }
    } catch (error) {
      console.error("Delete provider error:", error);
      alert(`Error: ${error.message}`);
    }
  }

 async function handleEditProvider(id, updatedData) {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authorized");

    const res = await fetch(`https://localhost:7255/api/provider/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id,
        ...updatedData
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.title || "Failed to update provider");
    }

    setProviders(providers.map(p => 
      p.id === id ? { ...p, ...updatedData } : p
    ));
  } catch (error) {
    console.error("Error updating provider:", error);
    alert(`Error: ${error.message}`);
  }
}

  const [editingProviderId, setEditingProviderId] = useState(null);
  const [providerEditData, setProviderEditData] = useState({});

  function startEditProvider(provider) {
    setEditingProviderId(provider.id);
    setProviderEditData({ fullName: provider.fullName, email: provider.email });
  }

  function cancelEditProvider() {
    setEditingProviderId(null);
    setProviderEditData({});
  }

  async function saveEditProvider(id) {
    await handleEditProvider(id, "fullName", providerEditData.fullName);
    await handleEditProvider(id, "email", providerEditData.email);
    setEditingProviderId(null);
    setProviderEditData({});
  }

  return (
    <div className="container-fluid g-0 min-vh-100 bg-light m-0 p-0 vw-100 overflow-x-hidden">
      <div className="row g-0">
        <div
          className="col-md-2 text-white p-3 min-vh-100"
          style={{ backgroundColor: "#004D7C" }}
        >
          <h4 className="text-center mb-4">Admin Panel</h4>
          <ul className="nav flex-column">
            <li className="nav-item mb-3">
              <button
                className={`nav-link text-white btn btn-link text-start ${
                  activePage === "dashboard" ? "fw-bold" : ""
                }`}
                onClick={() => setActivePage("dashboard")}
              >
                <FiBarChart2 className="me-2" />
                Dashboard
              </button>
            </li>
            <li className="nav-item mb-3">
              <button
                className={`nav-link text-white btn btn-link text-start ${
                  activePage === "students" ? "fw-bold" : ""
                }`}
                onClick={() => setActivePage("students")}
              >
                <FiUser className="me-2" />
                Students
              </button>
            </li>
            <li className="nav-item mb-3">
              <button
                className={`nav-link text-white btn btn-link text-start ${
                  activePage === "providers" ? "fw-bold" : ""
                }`}
                onClick={() => setActivePage("providers")}
              >
                <FiUsers className="me-2" />
                Providers
              </button>
            </li>
            <li className="nav-item mb-3">
              <button
                className={`nav-link text-white btn btn-link text-start ${
                  activePage === "reports" ? "fw-bold" : ""
                }`}
                onClick={() => setActivePage("reports")}
              >
                <FiCalendar className="me-2" />
                Reports
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
                </div>
              </div>
              {stats && (
                <div className="row mb-4">
                  {[
                    "Students",
                    "Providers",
                    "Scholarships",
                    "Applications",
                  ].map((label, i) => (
                    <div className="col-md-3" key={i}>
                      <div className="card">
                        <div className="card-body">
                          <h6>{label}</h6>
                          <h3>{Object.values(stats)[i]}</h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="card mb-4">
                <div className="card-header">
                  <h5>Overview Chart</h5>
                </div>
                <div className="card-body">
                  <Bar
                    data={{
                      labels: [
                        "Students",
                        "Providers",
                        "Scholarships",
                        "Applications",
                      ],
                      datasets: [
                        {
                          label: "Total",
                          data: [
                            stats?.totalStudents || 0,
                            stats?.totalProviders || 0,
                            stats?.totalScholarships || 0,
                            stats?.totalApplications || 0,
                          ],
                          backgroundColor: "rgba(0,77,124,0.7)",
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: "top" },
title: { display: true, text: "System Overview" },
},
}}
/>
</div>
</div>
<div className="card">
<div className="card-header">
<h5>Provider Approval Requests</h5>
</div>
<div className="card-body">
{requests.length === 0 ? (
<p>No pending requests.</p>
) : (
<table className="table table-bordered">
<thead>
<tr>
<th>Name</th>
<th>Email</th>
<th>Actions</th>
</tr>
</thead>
<tbody>
{requests.map((req) => (
<tr key={req.id}>
<td>{req.fullName}</td>
<td>{req.email}</td>
<td>
<button
className="btn btn-success me-2"
onClick={() => approveRequest(req.id)}
>
Approve
</button>
<button
className="btn btn-danger"
onClick={() => rejectRequest(req.id)}
>
Reject
</button>
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

javascript
Copy code

      {activePage === "students" && (
        <>
          <h3>Manage Students</h3>
          <button
            className="btn btn-primary mb-3"
            onClick={() => setShowAddStudentForm(!showAddStudentForm)}
          >
            {showAddStudentForm ? "Cancel" : "Add Student"}
          </button>
          {showAddStudentForm && (
            <form onSubmit={handleAddStudent} className="mb-4">
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newStudent.fullName}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, fullName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={newStudent.email}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">School or University Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newStudent.schoolOrUniversityName}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      schoolOrUniversityName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Field of Study</label>
                <input
                  type="text"
                  className="form-control"
                  value={newStudent.studyField}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, studyField: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={newStudent.password}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, password: e.target.value })
                  }
                  required
                />
              </div>
              <button type="submit" className="btn btn-success">
                Add Student
              </button>
            </form>
          )}

          <table className="table table-striped">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>School/University</th>
                <th>Field of Study</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.fullName}</td>
                  <td>{student.email}</td>
                  <td>{student.schoolOrUniversityName || "N/A"}</td>
                  <td>{student.studyField || "N/A"}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteStudent(student.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {activePage === "providers" && (
        <>
          <h3>Manage Providers</h3>
          <button
            className="btn btn-primary mb-3"
            onClick={() => setShowAddProviderForm(!showAddProviderForm)}
          >
            {showAddProviderForm ? "Cancel" : "Add Provider"}
          </button>
          {showAddProviderForm && (
            <form onSubmit={handleAddProvider} className="mb-4">
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newProvider.fullName}
                  onChange={(e) =>
                    setNewProvider({ ...newProvider, fullName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={newProvider.email}
                  onChange={(e) =>
                    setNewProvider({ ...newProvider, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Organization Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newProvider.organizationName}
                  onChange={(e) =>
                    setNewProvider({ ...newProvider, organizationName: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={newProvider.phoneNumber}
                  onChange={(e) =>
                    setNewProvider({ ...newProvider, phoneNumber: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={newProvider.password}
                  onChange={(e) =>
                    setNewProvider({ ...newProvider, password: e.target.value })
                  }
                  required
                />
              </div>
              <button type="submit" className="btn btn-success">
                Add Provider
              </button>
            </form>
          )}

          <table className="table table-striped">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Organization</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((provider) => (
                <tr key={provider.id}>
                  <td>
                    {editingProviderId === provider.id ? (
                      <input
                        type="text"
                        value={providerEditData.fullName}
                        onChange={(e) =>
                          setProviderEditData({
                            ...providerEditData,
                            fullName: e.target.value,
                          })
                        }
                      />
                    ) : (
                      provider.fullName
                    )}
                  </td>
                  <td>
                    {editingProviderId === provider.id ? (
                      <input
                        type="email"
                        value={providerEditData.email}
                        onChange={(e) =>
                          setProviderEditData({
                            ...providerEditData,
                            email: e.target.value,
                          })
                        }
                      />
                    ) : (
                      provider.email
                    )}
                  </td>
                  <td>{provider.organizationName || "N/A"}</td>
                  <td>{provider.phoneNumber || "N/A"}</td>
                  <td>
                    {editingProviderId === provider.id ? (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => saveEditProvider(provider.id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={cancelEditProvider}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => startEditProvider(provider)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteProvider(provider.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {activePage === "reports" && (
        <div>
          <h3>Reports Page</h3>
          <p>Coming soon...</p>
        </div>
      )}
    </div>
  </div>
</div>
);
}

export default AdminDashboard;