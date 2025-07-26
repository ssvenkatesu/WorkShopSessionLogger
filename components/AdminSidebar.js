import Link from 'next/link';

export default function AdminSidebar() {
  return (
    <div className="sidebar admin-sidebar">
      <div className="sidebar-header">
        <h1>Workshop Logger</h1>
        <p>Admin Panel</p>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link href="/admin/dashboard">
              <span className="nav-icon">📊</span> Dashboard
            </Link>
          </li>
          <li>
            <Link href="/admin/workshops">
              <span className="nav-icon">🏫</span> Workshops
            </Link>
          </li>
          <li>
            <Link href="/admin/sessions">
              <span className="nav-icon">📅</span> Sessions
            </Link>
          </li>
          <li>
            <Link href="/admin/reports">
              <span className="nav-icon">📈</span> Reports
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



