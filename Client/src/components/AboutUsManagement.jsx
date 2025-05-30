import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiX, FiSave, } from 'react-icons/fi';
import { PlusCircle, XCircle, CheckCircle, TrashFill, PencilFill, PencilSquare } from "react-bootstrap-icons";
import axios from 'axios';

const AboutUsManagement = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [newSection, setNewSection] = useState({
    title: '',
    content: '',
    imageUrl: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://localhost:7255/api/aboutus", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch sections");
      const data = await res.json();
      setSections(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post('https://localhost:7255/api/aboutus/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const startEditing = (section) => {
    setEditingId(section.id);
    setEditData({
      title: section.title,
      content: section.content,
      imageUrl: section.imageUrl || ''
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleUpdateSection = async (id) => {
    try {
      let imageUrl = editData.imageUrl;
      if (editData.imageFile) {
        imageUrl = await handleImageUpload(editData.imageFile);
      }
      const token = localStorage.getItem("token");
      const res = await fetch(`https://localhost:7255/api/aboutus/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: editData.title,
          content: editData.content,
          imageUrl: imageUrl
        })
      });
      if (!res.ok) throw new Error("Failed to update section");
      await fetchSections();
      setEditingId(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteSection = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://localhost:7255/api/aboutus/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete section");
      await fetchSections();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAddSection = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = '';
      if (newSection.imageFile) {
        imageUrl = await handleImageUpload(newSection.imageFile);
      }
      const token = localStorage.getItem("token");
      const res = await fetch("https://localhost:7255/api/aboutus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newSection.title,
          content: newSection.content,
          imageUrl: imageUrl
        })
      });
      if (!res.ok) throw new Error("Failed to add section");
      await fetchSections();
      setNewSection({ title: '', content: '', imageUrl: '', imageFile: null, imagePreview: null });
      setShowAddForm(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleImageChangeEdit = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData({
          ...editData,
          imageFile: file,
          imageUrl: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;
  if (error) return <div className="alert alert-danger mt-3">Error: {error}</div>;

  return (
   <div className="card shadow-lg rounded-4 border border-primary mb-4" style={{ marginTop: '100px' }}>
      <div className="card-header bg-primary text-white d-flex align-items-center justify-content-between rounded-top-4">
        <div className="d-flex align-items-center">
        <h5 className="mb-0">About Us Management</h5>
       </div>
        <button 
          className={`btn btn-${showAddForm ? "outline-danger" : "light"} d-flex align-items-center`}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? (
          <>
          <XCircle className="me-2" />
           Cancel</> 
           ):(
           <>
           <PlusCircle className="me-2" />
            Add New Section
            </>
            )}
        </button>
      </div>

      {showAddForm && (
        <div className="card mb-4 shadow rounded border border-primary">
          <div className="card-body">
            <h5 className="card-title mb-4 text-primary fw-semibold">Add New Section</h5>
            <form onSubmit={handleAddSection}>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={newSection.title}
                  onChange={e => setNewSection({ ...newSection, title: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Content</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={newSection.content}
                  onChange={e => setNewSection({ ...newSection, content: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setNewSection({
                          ...newSection,
                          imageFile: file,
                          imagePreview: reader.result,
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {newSection.imagePreview && (
                  <img src={newSection.imagePreview} alt="Preview" className="img-thumbnail mt-2" style={{ maxHeight: '200px' }} />
                )}
              </div>
              <button type="submit" className="btn btn-success mt-4 d-flex align-items-center">
                
                <PlusCircle className="me-2" />Add Section
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="card shadow rounded border border-primary">
        <div className="card-body">
          <h5 className="card-title mb-4 text-primary fw-semibold">Sections List</h5>
          {sections.length === 0 ? (
            <p>No sections found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle mb-0">
                <thead className="table-primary">
                  <tr>
                    <th>Title</th>
                    <th>Content</th>
                    <th>Image</th>
                    <th style={{ width: '170px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sections.map(section => (
                    <tr key={section.id}>
                      <td>
                        {editingId === section.id ? (
                          <input
                            type="text"
                            className="form-control"
                            value={editData.title || ''}
                            onChange={e => setEditData({ ...editData, title: e.target.value })}
                          />
                        ) : (
                          section.title
                        )}
                      </td>
                      <td>
                        {editingId === section.id ? (
                          <textarea
                            className="form-control"
                            rows="3"
                            value={editData.content || ''}
                            onChange={e => setEditData({ ...editData, content: e.target.value })}
                          />
                        ) : (
                          <div style={{ whiteSpace: 'pre-wrap', maxHeight: '75px', overflow: 'hidden' }}>{section.content}</div>
                        )}
                      </td>
                      <td style={{ minWidth: '120px' }}>
                        {editingId === section.id ? (
                          <>
                            <input
                              type="file"
                              accept="image/*"
                              className="form-control"
                              onChange={handleImageChangeEdit}
                            />
                            {editData.imageUrl && (
                              <img
                                src={editData.imageUrl}
                                alt="Section"
                                className="img-thumbnail mt-2"
                                style={{ maxHeight: '100px' }}
                              />
                            )}
                          </>
                        ) : (
                          section.imageUrl && (
                            <img
                              src={section.imageUrl}
                              alt={section.title}
                              className="img-thumbnail"
                              style={{ maxHeight: '100px' }}
                            />
                          )
                        )}
                      </td>
                      <td>
                        {editingId === section.id ? (
                          <>
                            <button
                              className="btn btn-sm btn-success me-2"
                              onClick={() => handleUpdateSection(section.id)}
                              title="Save"
                            >
                              <CheckCircle />
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={cancelEditing}
                              title="Cancel"
                            >
                              <FiX />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn btn-outline-warning btn-sm me-2"
                              onClick={() => startEditing(section)}
                              title="Edit"
                            >
                              <PencilSquare />
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this section?')) {
                                  handleDeleteSection(section.id);
                                }
                              }}
                              title="Delete"
                            >
                              <TrashFill />
                            </button>
                            
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutUsManagement;
