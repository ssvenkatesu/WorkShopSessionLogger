'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSessionDetails, updateSession } from '@/lib/api';
import '../../../../styles/admin.css';
import React from 'react';

export default function SessionDetailsPage({ params }) {
  const { id } = React.use(params);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!token || user?.role !== 'admin') {
          router.push('/login');
          return;
        }
        
        const data = await getSessionDetails(id);
        setSession(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSession();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const updatedSession = await updateSession(session._id, session);
      setSession(updatedSession);
    } catch (err) {
      setError(err.message || 'Failed to update session');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading session details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="admin-layout">
      <div className="admin-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="page-header">
          <h1>Session: {session.title}</h1>
        </div>
        <form onSubmit={handleUpdate} className="form-container" style={{ margin: '0 auto' }}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={session.title}
              onChange={(e) => setSession({...session, title: e.target.value})}
              required
              className="input-glass"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={session.description}
              onChange={(e) => setSession({...session, description: e.target.value})}
              className="input-glass"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={new Date(session.date).toISOString().split('T')[0]}
                onChange={(e) => setSession({...session, date: e.target.value})}
                required
                className="input-glass"
              />
            </div>
            <div className="form-group">
              <label>Start Time</label>
              <input
                type="time"
                value={session.startTime}
                onChange={(e) => setSession({...session, startTime: e.target.value})}
                required
                className="input-glass"
              />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <input
                type="time"
                value={session.endTime}
                onChange={(e) => setSession({...session, endTime: e.target.value})}
                required
                className="input-glass"
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="submit-btn vibrant-btn">
            {loading ? 'Updating...' : 'Update Session'}
          </button>
        </form>
        <div className="attendance-section card-glass">
          <h2>Attendance</h2>
          <div className="attendance-stats">
            <span className="attendance-total">Total Participants: <b>{session.workshop.participants.length}</b></span>
            <span className="attendance-attended">Attended: <b>{session.attendance.length}</b></span>
          </div>
          <div className="attendance-list">
            <h3>Attendees</h3>
            {session.attendance.length > 0 ? (
              <ul className="attendee-list">
                {session.attendance.map(participant => (
                  <li key={participant._id} className="attendee-item">{participant.name}</li>
                ))}
              </ul>
            ) : (
              <p className="no-attendance">No attendance recorded yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}