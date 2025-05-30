import React, { useState } from "react";
import PropTypes from "prop-types";
import { FiCheck, FiX, FiEye } from "react-icons/fi";

function ApplicationsSection({
  applications = [],
  scholarships = [],
  selectedScholarshipId,
  setSelectedScholarshipId,
  onStatusChange,
  showActions = false,
  showDocuments = false,
 
}) {

  const [filterType, setFilterType] = useState("all"); 


  const filteredScholarships = scholarships.filter((sch) => {
    if (filterType === "admin") return sch.providerId === null;
    if (filterType === "provider") return sch.providerId !== null;
    return true;
  });


  const filteredApplications = applications.filter((app) => {
    const scholarship = scholarships.find((sch) => sch.Id === app.ScholarshipId);
    if (!scholarship) return false;

    if (filterType === "admin" && scholarship.providerId !== null) return false;
    if (filterType === "provider" && scholarship.providerId === null) return false;

    if (selectedScholarshipId && app.ScholarshipId !== selectedScholarshipId) return false;

    return true;
  });
  

  const getApplicationDisplayData = (app) => ({
    Id: app.id,
    StudentName: app.studentName || "Unknown Student",
    SchoolOrUniversityName: app.schoolOrUniversityName || "Unknown",
    StudyField: app.studyField || "Unknown",
    StudentLevelName: app.studentLevelName || "Unknown",
    ScholarshipTitle: app.scholarshipTitle || "Unknown Scholarship",
    ProviderName: app.providerName || "Unknown Provider",
    ApplicationDate: app.applicationDate || "Unknown Date",
    ApplicationStatusId: app.applicationStatusId || 0,
    ApplicationDocument: app.applicationDocument || [],
  });


  const getStatusBadge = (statusId) => {
    switch (statusId) {
      case 1:
        return <span className="badge bg-warning text-dark fw-semibold">Pending</span>;
      case 2:
        return <span className="badge bg-success fw-semibold">Approved</span>;
      case 3:
        return <span className="badge bg-danger fw-semibold">Rejected</span>;
      default:
        return <span className="badge bg-secondary fw-semibold">Unknown</span>;
    }
  };

  const _formatDocuments = (docs) => {
    if (!docs) return "No documents";
    if (Array.isArray(docs)) {
      return docs
        .map((doc) => (typeof doc === "string" ? doc : doc.name || "Document"))
        .join(", ");
    }
    return typeof docs === "string" ? docs : "No documents";
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div
      className="card shadow-sm rounded-4 border border-primary"
      style={{ marginTop: "100px" }}
    >
      <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white rounded-top-4">
        <h5 className="mb-0">
          {showActions
            ? "Applications for Admin Scholarships"
            : "Applications for Providers' Scholarships"}
        </h5>

        {showActions && (
          <div className="d-flex gap-2 align-items-center">
            <select
              className="form-select w-auto"
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setSelectedScholarshipId(null);
              }}
              aria-label="Filter by scholarship type"
            >
              <option value="all">All Scholarships</option>
              <option value="admin">Admin Scholarships</option>
              <option value="provider">Provider Scholarships</option>
            </select>

            <select
              className="form-select w-auto"
              value={selectedScholarshipId || ""}
              onChange={(e) =>
                setSelectedScholarshipId(
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              aria-label="Select Scholarship"
            >
              <option value="">All Scholarships</option>
              {filteredScholarships.map((scholarship) => (
                <option key={scholarship.Id} value={scholarship.Id}>
                  {scholarship.Title}
                  {scholarship.providerName ? ` – ${scholarship.providerName}` : ""}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="card-body p-3">
        {filteredApplications.length === 0 ? (
          <p className="text-center fst-italic text-muted mb-0">
            No applications found.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead className="table-primary">
                <tr>
                  <th>Student</th>
                  <th>School/University</th>
                  <th>Study Field</th>
                  <th>Level</th>
                  <th>Scholarship</th>
                  <th>Provider</th>
                  <th>Application Date</th>
                  <th>Status</th>
                  {showActions && <th style={{ width: "110px" }}>Actions</th>}
                  {showDocuments && <th style={{ width: "90px" }}>Details</th>}
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => {
                  const displayData = getApplicationDisplayData(app);
                  return (
                    <tr key={displayData.Id}>
                      <td>{displayData.StudentName}</td>
                      <td>{displayData.SchoolOrUniversityName}</td>
                      <td>{displayData.StudyField}</td>
                      <td>{displayData.StudentLevelName}</td>
                      <td>{displayData.ScholarshipTitle}</td>
                      <td>{displayData.ProviderName}</td>
                      <td>{formatDate(displayData.ApplicationDate)}</td>
                      <td>{getStatusBadge(displayData.ApplicationStatusId)}</td>

                      {showActions && (
                        <td>
                          <div className="btn-group" role="group">
                            <button
                              className="btn btn-sm btn-success d-flex align-items-center justify-content-center"
                              onClick={() => onStatusChange(app.Id, 2)}
                              disabled={app.ApplicationStatusId === 2}
                              aria-label="Approve application"
                              title="Approve"
                            >
                              <FiCheck size={18} />
                            </button>
                            <button
                              className="btn btn-sm btn-danger d-flex align-items-center justify-content-center"
                              onClick={() => onStatusChange(app.Id, 3)}
                              disabled={app.ApplicationStatusId === 3}
                              aria-label="Reject application"
                              title="Reject"
                            >
                              <FiX size={18} />
                            </button>
                          </div>
                        </td>
                      )}

                    {showDocuments && (
  <td>
    <button
      className="btn btn-sm btn-primary"
      onClick={() =>
        alert(
          `Documents:\n${displayData.applicationDocument
            ?.map((d, i) => `${i + 1}. ${d.fileName} (${d.filePath})`)
            .join("\n") || "No documents"}`
        )
      }
      title="View Documents"
    >
      <FiEye size={18} />
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
      applicationDocument: PropTypes.array,
      ScholarshipId: PropTypes.number,
      ApplicationStatusId: PropTypes.number,
      providerId: PropTypes.number, 
    })
  ),

  scholarships: PropTypes.array,
  selectedScholarshipId: PropTypes.number,
  setSelectedScholarshipId: PropTypes.func,
  onStatusChange: PropTypes.func,
  showActions: PropTypes.bool,
  showDocuments: PropTypes.bool,
};

export default ApplicationsSection;
