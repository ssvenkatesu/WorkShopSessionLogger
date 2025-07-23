import Link from 'next/link';

export default function ParticipantSidebar() {
  return (
    <div className="sidebar participant-sidebar">
      <div className="sidebar-header">
        <h1>Workshop Logger</h1>
        <p>Participant Panel</p>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link href="/participant/dashboard">
              <span className="nav-icon">📊</span> Dashboard
            </Link>
          </li>
          <li>
            <Link href="/participant/workshops">
              <span className="nav-icon">🏫</span> My Workshops
            </Link>
          </li>
          
          <li>
            <button 
              className="logout-btn"
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
              }}
            >
              <span className="nav-icon">🚪</span> Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}