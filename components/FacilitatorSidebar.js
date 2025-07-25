import Link from 'next/link';

export default function FacilitatorSidebar() {
  return (
    <div className="sidebar facilitator-sidebar" >
      <div className="sidebar-header">
        <h1>Workshop Logger</h1>
        <p>Facilitator Panel</p>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link href="/facilitator/dashboard">
              <span className="nav-icon">📊</span> Dashboard
            </Link>
          </li>
          <li>
            <Link href="/facilitator/sessions">
              <span className="nav-icon">📅</span> My Sessions
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