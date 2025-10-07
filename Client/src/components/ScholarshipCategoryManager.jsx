import React, { useState, useEffect } from "react";
import { Button, Table, Badge } from "react-bootstrap";
import { PencilSquare, TrashFill, PlusCircle, XCircle, CheckCircle } from "react-bootstrap-icons";

function ScholarshipCategoryManager() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", description: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://localhost:7255/api/scholarshipcategory/all-with-counts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await fetch("https://localhost:7255/api/scholarshipcategory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCategory),
      });
      fetchCategories();
      setNewCategory({ name: "", description: "" });
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (category) => {
    setEditingId(category.id);
    setEditData({ name: category.name, description: category.description });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: "", description: "" });
  };

  const saveEdit = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`https://localhost:7255/api/scholarshipcategory/admin/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(editData),
      });
      fetchCategories();
      cancelEdit();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCategory = async (id, count) => {
    if (count > 0) return;
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`https://localhost:7255/api/scholarshipcategory/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const renderEditableInput = (field, placeholder = "") => (
    <input
      type="text"
      className="form-control"
      placeholder={placeholder}
      value={editData[field]}
      onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
    />
  );

  return (
   <div className="card shadow-lg rounded-4 border border-primary mb-4" style={{ marginTop: '100px' }}>
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center rounded-top-4">
        <h5 className="mb-0">Manage Scholarship Categories</h5>
        <Button
          variant={showAddForm ? "outline-danger" : "light"}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? <><XCircle className="me-2"/>Cancel</> : <><PlusCircle className="me-2"/>Add Category</>}
        </Button>
      </div>


      {showAddForm && (
        <div className="card mb-4 shadow-lg rounded-3 border border-primary">
          <div className="card-body">
            <h5 className="card-title mb-4 text-primary fw-semibold">Add New Category</h5>
            <form onSubmit={handleAddCategory}>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      required
                    />
                    <label>Name</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Description"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    />
                    <label>Description</label>
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-success mt-4 d-flex align-items-center">
                <CheckCircle className="me-2"/>Add Category
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="card shadow-lg rounded-3 border border-primary">
        <div className="card-body">
          <h5 className="card-title mb-4 text-primary fw-semibold">Category List</h5>
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead className="table-primary">
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Scholarships</th>
                  <th style={{ width: "170px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <tr key={category.id}>
                    <td>{editingId === category.id ? renderEditableInput("name", "Name") : category.name}</td>
                    <td>{editingId === category.id ? renderEditableInput("description", "Description") : category.description}</td>
                  <td>
 {category.scholarshipCount}
</td>

                    <td>
                      {editingId === category.id ? (
                        <>
                          <Button className="btn btn-success btn-sm me-2" onClick={() => saveEdit(category.id)}>
                            <CheckCircle />
                          </Button>
                          <Button className="btn btn-secondary btn-sm" onClick={cancelEdit}>
                            <XCircle />
                          </Button>
                        </>
                      ) : (
                        <>
                        <Button variant="outline-warning" size="sm" className="me-2" onClick={() => startEdit(category)}>
  <PencilSquare />
</Button>
<Button variant="outline-danger" size="sm" onClick={() => deleteCategory(category.id, category.scholarshipCount)} disabled={category.scholarshipCount > 0}>
  <TrashFill />
</Button>

                        </>
                      )}
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
