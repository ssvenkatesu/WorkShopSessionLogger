'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getWorkshopDetails } from '@/lib/api';
import '../../../../styles/participant.css';

export default function ParticipantWorkshopDetails() {
  const params = useParams();
  const { id } = params;
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        if (!token || user?.role !== 'participant') {
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

  if (loading) return <div className="loading">Loading workshop details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!workshop) return <div className="error-message">Workshop not found.</div>;

  return (
    <div className="workshop-details participant-details card-glass">
      <h1>{workshop.title}</h1>
      <p><b>Dates:</b> {workshop.startDate ? new Date(workshop.startDate).toLocaleDateString() : 'N/A'} - {workshop.endDate ? new Date(workshop.endDate).toLocaleDateString() : 'N/A'}</p>
      <p><b>Location:</b> {workshop.isOnline ? 'Online' : (workshop.location || 'N/A')}</p>
      <p><b>Description:</b> {workshop.description}</p>
      <div className="sessions-section">
        <h2>Sessions</h2>
        {workshop.sessions && workshop.sessions.length > 0 ? (
          <ul className="session-list">
            {workshop.sessions.map(session => (
              <li key={session._id}>
                <b>{session.title}</b> <br />
                {session.date ? new Date(session.date).toLocaleDateString() : 'N/A'} | {session.startTime} - {session.endTime}
              </li>
            ))}
          </ul>
        ) : (
          <p>No sessions scheduled for this workshop.</p>
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


