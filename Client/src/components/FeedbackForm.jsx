import React, { useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { FiX } from "react-icons/fi";

function FeedbackForm({ show, onClose, onSubmit, scholarships }) {
  const [feedbackData, setFeedbackData] = useState({
    comment: "",
    rating: 0,
    scholarshipId: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feedbackData.scholarshipId) {
      alert("Please select a scholarship");
      return;
    }
    onSubmit(feedbackData);
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Submit Feedback</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Scholarship *</Form.Label>
            <Form.Select
              name="scholarshipId"
              value={feedbackData.scholarshipId}
              onChange={handleChange}
              required
            >
              <option value="">Select a scholarship</option>
              {scholarships.map(scholarship => (
                <option key={scholarship.id} value={scholarship.id}>
                  {scholarship.title}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Rating *</Form.Label>
            <Form.Select
              name="rating"
              value={feedbackData.rating}
              onChange={handleChange}
              required
            >
              <option value="">Select rating</option>
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num} ⭐</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="comment"
              value={feedbackData.comment}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default FeedbackForm;