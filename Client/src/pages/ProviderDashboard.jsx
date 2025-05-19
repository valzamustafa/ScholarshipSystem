import React, { useEffect, useState } from "react";
import { FiUser, FiBriefcase, FiBookOpen, FiMail, FiBell, FiCalendar, FiDollarSign } from "react-icons/fi";

function ProviderDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoadingTasks(true);
      setError(null);
      try {
     
        const res = await fetch('https://localhost:7255/api/provider/tasks');
        if (!res.ok) throw new Error('Failed to fetch tasks');
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="container-fluid g-0 min-vh-100 bg-light m-0 p-0 vw-100 overflow-x-hidden">
      <div className="row g-0">

       
        <div
          className="col-md-2 text-white p-3 min-vh-100"
           style={{ backgroundColor: '#004D7C', color: 'white' }}
        >
          <h4 className="text-center mb-4">Provider Panel</h4>

          <ul className="nav flex-column">
            <li className="nav-item mb-3">
              <a className="nav-link text-white active" href="#"><FiBriefcase className="me-2" />My Tasks</a>
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
            <h3>Welcome, Provider!</h3>
            <div className="d-flex align-items-center">
              <FiBell className="me-3" size={20} />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>

        
          <div className="row mb-4">
            <div className="col-md-4 mb-3">
              <div className="card border-start-primary h-100">
                <div className="card-body">
                  <h6 className="text-muted">Active Tasks</h6>
                  <h3 className="mb-0">{tasks.length}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card border-start-success h-100">
                <div className="card-body">
                  <h6 className="text-muted">Earnings This Month</h6>
                  <h3 className="mb-0">$4,200</h3>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card border-start-warning h-100">
                <div className="card-body">
                  <h6 className="text-muted">Pending Payments</h6>
                  <h3 className="mb-0">$1,150</h3>
                </div>
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
