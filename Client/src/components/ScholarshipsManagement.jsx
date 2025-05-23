import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

function ScholarshipsManagement() {
  const [scholarships, setScholarships] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [providers, setProviders] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    applyLink: "",
    isAvailable: true,
    providerId: "",
    scholarshipCategoryId: "",
    scholarshipTypeId: "",
  });

  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchScholarships();
    fetchCategories();
    fetchTypes();
    fetchProviders();
  }, []);

  async function fetchScholarships() {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const res = await fetch("https://localhost:7255/api/scholarship", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to fetch scholarships");
    }

    const data = await res.json();
    setScholarships(data);
  } catch (error) {
    console.error("Error fetching scholarships:", error);
    alert(`Error fetching scholarships: ${error.message}`);
  }
}

// Similarly update other fetch functions:
async function fetchCategories() {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch("https://localhost:7255/api/scholarshipcategory", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch categories");
    const data = await res.json();
    setCategories(data);
  } catch (error) {
    console.error("Error fetching categories:", error);
    alert(`Error fetching categories: ${error.message}`);
  }
}

async function fetchTypes() {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch("https://localhost:7255/api/scholarshiptype", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch types");
    const data = await res.json();
    setTypes(data);
  } catch (error) {
    console.error("Error fetching types:", error);
    alert(`Error fetching types: ${error.message}`);
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

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const requiredFields = [
    { name: "Title", value: formData.title },
    { name: "Description", value: formData.description },
    { name: "Application Link", value: formData.applyLink },
    { name: "Provider", value: formData.providerId },
    { name: "Category", value: formData.scholarshipCategoryId },
    { name: "Type", value: formData.scholarshipTypeId },
  ];

  const missingFields = requiredFields.filter((field) => !field.value);

  if (missingFields.length > 0) {
    const fieldNames = missingFields.map((f) => f.name).join(", ");
    alert(`Please fill in the following fields: ${fieldNames}`);
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const url = editingId
      ? `https://localhost:7255/api/scholarship/${editingId}`
      : "https://localhost:7255/api/scholarship";
    const method = editingId ? "PUT" : "POST";

    const formToSend = new FormData();
    formToSend.append("title", formData.title);
    formToSend.append("description", formData.description);
    formToSend.append("applyLink", formData.applyLink);
    formToSend.append("isAvailable", formData.isAvailable);
    formToSend.append("providerId", parseInt(formData.providerId));
    formToSend.append("scholarshipCategoryId", parseInt(formData.scholarshipCategoryId));
    formToSend.append("scholarshipTypeId", parseInt(formData.scholarshipTypeId));

    if (imageFile) {
      formToSend.append("imageFile", imageFile);
    }

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formToSend,
    });

    if (!response.ok) {
      let errorMessage = "Failed to save scholarship";
      
      try {
        // First try to parse as JSON
        const errorData = await response.json();
        
        if (errorData.errors) {
          errorMessage = Object.entries(errorData.errors)
            .map(([field, errors]) => `${field}: ${errors.join(", ")}`)
            .join("\n");
        } else if (errorData.title) {
          errorMessage = errorData.title;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      // eslint-disable-next-line no-unused-vars
      } catch (jsonError) {
        // If JSON parsing fails, try to get the text response
        try {
          const textResponse = await response.text();
          errorMessage = textResponse || errorMessage;
        } catch (textError) {
          console.error("Failed to parse error response:", textError);
        }
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
      scholarshipTypeId: "",
    });
    setImageFile(null);
    setPreviewImage(null);
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
      scholarshipTypeId: scholarship.scholarshipTypeId,
    });
    
    // Set preview image if exists
    if (scholarship.imageUrl) {
      setPreviewImage(scholarship.imageUrl);
    } else {
      setPreviewImage(null);
    }
    
    setImageFile(null);
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
    const category = categories.find((c) => c.id === id);
    return category ? category.name : "N/A";
  };

  const getTypeName = (id) => {
    const type = types.find((t) => t.id === id);
    return type ? type.name : "N/A";
  };

  const getProviderName = (id) => {
    const provider = providers.find((p) => p.id === id);
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
                  {providers.map((provider) => (
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
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
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
                  {types.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Improved file input with preview */}
              <div className="mb-3">
                <label className="form-label">Image (optional)</label>
                <input
                  type="file"
                  className="form-control"
                  name="imageFile"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                {previewImage && (
                  <div className="mt-2">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      style={{ maxWidth: "200px", maxHeight: "200px" }}
                      className="img-thumbnail"
                    />
                    <button 
                      type="button" 
                      className="btn btn-sm btn-danger ms-2"
                      onClick={() => {
                        setPreviewImage(null);
                        setImageFile(null);
                      }}
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-success me-2">
                {editingId ? "Update Scholarship" : "Add Scholarship"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Application Link</th>
            <th>Available</th>
            <th>Provider</th>
            <th>Category</th>
            <th>Type</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {scholarships.length === 0 && (
            <tr>
              <td colSpan="9" className="text-center">
                No scholarships found.
              </td>
            </tr>
          )}
          {scholarships.map((scholarship) => (
            <tr key={scholarship.id}>
              <td>{scholarship.title}</td>
              <td>{scholarship.description}</td>
              <td>
                <a href={scholarship.applyLink} target="_blank" rel="noreferrer">
                  Apply Link
                </a>
              </td>
              <td>{scholarship.isAvailable ? "Yes" : "No"}</td>
              <td>{getProviderName(scholarship.providerId)}</td>
              <td>{getCategoryName(scholarship.scholarshipCategoryId)}</td>
              <td>{getTypeName(scholarship.scholarshipTypeId)}</td>
              <td>
                {scholarship.imageFile ? (
    <img
      src={`data:image/jpeg;base64,${scholarship.imageFile}`}
      alt={scholarship.title}
      style={{ width: "100px", height: "auto" }}
      className="img-thumbnail"
    />
  ) : (
    "No image"
  )}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => handleEdit(scholarship)}
                >
                  <FiEdit />
                </button>
                <button
                  className="btn btn-sm btn-danger"
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
  );
}

export default ScholarshipsManagement;