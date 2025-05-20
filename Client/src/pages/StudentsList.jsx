import React, { useEffect, useState } from "react";
import axios from "axios";

function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newStudent, setNewStudent] = useState({
    fullName: "",
    email: "",
    schoolOrUniversityName: "",
    studyField: "",
    studentLevelId: 1,  
    roleId: 1           
  });


  const fetchStudents = () => {
    setLoading(true);
    axios
      .get("https://localhost:7255/api/admin/adminstudents")
      .then((response) => {
        setStudents(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Gabim gjatë marrjes së studentëve.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStudents();
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({
      ...prev,
      [name]: name === "studentLevelId" ? Number(value) : value
    }));
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    axios
      .post("https://localhost:7255/api/admin/adminstudents", newStudent)
      .then(() => {
        fetchStudents();
        setNewStudent({
          fullName: "",
          email: "",
          schoolOrUniversityName: "",
          studyField: "",
          studentLevelId: 1,
          roleId: 1
        });
      })
      .catch((err) => {
        console.error(err);
        alert("Gabim gjatë shtimit të studentit.");
      });
  };

 const handleDelete = (id) => {
  if (!window.confirm("A jeni i sigurt që doni të fshini këtë student?")) return;
  axios
    .delete(`https://localhost:7255/api/student/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(() => {
      fetchStudents();
    })
    .catch((err) => {
      console.error(err);
      alert("Gabim gjatë fshirjes së studentit.");
    });
};
  if (loading) return <div>Duke ngarkuar studentët...</div>;
  if (error)   return <div className="text-danger">{error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Lista e Studentëve</h2>

      <h3 className="mt-4">Shto Student të Ri</h3>
      <form onSubmit={handleAddStudent} style={{ marginBottom: "20px" }}>
        <div>
          <input
            name="fullName"
            placeholder="Emri i Plotë"
            value={newStudent.fullName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <input
            name="email"
            placeholder="Email"
            type="email"
            value={newStudent.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <input
            name="schoolOrUniversityName"
            placeholder="Shkolla / Universiteti"
            value={newStudent.schoolOrUniversityName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <input
            name="studyField"
            placeholder="Fusha e Studimit"
            value={newStudent.studyField}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>
            Niveli:
            <input
              name="studentLevelId"
              type="number"
              min="1"
              value={newStudent.studentLevelId}
              onChange={handleInputChange}
              style={{ width: "60px", marginLeft: "8px" }}
            />
          </label>
        </div>
       
        <button type="submit">Shto</button>
      </form>

      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Emri</th>
            <th>Email</th>
            <th>Shkolla</th>
            <th>Fusha</th>
            <th>Niveli</th>
            <th>Foto</th>
            <th>Veprime</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.fullName}</td>
              <td>{student.email}</td>
              <td>{student.schoolOrUniversityName}</td>
              <td>{student.studyField}</td>
              <td>{student.studentLevel?.level || "—"}</td>
              <td>
                {student.profilePictureUrl ? (
                  <img
                    src={student.profilePictureUrl}
                    alt="Foto"
                    width="50"
                    height="50"
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  "—"
                )}
              </td>
              <td>
                <button onClick={() => handleDelete(student.id)}>Fshi</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;
