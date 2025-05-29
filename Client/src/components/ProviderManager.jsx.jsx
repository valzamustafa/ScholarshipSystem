import React from "react";
import { PencilSquare, TrashFill, PlusCircle, XCircle, CheckCircle } from "react-bootstrap-icons";

function ProviderManager({
  providers,
  newProvider,
  setNewProvider,
  showAddProviderForm,
  setShowAddProviderForm,
  handleAddProvider,
  editingProviderId,
  providerEditData,
  setProviderEditData,
  startEditProvider,
  cancelEditProvider,
  saveEditProvider,
  deleteProvider,
}) {
  
  const renderEditableInput = (field, type = "text", placeholder = "") => (
    <input
      type={type}
      className="form-control"
      placeholder={placeholder}
      value={providerEditData[field] || ""}
      onChange={(e) =>
        setProviderEditData({ ...providerEditData, [field]: e.target.value })
      }
    />
  );

  return (
    <div className="card shadow-lg rounded-4 border border-primary mb-4" style={{ marginTop: '100px' }}>
     <div className="card-header bg-primary text-white d-flex align-items-center justify-content-between rounded-top-4">
      <div className="d-flex align-items-center">
        <h5 className="mb-0">Manage Providers</h5>
        </div>
        <button
          className={`btn btn-${showAddProviderForm ? "outline-danger" : "light"} d-flex align-items-center`}
          onClick={() => setShowAddProviderForm(!showAddProviderForm)}
        >
          {showAddProviderForm ? (
            <>
              <XCircle className="me-2" />
              Cancel
            </>
          ) : (
            <>
              <PlusCircle className="me-2" />
              Add Provider
            </>
          )}
        </button>
      </div>
      {showAddProviderForm && (
        <div className="card mb-5 shadow-lg rounded-3 border border-primary">
          <div className="card-body">
            <h5 className="card-title mb-4 text-primary fw-semibold">Add New Provider</h5>
            <form onSubmit={handleAddProvider}>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="fullName"
                      placeholder="Full Name"
                      value={newProvider.fullName}
                      onChange={(e) =>
                        setNewProvider({ ...newProvider, fullName: e.target.value })
                      }
                      required
                    />
                    <label htmlFor="fullName">Full Name</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Email"
                      value={newProvider.email}
                      onChange={(e) =>
                        setNewProvider({ ...newProvider, email: e.target.value })
                      }
                      required
                    />
                    <label htmlFor="email">Email</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="organizationName"
                      placeholder="Organization Name"
                      value={newProvider.organizationName}
                      onChange={(e) =>
                        setNewProvider({ ...newProvider, organizationName: e.target.value })
                      }
                    />
                    <label htmlFor="organizationName">Organization Name</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="phoneNumber"
                      placeholder="Phone Number"
                      value={newProvider.phoneNumber}
                      onChange={(e) =>
                        setNewProvider({ ...newProvider, phoneNumber: e.target.value })
                      }
                    />
                    <label htmlFor="phoneNumber">Phone Number</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Password"
                      value={newProvider.password}
                      onChange={(e) =>
                        setNewProvider({ ...newProvider, password: e.target.value })
                      }
                      required
                    />
                    <label htmlFor="password">Password</label>
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-success mt-4 d-flex align-items-center">
                <CheckCircle className="me-2" />
                Add Provider
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="card shadow-lg rounded-3 border border-primary">
        <div className="card-body">
          <h5 className="card-title mb-4 text-primary fw-semibold">Provider List</h5>
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead className="table-primary">
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Organization</th>
                  <th>Phone</th>
                  <th style={{ width: "170px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {providers.map((provider) => (
                  <tr key={provider.id}>
                    <td>
                      {editingProviderId === provider.id
                        ? renderEditableInput("fullName", "text", "Full Name")
                        : provider.fullName}
                    </td>
                    <td>
                      {editingProviderId === provider.id
                        ? renderEditableInput("email", "email", "Email")
                        : provider.email}
                    </td>
                    <td>
                      {editingProviderId === provider.id
                        ? renderEditableInput("organizationName", "text", "Organization")
                        : provider.organizationName || "N/A"}
                    </td>
                    <td>
                      {editingProviderId === provider.id
                        ? renderEditableInput("phoneNumber", "text", "Phone Number")
                        : provider.phoneNumber || "N/A"}
                    </td>
                    <td>
                      {editingProviderId === provider.id ? (
                        <>
                         <button
        className="btn btn-success btn-sm me-2"
        onClick={() => saveEditProvider(provider.id)}
        title="Save"
      >
        <CheckCircle />
      </button>
      <button
        className="btn btn-secondary btn-sm"
        onClick={cancelEditProvider}
        title="Cancel"
      >
        <XCircle />
      </button>
    </>
  ) : (
    <>
      <button
        className="btn btn-outline-warning btn-sm me-2"
        onClick={() => startEditProvider(provider)}
        title="Edit"
      >
        <PencilSquare />
      </button>
      <button
        className="btn btn-outline-danger btn-sm"
        onClick={() => deleteProvider(provider.id)}
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
        </div>
      </div>
    </div>
  );
}

export default ProviderManager; 