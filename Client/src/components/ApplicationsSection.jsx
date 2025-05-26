import React from "react";
import { FiFileText, FiCheckCircle, FiXCircle } from "react-icons/fi";

function ApplicationsSection({
  applications,
  scholarships,
  selectedScholarshipId,
  setSelectedScholarshipId,
  onStatusChange
}) {
  return (
    <div className="card mb-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Student Applications</h5>
        <div className="form-group mb-0">
          <select
            className="form-select form-select-sm"
            value={selectedScholarshipId || ''}
            onChange={(e) => setSelectedScholarshipId(e.target.value || null)}
          >
            <option value="">All Scholarships</option>
            {scholarships.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Student</th>
                <th>Scholarship</th>
                <th>Application Date</th>
                <th>Status</th>
                <th>Documents</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications
                .filter((app) =>
                  selectedScholarshipId ? app.scholarshipId === parseInt(selectedScholarshipId) : true
                )
                .map((application) => (
                  <tr key={application.id}>
                   <td>{application.studentName || 'N/A'}</td>


                    <td>{application.scholarshipTitle || 'N/A'}</td>
                    <td>{new Date(application.applicationDate).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`badge ${
                          application.applicationStatusId === 1
                            ? 'bg-secondary'
                            : application.applicationStatusId === 2
                            ? 'bg-danger'
                            : 'bg-success'
                        }`}
                      >
                        {application.applicationStatusName || 'N/A'}
                      </span>
                    </td>
                    <td>
                      {application.applicationDocument?.length > 0 ? (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            console.log(application.applicationDocument);
                          }}
                        >
                          <FiFileText /> View ({application.applicationDocument.length})
                        </button>
                      ) : (
                        'No documents'
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        {application.applicationStatusId !== 3 && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => onStatusChange(application.id, 3)}
                            disabled={application.applicationStatusId === 3}
                          >
                            <FiCheckCircle /> Approve
                          </button>
                        )}
                        {application.applicationStatusId !== 2 && (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => onStatusChange(application.id, 2)}
                            disabled={application.applicationStatusId === 2}
                          >
                            <FiXCircle /> Decline
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ApplicationsSection;