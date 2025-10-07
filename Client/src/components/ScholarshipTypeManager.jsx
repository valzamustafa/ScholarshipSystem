import React, { useState, useEffect } from "react";
import { PlusCircle, XCircle, CheckCircle, PencilSquare, TrashFill } from 'react-bootstrap-icons';

function ScholarshipCategoryManager() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch('https://localhost:7255/api/scholarshipcategory/all-with-counts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = editingId
        ? `https://localhost:7255/api/scholarshipcategory/admin/${editingId}`
        : 'https://localhost:7255/api/scholarshipcategory';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to save category');
      fetchCategories();
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (category) => {
    setFormData({ name: category.name, description: category.description });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleDelete = async (id, count) => {
    if (count > 0 || !window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://localhost:7255/api/scholarshipcategory/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete category');
      fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card shadow-lg rounded-4 border border-primary mb-4" style={{ marginTop: '100px' }}>
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center rounded-top-4">
        <h5 className="mb-0">Manage Scholarship Categories</h5>
        <button
          className={`btn btn-${showForm ? 'outline-danger' : 'light'} d-flex align-items-center`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <><XCircle className="me-2" />Cancel</> : <><PlusCircle className="me-2" />Add Category</>}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4 shadow-lg rounded-3 border border-primary">
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                    <label htmlFor="name">Name</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="description"
                      name="description"
                      placeholder="Description"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="description">Description</label>
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-success mt-4 d-flex align-items-center" disabled={loading}>
                <CheckCircle className="me-2" />
                {editingId ? 'Update Category' : 'Add Category'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="card shadow-lg rounded-3 border border-primary">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead className="table-primary">
                  <h5 className="card-title mb-4 text-primary fw-semibold">Type List</h5>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Scholarships</th>
                  <th style={{ width: '170px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr><td colSpan="4" className="text-center text-muted">No categories found.</td></tr>
                ) : categories.map(category => (
                  <tr key={category.id}>
                    <td>{category.name}</td>
                    <td>{category.description}</td>
                    <td>{category.scholarshipCount}</td>
                    <td>
                      <button className="btn btn-outline-warning btn-sm me-2" onClick={() => startEdit(category)}>
                        <PencilSquare />
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(category.id, category.scholarshipCount)}
                        disabled={category.scholarshipCount > 0}
                      >
                        <TrashFill />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScholarshipCategoryManager;
