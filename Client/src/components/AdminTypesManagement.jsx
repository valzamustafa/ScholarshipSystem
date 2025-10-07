import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';

function AdminTypesManagement() {
  const [types, setTypes] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('https://localhost:7255/api/scholarshiptype/all-with-counts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to fetch types');
      
      const data = await response.json();
      setTypes(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (type) => {
    setEditingType(type);
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://localhost:7255/api/scholarshiptype/admin/${editingType.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editingType.name,
          description: editingType.description
        })
      });

      if (!response.ok) throw new Error('Failed to update type');
      
      setShowEditModal(false);
      fetchTypes(); // Refresh list
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this type?')) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://localhost:7255/api/scholarshiptype/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete type');
      
      fetchTypes(); // Refresh list
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Manage Scholarship Types</h5>
      </div>
      <div className="card-body">
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Table responsive striped>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Scholarships</th>
              <th>Source</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {types.map(type => (
              <tr key={type.id}>
                <td>{type.name}</td>
                <td>{type.description}</td>
                <td>
                  <Badge bg="primary">{type.scholarshipCount}</Badge>
                </td>
                <td>
                  <Badge bg={type.createdByProvider ? "warning" : "success"}>
                    {type.createdByProvider ? "Provider" : "System"}
                  </Badge>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => handleEdit(type)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDelete(type.id)}
                      disabled={type.scholarshipCount > 0}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Edit Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Type</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleUpdate}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editingType?.name || ''}
                  onChange={(e) => setEditingType({...editingType, name: e.target.value})}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editingType?.description || ''}
                  onChange={(e) => setEditingType({...editingType, description: e.target.value})}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

export default AdminTypesManagement;