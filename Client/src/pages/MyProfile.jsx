/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Modal,Form ,Button,Spinner,Alert} from 'react-bootstrap';
const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('info');
  const navigate = useNavigate();
  const inputRef = useRef();
  const [messages, setMessages] = useState([]);
const [loadingMessages, setLoadingMessages] = useState(false);
const [messageError, setMessageError] = useState(null);
const [activeMessageTab, setActiveMessageTab] = useState('received');
const [showMessageModal, setShowMessageModal] = useState(false);
const [selectedMessage, setSelectedMessage] = useState(null);
const [replyContent, setReplyContent] = useState({
      subject: '',
    content: '',
    recipientId: null,
    scholarshipId: null,
    parentMessageId: null
});
useEffect(() => {
    if (activeTab === 'messages' && profile?.id) {
        fetchMessages(profile.id);
    }
}, [activeTab, profile?.id]);

const fetchMessages = async (userId) => {
    setLoadingMessages(true);
    try {
        const token = localStorage.getItem("token");
        const endpoint = activeMessageTab === 'received' 
            ? `received/${userId}`
            : `sent/${userId}`;
            
        const res = await fetch(`https://localhost:7255/api/message/${endpoint}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error('Failed to load messages');
        
        const data = await res.json();
        setMessages(data);
    } catch (error) {
        setMessageError(error.message);
    } finally {
        setLoadingMessages(false);
    }
};

const handleReply = (message) => {
    setSelectedMessage(message);
    setReplyContent({
        subject: `Re: ${message.subject}`,
        content: '',
        recipientId: activeMessageTab === 'received' ? message.senderId : message.recipientId,
        scholarshipId: message.scholarshipId,
        parentMessageId: message.id
    });
    setShowMessageModal(true);
};

const handleDeleteMessage = async (messageId) => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`https://localhost:7255/api/message/${messageId}`, {
            method: "DELETE",
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || "Failed to delete message");
        }
        
        setMessages(messages.filter(msg => msg.id !== messageId));
    } catch (error) {
        console.error("Error deleting message:", error);
        setMessageError(error.message || "Failed to delete message");
    }
};
const handleSendReply = async () => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch('https://localhost:7255/api/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(replyContent)
        });

        if (!res.ok) throw new Error('Failed to send reply');
        
        setShowMessageModal(false);
        setReplyContent({});
        fetchMessages(profile.id); 
    } catch (error) {
        console.error("Error sending reply:", error);
        setMessageError(error.message);
    }
};
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("https://localhost:7255/api/student/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          setError("Nuk u mor profili. Provoni përsëri më vonë.");
        }
      } catch (err) {
        setError("Gabim gjatë marrjes së profilit.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleImageUpload = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://localhost:7255/api/student/upload-profile-picture", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload failed:", errorText);
        return;
      }

      const data = await response.json();
      setProfile(prev => ({ ...prev, imageUrl: data.url }));
    } catch (error) {
      console.error("Gabim në ngarkim:", error);
    }
  };

  const handleIconClick = () => {
    inputRef.current.click();
  };

  if (loading) return <div className="text-center mt-5">Duke u ngarkuar profili...</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  if (!profile) return <div className="text-center mt-4">Nuk u gjetën të dhëna për profilin.</div>;

  return (
    <div className="container-fluid py-4 mt-5 m-0 p-0 vw-100 overflow-x-hidden">
      <div className="row">
    
        <div className="col-md-3 mb-4">
          <div className="card shadow-sm border-0 text-center">
            <div className="card-body">
              <div className="position-relative mx-auto mb-3" style={{ width: '120px' }}>
                <img
                  src={profile.imageUrl || "/88b6a298-53ef-4c73-a89a-7a0116d4e7ee.png"}
                  alt="Profile"
                  className="rounded-circle border border-3 border-primary img-fluid"
                  style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={inputRef}
                  onChange={handleImageUpload}
                  className="d-none"
                />
                <button
                  className="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle"
                  onClick={handleIconClick}
                  style={{ width: '28px', height: '28px' }}
                  title="Ndrysho foton"
                >
                  <i className="bi bi-pencil"></i>
                </button>
              </div>
              <h5>{profile.fullName}</h5>
              <p className="text-muted small">{profile.email}</p>
              <span className="badge bg-primary">{profile.role}</span>
              <hr />
              <div className="d-grid gap-2">
                <button
                  className={`btn ${activeTab === 'info' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setActiveTab('info')}
                >
                  🧍‍♂️ Të Dhënat Personale
                </button>
                <button
                  className={`btn ${activeTab === 'apps' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setActiveTab('apps')}
                >
                  🎓 Aplikimet për Bursa
                </button>
              
<button
    className={`btn ${activeTab === 'messages' ? 'btn-primary' : 'btn-outline-primary'}`}
    onClick={() => setActiveTab('messages')}
>
    ✉️ Messages
</button>
              </div>
            </div>
          </div>
        </div>

       
        <div className="col-md-9">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              {activeTab === 'info' && (
                <>
                  <h5 className="mb-3">📄 Të Dhënat Personale</h5>
                  <div className="row mb-2"><div className="col-5 fw-semibold">Emri:</div><div className="col-7">{profile.fullName}</div></div>
                  <div className="row mb-2"><div className="col-5 fw-semibold">Email:</div><div className="col-7">{profile.email}</div></div>
                  <div className="row mb-2"><div className="col-5 fw-semibold">Shkolla:</div><div className="col-7">{profile.schoolOrUniversityName}</div></div>
                  <div className="row mb-2"><div className="col-5 fw-semibold">Drejtimi:</div><div className="col-7">{profile.studyField}</div></div>
                  <div className="row"><div className="col-5 fw-semibold">Niveli:</div><div className="col-7">{profile.studentLevelName}</div></div>
                </>
              )}
              {activeTab === 'messages' && (
    <div className="mt-4">
        <div className="d-flex mb-3">
            <button
                className={`btn ${activeMessageTab === 'received' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => {
                    setActiveMessageTab('received');
                    fetchMessages(profile.id);
                }}
            >
                Inbox
            </button>
            <button
                className={`btn ${activeMessageTab === 'sent' ? 'btn-primary' : 'btn-outline-primary'} ms-2`}
                onClick={() => {
                    setActiveMessageTab('sent');
                    fetchMessages(profile.id);
                }}
            >
                Sent
            </button>
        </div>

        {loadingMessages ? (
            <div className="text-center py-3">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading messages...</p>
            </div>
        ) : messageError ? (
            <Alert variant="danger">{messageError}</Alert>
        ) : messages.length === 0 ? (
            <p className="text-muted">No messages yet</p>
        ) : (
            <div className="list-group">
                {messages.map(msg => (
                    <div 
                        key={msg.id} 
                        className={`list-group-item ${!msg.isRead && activeMessageTab === 'received' ? 'border-start border-primary border-3' : ''}`}
                    >
                        <div className="d-flex justify-content-between">
                            <div>
                                <h6 className="mb-1">
                                    {activeMessageTab === 'received' ? msg.senderName : msg.recipientName}
                                </h6>
                                <small className="text-muted">
                                    {msg.subject}
                                </small>
                            </div>
                            <small className="text-muted">
                                {new Date(msg.sentAt).toLocaleString()}
                            </small>
                        </div>
                        <p className="mb-0 mt-2">{msg.content}</p>
                        {msg.scholarshipTitle && (
                            <small className="text-muted d-block mt-1">
                                Regarding: {msg.scholarshipTitle}
                            </small>
                        )}
                        <div className="mt-2 d-flex gap-2">
                            <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => handleReply(msg)}
                            >
                                Reply
                            </Button>
                            <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleDeleteMessage(msg.id)}
                            >
                                Delete
                            </Button>
                            {!msg.isRead && activeMessageTab === 'received' && (
                                <span className="badge bg-primary ms-auto">New</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
)}

{/* Reply Modal */}
<Modal show={showMessageModal} onHide={() => setShowMessageModal(false)}>
    <Modal.Header closeButton>
        <Modal.Title>Reply to {selectedMessage?.senderName || selectedMessage?.recipientName}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        {messageError && <Alert variant="danger">{messageError}</Alert>}
        <Form.Group className="mb-3">
            <Form.Label>Subject</Form.Label>
            <Form.Control
                type="text"
                value={replyContent.subject}
                onChange={(e) => setReplyContent({...replyContent, subject: e.target.value})}
            />
        </Form.Group>
        <Form.Group className="mb-3">
            <Form.Label>Message</Form.Label>
            <Form.Control
                as="textarea"
                rows={5}
                value={replyContent.content}
                onChange={(e) => setReplyContent({...replyContent, content: e.target.value})}
            />
        </Form.Group>
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowMessageModal(false)}>
            Cancel
        </Button>
        <Button variant="primary" onClick={handleSendReply}>
            Send Reply
        </Button>
    </Modal.Footer>
</Modal>

              {activeTab === 'apps' && (
                <>
                  <h5 className="mb-3">🎓 Aplikimet për Bursa</h5>
                  {profile.applications && profile.applications.length > 0 ? (
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Bursa</th>
                          <th>Data</th>
                          <th>Statusi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profile.applications.map(app => (
                          <tr key={app.id}>
                            <td>{app.scholarshipTitle}</td>
                            <td>{new Date(app.applicationDate).toLocaleDateString()}</td>
                            <td>
                              <span className={`badge ${
                                app.applicationStatusName === "Approved" ? "bg-success" :
                                app.applicationStatusName === "Pending" ? "bg-warning text-dark" :
                                app.applicationStatusName === "Not Approved" ? "bg-danger" : "bg-secondary"
                              }`}>
                                {app.applicationStatusName}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-muted">Nuk keni aplikime për bursa.</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;