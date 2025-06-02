import React, { useEffect, useState } from "react";
import { 
  FiUser, FiBriefcase, FiBookOpen, FiMail, FiBell, FiUsers, FiAward 
} from "react-icons/fi";
import NotificationsDropdown from "../components/NotificationsDropdown.jsx";
import NotificationsPanel from "../components/NotificationsPanel.jsx";
import { Spinner, Alert } from "react-bootstrap";
import ScholarshipsSection from "../components/ScholarshipsSection";
import ApplicationsSection from "../components/ApplicationsSection";
import AwardedStudentsSection from "../components/AwardedStudentsSection";
import ProviderProfile from "../components/ProviderProfile";
function ProviderDashboard() {
  const [scholarships, setScholarships] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState(null);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
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
const [providerNotifications, setProviderNotifications] = useState([]);
const [providerUnreadCount, setProviderUnreadCount] = useState(0);
const [loadingMessages, setLoadingMessages] = useState(false);
const [messageError, setMessageError] = useState(null);
const [recentActivity, setRecentActivity] = useState([]);
 useEffect(() => {
 if (providerUserId && activeTab === 'messages') {
  fetchMessages(providerUserId); 
}

}, [providerUserId, activeTab]);
useEffect(() => {
    const fetchProviderNotifications = async () => {
        if (currentProvider?.userId) { 
            try {
                const data = await fetchUserNotifications(currentProvider.userId);
                setProviderNotifications(data);
                setProviderUnreadCount(data.filter(n => !n.isRead).length);
            } catch (error) {
                console.error("Error fetching provider notifications:", error);
            }
        }
    };
    fetchProviderNotifications();
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
  
  }, []);
const [stats, setStats] = useState({
    scholarshipCount: 0,
    awardedCount: 0,
    recentApplications: []
});
const fetchNotifications = async () => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`https://localhost:7255/api/notification/for-user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (error) {
        console.error("Error fetching notifications:", error);
    }
};
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
        console.log("Fetching messages for provider ID:", providerId);
        const token = localStorage.getItem("token");
        const res = await fetch(`https://localhost:7255/api/message/received/${providerId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Messages API response status:", res.status);
        
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`HTTP error! status: ${res.status}, body: ${errorText}`);
        }
        
        const data = await res.json();
        console.log("Received messages data:", data);
        
    
        const transformedData = data.map(msg => ({
            id: msg.id,
            senderName: msg.senderName || 'Unknown',
            subject: msg.subject,
            content: msg.content,
            sentAt: msg.sentAt || msg.createdAt,
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
const markMessageAsRead = async (messageId) => {
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
    onClick={() => markMessageAsRead(msg.id)}
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
    {!msg.isRead && (
      <span className="badge bg-primary float-end">New</span>
    )}
  </div>
))}
                    </div>
                )}
            </div>
        </div>
    );
      case 'awarded':
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
            <div className="col-md-4 mb-3">
              <div className="card border-start-warning h-100">
                <div className="card-body">
                  <h6 className="text-muted">Pending Applications</h6>
                  <h3 className="mb-0">{applications.filter(a => a.applicationStatusId === 1).length}</h3>
                </div>
              </div>
            </div>
          </div>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

export default ProviderDashboard;