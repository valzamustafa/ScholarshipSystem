import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Alert, Spinner } from "react-bootstrap";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import AOS from "aos";
import "aos/dist/aos.css";

function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState({
    scholarships: false,
    categories: false,
    types: false,
    submitting: false
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    applyLink: "",
    isAvailable: true,
    scholarshipCategoryId: "",
    scholarshipTypeId: "",
    imageFile: null
  });

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchInitialData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(prev => ({ ...prev, scholarships: true, categories: true, types: true }));
      await Promise.all([fetchScholarships(), fetchCategories(), fetchTypes()]);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      setError("Failed to load initial data");
    } finally {
      setLoading(prev => ({ ...prev, scholarships: false, categories: false, types: false }));
    }
  };

  const fetchScholarships = async () => {
    try {
      const res = await fetch("https://localhost:7255/api/scholarship", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setScholarships(data);
    } catch (error) {
      console.error("Error fetching scholarships:", error);
      setError("Failed to load scholarships");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("https://localhost:7255/api/scholarshipcategory");
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTypes = async () => {
    try {
      const res = await fetch("https://localhost:7255/api/scholarshiptype");
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setTypes(data);
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const requiredFields = ['title', 'description', 'applyLink', 'scholarshipCategoryId', 'scholarshipTypeId'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      setError(`Please fill all required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      setLoading(prev => ({ ...prev, submitting: true }));

      const url = editingId
        ? `https://localhost:7255/api/scholarship/${editingId}`
        : "https://localhost:7255/api/scholarship";
      const method = editingId ? "PUT" : "POST";

      const formPayload = new FormData();
      formPayload.append("title", formData.title);
      formPayload.append("description", formData.description);
      formPayload.append("applyLink", formData.applyLink);
      formPayload.append("isAvailable", formData.isAvailable);
      formPayload.append("scholarshipCategoryId", formData.scholarshipCategoryId);
      formPayload.append("scholarshipTypeId", formData.scholarshipTypeId);
      if (formData.imageFile) {
        formPayload.append("imageFile", formData.imageFile);
      }

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formPayload
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save scholarship");
      }

      await fetchScholarships();
      resetForm();
    } catch (error) {
      console.error("Error saving scholarship:", error);
      setError(error.message);
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      applyLink: "",
      isAvailable: true,
      scholarshipCategoryId: "",
      scholarshipTypeId: "",
      imageFile: null
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
      scholarshipTypeId: scholarship.scholarshipTypeId.toString(),
      imageFile: null
    });
    setEditingId(scholarship.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scholarship?")) return;

    try {
      setLoading(prev => ({ ...prev, submitting: true }));
      const response = await fetch(`https://localhost:7255/api/scholarship/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete scholarship");
      }

      await fetchScholarships();
    } catch (error) {
      console.error("Error deleting scholarship:", error);
      setError(error.message);
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
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
    <div className="container py-5" style={{ background: '#f9fbfc' }}>
      <div className="text-center mb-5" data-aos="fade-down">
        <h2 className="fw-bold display-5 text-primary">Scholarships</h2>
        <p className="lead">Find the perfect opportunity to fund your future</p>
        {(role === "admin" || role === "provider") && (
          <Button 
            variant="primary" 
            className="rounded-pill px-4 mt-3"
            onClick={() => setShowModal(true)}
            disabled={loading.submitting}
          >
            {loading.submitting ? <Spinner animation="border" size="sm" /> : "+ Add Scholarship"}
          </Button>
        )}
      </div>

      <div className="mb-4" data-aos="fade-up">
        <Form.Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ maxWidth: "300px" }}
          className="mx-auto"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </Form.Select>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <div className="row g-4">
        {loading.scholarships ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading scholarships...</p>
          </div>
        ) : filteredScholarships.length === 0 ? (
          <p className="text-center">No scholarships available yet.</p>
        ) : (
          filteredScholarships.map((scholarship) => (
            <div className="col-md-6 col-lg-4 d-flex" key={scholarship.id} data-aos="zoom-in">
              <div className="card border-0 shadow rounded-4 w-100 transition-hover">
                {scholarship.imageUrl && (
                  <img 
                    src={scholarship.imageUrl.startsWith("http") 
                      ? scholarship.imageUrl 
                      : `https://localhost:7255${scholarship.imageUrl.replace('./', '/')}`}
                    alt={scholarship.title}
                    className="card-img-top"
                    style={{ height: "150px", objectFit: "cover" }}
                    onError={(e) => e.target.style.display = "none"}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start">
                    <h5 className="text-primary fw-bold">{scholarship.title}</h5>
                    {(role === "admin" || role === "provider") && (
                      <div>
                        <Button 
                          variant="link" 
                          size="sm" 
                          onClick={() => handleEdit(scholarship)} 
                          className="text-primary p-0 me-2"
                          disabled={loading.submitting}
                        >
                          <FiEdit />
                        </Button>
                        <Button 
                          variant="link" 
                          size="sm" 
                          onClick={() => handleDelete(scholarship.id)} 
                          className="text-danger p-0"
                          disabled={loading.submitting}
                        >
                          <FiTrash2 />
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="text-muted">{scholarship.description}</p>
                  <p><strong>Category:</strong> {getCategoryName(scholarship.scholarshipCategoryId)}</p>
                  <p><strong>Type:</strong> {getTypeName(scholarship.scholarshipTypeId)}</p>
                  <p><strong>Status:</strong> 
                    <span className={`badge bg-${scholarship.isAvailable ? "success" : "secondary"}`}>
                      {scholarship.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </p>
                  <a 
                    href={scholarship.applyLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-outline-primary rounded-pill mt-auto"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal show={showModal} onHide={resetForm} centered scrollable>
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
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
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
                  <option key={type.id} value={type.id}>{type.name}</option>
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
            <Form.Group controlId="imageFile" className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control 
                type="file"
                name="imageFile"
                accept="image/*"
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={resetForm} disabled={loading.submitting}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit} 
            disabled={loading.submitting}
          >
            {loading.submitting ? <Spinner animation="border" size="sm" /> : editingId ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ScholarshipsPage;
