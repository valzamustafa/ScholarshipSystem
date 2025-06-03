import React, { useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { FiX } from "react-icons/fi";

function FeedbackForm({ show, onClose, onSubmit }) {
  const [feedbackData, setFeedbackData] = useState({
    comment: "",
    rating: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://localhost:7255/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(feedbackData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit feedback");
      }
      
      const data = await response.json();
      alert("Feedback submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Submit Feedback</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
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