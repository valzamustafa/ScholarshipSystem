import React from "react";
import PropTypes from "prop-types";
import { FiCheck, FiX, FiEye } from "react-icons/fi";

function ApplicationsSection({
  applications = [],
  scholarships = [],
  selectedScholarshipId,
  setSelectedScholarshipId,
  onStatusChange,
  showActions = false,
  showDocuments = false
}) {
  const filteredApplications = selectedScholarshipId
    ? applications.filter(app => app.ScholarshipId === selectedScholarshipId)
    : applications;

const getApplicationDisplayData = (app) => {
  return {
    Id: app.id,
   StudentName: app.studentName || "Unknown Student",
    SchoolOrUniversityName: app.schoolOrUniversityName || "Unknown",
    StudyField: app.studyField || "Unknown",
    StudentLevelName: app.studentLevelName || "Unknown",
    ScholarshipTitle: app.scholarshipTitle || "Unknown Scholarship",
    ProviderName: app.providerName || "Unknown Provider",
    ApplicationDate: app.applicationDate || "Unknown Date",
    ApplicationStatusId: app.applicationStatusId || 0,
    ApplicationDocument: app.applicationDocument || []
  };
};
  const getStatusBadge = (statusId) => {
    switch(statusId) {
      case 1: return <span className="badge bg-warning text-dark">Pending</span>;
      case 2: return <span className="badge bg-success">Approved</span>;
      case 3: return <span className="badge bg-danger">Rejected</span>;
      default: return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  const formatDocuments = (docs) => {
    if (!docs) return 'No documents';
    if (Array.isArray(docs)) {
      return docs.map(doc => typeof doc === 'string' ? doc : doc.name || 'Document').join(", ");
    }
    return typeof docs === 'string' ? docs : 'No documents';
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5>
          {showActions 
            ? "Applications for Admin Scholarships" 
            : "Applications for Providers' Scholarships"}
        </h5>
        {showActions && (
          <select 
            className="form-select w-auto"
            value={selectedScholarshipId || ""}
            onChange={(e) => setSelectedScholarshipId(e.target.value ? parseInt(e.target.value) : null)}
          >
            <option value="">All Scholarships</option>
            {scholarships.map(scholarship => (
              <option key={scholarship.Id} value={scholarship.Id}>
                {scholarship.Title}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="card-body">
        {filteredApplications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>School/University</th>
                  <th>Study Field</th>
                  <th>Level</th>
                  <th>Scholarship</th>
                  <th>Provider</th>
                  <th>Application Date</th>
                  <th>Status</th>
                  {showActions && <th>Actions</th>}
                  {showDocuments && <th>Details</th>}
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => {
                  const displayData = getApplicationDisplayData(app);
                  return (
                <tr key={displayData.Id}>
  <td>{displayData.StudentName ||displayData.StudentFullName }</td>
  <td>{displayData.SchoolOrUniversityName}</td>
  <td>{displayData.StudyField}</td>
  <td>{displayData.StudentLevelName}</td>
  <td>{displayData.ScholarshipTitle}</td>
  <td>{displayData.ProviderName}</td>
  <td>{formatDate(displayData.ApplicationDate)}</td>
  <td>{getStatusBadge(displayData.ApplicationStatusId)}</td>
                      {showActions && (
                        <td>
                          <div className="btn-group">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => onStatusChange(app.Id, 2)}
                              disabled={app.ApplicationStatusId === 2}
                              aria-label="Approve application"
                            >
                              <FiCheck />
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => onStatusChange(app.Id, 3)}
                              disabled={app.ApplicationStatusId === 3}
                              aria-label="Reject application"
                            >
                              <FiX />
                            </button>
                          </div>
                        </td>
                      )}
                      {showDocuments && (
                        <td>
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => {
                              alert(`Application Details:\n\nDocuments: ${formatDocuments(app.ApplicationDocument)}`);
                            }}
                            aria-label="View application details"
                          >
                            <FiEye />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
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
      schoolOrUniversityName: PropTypes.string,
      studyField: PropTypes.string,
      studentLevelName: PropTypes.string,
      scholarshipTitle: PropTypes.string,
      providerName: PropTypes.string,
      applicationDate: PropTypes.string,
      applicationStatusId: PropTypes.number,
      applicationDocument: PropTypes.array
    })
  ),
 
  scholarships: PropTypes.array,
  selectedScholarshipId: PropTypes.number,
  setSelectedScholarshipId: PropTypes.func,
  onStatusChange: PropTypes.func,
  showActions: PropTypes.bool,
  showDocuments: PropTypes.bool
};

export default ApplicationsSection;