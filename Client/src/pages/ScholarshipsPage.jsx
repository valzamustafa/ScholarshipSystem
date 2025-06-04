/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Button, Card, Form, InputGroup, Pagination, Badge, Alert, Spinner, Modal } from "react-bootstrap";
import { FiSearch, FiCalendar, FiAward, FiFilter,FiBook, FiX, FiEdit, FiTrash2, FiChevronDown, FiChevronUp ,FiUser,FiMail} from "react-icons/fi";
import { FiMessageSquare } from "react-icons/fi";
import herosectionscholarships from '../assets/herosectionscholarships.png';
import SendMessageModal from "../components/SendMessageModal";
import AOS from "aos";
import "aos/dist/aos.css";
import { useAuth } from "../context/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [showMessageModal, setShowMessageModal] = useState(false);
const [selectedProviderId, setSelectedProviderId] = useState(null);
const [selectedProvider, setSelectedProvider] = useState(null);
const [selectedScholarshipId, setSelectedScholarshipId] = useState(null);
  const navigate = useNavigate();
  const [messageContent, setMessageContent] = useState({
  subject: '',
  content: ''
});

  const { user } = useAuth();
  const [loading, setLoading] = useState({
    scholarships: false,
    categories: false,
    types: false,
    submitting: false
  });
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    type: "all",
    status: "all",
     studyField: "" 
  });
  const [currentPage, setCurrentPage] = useState(1);
  const scholarshipsPerPage = 6;
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    isAvailable: true,
    scholarshipCategoryId: "",
    scholarshipTypeId: "",
    applyLink: ""
  });
  const [editingId, setEditingId] = useState(null);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchInitialData();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const fetchInitialData = async () => {
    try {
      setLoading(prev => ({ ...prev, scholarships: true, categories: true, types: true }));
      await Promise.all([fetchScholarships(), fetchCategories(), fetchTypes()]);
    } catch (error) {
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
    const data = await res.json();
    console.log(data[0]); 
    setScholarships(data);
  } catch (err) {
    setError("Failed to load scholarships");
  }
};

  const fetchCategories = async () => {
    try {
      const res = await fetch("https://localhost:7255/api/scholarshipcategory");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchTypes = async () => {
    try {
      const res = await fetch("https://localhost:7255/api/scholarshiptype");
      const data = await res.json();
      setTypes(data);
    } catch (err) {
      console.error("Error fetching types:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "all",
      type: "all",
      status: "all"
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(prev => ({ ...prev, submitting: true }));
      const url = editingId 
        ? `https://localhost:7255/api/scholarship/${editingId}`
        : "https://localhost:7255/api/scholarship";
      const method = editingId ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error("Failed to save scholarship");
      
      await fetchScholarships();
      setShowModal(false);
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

 const handleEdit = (scholarship) => {
  setFormData({
    title: scholarship.title,
    description: scholarship.description,
    studyField: scholarship.studyField || '',
    deadline: scholarship.deadline,
    isAvailable: scholarship.isAvailable,
    scholarshipCategoryId: scholarship.scholarshipCategoryId,
    scholarshipTypeId: scholarship.scholarshipTypeId,
    applyLink: scholarship.applyLink
  });
  setEditingId(scholarship.id);
  setShowModal(true);
};

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scholarship?")) return;
    try {
      setLoading(prev => ({ ...prev, submitting: true }));
      await fetch(`https://localhost:7255/api/scholarship/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchScholarships();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  const filteredScholarships = scholarships.filter(scholarship => {
    if (filters.search && !scholarship.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.category !== "all" && scholarship.scholarshipCategoryId.toString() !== filters.category) {
      return false;
    }
    if (filters.type !== "all" && scholarship.scholarshipTypeId.toString() !== filters.type) {
      return false;
    }
    if (filters.status !== "all") {
      const isActive = scholarship.isAvailable && new Date(scholarship.deadline) > new Date();
      if (filters.status === "active" && !isActive) return false;
      if (filters.status === "expired" && isActive) return false;
    }
   if (filters.studyField && !scholarship.studyField?.toLowerCase().includes(filters.studyField.toLowerCase())) {
        return false;
    }
    return true;
});
const handleSendMessage = async () => {
  if (!messageContent.content?.trim()) {
    setError('Message content is required');
    return;
  }

  const token = localStorage.getItem("token");
  try {
    const response = await fetch('https://localhost:7255/api/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        subject: messageContent.subject || 'Question about scholarship', 
        content: messageContent.content,
        recipientId: selectedProvider.id,
        scholarshipId: selectedScholarshipId || null
      })
    });

    if (!response.ok) throw new Error('Failed to send message');
    
    setShowMessageModal(false);
    setMessageContent({});
    return { success: true, message: 'Message sent successfully!' };
  } catch (error) {
    console.error("Error sending message:", error);
    setError(error.message);
    return { success: false, message: error.message };
  }
};
  const indexOfLastScholarship = currentPage * scholarshipsPerPage;
  const indexOfFirstScholarship = indexOfLastScholarship - scholarshipsPerPage;
  const currentScholarships = filteredScholarships.slice(indexOfFirstScholarship, indexOfLastScholarship);
  const totalPages = Math.ceil(filteredScholarships.length / scholarshipsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="scholarships-page m-0 p-0 vw-100 overflow-x-hidden" style={{ background: '#f8fafc', display: 'flex' }}>
     
  
      <div className="main-content" style={{ flex: 1, padding: '20px' }}>
   
    <motion.div 
  className="hero-section text-center py-5 mb-4" 
  style={{ 
    marginTop:'90px',
    backgroundImage: `url(${herosectionscholarships})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white',
    borderRadius: '10px',
    backdropFilter: 'brightness(0.85)', 
  }}
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  
>
       
  
          <h1 className="display-5 fw-bold mb-3">OPPORTUNITIES FOR</h1>
          <motion.h2 
            className="display-4 fw-bolder" 
            style={{ color: '#fbbf24' }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            THOSE WHO DREAM
          </motion.h2>
          <p className="lead">Find the perfect scholarship to fund your education</p>
          {(role === "admin" || role === "provider") && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="warning" 
                className="rounded-pill px-4 mt-3 fw-bold"
                onClick={() => setShowModal(true)}
              >
                + Add Scholarship
              </Button>
            </motion.div>
          )}
        </motion.div>

       
       
      <motion.div 
  className="horizontal-filters bg-white p-3 rounded-3 shadow-sm mb-4"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.3 }}
>
  <div className="d-flex align-items-center gap-3 flex-wrap">
    {/* Search Input */}
    <InputGroup style={{ width: '250px', flex: '1 0 auto' }}>
      <InputGroup.Text>
        <FiSearch />
      </InputGroup.Text>
      <Form.Control
        placeholder="Search scholarships..."
        name="search"
        value={filters.search}
        onChange={handleFilterChange}
      />
      <Form.Control
    placeholder="Filter by study field..."
    name="studyField"
    value={filters.studyField}
    onChange={handleFilterChange}
    style={{ width: '200px', flex: '1 0 auto' }}
/>
    </InputGroup>

   
    <Form.Select 
      name="category"
      value={filters.category}
      onChange={handleFilterChange}
      style={{ width: '200px', flex: '1 0 auto' }}
    >
      <option value="all">All Categories</option>
      {categories.map(category => (
        <option key={category.id} value={category.id}>{category.name}</option>
      ))}
    </Form.Select>


    <Form.Select 
      name="type"
      value={filters.type}
      onChange={handleFilterChange}
      style={{ width: '200px', flex: '1 0 auto' }}
    >
      <option value="all">All Types</option>
      {types.map(type => (
        <option key={type.id} value={type.id}>{type.name}</option>
      ))}
    </Form.Select>


    <Form.Select 
      name="status"
      value={filters.status}
      onChange={handleFilterChange}
      style={{ width: '180px', flex: '1 0 auto' }}
    >
      <option value="all">All Statuses</option>
      <option value="active">Active</option>
      <option value="expired">Expired</option>
    </Form.Select>

 
    <Button 
      variant="outline-danger" 
      onClick={clearFilters}
      className="d-flex align-items-center gap-2"
      style={{
        border: '1px dashed #ef4444',
        background: 'transparent',
        color: '#ef4444',
        fontWeight: '500',
        flex: '1 0 auto',
        maxWidth: '200px'
      }}
    >
      <FiX /> Clear Filters
    </Button>
  </div>
</motion.div>

        <motion.div 
          className="d-flex justify-content-between align-items-center mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h4 className="mb-0">Featured Scholarships</h4>
          <div className="text-muted">
            Showing {indexOfFirstScholarship + 1}-{Math.min(indexOfLastScholarship, filteredScholarships.length)} of {filteredScholarships.length} scholarships
          </div>
        </motion.div>

 
 
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          </motion.div>
        )}

        {loading.scholarships ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading scholarships...</p>
          </div>
        ) : currentScholarships.length === 0 ? (
          <motion.div 
            className="text-center py-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FiAward size={48} className="text-muted mb-3" />
            <h5>No scholarships found</h5>
            <Button 
              variant="outline-primary" 
              className="mt-2"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </motion.div>
        ) : (
          <div className="row g-4">
            <AnimatePresence>
              {currentScholarships.map((scholarship, index) => (
                <motion.div 
                  className="col-md-6 col-lg-4" 
                  key={scholarship.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  exit={{ opacity: 0 }}
                  layout
                >
                  <Card className="h-100 border-0 shadow-sm" style={{ transition: 'transform 0.3s' }}>
                    <motion.div 
                      style={{
                        height: '180px',
                        background: scholarship.imageFile 
                          ? `url(https://localhost:7255/${scholarship.imageFile.replace(/^\.?\/?/, '')}) center/cover`
                          : 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
                        borderTopLeftRadius: '0.375rem',
                        borderTopRightRadius: '0.375rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      whileHover={{ scale: 1.03 }}
                    >
                      {!scholarship.imageFile && (
                        <span className="text-3xl text-blue-800 font-bold">{scholarship.title.charAt(0)}</span>
                      )}
                    </motion.div>
                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="mb-0">{scholarship.title}</h5>
                        <Badge pill bg={scholarship.isAvailable && new Date(scholarship.deadline) > new Date() ? "success" : "danger"}>
                          {scholarship.isAvailable && new Date(scholarship.deadline) > new Date() ? "Open" : "Closed"}
                        </Badge>
                      </div>
                       <div className="provider-info mt-3 pt-3 border-top">
    <h6 className="mb-2">Provided by:</h6>
    <div className="d-flex align-items-center gap-2 mb-2">
      <FiUser className="text-primary" />
      <span>{scholarship.providerName || 'Unknown'}</span>
    </div>
    <div className="d-flex align-items-center gap-2 mb-3">
      <FiMail className="text-primary" />
      <span>{scholarship.providerEmail || 'No email provided'}</span>
    </div>
    
    {user?.role === 'student' && (
<Button 
  variant="outline-primary" 
  size="sm"
  onClick={() => {
    setSelectedProvider({
      id: scholarship.providerId,
      name: scholarship.providerName,
      email: scholarship.providerEmail
    });
    setSelectedScholarshipId(scholarship.id);
    setShowMessageModal(true);
  }}
  className="d-flex align-items-center gap-1"
>
  <FiMessageSquare /> Message Provider
</Button>
    )}
  </div>
                      <p className="text-muted small">{scholarship.description.substring(0, 100)}...</p>
                      <div className="mt-3 mb-2">
                        <div className="d-flex align-items-center gap-2 text-muted mb-1">
                          <FiAward size={16} />
                          <small>{types.find(t => t.id === scholarship.scholarshipTypeId)?.name || "N/A"}</small>
                        </div>
                        <div className="d-flex align-items-center gap-2 text-muted">
                          <FiCalendar size={16} />
                          <small>Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</small>
                        </div>
                      </div>
                    
<div className="mb-2">
  <div className="d-flex align-items-center gap-2 text-muted">
    <FiBook size={16} /> 
    <small>Study Field: {scholarship.studyField || 'Not specified'}</small>
  </div>
</div> 
                      <div className="mt-auto pt-3">
                        <div className="d-flex justify-content-between align-items-center">
                          {(role === "admin" || role === "provider") && (
                            <div>
                              <Button 
                                variant="link" 
                                size="sm" 
                                className="text-primary p-0 me-2"
                                onClick={() => handleEdit(scholarship)}
                              >
                                <FiEdit />
                              </Button>
                              <Button 
                                variant="link" 
                                size="sm" 
                                className="text-danger p-0"
                                onClick={() => handleDelete(scholarship.id)}
                              >
                                <FiTrash2 />
                              </Button>
                            </div>
                          )}
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
<Button
    variant="primary"
    className="rounded-pill px-3"
    onClick={() => {
        if (!user) {
            navigate('/login', { 
                state: { 
                    from: `/apply/${scholarship.id}`,
                    message: 'You need to login as a student to apply for scholarships'
                } 
            });
        } else if (user.role !== 'student') {
            navigate('/unauthorized', { 
                state: { 
                    message: 'Only students can apply for scholarships'
                } 
            });
        } else {
            navigate(`/apply/${scholarship.id}`);
        }
    }}
    disabled={!scholarship.isAvailable || new Date(scholarship.deadline) <= new Date()}
>
    Apply Now
</Button>                          </motion.div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

 
 
        {filteredScholarships.length > scholarshipsPerPage && (
          <motion.div 
            className="d-flex justify-content-center mt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Pagination>
              <Pagination.Prev 
                onClick={() => paginate(currentPage - 1)} 
                disabled={currentPage === 1} 
              />
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next 
                onClick={() => paginate(currentPage + 1)} 
                disabled={currentPage === totalPages} 
              />
            </Pagination>
          </motion.div>
        )}
      </div>

 
 
      <Modal show={showModal} onHide={() => { setShowModal(false); setEditingId(null); }}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? "Edit Scholarship" : "Add Scholarship"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
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
            <Form.Group className="mb-3">
              <Form.Label>Application Link *</Form.Label>
              <Form.Control
                type="url"
                name="applyLink"
                value={formData.applyLink}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category *</Form.Label>
              <Form.Select
                name="scholarshipCategoryId"
                value={formData.scholarshipCategoryId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type *</Form.Label>
              <Form.Select
                name="scholarshipTypeId"
                value={formData.scholarshipTypeId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Type</option>
                {types.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Deadline *</Form.Label>
              <Form.Control
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
      
<Form.Group className="mb-3">
  <Form.Label>Study Field</Form.Label>
  <Form.Control
    type="text"
    name="studyField"
    value={formData.studyField || ''}
    onChange={handleInputChange}
    placeholder="e.g. Computer Science, Medicine"
  />
</Form.Group>
            <Form.Group className="mb-3">
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
          <Button variant="secondary" onClick={() => { setShowModal(false); setEditingId(null); }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading.submitting}>
            {loading.submitting ? (
              <Spinner animation="border" size="sm" />
            ) : editingId ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Message {selectedProvider?.name}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form.Group className="mb-3">
      <Form.Label>Subject</Form.Label>
      <Form.Control
        type="text"
        placeholder="Subject of your message"
        value={messageContent.subject || ''}
        onChange={(e) => setMessageContent({...messageContent, subject: e.target.value})}
      />
    </Form.Group>
    <Form.Group className="mb-3">
      <Form.Label>Message</Form.Label>
      <Form.Control
        as="textarea"
        rows={5}
        placeholder="Write your message here..."
        value={messageContent.content || ''}
        onChange={(e) => setMessageContent({...messageContent, content: e.target.value})}
      />
    </Form.Group>
  </Modal.Body>
 <Modal.Footer>
  <Button variant="secondary" onClick={() => setShowMessageModal(false)}>
    Cancel
  </Button>
  <Button variant="primary" onClick={async () => {
    const result = await handleSendMessage();
    if (result.success) {
      alert(result.message);
    }
  }}>
    Send Message
  </Button>
</Modal.Footer>
</Modal>
    </div>
  );
}

export default ScholarshipsPage;