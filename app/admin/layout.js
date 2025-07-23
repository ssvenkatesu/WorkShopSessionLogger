'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import '../../styles/admin.css';

export default function AdminLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token || user?.role !== 'admin') {
      router.push('/login');
    }
  }, []);

  return (
    <div className="admin-layout-row">
      <aside className="admin-sidebar">
        <AdminSidebar />
      </aside>
      <main className="admin-main-content">
        {children}
      </main>
    </div>
  );
}