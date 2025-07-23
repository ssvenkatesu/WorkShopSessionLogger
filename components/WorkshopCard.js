export default function WorkshopCard({ workshop, onView, onRegister }) {
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
      <button onClick={onView} className="view-btn">
        View Details
      </button>
      {onRegister && (
        <button onClick={onRegister} className="register-btn">
          Register
        </button>
      )}
    </div>
  );
}