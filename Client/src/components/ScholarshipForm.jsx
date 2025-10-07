import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';

function ScholarshipForm({ scholarship, categories, types, providerId, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: scholarship?.title || '',
    description: scholarship?.description || '',
    studyField: scholarship?.studyField || '',
    deadline: scholarship?.deadline ? new Date(scholarship.deadline).toISOString().split('T')[0] : '',
    isAvailable: scholarship?.isAvailable ?? true,
    scholarshipCategoryId: scholarship?.scholarshipCategoryId || '',
    scholarshipTypeId: scholarship?.scholarshipTypeId || '',
    providerId: providerId,
    imageFile: null
  });

  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [showNewTypeModal, setShowNewTypeModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [newType, setNewType] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [localCategories, setLocalCategories] = useState(categories || []);
  const [localTypes, setLocalTypes] = useState(types || []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (formData.scholarshipCategoryId === 'other') {
        setError('Ju lutem krijoni një kategori të re ose zgjidhni një kategori ekzistuese');
        setLoading(false);
        return;
      }

      if (formData.scholarshipTypeId === 'other') {
        setError('Ju lutem krijoni një lloj të ri ose zgjidhni një lloj ekzistues');
        setLoading(false);
        return;
      }

      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('studyField', formData.studyField);
      submitData.append('deadline', formData.deadline);
      submitData.append('isAvailable', formData.isAvailable.toString());
      submitData.append('scholarshipCategoryId', formData.scholarshipCategoryId);
      submitData.append('scholarshipTypeId', formData.scholarshipTypeId);
      submitData.append('providerId', formData.providerId);
      
      if (formData.imageFile) {
        submitData.append('imageFile', formData.imageFile);
      }

      await onSubmit(submitData);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      setError('Emri i kategorisë është i detyrueshëm');
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch('https://localhost:7255/api/scholarship/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newCategory)
      });

      if (!response.ok) {
        throw new Error('Dështoi krijimi i kategorisë');
      }

      const createdCategory = await response.json();

      const updatedCategories = [...localCategories, createdCategory];
      setLocalCategories(updatedCategories);
      
    
      setFormData(prev => ({
        ...prev,
        scholarshipCategoryId: createdCategory.id.toString()
      }));

      setShowNewCategoryModal(false);
      setNewCategory({ name: '', description: '' });
      
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateType = async () => {
    if (!newType.name.trim()) {
      setError('Emri i llojit është i detyrueshëm');
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch('https://localhost:7255/api/scholarship/type', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newType)
      });

      if (!response.ok) {
        throw new Error('Dështoi krijimi i llojit');
      }

      const createdType = await response.json();
      
     
      const updatedTypes = [...localTypes, createdType];
      setLocalTypes(updatedTypes);
      

      setFormData(prev => ({
        ...prev,
        scholarshipTypeId: createdType.id.toString()
      }));

      setShowNewTypeModal(false);
      setNewType({ name: '', description: '' });
      
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setFormData({...formData, scholarshipCategoryId: value});
    
   
    if (value === 'other') {
      setShowNewCategoryModal(true);
    }
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setFormData({...formData, scholarshipTypeId: value});
    

    if (value === 'other') {
      setShowNewTypeModal(true);
    }
  };

  return (
    <>
      <div className="card mb-4">
        <div className="card-header">
          <h5>{scholarship ? 'Edit Scholarship' : 'Add New Scholarship'}</h5>
        </div>
        <div className="card-body">
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Study Field</Form.Label>
              <Form.Control
                type="text"
                value={formData.studyField}
                onChange={(e) => setFormData({...formData, studyField: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Deadline *</Form.Label>
              <Form.Control
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                required
              />
            </Form.Group>

 
            <Form.Group className="mb-3">
              <Form.Label>Category *</Form.Label>
              <Form.Select
                value={formData.scholarshipCategoryId}
                onChange={handleCategoryChange}
                required
              >
                <option value="">Select Category</option>
                {localCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
                <option value="other">+ Add New Category</option>
              </Form.Select>
              {formData.scholarshipCategoryId === 'other' && (
                <small className="text-muted">
                  Klikoni "Add New Category" për të krijuar një kategori të re
                </small>
              )}
            </Form.Group>


            <Form.Group className="mb-3">
              <Form.Label>Type *</Form.Label>
              <Form.Select
                value={formData.scholarshipTypeId}
                onChange={handleTypeChange}
                required
              >
                <option value="">Select Type</option>
                {localTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
                <option value="other">+ Add New Type</option>
              </Form.Select>
              {formData.scholarshipTypeId === 'other' && (
                <small className="text-muted">
                  Klikoni "Add New Type" për të krijuar një lloj të ri
                </small>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({...formData, imageFile: e.target.files[0]})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Available"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})}
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Duke u ruajtur...' : (scholarship ? 'Update' : 'Create')}
              </Button>
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </div>

      {/* New Category Modal */}
      <Modal show={showNewCategoryModal} onHide={() => setShowNewCategoryModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Category Name *</Form.Label>
            <Form.Control
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
              placeholder="Enter category name"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={newCategory.description}
              onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
              placeholder="Enter category description"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowNewCategoryModal(false);
            setFormData(prev => ({...prev, scholarshipCategoryId: ''}));
          }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateCategory}>
            Create Category
          </Button>
        </Modal.Footer>
      </Modal>

      {/* New Type Modal */}
      <Modal show={showNewTypeModal} onHide={() => setShowNewTypeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Type Name *</Form.Label>
            <Form.Control
              type="text"
              value={newType.name}
              onChange={(e) => setNewType({...newType, name: e.target.value})}
              placeholder="Enter type name"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={newType.description}
              onChange={(e) => setNewType({...newType, description: e.target.value})}
              placeholder="Enter type description"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowNewTypeModal(false);
            setFormData(prev => ({...prev, scholarshipTypeId: ''}));
          }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateType}>
            Create Type
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ScholarshipForm;