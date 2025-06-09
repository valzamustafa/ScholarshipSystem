
import React, { useState, useEffect } from "react";

import { PlusCircle, XCircle, CheckCircle, TrashFill,PencilSquare } from "react-bootstrap-icons";
function ScholarshipsManagement() {
  const [scholarships, setScholarships] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [providers, setProviders] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
const [isAdminScholarship, setIsAdminScholarship] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    applyLink: "",
    isAvailable: true,
      deadline:"",
    studyField:"",
    scholarshipCategoryId: "",
    scholarshipTypeId: "",
  });

  const [imageFile, setImageFile] = useState(null);


useEffect(() => {
  fetchScholarships();
  fetchCategories();
  fetchTypes();
  fetchProviders();
}, [isAdminScholarship]); 

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
      if (!res.ok) throw new Error("Failed to fetch providers");
      const data = await res.json();
      setProviders(data);
    } catch (error) {
      console.error("Error fetching providers:", error);
      alert(`Error fetching providers: ${error.message}`);
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

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const formToSend = new FormData();

  const requiredFields = [
    { name: "Title", value: formData.title },
    { name: "Description", value: formData.description },
    { name: "Application Link", value: formData.applyLink },
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

    formToSend.append("title", formData.title);
    formToSend.append("description", formData.description);
    formToSend.append("applyLink", formData.applyLink);
    formToSend.append("isAvailable", formData.isAvailable);
     formToSend.append("deadline", formData.deadline || null); 
  formToSend.append("studyField", formData.studyField || "");
 if (!isAdminScholarship && formData.providerId) {
  formToSend.append("providerId", formData.providerId);
}

    
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
        } catch {
 try {
  const textResponse = await response.text();
  errorMessage = textResponse || errorMessage;
} catch (innerErr) {
  console.error("Failed to parse error response:", innerErr);
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
    deadline: scholarship.deadline || '',
    providerId: scholarship.providerId ? scholarship.providerId.toString() : "",
    scholarshipCategoryId: scholarship.scholarshipCategoryId?.toString() || "",
    scholarshipTypeId: scholarship.scholarshipTypeId?.toString() || "",
  });

   setPreviewImage(scholarship.imageUrl || null);
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
   <div className="card shadow-lg rounded-4 border border-primary mb-4" style={{ marginTop: '100px' }}>
  <div className="card-header bg-primary text-white d-flex align-items-center justify-content-between rounded-top-4">
    <div className="d-flex align-items-center">
     
      <h5 className="mb-0">Manage Scholarships</h5>
        </div>
        <button
          className={`btn btn-${showAddForm ? "outline-danger" : "light"} d-flex align-items-center`}
          onClick={() => {
            resetForm();
            setShowAddForm(!showAddForm);
          }}
        >
          {showAddForm ? (
            <>
              <XCircle className="me-2" />
              Cancel
            </>
          ) : (
            <>
              <PlusCircle className="me-2" />
              Add Scholarship
            </>
          )}
        </button>
      </div>
 
      {showAddForm && (
        <div className="card mb-5 shadow-lg rounded-3 border border-primary">
          <div className="card-body">
            <h5 className="card-title mb-4 text-primary fw-semibold">
              {editingId ? "Edit Scholarship" : "Add New Scholarship"}
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      placeholder="Title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                    <label htmlFor="title">Title</label>
                  </div>
                </div>
                

                
                <div className="col-md-6">
                  <div className="form-floating">
                    <textarea
                      className="form-control"
                      id="description"
                      placeholder="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      style={{ height: "100px" }}
                    />
                    <label htmlFor="description">Description</label>
                  </div>
                </div>
<div className="col-md-6">
  <div className="form-check">
    <input
      type="checkbox"
      className="form-check-input"
      id="isAdminScholarship"
      checked={isAdminScholarship}
      onChange={() => setIsAdminScholarship(!isAdminScholarship)}
    />
    <label className="form-check-label" htmlFor="isAdminScholarship">
      Admin Scholarship (no provider)
    </label>
  </div>
</div>
<div className="col-md-6">
  <div className="form-floating">
    <input
      type="date"
      className="form-control"
      id="deadline"
      placeholder="Deadline"
      name="deadline"
      value={formData.deadline || ''}
      min={new Date().toISOString().split('T')[0]} 
      onChange={handleInputChange}
      required
    />
    <label htmlFor="deadline">Deadline</label>
  </div>
</div>
{!isAdminScholarship && (
  <div className="col-md-6">
    <div className="form-floating">
      <select
        className="form-select"
        id="providerId"
        name="providerId"
        value={formData.providerId}
        onChange={handleInputChange}
        required={!isAdminScholarship}
      >
        <option value="">Select Provider</option>
        {providers.map((provider) => (
          <option key={provider.id} value={provider.id}>
            {provider.fullName}
          </option>
        ))}
      </select>
      <label htmlFor="providerId">Provider</label>
    </div>
  </div>
)}

                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="url"
                      className="form-control"
                      id="applyLink"
                      placeholder="Application Link"
                      name="applyLink"
                      value={formData.applyLink}
                      onChange={handleInputChange}
                      required
                    />
                    <label htmlFor="applyLink">Application Link</label>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-floating">
                    <select
                      className="form-select"
                      id="scholarshipCategoryId"
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
                    <label htmlFor="scholarshipCategoryId">Category</label>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-floating">
                    <select
                      className="form-select"
                      id="scholarshipTypeId"
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
                    <label htmlFor="scholarshipTypeId">Type</label>
                  </div>
                </div>

                <div className="col-md-4 d-flex align-items-center">
                  <div className="form-check mt-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isAvailable"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="isAvailable">
                      Available
                    </label>
                  </div>
                </div>
                <div className="col-md-6">
    <div className="form-floating">
        <input
            type="text"
            className="form-control"
            id="studyField"
            placeholder="Study Field"
            name="studyField"
            value={formData.studyField || ''}
            onChange={handleInputChange}
        />
        <label htmlFor="studyField">Study Field</label>
    </div>
</div>

                <div className="col-md-12">
                  <label htmlFor="imageFile" className="form-label">
                    Image (optional)
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="imageFile"
                    name="imageFile"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  {previewImage && (
                    <div className="mt-2 d-flex align-items-center">
                      <img
                        src={previewImage}
                        alt="Preview"
                        style={{ width: "120px", height: "auto", objectFit: "cover" }}
                        className="img-thumbnail me-3"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => {
                          setImageFile(null);
                          setPreviewImage(null);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success d-flex align-items-center">
                  <CheckCircle className="me-2" />
                  {editingId ? "Update Scholarship" : "Add Scholarship"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card shadow-lg rounded-3 border border-primary">
        <div className="card-body">
          <h5 className="card-title mb-4 text-primary fw-semibold">Scholarship List</h5>
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead className="table-primary text-center">
                <tr>
                    <th>Title</th>
    <th>Description</th>
    <th>Deadline</th>
    <th>Apply Link</th>
    <th>Available</th>
    <th> Study Field </th>
    <th>Provider</th>
    <th>Category</th>
    <th>Type</th>
    <th>Image</th>
                  <th style={{ width: "110px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {scholarships.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center fst-italic">
                      No scholarships found.
                    </td>
                  </tr>
                ) : (
                  scholarships.map((scholarship) => (
                    <tr key={scholarship.id}>
                      <td>{scholarship.title}</td>
                      <td className="text-truncate" style={{ maxWidth: "200px" }}>
                        {scholarship.description}
                      </td>
                    <td>
  {scholarship.deadline ? 
    new Date(scholarship.deadline).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }) 
    : 'No deadline'}
</td>
                      <td className="text-center">
                        <a
                          href={scholarship.applyLink}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-primary"
                        >
                          Apply
                        </a>
                      </td>
                      <td className="text-center">{scholarship.isAvailable ? "Yes" : "No"}</td>
                      <td>{scholarship.studyField || 'N/A'}</td>
                      <td>{getProviderName(scholarship.providerId)}</td>
                      <td>{getCategoryName(scholarship.scholarshipCategoryId)}</td>
                      <td>{getTypeName(scholarship.scholarshipTypeId)}</td>
                      <td className="text-center">
                        {scholarship.imageFile ? (
                          <img
                            src={`https://localhost:7255/${scholarship.imageFile.replace(/^\.?\/?/, "")}`}
                            alt={scholarship.title}
                            style={{ width: "100px", height: "auto", objectFit: "cover" }}
                            className="img-thumbnail"
                          />
                        ) : (
                          <span className="text-muted">No image</span>
                        )}
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-outline-warning btn-sm me-2"
                          onClick={() => handleEdit(scholarship)}
                          title="Edit "
                        >
                          <PencilSquare />
                        </button>
                      
      <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => handleDelete(scholarship.id)}
              title="Delete"
            >
              <TrashFill />
            </button>
                      </td>
                    </tr>
                  ))

    
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScholarshipsManagement;