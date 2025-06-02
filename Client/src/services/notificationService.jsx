const API_BASE_URL = 'https://localhost:7255/api/notification';
export const fetchUserNotifications = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("https://localhost:7255/api/notification/for-user", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    
        
    if (!res.ok) {
        const errorText = await res.text();  
        throw new Error(errorText || "Failed to fetch notifications");
    }

    return await res.json(); 
};
export const fetchAdminNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    try {
        const response = await fetch(`${API_BASE_URL}/admin`, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            try {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            } catch {
                const errorText = await response.text();
                throw new Error(errorText || `HTTP error! status: ${response.status}`);
            }
        }
        
        return await response.json();
    } catch (error) {
        console.error("Error fetching admin notifications:", error);
        throw error;
    }
};

export const markAsRead = async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/${id}/read`, {
        method: 'PUT',
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
};

export const markAllAsRead = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/mark-all-read`, {
        method: 'PUT',
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
};