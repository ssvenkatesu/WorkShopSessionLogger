'use client';


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSessionDetails, markAttendance } from '@/lib/api';


import '../../../../styles/participant.css';
import React from 'react';

export default function SessionPage({ params }) {
  const { id } = React.use(params);
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
        
        if (!token || user?.role !== 'participant') {
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

  const handleAttendance = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const user = JSON.parse(localStorage.getItem('user'));
      await markAttendance(id, user.id);
      setSuccess('Attendance marked successfully');
      
   
      const updatedSession = await getSessionDetails(id);
      setSession(updatedSession);
    } catch (err) {
      setError(err.message);
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
    <div className="participant-layout">
      <div className="participant-content">
        <div className="page-header">
          <h1>Session: {session.title}</h1>
        </div>
        <div className="session-info">
          <p><strong>Date:</strong> {new Date(session.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {session.startTime} - {session.endTime}</p>
          <p><strong>Workshop:</strong> {session.workshop?.title || 'Unknown Workshop'}</p>
          <p><strong>Facilitator:</strong> {session.facilitator?.name || 'Unknown Facilitator'}</p>
        </div>
        <div className="attendance-section">
          <h2>Mark Attendance</h2>
          {success && <div className="success-message">{success}</div>}
          <div className="attendance-options">
            <div className="manual-option">
              <h3>Manual Attendance</h3>
              <button 
                onClick={handleAttendance}
                disabled={loading || session.attendance.some(a => (a._id || a) === JSON.parse(localStorage.getItem('user')).id)}
                className="attendance-btn"
              >
                {loading ? 'Marking...' : 'Mark My Attendance'}
              </button>
            </div>
          </div>
        </div>
       
        
      </div>
    </div>
  );
}




