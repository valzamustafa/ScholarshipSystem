import React, { useState } from "react";
import { CheckCircle, XCircle } from "react-bootstrap-icons";

function ScholarshipForm({ 
  scholarship, 
  categories, 
  types, 
  providerId,
  onClose, 
  onSubmit 
}) {
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState({
    title: scholarship?.title || "",
    description: scholarship?.description || "",
    studyField: scholarship?.studyField || "",
    deadline: formatDateForInput(scholarship?.deadline),
    isAvailable: scholarship?.isAvailable ?? true,
    scholarshipCategoryId: scholarship?.scholarshipCategory?.id || "",
    scholarshipTypeId: scholarship?.scholarshipType?.id || "",
    imageFile: null,
    existingImageUrl: scholarship?.imageUrl || null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files[0]
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.scholarshipCategoryId || !formData.scholarshipTypeId) {
      alert("Please fill all required fields");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("Title", formData.title);
    formDataToSend.append("Description", formData.description);
    formDataToSend.append("StudyField", formData.studyField);
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
    <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" style={{ zIndex: 1050 }}>
      <div className="card shadow-lg rounded-4 border border-primary w-100" style={{ maxWidth: "800px" }}>
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center rounded-top-4">
          <h5 className="mb-0">{scholarship ? "Edit Scholarship" : "Add New Scholarship"}</h5>
          <button className="btn btn-outline-light btn-sm" onClick={onClose}>
            <XCircle />
          </button>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Title"
                    required
                  />
                  <label>Title</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                    style={{ height: "100px" }}
                    required
                  />
                  <label>Description</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    name="studyField"
                    value={formData.studyField}
                    onChange={handleChange}
                    placeholder="Study Field"
                  />
                  <label>Study Field</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="date"
                    className="form-control"
                    name="deadline"
                    value={formData.deadline || ""}
                    onChange={handleChange}
                    placeholder="Deadline"
                  />
                  <label>Deadline</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <select
                    className="form-select"
                    name="scholarshipCategoryId"
                    value={formData.scholarshipCategoryId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories?.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <label>Category</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <select
                    className="form-select"
                    name="scholarshipTypeId"
                    value={formData.scholarshipTypeId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Type</option>
                    {types?.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <label>Type</label>
                </div>
              </div>

              <div className="col-md-6 d-flex align-items-center">
                <div className="form-check mt-3">
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
              </div>

              <div className="col-md-6">
                <label className="form-label">Image (optional)</label>
                <input
                  type="file"
                  className="form-control"
                  name="imageFile"
                  onChange={handleChange}
                  accept="image/*"
                />
                {formData.imageFile ? (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(formData.imageFile)}
                      alt="Preview"
                      className="img-thumbnail"
                      style={{ maxWidth: "150px" }}
                    />
                  </div>
                ) : formData.existingImageUrl ? (
                  <div className="mt-2">
                    <img
                      src={`https://localhost:7255/${formData.existingImageUrl.replace(/^\.?\/?/, "")}`}
                      alt="Existing"
                      className="img-thumbnail"
                      style={{ maxWidth: "150px" }}
                    />
                  </div>
                ) : null}
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success d-flex align-items-center">
                <CheckCircle className="me-2" />
                {scholarship ? "Update Scholarship" : "Add Scholarship"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ScholarshipForm;
