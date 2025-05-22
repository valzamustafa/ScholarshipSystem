import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiPlus, FiCheck, FiX } from "react-icons/fi";
import ScholarshipForm from "./ScholarshipForm";

function ScholarshipManager({ scholarships, setScholarships, isAdmin = false }) {
  const [showForm, setShowForm] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState(null);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    
    fetch("https://localhost:7255/api/scholarshipcategory")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(console.error);

    fetch("https://localhost:7255/api/scholarshiptype")
      .then(res => res.json())
      .then(data => setTypes(data))
      .catch(console.error);

    if (isAdmin) {
      fetch("https://localhost:7255/api/provider")
        .then(res => res.json())
        .then(data => setProviders(data))
        .catch(console.error);
    }
  }, [isAdmin]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://localhost:7255/api/scholarship/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setScholarships(scholarships.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error("Error deleting scholarship:", error);
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://localhost:7255/api/scholarship/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...scholarships.find(s => s.id === id),
          isAvailable: !currentStatus,
        }),
      });
      if (res.ok) {
        setScholarships(
          scholarships.map(s =>
            s.id === id ? { ...s, isAvailable: !currentStatus } : s
          )
        );
      }
    } catch (error) {
      console.error("Error updating scholarship:", error);
    }
  };

  return (
    <div className="container-fluid" style={{ marginTop: "100px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>{isAdmin ? "All Scholarships" : "My Scholarships"}</h3>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingScholarship(null);
            setShowForm(true);
          }}
        >
          <FiPlus className="me-1" /> Add Scholarship
        </button>
      </div>

      {showForm && (
        <ScholarshipForm
          scholarship={editingScholarship}
          categories={categories}
          types={types}
          providers={providers}
          isAdmin={isAdmin}
          onClose={() => setShowForm(false)}
          onSubmit={(newScholarship) => {
            if (editingScholarship) {
              setScholarships(
                scholarships.map(s =>
                  s.id === newScholarship.id ? newScholarship : s
                )
              );
            } else {
              setScholarships([...scholarships, newScholarship]);
            }
            setShowForm(false);
          }}
        />
      )}

      <div className="row">
        {scholarships.map((scholarship) => (
          <div className="col-md-4 mb-4" key={scholarship.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <h5 className="card-title">{scholarship.title}</h5>
                  <span
                    className={`badge ${
                      scholarship.isAvailable ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {scholarship.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
                <p className="card-text text-muted">
                  {scholarship.description.length > 100
                    ? `${scholarship.description.substring(0, 100)}...`
                    : scholarship.description}
                </p>
                <div className="mb-2">
                  <small className="text-muted">
                    <strong>Category:</strong>{" "}
                    {scholarship.scholarshipCategory?.name || "N/A"}
                  </small>
                </div>
                <div className="mb-2">
                  <small className="text-muted">
                    <strong>Type:</strong>{" "}
                    {scholarship.scholarshipType?.name || "N/A"}
                  </small>
                </div>
                {isAdmin && (
                  <div className="mb-3">
                    <small className="text-muted">
                      <strong>Provider:</strong>{" "}
                      {scholarship.provider?.organizationName || "N/A"}
                    </small>
                  </div>
                )}
                <a
                  href={scholarship.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-primary me-2"
                >
                  Apply Link
                </a>
                <div className="mt-3 d-flex justify-content-between">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => {
                      setEditingScholarship(scholarship);
                      setShowForm(true);
                    }}
                  >
                    <FiEdit />
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger me-2"
                    onClick={() => handleDelete(scholarship.id)}
                  >
                    <FiTrash2 />
                  </button>
                  <button
                    className={`btn btn-sm ${
                      scholarship.isAvailable
                        ? "btn-outline-warning"
                        : "btn-outline-success"
                    }`}
                    onClick={() =>
                      toggleAvailability(scholarship.id, scholarship.isAvailable)
                    }
                  >
                    {scholarship.isAvailable ? <FiX /> : <FiCheck />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ScholarshipManager;