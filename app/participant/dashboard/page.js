'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getParticipantDashboard } from '@/lib/api';


export default function ParticipantDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        if (!token || user?.role !== 'participant') {
          router.push('/login');
          return;
        }
        const data = await getParticipantDashboard(user.id);
        setDashboard(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="participant-dashboard-inner">
      <div className="welcome-banner">
        <span role="img" aria-label="wave">👋</span>
        Welcome, Participant! Here’s your dashboard overview.
      </div>
      <div className="page-header">
        <h1>Participant Dashboard</h1>
      </div>
      <div className="stats-container">
        <div className="stat-card">
          <h2 style={{color: '#000000'}}>Registered Workshops</h2>
          <p>{dashboard?.registeredWorkshops ?? 0}</p>
        </div>
        <div className="stat-card">
          <h2 style={{color: '#000000'}}>Upcoming Sessions</h2>
          <p>{dashboard?.upcomingSessions ?? 0}</p>
        </div>
        <div className="stat-card">
          <h2 style={{color: '#000000'}}>Attendance Rate</h2>
          <p>{dashboard?.attendanceRate ?? 0}%</p>
        </div>
      </div>
      <div className="upcoming-sessions">
        <h2>Upcoming Sessions</h2>
        {dashboard?.nextSessions?.length === 0 ? (
          <p>No upcoming sessions</p>
        ) : (
          <ul>
            {dashboard?.nextSessions?.map(session => (
              <li key={session._id}>
                <h3>{session.title}</h3>
                <p>{new Date(session.date).toLocaleDateString()} | {session.startTime} - {session.endTime}</p>
                <button 
                  onClick={() => router.push(`/participant/sessions/${session._id}`)}
                  className="view-btn"
                >
                  View Details
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}




