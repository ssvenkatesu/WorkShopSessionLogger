'use client';


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSessionDetails, markAttendance } from '@/lib/api';
import { submitFeedback, getSessionFeedback } from '@/lib/api';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import '../../../../styles/participant.css';
import React from 'react';

export default function SessionPage({ params }) {
  const { id } = React.use(params);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [myFeedback, setMyFeedback] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');
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

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const res = await getSessionFeedback(id);
      if (res.success) {
        setFeedbacks(res.feedbacks);
        const user = JSON.parse(localStorage.getItem('user'));
        const mine = res.feedbacks.find(f => f.user._id === user.id);
        setMyFeedback(mine);
      }
    };
    fetchFeedbacks();
  }, [id]);

  const handleAttendance = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const user = JSON.parse(localStorage.getItem('user'));
      await markAttendance(id, user.id);
      setSuccess('Attendance marked successfully');
      
      // Refresh session data
      const updatedSession = await getSessionDetails(id);
      setSession(updatedSession);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (e) => {
    e.preventDefault();
    setFeedbackMsg('');
    const res = await submitFeedback(id, rating, comment);
    if (res.success) {
      setFeedbackMsg('Thank you for your feedback!');
      setMyFeedback(res.feedback);
      setFeedbacks([...feedbacks, res.feedback]);
    } else {
      setFeedbackMsg(res.message || 'Could not submit feedback');
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
          <p><strong>Workshop:</strong> {session.workshop.title}</p>
          <p><strong>Facilitator:</strong> {session.facilitator.name}</p>
        </div>
        <div className="attendance-section">
          <h2>Mark Attendance</h2>
          {success && <div className="success-message">{success}</div>}
          <div className="attendance-options">
            <div className="qr-option">
              <h3>QR Code Attendance</h3>
              <QRCodeGenerator sessionId={session._id} />
            </div>
            <div className="manual-option">
              <h3>Manual Attendance</h3>
              <button 
                onClick={handleAttendance}
                disabled={loading || session.attendance.some(a => a._id === JSON.parse(localStorage.getItem('user')).id)}
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




