import React, { useState } from "react";
import { FiX } from "react-icons/fi";

function ScholarshipForm({ 
  scholarship, 
  categories, 
  types, 
  providerId,
  onClose, 
  onSubmit 
}) {
const [formData, setFormData] = useState({
  title: scholarship?.title || "",
  description: scholarship?.description || "",
  applyLink: scholarship?.applyLink || "",
  deadline: scholarship?.deadline || "",
  isAvailable: scholarship?.isAvailable || true,
  scholarshipCategoryId: scholarship?.scholarshipCategory?.id || "",
  scholarshipTypeId: scholarship?.scholarshipType?.id || "",
  imageFile: null
});

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : 
              type === "file" ? files[0] : 
              value
    }));
  };
const handleSubmit = (e) => {
  e.preventDefault();

  if (!formData.title || !formData.description || !formData.applyLink || 
      !formData.scholarshipCategoryId || !formData.scholarshipTypeId) {
    alert("Please fill all required fields");
    return;
  }

  const formDataToSend = new FormData();
  formDataToSend.append("Title", formData.title);
  formDataToSend.append("Description", formData.description);
  formDataToSend.append("ApplyLink", formData.applyLink);
  formDataToSend.append("Deadline", formData.deadline || "");
  formDataToSend.append("IsAvailable", formData.isAvailable);
  formDataToSend.append("ScholarshipCategoryId", formData.scholarshipCategoryId);
  formDataToSend.append("ScholarshipTypeId", formData.scholarshipTypeId);
  formDataToSend.append("ProviderId", providerId);
  
  if (formData.imageFile) {
    formDataToSend.append("ImageFile", formData.imageFile);
  }

  onSubmit(formDataToSend);
};
  return (
    <div className="modal-backdrop" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div className="modal-content bg-white p-4 rounded" style={{ width: '600px', maxWidth: '90%' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>{scholarship ? "Edit Scholarship" : "Add New Scholarship"}</h4>
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Apply Link</label>
            <input
              type="url"
              className="form-control"
              name="applyLink"
              value={formData.applyLink}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Deadline</label>
           <input 
  type="date"
  name="deadline"
  value={formData.deadline || ''}
  onChange={handleChange}
/>


          </div>
          
          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              name="scholarshipCategoryId"
              value={formData.scholarshipCategoryId}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories?.map(category => (
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
              onChange={handleChange}
              required
            >
              <option value="">Select a type</option>
              {types?.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="isAvailable"
              id="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="isAvailable">
              Available
            </label>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Image</label>
            <input
              type="file"
              className="form-control"
              name="imageFile"
              onChange={handleChange}
              accept="image/*"
            />
          </div>
          
          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {scholarship ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ScholarshipForm;