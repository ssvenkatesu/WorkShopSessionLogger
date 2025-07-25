'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getParticipantWorkshops, getWorkshops } from '@/lib/api';
import WorkshopCard from '@/components/WorkshopCard';

async function registerForWorkshop(workshopId, setMessage, setError) {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await fetch('/api/participant/workshops/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ workshopId, userId: user.id })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to register');
    setMessage('Successfully registered for the workshop!');
    setError('');
  } catch (err) {
    setError(err.message);
    setMessage('');
  }
}

export default function ParticipantWorkshopsPage() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const token = localStorage.getItem('token');
        const userObj = JSON.parse(localStorage.getItem('user'));
        setUser(userObj);
        if (!token || userObj?.role !== 'participant') {
          router.push('/login');
          return;
        }
        const data = await getWorkshops();
        setWorkshops(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshops();
  }, []);

  async function registerForWorkshop(workshopId) {
    try {
      const token = localStorage.getItem('token');
      const userObj = JSON.parse(localStorage.getItem('user'));
      const response = await fetch('/api/participant/workshops/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ workshopId, userId: userObj.id })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to register');
      setMessage('Successfully registered for the workshop!');
      setError('');
      // Update the UI to reflect registration
      setWorkshops(ws => ws.map(w => w._id === workshopId ? { ...w, participants: [...w.participants, { _id: userObj.id, name: userObj.name, email: userObj.email }] } : w));
    } catch (err) {
      setError(err.message);
      setMessage('');
    }
  }

  if (loading) {
    return <div className="loading">Loading workshops...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="workshops-page">
      <h1>All Workshops</h1>
      {message && <div className="success-message">{message}</div>}
      <div className="workshops-list">
        {workshops.length === 0 ? (
          <p>No workshops available</p>
        ) : (
          workshops.map(workshop => {
            const isRegistered = user && Array.isArray(workshop.participants) && workshop.participants.some(p => (p._id || p) === user.id);
            return (
              <div key={workshop._id} className="workshop-with-participants horizontal-card">
                <div className="workshop-details-col">
                  <WorkshopCard 
                    workshop={workshop} 
                    onView={() => router.push(`/participant/workshops/${workshop._id}`)}
                    onRegister={!isRegistered ? () => registerForWorkshop(workshop._id) : undefined}
                  />
                  {isRegistered && <div className="registered-label">Registered</div>}
                </div>
                <div className="participants-col participants-section card-glass">
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
          })
        )}
      </div>
    </div>
  );
}