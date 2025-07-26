'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDashboardStats } from '@/lib/api';


export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        if (!token || user?.role !== 'admin') {
          router.push('/login');
          return;
        }
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-content">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
      </div>
      <div  className="stats-container">
        <div className="stat-card">
          <h2 style={{color: '#000000'}}>Workshops</h2>
          <p>{stats.workshopsCount}</p>
        </div>
        <div className="stat-card">
          <h2 style={{color: '#000000'}}>Sessions</h2>
          <p>{stats.sessionsCount}</p>
        </div>
        <div className="stat-card">
          <h2 style={{color: '#000000'}}>Participants</h2>
          <p>{stats.participantsCount}</p>
        </div>
        <div className="stat-card">
          <h2 style={{color: '#000000'}}>Facilitators</h2>
          <p>{stats.facilitatorsCount}</p>
        </div>
      </div>
      <div className="recent-activities">
        <h2>Recent Workshops</h2>
        <ul>
          {stats.recentWorkshops.map(workshop => (
            <li key={workshop._id}>
              <h3>{workshop.title}</h3>
              <p>{new Date(workshop.startDate).toLocaleDateString()} - {new Date(workshop.endDate).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}