import React from 'react';

export default function SessionCard({ session, onView, onDelete }) {
  return (
    <div className="session-card">
      <h2>{session.title}</h2>
      <p className="dates">
        {session.date ? new Date(session.date).toLocaleDateString() : ''} | {session.startTime} - {session.endTime}
      </p>
      {session.workshop && (
        <p className="workshop">Workshop: {session.workshop.title || session.workshop}</p>
      )}
      {session.facilitator && (
        <p className="facilitator">Facilitator: {session.facilitator.name || session.facilitator}</p>
      )}
      <div className="session-stats">
        <span>Attendees: {session.attendance ? session.attendance.length : 0}</span>
        {session.resources && session.resources.length > 0 && (
          <span>Resources: {session.resources.length}</span>
        )}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <button onClick={onView} className="view-btn">
          View
        </button>
        {onDelete && (
          <button onClick={onDelete} className="delete-btn">
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
