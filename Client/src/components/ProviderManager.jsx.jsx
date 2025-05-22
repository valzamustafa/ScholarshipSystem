import React from "react";

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
  return (
    <>
      <h3>Manage Providers</h3>
      <button
        className="btn btn-primary mb-3"  style={{ marginTop: "200px" }}
        onClick={() => setShowAddProviderForm(!showAddProviderForm)}
      >
        {showAddProviderForm ? "Cancel" : "Add Provider"}
      </button>
      {showAddProviderForm && (
        <form onSubmit={handleAddProvider} className="mb-4">
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={newProvider.fullName}
              onChange={(e) =>
                setNewProvider({ ...newProvider, fullName: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={newProvider.email}
              onChange={(e) =>
                setNewProvider({ ...newProvider, email: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Organization Name</label>
            <input
              type="text"
              className="form-control"
              value={newProvider.organizationName}
              onChange={(e) =>
                setNewProvider({
                  ...newProvider,
                  organizationName: e.target.value,
                })
              }
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-control"
              value={newProvider.phoneNumber}
              onChange={(e) =>
                setNewProvider({
                  ...newProvider,
                  phoneNumber: e.target.value,
                })
              }
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={newProvider.password}
              onChange={(e) =>
                setNewProvider({ ...newProvider, password: e.target.value })
              }
              required
            />
          </div>
          <button type="submit" className="btn btn-success">
            Add Provider
          </button>
        </form>
      )}

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Organization</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((provider) => (
            <tr key={provider.id}>
              <td>
                {editingProviderId === provider.id ? (
                  <input
                    type="text"
                    value={providerEditData.fullName}
                    onChange={(e) =>
                      setProviderEditData({
                        ...providerEditData,
                        fullName: e.target.value,
                      })
                    }
                  />
                ) : (
                  provider.fullName
                )}
              </td>
              <td>
                {editingProviderId === provider.id ? (
                  <input
                    type="email"
                    value={providerEditData.email}
                    onChange={(e) =>
                      setProviderEditData({
                        ...providerEditData,
                        email: e.target.value,
                      })
                    }
                  />
                ) : (
                  provider.email
                )}
              </td>
              <td>{provider.organizationName || "N/A"}</td>
              <td>{provider.phoneNumber || "N/A"}</td>
              <td>
                {editingProviderId === provider.id ? (
                  <>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => saveEditProvider(provider.id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={cancelEditProvider}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => startEditProvider(provider)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteProvider(provider.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default ProviderManager;
