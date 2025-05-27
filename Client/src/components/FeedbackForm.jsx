import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { FiX } from "react-icons/fi";

function FeedbackForm({ onClose, onSubmit, scholarships }) {
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
    <div className="modal-backdrop">
      <div className="modal-content bg-white p-4 rounded" style={{ width: '600px' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Submit Feedback</h4>
          <Button variant="outline-secondary" onClick={onClose}>
            <FiX size={20} />
          </Button>
        </div>

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

          <Button variant="primary" type="submit">Submit</Button>
        </Form>
      </div>
    </div>
  );
}

export default FeedbackForm;