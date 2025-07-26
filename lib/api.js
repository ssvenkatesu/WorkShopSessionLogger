export const createWorkshop = async (data) => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/workshops', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Failed to create workshop');
  }
  
  return result.workshop;
};

export const getWorkshopDetails = async (id) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`/api/workshops/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch workshop');
  }
  
  return result.workshop;
};

export const updateWorkshop = async (id, data) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`/api/workshops/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Failed to update workshop');
  }
  
  return result.workshop;
};

export const getSessionDetails = async (id) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`/api/sessions/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch session');
  }
  
  return result.session;
};

export const updateSession = async (id, data) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`/api/sessions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Failed to update session');
  }
  
  return result.session;
};

export const markAttendance = async (sessionId, userId) => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/attendance', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ sessionId, userId })
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Failed to mark attendance');
  }
  
  return result;
};

export const getDashboardStats = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/admin/dashboard', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch dashboard stats');
  }
  
  return result;
};

export const getFacilitatorDashboard = async (userId) => {
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/facilitator/dashboard?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.headers.get('content-type')?.includes('application/json')) {
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to fetch facilitator dashboard');
      return result;
    } else {
     
      return {
        assignedWorkshops: 0,
        upcomingSessions: 0,
        completedSessions: 0,
        nextSessions: []
      };
    }
  } catch (err) {
    
    return {
      assignedWorkshops: 0,
      upcomingSessions: 0,
      completedSessions: 0,
      nextSessions: []
    };
  }
};

export const getParticipantDashboard = async (userId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`/api/participant/dashboard?userId=${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch participant dashboard');
  }
  
  return result;
};

export const generateReports = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/admin/reports', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Failed to generate reports');
  }
  
  return result;
};

export const getWorkshops = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/workshops', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch workshops');
  }
  
  return result.workshops;
};

export const getSessions = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/sessions', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch sessions');
  }
  
  return result.sessions;
};

export const getFacilitatorSessions = async (userId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`/api/facilitator/sessions?userId=${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch sessions');
  }
  
  return result.sessions;
};

export const getParticipantWorkshops = async (userId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`/api/participant/workshops?userId=${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch workshops');
  }
  
  return result.workshops;
};
