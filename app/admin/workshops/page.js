'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getWorkshops } from '@/lib/api';
import WorkshopCard from '@/components/WorkshopCard';

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!token || user?.role !== 'admin') {
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

  async function handleDeleteWorkshop(workshopId) {
    if (!window.confirm('Are you sure you want to delete this workshop? This action cannot be undone.')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/workshops/${workshopId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete workshop');
      setWorkshops(ws => ws.filter(w => w._id !== workshopId));
    } catch (err) {
      setError(err.message);
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
      <div className="page-header">
        <h1>Workshops Management</h1>
        <button 
          className="create-btn"
          onClick={() => router.push('/admin/workshops/create')}
        >
          Create New Workshop
        </button>
      </div>
      
      <div className="workshops-list">
        {workshops.length === 0 ? (
          <p>No workshops found</p>
        ) : (
          workshops.map(workshop => (
            <WorkshopCard 
              key={workshop._id} 
              workshop={workshop} 
              onView={() => router.push(`/admin/workshops/${workshop._id}`)}
              onDelete={() => handleDeleteWorkshop(workshop._id)}
            />
          ))
        )}
      </div>
    </div>
  );
}