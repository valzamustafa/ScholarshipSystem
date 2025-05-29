import React from "react";
import { FiMail, FiTrash2 } from "react-icons/fi";
import axios from "axios";

function ContactMessages({ messages, fetchMessages }) {
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://localhost:7255/api/contact/${id}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      fetchMessages(); 
    } catch (error) {
      console.error("Error deleting message:", error);
      alert(error.response?.data?.message || "Failed to delete message");
    }
  };

  return (
    <div className="card shadow-lg rounded-4 border border-primary mb-4" 
      style={{ marginTop: '100px' }}>
      <div className="card-header bg-primary text-white d-flex align-items-center rounded-top-4">
        <FiMail className="me-2" size={20} />
        <h5 className="mb-0">Contact Messages</h5>
      </div>

      <div className="card-body p-3">
        {messages.length === 0 ? (
          <div className="alert alert-info text-center mb-0">
            No messages found.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead className="table-primary">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <tr key={msg.id}>
                    <td>{msg.name}</td>
                    <td>{msg.email}</td>
                    <td>{msg.subject || "-"}</td>
                    <td>{msg.message}</td>
                    <td>
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(msg.id)}
                        title="Delete message"
                      >
                        <FiTrash2 />
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

export default ContactMessages;