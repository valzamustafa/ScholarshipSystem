import React from "react";

function AwardedStudentsSection({ awardedStudents }) {
  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="mb-0">Awarded Students</h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Student</th>
                <th>Scholarship</th>
                <th>Award Date</th>
                <th>Contact Email</th>
                <th>Contact Phone</th>
              </tr>
            </thead>
            <tbody>
              {awardedStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No awarded students found.
                  </td>
                </tr>
              ) : (
                awardedStudents.map((award) => (
                  <tr key={award.id}>
                    <td>{award.studentName || "N/A"}</td>
                    <td>{award.scholarshipTitle || "N/A"}</td>
                    <td>{new Date(award.awardDate).toLocaleDateString()}</td>
                    <td>{award.studentEmail || "N/A"}</td>
                    <td>{award.studentPhone || "N/A"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AwardedStudentsSection;
