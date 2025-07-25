'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generateReports } from '@/lib/api';

export default function ReportsPage() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!token || user?.role !== 'admin') {
          router.push('/login');
          return;
        }
        
        const data = await generateReports();
        setReports(data.report);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReports();
  }, []);

  if (loading) {
    return <div className="loading">Generating reports...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="reports-page card-glass" style={{width:'100%'}}>
      <h1>Workshop Reports</h1>
      
      <div className="report-cards">
        <div className="report-card">
          <h2>Overall Attendance</h2>
          <p className="stat">{reports?.overallAttendance !== undefined ? reports.overallAttendance + '%' : 'N/A'}</p>
        </div>
        
       
      </div>
      
      <div className="detailed-reports">
        <h2>Workshop Performance</h2>
        <table>
          <thead>
            <tr>
              <th>Workshop</th>
              <th>Sessions</th>
              <th>Participants</th>
              <th>Avg. Attendance</th>
              
            </tr>
          </thead>
          <tbody>
            {Array.isArray(reports?.workshopPerformance) && reports.workshopPerformance.length > 0 ? (
              reports.workshopPerformance.map(workshop => (
                <tr key={workshop._id}>
                  <td>{workshop.title}</td>
                  <td>{workshop.sessions}</td>
                  <td>{workshop.participants}</td>
                  <td>{workshop.attendance}%</td>
                  
                </tr>
              ))
            ) : (
              <tr><td colSpan={5}>No workshop performance data available.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="detailed-reports section-spacing">
        <h2>Participants</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              
            </tr>
          </thead>
          <tbody>
            {Array.isArray(reports?.participantAttendance) && reports.participantAttendance.length > 0 ? (
              reports.participantAttendance.map(p => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.email}</td>
                 
                </tr>
              ))
            ) : (
              <tr><td colSpan={5}>No participant attendance data available.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}