'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ParticipantSidebar from '@/components/ParticipantSidebar';
import '../../styles/participant.css';

export default function ParticipantLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token || user?.role !== 'participant') {
      router.push('/login');
    }
  }, []);

  return (
    <div className="participant-layout-row">
      <aside className="participant-sidebar">
        <ParticipantSidebar />
      </aside>
      <main className="participant-main-content">
        {children}
      </main>
    </div>
  );
}