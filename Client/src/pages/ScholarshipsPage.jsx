import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { FiEdit, FiTrash2 } from "react-icons/fi";

function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    applyLink: "",
    isAvailable: true,
    scholarshipCategoryId: "",
    scholarshipTypeId: ""
  });

  const role = localStorage.getItem("role"); 


  useEffect(() => {
    fetchScholarships();
    fetchCategories();
    fetchTypes();
  }, []);

  async function fetchScholarships() {
    try {
      const res = await fetch("https://localhost:7255/api/scholarship");
      const data = await res.json();
      setScholarships(data);
    } catch (error) {
      console.error("Error fetching scholarships:", error);
      setError("Failed to load scholarships");
    }
  }

  async function fetchCategories() {
    try {
      const res = await fetch("https://localhost:7255/api/scholarshipcategory");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  async function fetchTypes() {
    try {
      const res = await fetch("https://localhost:7255/api/scholarshiptype");
      const data = await res.json();
      setTypes(data);
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    if (!formData.title || !formData.description || !formData.applyLink || 
        !formData.scholarshipCategoryId || !formData.scholarshipTypeId) {
      setError("Please fill all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const url = editingId 
        ? `https://localhost:7255/api/scholarship/${editingId}`
        : "https://localhost:7255/api/scholarship";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          scholarshipCategoryId: parseInt(formData.scholarshipCategoryId),
          scholarshipTypeId: parseInt(formData.scholarshipTypeId),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save scholarship");
      }

      fetchScholarships();
      resetForm();
    } catch (error) {
      console.error("Error saving scholarship:", error);
      setError(error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      applyLink: "",
      isAvailable: true,
      scholarshipCategoryId: "",
      scholarshipTypeId: ""
    });
    setEditingId(null);
    setShowModal(false);
    setError(null);
  };

  const handleEdit = (scholarship) => {
    setFormData({
      title: scholarship.title,
      description: scholarship.description,
      applyLink: scholarship.applyLink,
      isAvailable: scholarship.isAvailable,
      scholarshipCategoryId: scholarship.scholarshipCategoryId.toString(),
      scholarshipTypeId: scholarship.scholarshipTypeId.toString()
    });
    setEditingId(scholarship.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scholarship?")) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://localhost:7255/api/scholarship/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete scholarship");
      }

      fetchScholarships();
    } catch (error) {
      console.error("Error deleting scholarship:", error);
      setError(error.message);
    }
  };

  const getCategoryName = (id) => {
    const category = categories.find(c => c.id === id);
    return category ? category.name : "N/A";
  };

  const getTypeName = (id) => {
    const type = types.find(t => t.id === id);
    return type ? type.name : "N/A";
  };

 
  const filteredScholarships = filter === "all"
    ? scholarships
    : scholarships.filter(s => s.scholarshipCategoryId.toString() === filter.toString());

  return (
    <div className="container mt-5 m-0 p-0 vw-100 overflow-x-hidden">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Scholarships</h2>
        {(role === "admin" || role === "provider") && (
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + Add Scholarship
          </Button>
        )}
      </div>


      <div className="mb-4">
        <Form.Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ maxWidth: "300px" }}
        >
          <option value="all">All Scholarships</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </Form.Select>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

      {/* Scholarships list */}
      <div className="row">
        {filteredScholarships.length === 0 ? (
          <p>No scholarships available yet.</p>
        ) : (
          filteredScholarships.map((scholarship) => (
            <div className="col-md-6 col-lg-4 mb-4" key={scholarship.id}>
              <div className="card shadow h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <h5 className="card-title text-primary">{scholarship.title}</h5>
                    {(role === "admin" || role === "provider") && (
                      <div>
                        <Button 
                          variant="link" 
                          size="sm" 
                          onClick={() => handleEdit(scholarship)}
                          className="text-primary p-0 me-2"
                        >
                          <FiEdit />
                        </Button>
                        <Button 
                          variant="link" 
                          size="sm" 
                          onClick={() => handleDelete(scholarship.id)}
                          className="text-danger p-0"
                        >
                          <FiTrash2 />
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="card-text">{scholarship.description}</p>
                  <p>
                    <strong>Category:</strong> {getCategoryName(scholarship.scholarshipCategoryId)}
                  </p>
                  <p>
                    <strong>Type:</strong> {getTypeName(scholarship.scholarshipTypeId)}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`badge bg-${scholarship.isAvailable ? "success" : "secondary"}`}>
                      {scholarship.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </p>
                  <a
                    href={scholarship.applyLink}
                    className="btn btn-sm btn-outline-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {(role === "admin" || role === "provider") && (
        <Modal
          show={showModal}
          onHide={resetForm}
          centered
          scrollable
        >
          <Modal.Header closeButton>
            <Modal.Title>{editingId ? "Edit Scholarship" : "Add New Scholarship"}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="pt-4">
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="title" className="mb-3">
                <Form.Label>Title *</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="description" className="mb-3">
                <Form.Label>Description *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="applyLink" className="mb-3">
                <Form.Label>Application Link *</Form.Label>
                <Form.Control
                  type="url"
                  name="applyLink"
                  value={formData.applyLink}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="scholarshipCategoryId" className="mb-3">
                <Form.Label>Category *</Form.Label>
                <Form.Select
                  name="scholarshipCategoryId"
                  value={formData.scholarshipCategoryId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="scholarshipTypeId" className="mb-3">
                <Form.Label>Type *</Form.Label>
                <Form.Select
                  name="scholarshipTypeId"
                  value={formData.scholarshipTypeId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Type</option>
                  {types.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="isAvailable" className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Available"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingId ? "Update" : "Save"}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default ScholarshipsPage;