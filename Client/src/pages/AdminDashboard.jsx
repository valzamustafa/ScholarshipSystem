import React from "react";
import { FiUser, FiBriefcase, FiBookOpen, FiBarChart2, FiMail, FiBell, FiCalendar, FiDollarSign, FiTrendingUp } from "react-icons/fi";

function AdminDashboard() {
  return (
    <div className="container-fluid g-0 min-vh-100 bg-light m-0 p-0 vw-100 overflow-x-hidden">
      <div className="row g-0">
       
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

        
          <div className="row">
          
            <div className="col-md-8">
            
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="mb-0">Market Overview</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-3">
                    <span>Activity</span>
                    <span>Goal</span>
                  </div>
                
                  <div className="bg-light" style={{height: "200px"}}></div>
                </div>
              </div>

              
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Sales Analytics</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <span>M</span>
                    <span>T</span>
                    <span>W</span>
                    <span>T</span>
                    <span>F</span>
                  </div>
                  
                  <div className="bg-light mt-3" style={{height: "150px"}}></div>
                </div>
              </div>
            </div>

            
            <div className="col-md-4">
             
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="mb-0">Sales Overview</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <span>Today</span>
                    <div className="progress mt-1">
                      <div className="progress-bar" style={{width: "65%"}}></div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <span>System status</span>
                    <div className="progress mt-1">
                      <div className="progress-bar bg-success" style={{width: "85%"}}></div>
                    </div>
                  </div>
                  <div>
                    <span>OPTIMUM</span>
                    <div className="progress mt-1">
                      <div className="progress-bar bg-warning" style={{width: "45%"}}></div>
                    </div>
                  </div>
                </div>
              </div>

            
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="mb-0">Accounts</h5>
                </div>
                <div className="card-body text-center py-4">
                  <h1 className="display-4">15,893</h1>
                  <p className="text-muted">Operations</p>
                </div>
              </div>

              
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Today 22nd Jan, 2021</h5>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled">
                    <li className="mb-3">
                      <strong>Incoming Transfer</strong>
                      <div>Bitcoin</div>
                    </li>
                    <li className="mb-3">
                      <strong>Sales Report</strong>
                      <div>Ethereum</div>
                    </li>
                    <li className="mb-3">
                      <strong>Incoming Transfer</strong>
                      <div>Binance</div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;