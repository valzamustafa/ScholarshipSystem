import React from "react";

function StudentManager({
  students,
  newStudent,
  setNewStudent,
  showAddStudentForm,
  setShowAddStudentForm,
  handleAddStudent,
  deleteStudent,
}) {
  return (
    <> 
      <h3  >Manage Students</h3>
      <button
        className="btn btn-primary mb-3" 
        onClick={() => setShowAddStudentForm(!showAddStudentForm)} style={{ marginTop: "200px" }}
      >
        {showAddStudentForm ? "Cancel" : "Add Student"}
      </button>
      {showAddStudentForm && (
        <form onSubmit={handleAddStudent} className="mb-4" >
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
  );
}

export default StudentManager;
