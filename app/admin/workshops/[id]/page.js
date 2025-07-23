'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getWorkshopDetails, updateWorkshop } from '@/lib/api';

export default function WorkshopDetailsPage({ params }) {
  const { id } = React.use(params);
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (id === 'create') {
      router.replace('/admin/workshops/create');
      return;
    }
    const fetchWorkshop = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!token || user?.role !== 'admin') {
          router.push('/login');
          return;
        }
        
        const data = await getWorkshopDetails(id);
        setWorkshop(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkshop();
  }, [id]);

  if (id === 'create') {
    return null;
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const updatedWorkshop = await updateWorkshop(workshop._id, workshop);
      setWorkshop(updatedWorkshop);
    } catch (err) {
      setError(err.message || 'Failed to update workshop');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading workshop details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="workshop-details">
      <h1>Workshop: {workshop.title}</h1>
      
      <form onSubmit={handleUpdate}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={workshop.title}
            onChange={(e) => setWorkshop({...workshop, title: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={workshop.description}
            onChange={(e) => setWorkshop({...workshop, description: e.target.value})}
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              value={new Date(workshop.startDate).toISOString().split('T')[0]}
              onChange={(e) => setWorkshop({...workshop, startDate: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              value={new Date(workshop.endDate).toISOString().split('T')[0]}
              onChange={(e) => setWorkshop({...workshop, endDate: e.target.value})}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            value={workshop.location}
            onChange={(e) => setWorkshop({...workshop, location: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={workshop.isOnline}
              onChange={(e) => setWorkshop({...workshop, isOnline: e.target.checked})}
            />
            Online Workshop
          </label>
        </div>
        
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Updating...' : 'Update Workshop'}
        </button>
      </form>
      
      <div className="sessions-section">
        <h2>Sessions</h2>
        <button 
          className="create-btn"
          onClick={() => router.push(`/admin/workshops/${workshop._id}/sessions/create`)}
        >
          Add Session
        </button>
        
        {workshop.sessions.length > 0 ? (
          <ul className="sessions-list">
            {workshop.sessions.map(session => (
              <li key={session._id}>
                <h3>{session.title}</h3>
                <p>{new Date(session.date).toLocaleDateString()} | {session.startTime} - {session.endTime}</p>
                <button 
                  className="view-btn"
                  onClick={() => router.push(`/admin/sessions/${session._id}`)}
                >
                  View Details
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No sessions scheduled for this workshop</p>
        )}
      </div>

      <div className="participants-section card-glass">
        <h2>Registered Participants</h2>
        {workshop.participants && workshop.participants.length > 0 ? (
          <ul className="participant-list">
            {workshop.participants.map(participant => (
              <li key={participant._id || participant}>
                {participant.name || participant.email || participant}
              </li>
            ))}
          </ul>
        ) : (
          <p>No participants registered yet.</p>
        )}
      </div>
    </div>
  );
}

