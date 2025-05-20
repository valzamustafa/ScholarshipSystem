import React, { useEffect, useState } from "react";

function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ fullName: "", email: "" });

  useEffect(() => {
    fetchStudents();
  }, []);

const fetchStudents = async () => {
  try {
    const res = await fetch("https://localhost:7255/api/admin/students", {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!res.ok) throw new Error("Failed to fetch students");
    const data = await res.json();
    setStudents(data);
  } catch (err) {
    console.error(err);
    alert("Error fetching students. Check console for details.");
  }
};
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://localhost:7255/api/students/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete student");
      setStudents(students.filter((s) => s.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://localhost:7255/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });
      if (!res.ok) throw new Error("Failed to add student");
      const createdStudent = await res.json();
      setStudents([...students, createdStudent]);
      setNewStudent({ fullName: "", email: "" });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Manage Students</h3>

      <form onSubmit={handleAddStudent} className="mb-4">
        <div className="mb-2">
          <input
            type="text"
            placeholder="Full Name"
            className="form-control"
            value={newStudent.fullName}
            onChange={(e) => setNewStudent({ ...newStudent, fullName: e.target.value })}
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="email"
            placeholder="Email"
            className="form-control"
            value={newStudent.email}
            onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Student</button>
      </form>

      <ul className="list-group">
        {students.map((student) => (
          <li key={student.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{student.fullName}</strong> - {student.email}
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(student.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminStudents;
