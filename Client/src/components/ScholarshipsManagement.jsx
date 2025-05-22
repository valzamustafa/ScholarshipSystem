import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

function ScholarshipsManagement() {
  const [scholarships, setScholarships] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [providers, setProviders] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    applyLink: "",
    isAvailable: true,
    providerId: "",
    scholarshipCategoryId: "",
    scholarshipTypeId: ""
  });

  useEffect(() => {
    fetchScholarships();
    fetchCategories();
    fetchTypes();
    fetchProviders();
  }, []);

  async function fetchScholarships() {
    try {
      const res = await fetch("https://localhost:7255/api/scholarship");
      const data = await res.json();
      setScholarships(data);
    } catch (error) {
      console.error("Error fetching scholarships:", error);
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

  async function fetchProviders() {
    try {
      const res = await fetch("https://localhost:7255/api/admin/providers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setProviders(data);
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  }
const handleInputChange = (e) => {
  const { name, value, type, checked } = e.target;

  const newValue = type === "checkbox" ? checked : value;

  setFormData((prevData) => ({
    ...prevData,
    [name]: newValue,
  }));
};


const handleSubmit = async (e) => {
  e.preventDefault();

  const requiredFields = [
    { name: "Title", value: formData.title },
    { name: "Description", value: formData.description },
    { name: "Application Link", value: formData.applyLink },
    { name: "Provider", value: formData.providerId },
    { name: "Category", value: formData.scholarshipCategoryId },
    { name: "Type", value: formData.scholarshipTypeId }
  ];

  const missingFields = requiredFields.filter(field => !field.value);

  if (missingFields.length > 0) {
    const fieldNames = missingFields.map(f => f.name).join(", ");
    alert(`Please fill in the following fields: ${fieldNames}`);
    return;
  }

  if (
    formData.providerId === "" ||
    formData.scholarshipCategoryId === "" ||
    formData.scholarshipTypeId === ""
  ) {
    alert("Please select Provider, Category, and Type");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const url = editingId
      ? `https://localhost:7255/api/scholarship/${editingId}`
      : "https://localhost:7255/api/scholarship";
    const method = editingId ? "PUT" : "POST";

 
    const formToSend = {
      title: formData.title,
      description: formData.description,
      applyLink: formData.applyLink,
      isAvailable: formData.isAvailable,
      providerId: parseInt(formData.providerId),
      scholarshipCategoryId: parseInt(formData.scholarshipCategoryId),
      scholarshipTypeId: parseInt(formData.scholarshipTypeId),
    };

    // Kontroll shtesë (optional)
    if (
      isNaN(formToSend.providerId) ||
      isNaN(formToSend.scholarshipCategoryId) ||
      isNaN(formToSend.scholarshipTypeId)
    ) {
      alert("Invalid Provider, Category or Type selected");
      return;
    }

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formToSend),
    });

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = "Failed to save scholarship";

      if (errorData.errors) {
        errorMessage = Object.entries(errorData.errors)
          .map(([field, errors]) => `${field}: ${errors.join(", ")}`)
          .join("\n");
      } else if (errorData.title) {
        errorMessage = errorData.title;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }

      throw new Error(errorMessage);
    }

    fetchScholarships();
    resetForm();
  } catch (error) {
    console.error("Error saving scholarship:", error);
    alert(`Error: ${error.message}`);
  }
};

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      applyLink: "",
      isAvailable: true,
      providerId: "",
      scholarshipCategoryId: "",
      scholarshipTypeId: ""
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleEdit = (scholarship) => {
    setFormData({
      title: scholarship.title,
      description: scholarship.description,
      applyLink: scholarship.applyLink,
      isAvailable: scholarship.isAvailable,
      providerId: scholarship.providerId,
      scholarshipCategoryId: scholarship.scholarshipCategoryId,
      scholarshipTypeId: scholarship.scholarshipTypeId
    });
    setEditingId(scholarship.id);
    setShowAddForm(true);
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
      alert(`Error: ${error.message}`);
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

  const getProviderName = (id) => {
    const provider = providers.find(p => p.id === id);
    return provider ? provider.fullName : "N/A";
  };

  return (
    <div className="p-4" style={{ marginTop: "200px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Manage Scholarships</h3>
        <button 
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowAddForm(true);
          }}
        >
          <FiPlus className="me-2" />
          Add Scholarship
        </button>
      </div>

      {showAddForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">{editingId ? "Edit Scholarship" : "Add New Scholarship"}</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Application Link</label>
                <input
                  type="url"
                  className="form-control"
                  name="applyLink"
                  value={formData.applyLink}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleInputChange}
                  id="isAvailableCheck"
                />
                <label className="form-check-label" htmlFor="isAvailableCheck">
                  Available
                </label>
              </div>
              <div className="mb-3">
                <label className="form-label">Provider</label>
               <select
  className="form-select"
  name="providerId"
  value={formData.providerId}
  onChange={handleInputChange}
  required
>
  <option value="">Select Provider</option>
  {providers.map(provider => (
    <option key={provider.id} value={provider.id}>
      {provider.fullName}
    </option>
  ))}
</select>
              </div>
              <div className="mb-3">
      <label className="form-label">Category</label>
     <select
  className="form-select"
  name="scholarshipCategoryId"
  value={formData.scholarshipCategoryId}
  onChange={handleInputChange}
  required
>
  <option value="">Select Category</option>
  {categories.map(cat => (
    <option key={cat.id} value={cat.id}>
      {cat.name}
    </option>
  ))}
</select>

    </div>
              <div className="mb-3">
                <label className="form-label">Type</label>
                <select
                  className="form-select"
                  name="scholarshipTypeId"
                  value={formData.scholarshipTypeId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Type</option>
                  {types.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name} ({type.description})
                    </option>
                  ))}
                </select>
              </div>
              <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-secondary me-2" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Provider</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
  {scholarships.map(scholarship => (
    <tr key={scholarship.id}>
      <td>{scholarship.title}</td>
      <td title={scholarship.description}>
        {scholarship.description.length > 50
          ? scholarship.description.substring(0, 50) + "..."
          : scholarship.description}
      </td>
      <td>{getProviderName(scholarship.providerId)}</td>
      <td>{getCategoryName(scholarship.scholarshipCategoryId)}</td>
      <td>{getTypeName(scholarship.scholarshipTypeId)}</td>
      <td>
        <span className={`badge bg-${scholarship.isAvailable ? "success" : "secondary"}`}>
          {scholarship.isAvailable ? "Available" : "Unavailable"}
        </span>
      </td>
      <td>
        <button
          className="btn btn-sm btn-outline-primary me-2"
          onClick={() => handleEdit(scholarship)}
        >
          <FiEdit />
        </button>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => handleDelete(scholarship.id)}
        >
          <FiTrash2 />
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

export default ScholarshipsManagement;