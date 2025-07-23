'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getParticipantCertificates } from '@/lib/api';

export default function ParticipantCertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!token || user?.role !== 'participant') {
          router.push('/login');
          return;
        }
        
        const data = await getParticipantCertificates(user.id);
        setCertificates(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCertificates();
  }, []);

  if (loading) {
    return <div className="loading">Loading certificates...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="certificates-page">
      <h1>Your Certificates</h1>
      
      <div className="certificates-list">
        {certificates.length === 0 ? (
          <p>You don't have any certificates yet</p>
        ) : (
          certificates.map(cert => (
            <div key={cert._id} className="certificate-card">
              <h2>{cert.workshop.title}</h2>
              <p>Completed on: {new Date(cert.completionDate).toLocaleDateString()}</p>
              <p>Certificate ID: {cert.certificateId}</p>
              <button 
                onClick={() => window.open(cert.downloadUrl, '_blank')}
                className="download-btn"
              >
                Download Certificate
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}