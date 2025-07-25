'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createWorkshop } from '@/lib/api';

export default function WorkshopCreateForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    isOnline: false,
    facilitator: ''
  });
  const [facilitators, setFacilitators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  

  useEffect(() => {
    if (typeof window !== 'undefined' && !sessionStorage.getItem('workshopCreateReloaded')) {
      sessionStorage.setItem('workshopCreateReloaded', 'true');
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    async function fetchFacilitators() {
      try {
        const res = await fetch('/api/facilitator/list');
        const data = await res.json();
        if (data.success) setFacilitators(data.facilitators);
      } catch {}
    }
    fetchFacilitators();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (!formData.facilitator) {
        setError('Please select a facilitator.');
        setLoading(false);
        return;
      }
      const payload = { ...formData };
      const workshop = await createWorkshop(payload);
      router.push(`/admin/workshops/${workshop._id}`);
    } catch (err) {
      setError(err.message || 'Failed to create workshop');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Create New Workshop</h2>
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
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Facilitator</label>
          <select
            name="facilitator"
            value={formData.facilitator}
            onChange={handleChange}
            required
          >
            <option value="">Select Facilitator</option>
            {facilitators.map(f => (
              <option key={f._id} value={f._id}>{f.name} ({f.email})</option>
            ))}
          </select>
        </div>
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="isOnline"
              checked={formData.isOnline}
              onChange={handleChange}
            />
            Online Workshop
          </label>
        </div>
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Creating...' : 'Create Workshop'}
        </button>
      </form>
    </div>

    
  );
} 