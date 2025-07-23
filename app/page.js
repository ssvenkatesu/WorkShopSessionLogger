import Link from 'next/link';
import '../styles/globals.css';

export default function Home() {
  return (
    <div className="home-container">
      <h1>Workshop Session Logger</h1>
      <p>Manage workshops, sessions, and participant tracking</p>
      <div className="auth-links">
        <Link href="/login" className="btn">Login</Link>
        <Link href="/register" className="btn">Register</Link>
      </div>
    </div>
  );
}