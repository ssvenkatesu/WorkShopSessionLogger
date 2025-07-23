'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSessionDetails, updateSession } from '@/lib/api';
import '../../../styles/facilitator.css';

export default function FacilitatorSessionPage({ params }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!token || user?.role !== 'facilitator') {
          router.push('/login');
          return;
        }
        
        const data = await getSessionDetails(params.id);
        setSession(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSession();
  }, [params.id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const updatedSession = await updateSession(session._id, session);
      setSession(updatedSession);
      setSuccess('Session updated successfully');
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
    <div className="facilitator-layout">
      <div className="facilitator-content">
        <div className="page-header">
          <h1>Session: {session.title}</h1>
        </div>
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleUpdate} className="form-container">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={session.title}
              onChange={(e) => setSession({...session, title: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={session.description}
              onChange={(e) => setSession({...session, description: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={session.notes || ''}
              onChange={(e) => setSession({...session, notes: e.target.value})}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Start Time</label>
              <input
                type="time"
                value={session.startTime}
                onChange={(e) => setSession({...session, startTime: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <input
                type="time"
                value={session.endTime}
                onChange={(e) => setSession({...session, endTime: e.target.value})}
                required
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Updating...' : 'Update Session'}
          </button>
        </form>
        <div className="attendance-section">
          <h2>Attendance</h2>
          <p>Total Participants: {session.workshop.participants.length}</p>
          <p>Attended: {session.attendance.length}</p>
          <div className="attendance-list">
            <h3>Attendees</h3>
            {session.attendance.length > 0 ? (
              <ul>
                {session.attendance.map(participant => (
                  <li key={participant._id}>{participant.name}</li>
                ))}
              </ul>
            ) : (
              <p>No attendance recorded yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}