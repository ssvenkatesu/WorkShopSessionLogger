'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import FacilitatorSidebar from '@/components/FacilitatorSidebar';
import '../../styles/facilitator.css';

export default function FacilitatorLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token || user?.role !== 'facilitator') {
      router.push('/login');
    }
  }, []);

  return (
    <div className="facilitator-layout-row">
      <aside className="facilitator-sidebar">
        <FacilitatorSidebar />
      </aside>
      <main className="facilitator-main-content">
        {children}
      </main>
    </div>
  );
}