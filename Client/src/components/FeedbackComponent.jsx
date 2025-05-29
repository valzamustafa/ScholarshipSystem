import React from "react";
import { FiMessageSquare  } from "react-icons/fi";
import { TrashFill } from "react-bootstrap-icons";


function FeedbackComponent({ feedbacks, onDeleteFeedback, onToggleFeatured }) {
  return (
    <div
      className="card shadow-lg rounded-4 border border-primary mb-4"
      style={{ marginTop: "100px" }}
    >
      <div className="card-header bg-primary text-white d-flex align-items-center rounded-top-4">
        <FiMessageSquare className="me-2" size={20} />
        <h5 className="mb-0">User Feedback</h5>
      </div>

      <div className="card-body p-3">
        {feedbacks.length === 0 ? (
          <div className="alert alert-info text-center mb-0">
            No feedback received yet.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead className="table-primary">
                <tr>
                  <th>User</th>
                  <th>Scholarship</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Date</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((feedback) => (
                  <tr key={feedback.id}>
                    <td>{feedback.userFullName}</td>
                    <td>{feedback.scholarshipTitle}</td>
                    <td className="text-warning">
                      {Array(feedback.rating).fill("★").join("")}
                    </td>
                    <td>{feedback.comment}</td>
                    <td>
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${
                          feedback.isFeatured
                            ? "btn-success"
                            : "btn-outline-secondary"
                        }`}
                        onClick={() => onToggleFeatured(feedback.id)}
                      >
                        {feedback.isFeatured ? "Featured ★" : "Feature"}
                      </button>
                    </td>
                  <td>
  <button
    className="btn btn-outline-danger btn-sm"
    onClick={() => onDeleteFeedback(feedback.id)}
    title="Delete"
  >
    <TrashFill />
  </button>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default FeedbackComponent;
