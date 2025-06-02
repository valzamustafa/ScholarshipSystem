/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  FiUser, FiMail, FiPhone, FiBriefcase, FiEdit, FiSave, FiX
} from "react-icons/fi";

function ProviderProfile({ provider, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProvider, setEditedProvider] = useState({ ...provider });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProvider(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`https://localhost:7255/api/provider/${provider.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          id: provider.id,
          fullName: editedProvider.fullName,
          email: editedProvider.email,
          organizationName: editedProvider.organizationName,
          phoneNumber: editedProvider.phoneNumber,
          roleId: provider.roleId
        })
      });

      const data = await response.json();
      onUpdate(data);
      setIsEditing(false);
    } catch (error) {
      setError("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (!provider) return <div className="text-center py-5">Loading profile...</div>;

  return (
    <div className="card shadow-lg border-0">
      <div className="card-body p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
          <h4 className="mb-0 fw-semibold text-primary">Provider Profile</h4>
          {!isEditing ? (
            <button className="btn btn-outline-primary btn-sm" onClick={() => setIsEditing(true)}>
              <FiEdit className="me-1" /> Edit
            </button>
          ) : (
            <div>
              <button className="btn btn-outline-success btn-sm me-2" onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? 'Saving...' : (<><FiSave className="me-1" /> Save</>)}
              </button>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => {
                setIsEditing(false);
                setEditedProvider({ ...provider });
                setError(null);
              }} disabled={isLoading}>
                <FiX className="me-1" /> Cancel
              </button>
            </div>
          )}
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        
        <div className="text-center mb-4">
          <div className="rounded-circle bg-primary d-inline-flex align-items-center justify-content-center shadow"
            style={{ width: '90px', height: '90px' }}>
            <FiUser size={42} className="text-white" />
          </div>
          {isEditing ? (
            <div className="mt-3">
              <input
                type="text"
                name="fullName"
                value={editedProvider.fullName}
                onChange={handleInputChange}
                className="form-control text-center mb-2"
                placeholder="Full Name"
              />
              <input
                type="text"
                name="organizationName"
                value={editedProvider.organizationName}
                onChange={handleInputChange}
                className="form-control text-center"
                placeholder="Organization Name"
              />
            </div>
          ) : (
            <>
              <h5 className="mt-3 mb-1 fw-bold">{provider.fullName}</h5>
              <p className="text-muted mb-0">{provider.organizationName}</p>
            </>
          )}
        </div>

        
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label d-flex align-items-center">
              <FiMail className="me-2 text-primary" /> Email
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={editedProvider.email}
                onChange={handleInputChange}
                className="form-control"
              />
            ) : (
              <div className="ps-4">{provider.email}</div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label d-flex align-items-center">
              <FiPhone className="me-2 text-primary" /> Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phoneNumber"
                value={editedProvider.phoneNumber || ''}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Enter phone number"
              />
            ) : (
              <div className="ps-4">{provider.phoneNumber || 'Not provided'}</div>
            )}
          </div>

          {!isEditing && (
            <div className="col-md-12">
              <label className="form-label d-flex align-items-center">
                <FiBriefcase className="me-2 text-primary" /> Organization
              </label>
              <div className="ps-4">{provider.organizationName}</div>
            </div>
          )}
        </div>

       
        {!isEditing && (
          <div className="mt-4 pt-3 border-top">
            <h5 className="mb-3 text-secondary">Quick Stats</h5>
            <div className="row g-3">
              <div className="col-sm-6">
                <div className="card text-center border-0 shadow-sm">
                  <div className="card-body">
                    <h6 className="text-muted">Scholarships</h6>
                    <h4 className="fw-bold mb-0">{provider.scholarshipCount || 0}</h4>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="card text-center border-0 shadow-sm">
                  <div className="card-body">
                    <h6 className="text-muted">Awarded</h6>
                    <h4 className="fw-bold mb-0">{provider.awardedCount || 0}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ProviderProfile;
