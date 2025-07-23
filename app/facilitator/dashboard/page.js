'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getFacilitatorDashboard } from '@/lib/api';
import FacilitatorSidebar from '@/components/FacilitatorSidebar';
import DashboardLayout from '@/components/DashboardLayout';

export default function FacilitatorDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        if (!token || user?.role !== 'facilitator') {
          router.push('/login');
          return;
        }
        const data = await getFacilitatorDashboard(user.id);
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
    <div className="facilitator-layout">
      <DashboardLayout
        header={<h1 className="page-header">Facilitator Dashboard</h1>}
      >
        <div className="facilitator-content">
          <div className="stats-container">
            <div className="stat-card">
              <h2>Assigned Workshops</h2>
              <p>{dashboard.assignedWorkshops}</p>
            </div>
            <div className="stat-card">
              <h2>Upcoming Sessions</h2>
              <p>{dashboard.upcomingSessions}</p>
            </div>
            <div className="stat-card">
              <h2>Completed Sessions</h2>
              <p>{dashboard.completedSessions}</p>
            </div>
          </div>
          <div className="upcoming-sessions">
            <h2>Upcoming Sessions</h2>
            {dashboard.nextSessions.length === 0 ? (
              <p>No upcoming sessions</p>
            ) : (
              <ul>
                {dashboard.nextSessions.map(session => (
                  <li key={session._id}>
                    <h3>{session.title}</h3>
                    <p>{new Date(session.date).toLocaleDateString()} | {session.startTime} - {session.endTime}</p>
                    <button 
                      onClick={() => router.push(`/facilitator/sessions/${session._id}`)}
                      className="view-btn"
                    >
                      Manage Session
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
}