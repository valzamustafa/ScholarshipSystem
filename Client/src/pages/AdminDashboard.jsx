import React, { useEffect, useState } from "react";
import { FiUser, FiBriefcase, FiBookOpen, FiBarChart2, FiMail, FiBell, FiCalendar, FiDollarSign, FiTrendingUp } from "react-icons/fi";

function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoadingRequests(true);
      setError(null);
      try {
     
        const res = await fetch('https://localhost:7255/api/admin/provider-requests');
        if (!res.ok) throw new Error('Failed to fetch provider requests');
        const data = await res.json();
        setRequests(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingRequests(false);
      }
    };

    fetchRequests();
  }, []);

  const approveRequest = async (id) => {
    try {
      const res = await fetch(`https://localhost:7255/api/admin/provider-requests/${id}/approve`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to approve request');
      setRequests(prev => prev.filter(r => r.id !== id));
      alert('Provider approved successfully');
    } catch (err) {
      alert(err.message);
    }
  };

  const rejectRequest = async (id) => {
    try {
      const res = await fetch(`https://localhost:7255/api/admin/provider-requests/${id}/reject`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to reject request');
      setRequests(prev => prev.filter(r => r.id !== id));
      alert('Provider rejected');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container-fluid g-0 min-vh-100 bg-light m-0 p-0 vw-100 overflow-x-hidden">
      <div className="row g-0">

        {/* Sidebar */}
        <div
          className="col-md-2  text-white p-3 min-vh-100"
          style={{ backgroundColor: '#004D7C', color: 'white' }}
        >
          <h4 className="text-center mb-4">Acme</h4>

          <ul className="nav flex-column">
            <li className="nav-item mb-3">
              <a className="nav-link text-white" href="#"><FiBarChart2 className="me-2" />Home</a>
            </li>
            <li className="nav-item mb-3">
              <a className="nav-link text-white" href="#"><FiCalendar className="me-2" />Calendar</a>
            </li>
            <li className="nav-item mb-3">
              <a className="nav-link text-white" href="#"><FiTrendingUp className="me-2" />Reports</a>
            </li>
            <li className="nav-item mb-3">
              <a className="nav-link text-white active" href="#"><FiBarChart2 className="me-2" />Dashboard</a>
            </li>
            <li className="nav-item mb-3">
              <a className="nav-link text-white" href="#"><FiUser className="me-2" />Contacts</a>
            </li>
          </ul>
        </div>

      
        <div className="col-md-10 p-4">


          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>Dashboard</h3>
            <div className="d-flex align-items-center">
              <FiBell className="me-3" size={20} />
              <span>Today, 22nd Jan 2021</span>
            </div>
          </div>

      
          <div className="row mb-4">
            <div className="col-md-3 mb-3">
              <div className="card border-start-primary h-100">
                <div className="card-body">
                  <h6 className="text-muted">Number of Sales</h6>
                  <h3 className="mb-0">3,450</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card border-start-success h-100">
                <div className="card-body">
                  <h6 className="text-muted">Sales Revenue</h6>
                  <h3 className="mb-0">$35,256</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card border-start-info h-100">
                <div className="card-body">
                  <h6 className="text-muted">Average Price</h6>
                  <h3 className="mb-0">$35,256</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card border-start-warning h-100">
                <div className="card-body">
                  <h6 className="text-muted">Growth</h6>
                  <div className="d-flex align-items-center">
                    <h3 className="mb-0 me-2">15%</h3>
                    <span className="badge bg-success">+1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Pending Provider Requests</h5>
            </div>
            <div className="card-body">
              {loadingRequests && <p>Loading requests...</p>}
              {error && <p className="text-danger">{error}</p>}
              {!loadingRequests && requests.length === 0 && <p>No pending requests.</p>}
              <ul className="list-group">
                {requests.map(req => (
                  <li key={req.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{req.fullName}</strong> <br />
                      {req.email} <br />
                      {req.organizationName}
                    </div>
                    <div>
                      <button className="btn btn-success btn-sm me-2" onClick={() => approveRequest(req.id)}>Approve</button>
                      <button className="btn btn-danger btn-sm" onClick={() => rejectRequest(req.id)}>Reject</button>
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

export default AdminDashboard;
