import React, { useState } from "react";
import { PlusCircle, XCircle, CheckCircle, TrashFill, PencilFill, PencilSquare } from "react-bootstrap-icons";

function StudentManager({
  students,
  setStudents,
  newStudent,
  setNewStudent,
  showAddStudentForm,
  setShowAddStudentForm,
  handleAddStudent,
  deleteStudent,
}) {

  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editStudentData, setEditStudentData] = useState({
    fullName:"",
    email:"",
    schoolOrUniversityName: "",
    studyField: "",
    studentLevelId: 1
  });

  const startEdit = (student) => {
    setEditingStudentId(student.id);
    setEditStudentData({
      fullName:student.fullName || "",
      email:student.email || "",
      schoolOrUniversityName: student.schoolOrUniversityName,
      studyField: student.studyField,
      studentLevelId: student.studentLevelId
    });
  };

  const cancelEdit = () => {
    setEditingStudentId(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditStudentData(prev => ({ ...prev, [name]: value }));
  };

const saveEdit = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`https://localhost:7255/api/student/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editStudentData),
    });

    if (!res.ok) throw new Error("Failed to update student");

    
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === id ? { ...student, ...editStudentData } : student
      )
    );

    alert("Student updated successfully!");
    setEditingStudentId(null);
  } catch (error) {
    console.error("Error updating student:", error);
    alert(`Error: ${error.message}`);
  }
};



  return (
    <div className="card shadow-lg rounded-4 border border-primary mb-4" style={{ marginTop: '100px' }}>
      <div className="card-header bg-primary text-white d-flex align-items-center justify-content-between rounded-top-4">
        <div className="d-flex align-items-center">
          <h5 className="mb-0">Manage Students</h5>
        </div>
        <button
          className={`btn btn-${showAddStudentForm ? "outline-danger" : "light"} d-flex align-items-center`}
          onClick={() => setShowAddStudentForm(!showAddStudentForm)}
        >
          {showAddStudentForm ? (
            <>
              <XCircle className="me-2" />
              Cancel
            </>
          ) : (
            <>
              <PlusCircle className="me-2" />
              Add Student
            </>
          )}
        </button>
      </div>

      {showAddStudentForm && (
        <div className="card mb-5 shadow-lg rounded-3 border border-primary">
          <div className="card-body">
            <h5 className="card-title mb-4 text-primary fw-semibold">Add New Student</h5>
            <form onSubmit={handleAddStudent}>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="fullName"
                      placeholder="Full Name"
                      value={newStudent.fullName}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, fullName: e.target.value })
                      }
                      required
                    />
                    <label htmlFor="fullName">Full Name</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Email"
                      value={newStudent.email}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, email: e.target.value })
                      }
                      required
                    />
                    <label htmlFor="email">Email</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="schoolOrUniversityName"
                      placeholder="School or University"
                      value={newStudent.schoolOrUniversityName}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, schoolOrUniversityName: e.target.value })
                      }
                    />
                    <label htmlFor="schoolOrUniversityName">School or University Name</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="studyField"
                      placeholder="Field of Study"
                      value={newStudent.studyField}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, studyField: e.target.value })
                      }
                    />
                    <label htmlFor="studyField">Field of Study</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Password"
                      value={newStudent.password}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, password: e.target.value })
                      }
                      required
                    />
                    <label htmlFor="password">Password</label>
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-success mt-4 d-flex align-items-center">
                <CheckCircle className="me-2" />
                Add Student
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="card shadow-lg rounded-3 border border-primary">
        <div className="card-body">
          <h5 className="card-title mb-4 text-primary fw-semibold">Student List</h5>
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead className="table-primary">
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>School/University</th>
                  <th>Field of Study</th>
                  <th style={{ width: "150px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>

                    
                    {editingStudentId === student.id ? (
                      <>
                      <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            name="fullName"
                            value={editStudentData.fullName}
                            onChange={handleEditChange}
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="email"
                            className="form-control form-control-sm"
                            name="email"
                            value={editStudentData.email}
                            onChange={handleEditChange}
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            name="schoolOrUniversityName"
                            value={editStudentData.schoolOrUniversityName}
                            onChange={handleEditChange}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            name="studyField"
                            value={editStudentData.studyField}
                            onChange={handleEditChange}
                          />
                        </td>
                      </>
                    ) : (
                      <>
                      <td>{student.fullName}</td>
                        <td>{student.email}</td>
                        <td>{student.schoolOrUniversityName || "N/A"}</td>
                        <td>{student.studyField || "N/A"}</td>
                      </>
                    )}
                    
                    <td>
                      {editingStudentId === student.id ? (
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => saveEdit(student.id)}
                          >
                            <CheckCircle />
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={cancelEdit}
                          >
                            <XCircle />
                          </button>
                        </div>
                      ) : (
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-outline-warning btn-sm me-2"
                            onClick={() => startEdit(student)}
                            title="Edit Student"
                          >
                            <PencilSquare />
                          </button>

                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => deleteStudent(student.id)}
                            title="Delete Student"
                          >
                            <TrashFill />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentManager;