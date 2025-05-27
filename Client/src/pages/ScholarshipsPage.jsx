import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Alert, Spinner, Badge, Card, InputGroup } from "react-bootstrap";
import { FiFilter, FiSearch, FiX, FiChevronDown, FiChevronUp, FiEdit, FiTrash2, FiCalendar, FiAward, FiPlusCircle } from "react-icons/fi";
import AOS from "aos";
import "aos/dist/aos.css";
import ScholarshipApply from './ScholarshipApplyForm';

function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
    type: "all",
    workType: "all",
    level: "all"
  });
  const [editingId, setEditingId] = useState(null);
  const [selectedScholarshipId, setSelectedScholarshipId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState({
    scholarships: false,
    categories: false,
    types: false,
    submitting: false
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    applyLink: "",
    isAvailable: true,
    deadline: "",
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearFilters = () => {
    setFilters({
      category: "all",
      status: "all",
      type: "all",
      workType: "all",
      level: "all"
    });
    setSearchTerm("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const requiredFields = ['title', 'description', 'applyLink', 'scholarshipCategoryId', 'scholarshipTypeId', 'deadline'];
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
      formPayload.append("deadline", formData.deadline);
      formPayload.append("scholarshipCategoryId", formData.scholarshipCategoryId);
      formPayload.append("scholarshipTypeId", formData.scholarshipTypeId);
      if (formData.imageFile) {
        formPayload.append("imageFile", formData.imageFile);
      }
      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
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
      imageFile: null,
      deadline: ""
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
      imageFile: null,
      deadline: scholarship.deadline ? new Date(scholarship.deadline).toISOString().split('T')[0] : ""
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
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete scholarship");
      await fetchScholarships();
    } catch (error) {
      console.error("Error deleting scholarship:", error);
      setError(error.message);
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  const getTypeName = (id) => types.find(t => t.id === id)?.name || "N/A";

  const filteredScholarships = scholarships.filter(scholarship => {
    if (searchTerm && !scholarship.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filters.category !== "all" && scholarship.scholarshipCategoryId.toString() !== filters.category) {
      return false;
    }
    if (filters.status !== "all") {
      const isActive = scholarship.isAvailable && new Date(scholarship.deadline) > new Date();
      if (filters.status === "active" && !isActive) return false;
      if (filters.status === "expired" && isActive) return false;
    }
    if (filters.type !== "all" && scholarship.scholarshipTypeId.toString() !== filters.type) {
      return false;
    }
    return true;
  });

  return (
    <div className="scholarships-page" style={{ background: '#f8fafc', display: 'flex' }}>
      <div className="sidebar-filters" style={{
        width: '250px',
        padding: '5px',
        marginTop: '100px',
        background: 'white',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
        height: '250',
        position: 'sticky',
        top: 0
      }}>
        <h5 className="mb-3">Filters</h5>
        
        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Select 
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Status</Form.Label>
          <Form.Select 
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Type</Form.Label>
          <Form.Select 
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
          >
            <option value="all">All Types</option>
            {types.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button 
          variant="outline-danger" 
          size="sm"
          onClick={clearFilters}
          className="w-100"
        >
          <FiX size={16} /> Clear Filters
        </Button>
      </div>

      <div className="main-content " style={{ flex: 1, padding: '20px' }}>
        <div className="hero-section text-center py-5 mt-5 m-0 p-0 vw-100 overflow-x-hidden" style={{ 
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          color: 'white',
          borderRadius: '0 0 20px 20px',
       
        }} data-aos="fade-down">
          <h1 className="display-4 fw-bold mb-3">OPPORTUNITIES FOR</h1>
          <h2 className="display-2 fw-bolder" style={{ color: '#fbbf24' }}>THOSE WHO DREAM</h2>
          <p className="lead">Find the perfect scholarship to fund your education</p>
          {(role === "admin" || role === "provider") && (
            <Button 
              variant="warning" 
              className="rounded-pill px-4 mt-3 fw-bold"
              onClick={() => setShowModal(true)}
              disabled={loading.submitting}
            >
              {loading.submitting ? <Spinner animation="border" size="sm" /> : "+ Add Scholarship"}
            </Button>
          )}
        </div>

        <div className="bg-white p-3 rounded-3 shadow-sm mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">
              {filteredScholarships.length} Scholarships Found
            </h4>
          </div>

          <div className="d-flex align-items-center gap-3">
            <InputGroup style={{ width: '300px' }}>
              <InputGroup.Text>
                <FiSearch />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search scholarships..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </InputGroup>

            <div className="d-flex gap-2">
              <Form.Select 
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                style={{ width: '180px' }}
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Form.Select>

              <Form.Select 
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                style={{ width: '150px' }}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
              </Form.Select>

              <Form.Select 
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                style={{ width: '150px' }}
              >
                <option value="all">All Types</option>
                {types.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </Form.Select>
            </div>
          </div>
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
            <div className="text-center py-5">
              <FiAward size={48} className="text-muted mb-3" />
              <p className="h5">No scholarships found</p>
              <Button 
                variant="outline-primary" 
                className="mt-2"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            filteredScholarships.map((scholarship) => (
              <div className="col-md-6 col-lg-4 d-flex" key={scholarship.id} data-aos="zoom-in">
                <div className="card border-0 shadow-lg rounded-3 overflow-hidden h-100 w-100 transition-all hover-shadow">
                  <div className="card-img-top" style={{
                    height: '180px',
                    background: scholarship.imageFile 
                      ? `url(https://localhost:7255/${scholarship.imageFile.replace(/^\.?\/?/, '')}) center/cover`
                      : 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {!scholarship.imageFile && (
                      <span className="text-3xl text-blue-800 font-bold">{scholarship.title.charAt(0)}</span>
                    )}
                  </div>
                  
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h3 className="h5 fw-bold text-blue-900">{scholarship.title}</h3>
                      <Badge pill bg={scholarship.isAvailable && new Date(scholarship.deadline) > new Date() ? "success" : "danger"}>
                        {scholarship.isAvailable && new Date(scholarship.deadline) > new Date() ? "Open" : "Closed"}
                      </Badge>
                    </div>
                    
                    <p className="text-muted flex-grow-1">{scholarship.description.substring(0, 100)}...</p>
                    
                    <div className="mt-3 mb-2">
                      <div className="d-flex align-items-center gap-2 text-muted mb-1">
                        <FiAward size={16} />
                        <small>{getTypeName(scholarship.scholarshipTypeId)}</small>
                      </div>
                      <div className="d-flex align-items-center gap-2 text-muted mb-2">
                        <FiCalendar size={16} />
                        <small>Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</small>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
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
                      <Button
                        variant="primary"
                        className="rounded-pill px-3"
                        onClick={() => {
                          setSelectedScholarshipId(scholarship.id);
                          setShowApplyModal(true);
                        }}
                        disabled={!scholarship.isAvailable || new Date(scholarship.deadline) <= new Date()}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
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
            <Form.Group controlId="deadline" className="mb-3">
              <Form.Label>Deadline *</Form.Label>
              <Form.Control 
                type="date" 
                name="deadline" 
                value={formData.deadline} 
                onChange={handleInputChange} 
                required 
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

      <Modal 
        show={showApplyModal} 
        onHide={() => setShowApplyModal(false)} 
        size="lg"
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Apply for Scholarship</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedScholarshipId && (
            <ScholarshipApply scholarshipId={selectedScholarshipId} />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ScholarshipsPage;