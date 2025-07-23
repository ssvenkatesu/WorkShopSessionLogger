'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSessions } from '@/lib/api';
import SessionCard from '@/components/SessionCard';
import '../../../styles/admin.css';

export default function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!token || user?.role !== 'admin') {
          router.push('/login');
          return;
        }
        
        const data = await getSessions();
        setSessions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessions();
  }, []);

  if (loading) {
    return <div className="loading">Loading sessions...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="admin-layout">
      <div className="admin-content">
        <div className="page-header">
          <h1>Sessions Management</h1>
        </div>
        <div className="sessions-list">
          {sessions.length === 0 ? (
            <p>No sessions found</p>
          ) : (
            sessions.map(session => (
              <SessionCard 
                key={session._id} 
                session={session} 
                onView={() => router.push(`/admin/sessions/${session._id}`)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}