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

<style jsx>{`
  /* --- Admin Sidebar Styles (Glassmorphism + Vibrant) --- */
  .admin-sidebar {
    background: linear-gradient(120deg, #3f37c9 60%, #4ade80 100%);
    min-height: 100vh;
    width: 260px;
    padding: 2.5rem 1.5rem 2rem 1.5rem;
    box-shadow: 0 8px 32px 0 rgba(63,55,201,0.18), 0 0 32px 2px #4ade8011;
    border-radius: 0 2.5rem 2.5rem 0;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    z-index: 2;
    backdrop-filter: blur(10px);
  }

  .admin-sidebar .sidebar-header {
    margin-bottom: 2.5rem;
    width: 100%;
    text-align: left;
  }

  .admin-sidebar .sidebar-header h1 {
    font-size: 1.6rem;
    font-weight: 800;
    letter-spacing: -1px;
    margin-bottom: 0.2rem;
    color: #ffd166;
    text-shadow: 0 2px 12px #3f37c944;
  }

  .admin-sidebar .sidebar-header p {
    font-size: 1.05rem;
    color: #fff;
    opacity: 0.85;
    font-weight: 600;
    margin-bottom: 0;
    letter-spacing: 0.01em;
  }

  .admin-sidebar .sidebar-nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
  }

  .admin-sidebar .sidebar-nav li {
    margin-bottom: 1.2rem;
    width: 100%;
  }

  .admin-sidebar .sidebar-nav a,
  .admin-sidebar .sidebar-nav .logout-btn {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    font-size: 1.13rem;
    font-weight: 700;
    color: #fff;
    background: rgba(255,255,255,0.07);
    border: none;
    border-radius: 1.2rem;
    padding: 0.85rem 1.2rem;
    width: 100%;
    text-decoration: none;
    transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.12s;
    cursor: pointer;
    box-shadow: 0 2px 12px #3f37c911;
    outline: none;
  }

  .admin-sidebar .sidebar-nav a:hover,
  .admin-sidebar .sidebar-nav .logout-btn:hover {
    background: linear-gradient(90deg, #ffd166 60%, #4ade80 100%);
    color: #3f37c9;
    transform: translateY(-2px) scale(1.04);
    box-shadow: 0 8px 32px #4ade8011;
  }

  .admin-sidebar .sidebar-nav .logout-btn {
    margin-top: 2.5rem;
    font-weight: 800;
    background: rgba(255,255,255,0.13);
    color: #ffd166;
    border: 2px solid #ffd16633;
    transition: background 0.18s, color 0.18s, border 0.18s, box-shadow 0.18s;
  }

  .admin-sidebar .sidebar-nav .logout-btn:hover {
    background: linear-gradient(90deg, #ffd166 60%, #ff6f61 100%);
    color: #fff;
    border: 2px solid #ffd166;
    box-shadow: 0 8px 32px #ffd16633;
  }

  .admin-sidebar .nav-icon {
    font-size: 1.35rem;
    display: inline-block;
    margin-right: 0.2rem;
    filter: drop-shadow(0 1px 4px #3f37c922);
  }

  @media (max-width: 900px) {
    .admin-sidebar {
      min-width: 100vw;
      width: 100vw;
      border-radius: 0 0 2.5rem 2.5rem;
      flex-direction: row;
      align-items: flex-start;
      padding: 1.2rem 0.7rem 1.2rem 1.2rem;
    }
    .admin-sidebar .sidebar-header {
      margin-bottom: 0;
      margin-right: 2rem;
    }
    .admin-sidebar .sidebar-nav ul {
      display: flex;
      flex-direction: row;
      gap: 1.2rem;
    }
    .admin-sidebar .sidebar-nav li {
      margin-bottom: 0;
    }
    .admin-sidebar .sidebar-nav a,
    .admin-sidebar .sidebar-nav .logout-btn {
      padding: 0.7rem 1rem;
      font-size: 1rem;
      border-radius: 0.8rem;
    }
  }
`}</style>

