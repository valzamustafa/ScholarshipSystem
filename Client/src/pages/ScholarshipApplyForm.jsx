import React, { useEffect, useState } from 'react';

function ScholarshipApply({ scholarshipId }) {
  const [scholarship, setScholarship] = useState(null);
  const [formData, setFormData] = useState({
    motivation: '',
    document: '',
    gpa: '',
    studyYear: '',
    studyField: '',
    portfolio: '',
    cvLink: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`https://localhost:7255/api/scholarship/${scholarshipId}`);
      const data = await res.json();
      setScholarship(data);
    };
    fetchData();
  }, [scholarshipId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
 const studentId = localStorage.getItem("studentId");

if (!studentId || isNaN(parseInt(studentId))) {
  alert("Nuk u gjet studenti. Ju lutem hyni në llogari.");
  return;
}
    const applicationData = {
  scholarshipId,
  studentId: parseInt(studentId), 
  applicationStatusId: 1,
  motivationLetter: formData.motivation,
  applicationDocument: [formData.document],
  gpa: formData.gpa,
  studyYear: formData.studyYear,
  studyField: formData.studyField,
  portfolio: formData.portfolio,
  cvLink: formData.cvLink
};



    await fetch('https://localhost:7255/api/application', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(applicationData),
    });

    alert('Aplikimi u dorëzua me sukses!');
  };

  if (!scholarship) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2>Apliko për: {scholarship.title}</h2>
      <p>{scholarship.description}</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Letra e motivimit:</label>
          <textarea
            className="form-control"
            value={formData.motivation}
            onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label>Dokumenti (link ose emër dokumenti):</label>
          <input
            type="text"
            className="form-control"
            value={formData.document}
            onChange={(e) => setFormData({ ...formData, document: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label>Nota mesatare (GPA):</label>
          <input
            type="number"
            step="0.1"
            className="form-control"
            value={formData.gpa}
            onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label>Viti i studimeve:</label>
          <input
            type="text"
            className="form-control"
            placeholder="p.sh. Viti i dytë Bachelor"
            value={formData.studyYear}
            onChange={(e) => setFormData({ ...formData, studyYear: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label>Fusha e studimeve:</label>
          <input
            type="text"
            className="form-control"
            placeholder="p.sh. Inxhinieri Kompjuterike"
            value={formData.studyField}
            onChange={(e) => setFormData({ ...formData, studyField: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label>Link për portofol (nëse ka):</label>
          <input
            type="url"
            className="form-control"
            placeholder="https://portfolio.example.com"
            value={formData.portfolio}
            onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label>Link për CV (nëse ka):</label>
          <input
            type="url"
            className="form-control"
            placeholder="https://cv.example.com"
            value={formData.cvLink}
            onChange={(e) => setFormData({ ...formData, cvLink: e.target.value })}
          />
        </div>

        <button className="btn btn-primary" type="submit">Apliko</button>
      </form>
    </div>
  );
}

export default ScholarshipApply;
