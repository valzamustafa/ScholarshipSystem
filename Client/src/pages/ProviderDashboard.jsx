import React, { useEffect, useState } from "react";
import { 
  FiUser, FiBriefcase, FiBookOpen, FiMail, FiBell, FiUsers, FiAward 
} from "react-icons/fi";
import { Modal,Form } from 'react-bootstrap';
import NotificationsDropdown from "../components/NotificationsDropdown.jsx";
import NotificationsPanel from "../components/NotificationsPanel.jsx";
import SendMessageModal from "../components/SendMessageModal.jsx";
import { Spinner, Alert,  Button } from "react-bootstrap";
import ScholarshipsSection from "../components/ScholarshipsSection";
import ApplicationsSection from "../components/ApplicationsSection";
import AwardedStudentsSection from "../components/AwardedStudentsSection";
import ProviderProfile from "../components/ProviderProfile";
function ProviderDashboard() {
  const [loadingMessageDetails, setLoadingMessageDetails] = useState(false);
 const [scholarships, setScholarships] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState(null);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [showSendModal, setShowSendModal] = useState(false);

  const [currentProvider, setCurrentProvider] = useState(null);
  const [applications, setApplications] = useState([]);
  const [awardedStudents, setAwardedStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('scholarships');
  const [selectedScholarshipId, setSelectedScholarshipId] = useState(null);
  const [_loadingApplications, setLoadingApplications] = useState(false);
  const [_loadingAwards, setLoadingAwards] = useState(false);
  const [_error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [providerUserId, setProviderUserId] = useState(null);
const [showReplyModal, setShowReplyModal] = useState(false);
const [selectedMessage, setSelectedMessage] = useState(null);
const [replyContent, setReplyContent] = useState({
    subject: '',
    content: '',
    recipientId: null, 
    scholarshipId: null,
    parentMessageId: null
});
const [loadingMessages, setLoadingMessages] = useState(false);
const [messageError, setMessageError] = useState(null);
const [recentActivity, setRecentActivity] = useState([]);
 useEffect(() => {
 if (providerUserId && activeTab === 'messages') {
  fetchMessages(providerUserId); 
}

}, [providerUserId, activeTab]);
useEffect(() => {
  if (currentProvider && currentProvider.userId) {
    console.log("Current provider userId:", currentProvider.userId);
    setProviderUserId(currentProvider.userId);
  } else {
    console.warn("Missing provider userId from currentProvider", currentProvider);
  }
}, [currentProvider]);



  useEffect(() => {
    const fetchInitialData = async () => {
      const token = localStorage.getItem("token");
      try {
        const providerRes = await fetch('https://localhost:7255/api/provider/current', {
          headers: { Authorization: `Bearer ${token}` }
        });
         if (providerRes.ok) {
  const providerData = await providerRes.json();
  console.log("Provider data:", providerData);
        setCurrentProvider(providerData);
        setProviderUserId(providerData.userId); 


if (activeTab === 'messages') {
  fetchMessages(providerData.userId); 
}


            fetchProviderScholarships(providerData.id);
            fetchRecentActivity(providerData.id);
            fetchProviderStats(providerData.id)
        }
        const [categoriesRes, typesRes] = await Promise.all([
          fetch("https://localhost:7255/api/scholarshipcategory"),
          fetch("https://localhost:7255/api/scholarshiptype")
        ]);
        setCategories(await categoriesRes.json());
        setTypes(await typesRes.json());
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setError("Failed to load initial data. Please try again later.");
      }
    };
    fetchInitialData();
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
const [stats, setStats] = useState({
    scholarshipCount: 0,
    awardedCount: 0,
    recentApplications: []
});

 const fetchProviderStats = async (providerId) => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`https://localhost:7255/api/provider/stats/${providerId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setStats(data);
    } catch (error) {
        console.error("Error fetching provider stats:", error);
    }
};
  const fetchProviderScholarships = async (providerId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://localhost:7255/api/scholarship/byprovider/${providerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setScholarships(data);
    } catch (error) {
      console.error("Error fetching provider scholarships:", error);
      setError("Failed to load scholarships. Please try again later.");
    }
  };


const fetchApplications = async (providerId) => {
  setLoadingApplications(true);
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`https://localhost:7255/api/application/byprovider/${providerId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
    const data = await res.json();
    
    const transformedData = data.map(app => ({
      ...app,
   
      applicationDocument: app.applicationDocument || app.ApplicationDocument || [],
      ApplicationDocument: app.ApplicationDocument || app.applicationDocument || []
    }));
    
    setApplications(transformedData);
  } catch (error) {
    console.error("Error fetching applications:", error);
    setError(error.message || "Failed to load applications");
  } finally {
    setLoadingApplications(false);
  }
};

  const fetchAwardedStudents = async (providerId) => {
    setLoadingAwards(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://localhost:7255/api/scholarshipaward/byprovider/${providerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setAwardedStudents(data);
    } catch (error) {
      console.error("Error fetching awarded students:", error);
      setError("Failed to load awarded students. Please try again later.");
    } finally {
      setLoadingAwards(false);
    }
  };

  const handleDeleteScholarship = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://localhost:7255/api/scholarship/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setScholarships(scholarships.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error("Error deleting scholarship:", error);
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://localhost:7255/api/scholarship/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...scholarships.find(s => s.id === id),
          isAvailable: !currentStatus,
        }),
      });
      if (res.ok) {
        setScholarships(
          scholarships.map(s =>
            s.id === id ? { ...s, isAvailable: !currentStatus } : s
          )
        );
      }
    } catch (error) {
      console.error("Error updating scholarship:", error);
    }
  };

  const handleSubmitScholarship = async (formData) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");
        const url = editingScholarship 
            ? `https://localhost:7255/api/scholarship/${editingScholarship.id}`
            : "https://localhost:7255/api/scholarship";
        const method = editingScholarship ? "PUT" : "POST";
        const response = await fetch(url, {
            method,
            headers: { Authorization: `Bearer ${token}` },
            body: formData
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to save scholarship");
        }
       
        await fetchProviderScholarships(currentProvider.id);
        setShowForm(false);
        setEditingScholarship(null);
    } catch (error) {
        console.error("Error saving scholarship:", error);
        setError(error.message || "Failed to save scholarship. Please try again.");
    }
};

  const handleApplicationStatusChange = async (applicationId, newStatusId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://localhost:7255/api/application/${applicationId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ statusId: newStatusId }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update status");
      }
      setApplications(applications.map(app => 
        app.id === applicationId ? { ...app, applicationStatusId: newStatusId } : app
      ));
      if (newStatusId === 3) {
        await createScholarshipAward(applicationId);
        await fetchApplications(currentProvider.id); 
        await fetchAwardedStudents(currentProvider.id);
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      alert(`Error updating status: ${error.message}`);
    }
  };

  const createScholarshipAward = async (applicationId) => {
    try {
      const token = localStorage.getItem("token");
      const application = applications.find(a => a.id === applicationId);
      if (!application) throw new Error("Application not found");
      const res = await fetch(`https://localhost:7255/api/scholarshipaward`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          scholarshipId: application.scholarshipId,
          studentId: application.studentId,
          awardDate: new Date().toISOString()
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create award");
      }
    } catch (error) {
      console.error("Error creating award:", error);
    }
  };
  const fetchRecentActivity = async (providerId) => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`https://localhost:7255/api/provider/recent-activity/${providerId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setRecentActivity(data);
    } catch (error) {
        console.error("Error fetching recent activity:", error);
    }
};
const fetchMessages = async (providerId) => {
    setLoadingMessages(true);
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`https://localhost:7255/api/message/received/${providerId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`HTTP error! status: ${res.status}, body: ${errorText}`);
        }
        
        const data = await res.json();
        
        const transformedData = data.map(msg => ({
            id: msg.id,
            senderId: msg.senderId, 
            senderName: msg.senderName || 'Unknown',
            subject: msg.subject,
            content: msg.content,
            sentAt: msg.sentAt,
            isRead: msg.isRead || false,
            scholarshipTitle: msg.scholarshipTitle || '',
            scholarshipId: msg.scholarshipId || null
        }));
        
        setMessages(transformedData);
    } catch (error) {
        console.error("Error fetching messages:", error);
        setMessageError(error.message || "Failed to load messages");
    } finally {
        setLoadingMessages(false);
    }
};
const handleReply = async (message) => {
    setLoadingMessageDetails(true);
    try {
      
        if (!message.senderId) {
            throw new Error("Sender information not available");
        }
        
         setSelectedMessage(message);
        setReplyContent({
            subject: `Re: ${message.subject}`,
            content: '',
            recipientId: message.senderId, 
            scholarshipId: message.scholarshipId || null,
            parentMessageId: message.id || null
        });
        setShowReplyModal(true);
    } catch (error) {
        setMessageError(error.message);
    } finally {
        setLoadingMessageDetails(false);
    }
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
        fetchMessages(providerUserId); 
    } catch (error) {
        console.error("Error deleting message:", error);
        setMessageError(error.message || "Failed to delete message");
    }
};
const fetchMessageDetails = async (messageId) => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`https://localhost:7255/api/message/${messageId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) {
            throw new Error(`Failed to fetch message details: ${res.status}`);
        }
        
        return await res.json();
    } catch (error) {
        console.error("Error fetching message details:", error);
        throw error;
    }
};
const handleSendReply = async () => {
    try {
      
        if (!replyContent.content?.trim()) {
            setMessageError('Message content is required');
            return;
        }

        if (!replyContent.recipientId) {
            setMessageError('Recipient is required');
            return;
        }

      
       const messageData = {
            subject: replyContent.subject,
            content: replyContent.content,
            recipientId: replyContent.recipientId, 
            scholarshipId: replyContent.scholarshipId || null, 
            parentMessageId: replyContent.parentMessageId || null 
        };
        console.log("Sending message with data:", messageData); 

        const token = localStorage.getItem("token");
        const res = await fetch('https://localhost:7255/api/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(messageData)
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Server error: ${res.status}. ${errorText}`);
        }


          setShowReplyModal(false);
        setReplyContent({
            subject: '',
            content: '',
            recipientId: null,
            scholarshipId: null,
            parentMessageId: null
        });
        fetchMessages(providerUserId);
    } catch (error) {
        console.error("Error sending reply:", error);
        setMessageError(error.message);
    }
};const markMessageAsRead = async (messageId) => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`https://localhost:7255/api/message/${messageId}/read`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
            setMessages(messages.map(msg => 
                msg.id === messageId ? { ...msg, isRead: true } : msg
            ));
        }
    } catch (error) {
        console.error("Error marking message as read:", error);
    }
};

  const renderTabContent = () => {
    switch (activeTab) {
      case 'scholarships':
        return (
          <ScholarshipsSection
            scholarships={scholarships}
            categories={categories}
            types={types}
            currentProvider={currentProvider}
            showForm={showForm}
            editingScholarship={editingScholarship}
            onDelete={handleDeleteScholarship}
            onToggleAvailability={toggleAvailability}
            onSubmit={handleSubmitScholarship}
            onEdit={setEditingScholarship}
            onShowForm={setShowForm}
          />
        );
      case 'applications':
        return (
          <ApplicationsSection
            applications={applications}
            scholarships={scholarships}
            selectedScholarshipId={selectedScholarshipId}
            setSelectedScholarshipId={setSelectedScholarshipId}
            onStatusChange={handleApplicationStatusChange}
          />
        );
    case 'profile':
 return (
    <div className="row">
      <div className="col-md-5">
        <ProviderProfile 
          provider={{...currentProvider, 
                    scholarshipCount: stats.scholarshipCount,
                    awardedCount: stats.awardedCount}} 
          onUpdate={(updatedProvider) => {
            setCurrentProvider(updatedProvider);
          }} 
        />
      </div>
      <div className="col-md-7">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <h5 className="card-title">Recent Activity</h5>
            {recentActivity.length > 0 ? (
              <ul className="list-group list-group-flush">
                {recentActivity.map((activity, index) => (
                  <li key={index} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">{activity.studentName}</h6>
                        <small className="text-muted">{activity.scholarshipTitle}</small>
                      </div>
                      <span className={`badge bg-${activity.statusColor}`}>
                        {activity.status}
                      </span>
                    </div>
                    <small className="text-muted d-block mt-2">
                      {new Date(activity.applicationDate).toLocaleString()}
                    </small>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-muted">No recent activity</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  case 'messages':
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title">Messages</h5>
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
                className={`list-group-item ${!msg.isRead ? 'border-start border-primary border-3' : ''}`}
              >
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="mb-1">{msg.senderName}</h6>
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
                {!msg.senderId && (
                  <Alert variant="warning" className="mt-2">
                    Warning: Cannot reply to this message - sender information is missing
                  </Alert>
                )}
                <div className="mt-2 d-flex gap-2">
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => handleReply(msg)}
                    disabled={!msg.senderId}
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
                  {!msg.isRead && (
                    <Button 
                      variant="outline-success" 
                      size="sm"
                      onClick={() => markMessageAsRead(msg.id)}
                      className="ms-auto"
                    >
                      Mark as Read
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );      case 'awarded':
        return <AwardedStudentsSection awardedStudents={awardedStudents} />;
      default:
        return null;
    }
  };

  return (
    <div className="container-fluid g-0 min-vh-100 bg-light mt-5 m-0 p-0 vw-100 overflow-x-hidden ">
      <div className="row g-0">
        <div className="col-md-2 text-white p-3 min-vh-100" style={{ backgroundColor: '#004D7C', color: 'white',marginTop:'25px' }}>
          <h4 className="text-center mb-4">Provider Panel</h4>
          <ul className="nav flex-column">
            <li className="nav-item mb-3">
              <button 
                className={`nav-link text-white btn btn-link p-0 text-start ${activeTab === 'scholarships' ? 'active' : ''}`}
                onClick={() => setActiveTab('scholarships')}
              >
                <FiBookOpen className="me-2" />My Scholarships
              </button>
            </li>
            <li className="nav-item mb-3">
              <button 
                className={`nav-link text-white btn btn-link p-0 text-start ${activeTab === 'applications' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('applications');
                  if (currentProvider?.id) {
                    fetchApplications(currentProvider.id);
                  }
                }}
              >
                <FiUsers className="me-2" />Applications
              </button>
            </li>
            <li className="nav-item mb-3">
              <button 
                className={`nav-link text-white btn btn-link p-0 text-start ${activeTab === 'awarded' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('awarded');
                  fetchAwardedStudents(currentProvider?.id);
                }}
              >
                <FiAward className="me-2" />Awarded Students
              </button>
            </li>
           <li className="nav-item mb-3">
   <button 
    className={`nav-link text-white btn btn-link p-0 text-start ${activeTab === 'messages' ? 'active' : ''}`}
    onClick={() => {
        setActiveTab('messages');
        if (currentProvider?.id) {
            fetchMessages(currentProvider.id);
        }
    }}
>
    <FiMail className="me-2" />Messages
</button>
    <Button 
    variant="outline-success" 
    size="sm"
    onClick={() => markMessageAsRead(msg.id)}
>
    Mark as Read
</Button>
</li>
            <li className="nav-item mb-3">
  <button 
    className={`nav-link text-white btn btn-link p-0 text-start ${activeTab === 'profile' ? 'active' : ''}`}
    onClick={() => setActiveTab('profile')}
  >
    <FiUser className="me-2" />Profile
  </button>
</li>
          </ul>
        </div>
        <div className="col-md-10 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4" style={{ marginTop:'25px' }}>
            <h3>Welcome, {currentProvider?.fullName || 'Provider'}!</h3>
            <div className="d-flex align-items-center">
              <FiBell className="me-3" size={20} />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-4 mb-3">
               <NotificationsPanel />
              <div className="card border-start-primary h-100">
                <div className="card-body">
                  <h6 className="text-muted">Active Scholarships</h6>
                  <h3 className="mb-0">{scholarships.length}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card border-start-success h-100">
                <div className="card-body">
                  <h6 className="text-muted">Available Scholarships</h6>
                  <h3 className="mb-0">{scholarships.filter(s => s.isAvailable).length}</h3>
                </div>
              </div>
            </div>
         
<Modal show={showReplyModal} onHide={() => setShowReplyModal(false)}>
    <Modal.Header closeButton>
        <Modal.Title>Reply to {selectedMessage?.senderName || 'Sender'}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Form.Group className="mb-3">
            <Form.Label>Subject</Form.Label>
            <Form.Control
                type="text"
                value={replyContent.subject}
                readOnly
            />
        </Form.Group>
        <Form.Group>
            <Form.Label>Your Message</Form.Label>
            <Form.Control
                as="textarea"
                rows={4}
                value={replyContent.content}
                onChange={(e) => setReplyContent({...replyContent, content: e.target.value})}
                placeholder="Write your reply here..."
            />
        </Form.Group>
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowReplyModal(false)}>
            Cancel
        </Button>
        <Button 
            variant="primary" 
            onClick={handleSendReply}
            disabled={!replyContent.content.trim()}
        >
            Send Reply
        </Button>
    </Modal.Footer>
</Modal>
            <div className="col-md-4 mb-3">
              <div className="card border-start-warning h-100">
                <div className="card-body">
                  <h6 className="text-muted">Pending Applications</h6>
                  <h3 className="mb-0">{applications.filter(a => a.applicationStatusId === 1).length}</h3>
                </div>
              </div>
            </div>
          </div>
          
          <SendMessageModal
  show={showSendModal}
  onHide={() => setShowSendModal(false)}
  
  providerId={providerUserId}
  scholarshipId={null} 
  onMessageSent={() => fetchMessages(providerUserId)}
  providerName={currentProvider?.fullName}
/>

          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

export default ProviderDashboard;