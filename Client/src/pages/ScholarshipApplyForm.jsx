import React, { useEffect, useState } from 'react';

function ScholarshipApply({ scholarshipId }) {
  const [scholarship, setScholarship] = useState(null);
  const [formData, setFormData] = useState({
    gpa: '',
    studyYear: '',
    studyField: '',
  });
  const [files, setFiles] = useState({
    motivationLetter: null,
    cv: null,
    portfolio: null
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`https://localhost:7255/api/scholarship/${scholarshipId}`);
      const data = await res.json();
      setScholarship(data);
    };
    fetchData();
  }, [scholarshipId]);

  const handleFileChange = (e) => {
    setFiles({
      ...files,
      [e.target.name]: e.target.files[0]
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const studentId = localStorage.getItem("studentId");

    if (!studentId || isNaN(parseInt(studentId))) {
      alert("Nuk u gjet studenti. Ju lutem hyni në llogari.");
      return;
    }

 
    if (!files.motivationLetter || !files.cv) {
      setError("Letra e motivimit dhe CV janë të detyrueshme");
      return;
    }

    try {
      const formPayload = new FormData();
      formPayload.append('StudentId', studentId);
      formPayload.append('ScholarshipId', scholarshipId);
      formPayload.append('ApplicationStatusId', 1); 
      formPayload.append('Gpa', formData.gpa);
      formPayload.append('StudyYear', formData.studyYear);
      formPayload.append('StudyField', formData.studyField);
      
     
      formPayload.append('MotivationLetterFile', files.motivationLetter);
      formPayload.append('CvFile', files.cv);
      if (files.portfolio) {
        formPayload.append('PortfolioFile', files.portfolio);
      }

      const response = await fetch('https://localhost:7255/api/application', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formPayload
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gabim gjatë dorëzimit të aplikimit');
      }

      alert('Aplikimi u dorëzua me sukses!');
  
      setFormData({
        gpa: '',
        studyYear: '',
        studyField: ''
      });
      setFiles({
        motivationLetter: null,
        cv: null,
        portfolio: null
      });
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Gabim gjatë dorëzimit të aplikimit');
    }
  };

  if (!scholarship) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2>Apliko për: {scholarship.title}</h2>
      <p>{scholarship.description}</p>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Letra e motivimit (e detyrueshme):</label>
          <input
            type="file"
            className="form-control"
            name="motivationLetter"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            required
          />
          <small className="text-muted">Formate të pranuara: PDF, Word</small>
        </div>

        <div className="mb-3">
          <label className="form-label">CV (e detyrueshme):</label>
          <input
            type="file"
            className="form-control"
            name="cv"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            required
          />
          <small className="text-muted">Formate të pranuara: PDF, Word</small>
        </div>

        <div className="mb-3">
          <label className="form-label">Portfolio (opsionale):</label>
          <input
            type="file"
            className="form-control"
            name="portfolio"
            onChange={handleFileChange}
            accept=".pdf,.zip,.rar"
          />
          <small className="text-muted">Formate të pranuara: PDF, ZIP, RAR</small>
        </div>

        <div className="mb-3">
          <label className="form-label">Nota mesatare (GPA):</label>
          <input
            type="number"
            step="0.1"
            className="form-control"
            name="gpa"
            value={formData.gpa}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Viti i studimeve:</label>
          <input
            type="text"
            className="form-control"
            name="studyYear"
            placeholder="p.sh. Viti i dytë Bachelor"
            value={formData.studyYear}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Fusha e studimeve:</label>
          <input
            type="text"
            className="form-control"
            name="studyField"
            placeholder="p.sh. Inxhinieri Kompjuterike"
            value={formData.studyField}
            onChange={handleInputChange}
          />
        </div>

        <button className="btn btn-primary" type="submit">Apliko</button>
      </form>
    </div>
  );
}

export default ScholarshipApply;