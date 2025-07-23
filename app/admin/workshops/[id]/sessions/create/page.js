'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import '../../../../../../styles/admin.css';

export default function CreateSessionPage() {
  const router = useRouter();
  const params = useParams();
  const { id: workshopId } = params;
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    description: ''
  });
  const [facilitator, setFacilitator] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the workshop to get the facilitator
    async function fetchFacilitator() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/workshops/${workshopId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.workshop && data.workshop.facilitator) {
          setFacilitator(data.workshop.facilitator._id || data.workshop.facilitator);
        } else {
          setError('Could not fetch facilitator for this workshop.');
        }
      } catch (err) {
        setError('Could not fetch facilitator for this workshop.');
      }
    }
    fetchFacilitator();
  }, [workshopId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const payload = { ...formData, workshop: workshopId, facilitator };
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create session');
      router.push(`/admin/workshops/${workshopId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Create New Session</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Start Time</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>End Time</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading || !facilitator} className="submit-btn">
          {loading ? 'Creating...' : 'Create Session'}
        </button>
      </form>
    </div>
  );
} 