import { FiPlus, FiEdit, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import ScholarshipForm from "./ScholarshipForm";

function ScholarshipsSection({
  scholarships,
  categories,
  types,
  currentProvider,
  showForm,
  editingScholarship,
  onDelete,
  onToggleAvailability,
  onSubmit,
  onEdit,
  onShowForm
}) {
  return (
    <div className="card mb-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">My Scholarships</h5>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            onEdit(null);
            onShowForm(true);
          }}
        >
          <FiPlus className="me-1" /> Add Scholarship
        </button>
      </div>
      <div className="card-body">
        {showForm && (
          <ScholarshipForm
            scholarship={editingScholarship}
            categories={categories}
            types={types}
            providerId={currentProvider?.id}
            onClose={() => onShowForm(false)}
            onSubmit={onSubmit}
          />
        )}

        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
               <th>University</th>
                <th>Academic Year</th>
                <th>Eligibility Criteria</th>

                <th>Study Field</th>
                <th>Deadline</th>
                <th>Available</th>
                <th>Provider</th>
                <th>Category</th>
                <th>Type</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {scholarships.map((scholarship) => (
                <tr key={scholarship.id}>
                  <td>{scholarship.title}</td>
                  <td>
                    {scholarship.description.length > 50
                      ? `${scholarship.description.substring(0, 50)}...`
                      : scholarship.description}
                  </td>
                    <td>{scholarship.university || 'N/A'}</td>
                  <td>{scholarship.academicYear || 'N/A'}</td>
                  <td>
                    {scholarship.eligibilityCriteria && scholarship.eligibilityCriteria.length > 30
                      ? `${scholarship.eligibilityCriteria.substring(0, 30)}...`
                      : scholarship.eligibilityCriteria || 'N/A'}
                  </td>
                  <td>{scholarship.studyField || 'N/A'}</td>
                  <td>
                    {scholarship.deadline && !isNaN(new Date(scholarship.deadline).getTime())
                      ? new Date(scholarship.deadline).toLocaleDateString('en-GB', { 
                          day: '2-digit', 
                          month: '2-digit', 
                          year: 'numeric' 
                        })
                      : 'N/A'}
                  </td>
                  <td>
                    <span className={`badge ${scholarship.isAvailable ? "bg-success" : "bg-secondary"}`}>
                      {scholarship.isAvailable ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>{currentProvider?.organizationName || currentProvider?.fullName || 'N/A'}</td>
                  <td>{scholarship.scholarshipCategory?.name || "N/A"}</td>
                  <td>{scholarship.scholarshipType?.name || "N/A"}</td>
                  <td>
                    {scholarship.imageFile ? (
                      <img
                        src={`https://localhost:7255/${scholarship.imageFile.replace(/^\.?\/?/, '')}`}
                        alt={scholarship.title}
                        style={{ width: "100px", height: "auto", objectFit: "cover" }}
                        className="img-thumbnail"
                      />
                    ) : (
                      "No image"
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => {
                          onEdit({
                            ...scholarship,
                            scholarshipCategoryId: scholarship.scholarshipCategory?.id,
                            scholarshipTypeId: scholarship.scholarshipType?.id,
                            studyField: scholarship.studyField || '',
                               university: scholarship.university || '',
                            academicYear: scholarship.academicYear || '',
                            eligibilityCriteria: scholarship.eligibilityCriteria || ''
                          
                          });
                          onShowForm(true);
                        }}
                      >
                        <FiEdit />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDelete(scholarship.id)}
                      >
                        <FiTrash2 />
                      </button>
                      <button
                        className={`btn btn-sm ${
                          scholarship.isAvailable
                             ?"btn-outline-success"
                            : "btn-outline-warning"
                           
                        }`}
                        onClick={() => onToggleAvailability(scholarship.id, scholarship.isAvailable)}
                      >
                        {scholarship.isAvailable ? <FiCheck /> : <FiX />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ScholarshipsSection;