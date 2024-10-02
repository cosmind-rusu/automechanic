'use client'
import React from 'react';
import { useSession } from 'next-auth/react';
import Sidebar from '../../components/Sidebar';
import { RouteGuard } from '../../components/RouteGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  if (!session) {
    return <div className="flex items-center justify-center h-screen">⛔ Acceso denegado ⛔</div>;
  }

  return (
    <RouteGuard>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </RouteGuard>
  );
}