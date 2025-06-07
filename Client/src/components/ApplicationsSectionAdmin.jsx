import React, { useState } from "react";
import PropTypes from "prop-types";
import { FiCheck, FiX, FiEye, FiFileText, FiCheckCircle, FiXCircle } from "react-icons/fi";

function ApplicationsSection({
  applications = [],
  scholarships = [],
  selectedScholarshipId,
  setSelectedScholarshipId,
  onStatusChange,
  showActions = false,
  showDocuments = false,
  showStatusOnly = false,
  selectedApplicationsTab, 
}) {
  const [filterType, setFilterType] = useState("all");

  const filteredScholarships = scholarships.filter((sch) => {
    if (filterType === "admin") return sch.providerId === null;
    if (filterType === "provider") return sch.providerId !== null;
    return true;
  });

const handleDownload = (filePath, fileName) => {
 
  const encodedPath = encodeURI(filePath);
  window.open(`https://localhost:7255${encodedPath}`, '_blank');
};
 const filteredApplications = applications.filter((app) => {
    const scholarship = scholarships.find(s => s.id === app.scholarshipId);
    if (selectedApplicationsTab === 'admin') {
      return scholarship && scholarship.providerId === null;
    } else {
      return scholarship && scholarship.providerId !== null;
    }
  });

  const getStatusBadge = (statusId) => {
    switch (statusId) {
      case 1: return <span className="badge bg-warning text-dark">Pending</span>;
      case 2: return <span className="badge bg-danger">Rejected</span>;
      case 3: return <span className="badge bg-success">Approved</span>;
      default: return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className="card shadow-lg rounded-4 border border-primary mb-4" style={{ marginTop: '100px' }}>
      <div className="card-header bg-primary text-white d-flex align-items-center justify-content-between rounded-top-4">
        <h5 className="mb-0">
          {showActions ? "Applications for Admin Scholarships" : "Applications for Provider Scholarships"}
        </h5>
        <div className="d-flex gap-2 align-items-center">
          
          
        </div>
      </div>

      <div className="card-body p-3">
        {filteredApplications.length === 0 ? (
          <p className="text-center fst-italic text-muted mb-0">No applications found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead className="table-primary">
                <tr>
                  <th>Student</th>
                  <th>Scholarship</th>
                  <th>Application Date</th>
                  <th>Status</th>
                  {showDocuments && <th>Documents</th>}
                  {showActions && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.studentName || "N/A"}</td>
                    <td>{app.scholarshipTitle || "N/A"}</td>
                    <td>{formatDate(app.applicationDate)}</td>
                    <td>{getStatusBadge(app.applicationStatusId)}</td>
                   
                   {showDocuments && (
  <td>
    {app.ApplicationDocument?.length > 0 || app.applicationDocument?.length > 0 ? (
      <div className="dropdown">
        <button
          className="btn btn-sm btn-outline-primary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
        >
          <FiFileText /> View ({(app.ApplicationDocument || app.applicationDocument).length})
        </button>
        <ul className="dropdown-menu">
          {(app.ApplicationDocument || app.applicationDocument).map((doc, index) => (
            <li key={index}>
              <a
                className="dropdown-item"
                href={`https://localhost:7255${doc.filePath}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {doc.fileName}
              </a>
            </li>
          ))}
        </ul>
      </div>
    ) : (
      "No documents"
    )}
  </td>
)}                    {showActions && (
                      <td>
                        <div className="d-flex gap-2">
                          {app.applicationStatusId !== 3 && (
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => onStatusChange(app.id, 3)}
                              disabled={app.applicationStatusId === 3}
                            >
                              <FiCheckCircle /> Approve
                            </button>
                          )}
                          {app.applicationStatusId !== 2 && (
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => onStatusChange(app.id, 2)}
                              disabled={app.applicationStatusId === 2}
                            >
                              <FiXCircle /> Decline
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

ApplicationsSection.propTypes = {
  applications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      studentName: PropTypes.string,
      scholarshipTitle: PropTypes.string,
      applicationDate: PropTypes.string,
      applicationStatusId: PropTypes.number,
      ApplicationDocument: PropTypes.array,
    })
  ),
  scholarships: PropTypes.array,
  selectedScholarshipId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  setSelectedScholarshipId: PropTypes.func,
  onStatusChange: PropTypes.func,
  showActions: PropTypes.bool,
  showDocuments: PropTypes.bool,
  showStatusOnly: PropTypes.bool,
};

export default ApplicationsSection;