import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function ScholarshipApply() {
  const { id: scholarshipId } = useParams();
  const navigate = useNavigate();
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!scholarshipId) {
      setError('No scholarship ID provided');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`https://localhost:7255/api/scholarship/${scholarshipId}`);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch scholarship (Status: ${res.status})`);
        }
        
        const data = await res.json();
        setScholarship(data);
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to load scholarship details');
        navigate('/scholarships');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [scholarshipId, navigate]);

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

  const validateForm = () => {
    if (!formData.gpa || isNaN(formData.gpa)) {
      setError('Ju lutem shkruani një GPA të vlefshme');
      return false;
    }

    if (!formData.studyYear) {
      setError('Ju lutem shkruani vitin tuaj të studimeve');
      return false;
    }

    if (!formData.studyField) {
      setError('Ju lutem shkruani fushën tuaj të studimeve');
      return false;
    }

    if (!files.motivationLetter || !files.cv) {
      setError("Letra e motivimit dhe CV janë të detyrueshme");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    const token = localStorage.getItem('token');
    const studentId = localStorage.getItem("studentId");

    if (!studentId || isNaN(parseInt(studentId))) {
      setError("Nuk u gjet studenti. Ju lutem hyni në llogari.");
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
      navigate('/scholarships');
  
    
      
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
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || 'Gabim gjatë dorëzimit të aplikimit');
    }
  };

  if (!scholarshipId) {
    return <div className="alert alert-danger">Nuk është zgjedhur bursa</div>;
  }

  if (isLoading) {
    return <div className="d-flex justify-content-center">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!scholarship) {
    return <div className="alert alert-warning">Detajet e bursës nuk janë të disponueshme</div>;
  }

  return (
<div className="container mt-5 vw-100 overflow-x-hidden">

  <div className="mt-5">
    <h2>Apliko për: {scholarship.title}</h2>
    <p>{scholarship.description}</p>
  </div>


      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data  m-0 p-0 vw-100 overflow-x-hidden">
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
            min="0"
            max="10"
            className="form-control"
            name="gpa"
            value={formData.gpa}
            onChange={handleInputChange}
            required
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
            required
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
            required
          />
        </div>

        <button className="btn btn-primary" type="submit">Apliko</button>
      </form>
    </div>
  );
}

export default ScholarshipApply;