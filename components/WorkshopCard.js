export default function WorkshopCard({ workshop, onView, onRegister, onDelete }) {
  return (
    <div className="workshop-card">
      <h2>{workshop.title || 'Untitled Workshop'}</h2>
      <p className="dates">
        {workshop.startDate ? new Date(workshop.startDate).toLocaleDateString() : 'N/A'} - 
        {workshop.endDate ? new Date(workshop.endDate).toLocaleDateString() : 'N/A'}
      </p>
      <p className="location">
        {workshop.isOnline ? 'Online' : (workshop.location || 'N/A')}
      </p>
      <div className="workshop-stats">
        <span>Sessions: {Array.isArray(workshop.sessions) ? workshop.sessions.length : 0}</span>
        <span>Participants: {Array.isArray(workshop.participants) ? workshop.participants.length : 0}</span>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <button onClick={onView} className="view-btn">
          View Details
        </button>
        {onDelete && (
          <button onClick={onDelete} className="delete-btn">
            Delete
          </button>
        )}
      </div>
      {onRegister && (
        <div style={{ marginTop: '0.5rem', width: '100%' }}>
          <button onClick={onRegister} className="register-btn" style={{ width: '100%' }}>
            Register
          </button>
        </div>
      )}
    </div>
  );
}