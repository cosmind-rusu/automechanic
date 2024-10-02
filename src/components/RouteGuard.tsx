'use client'
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { hasAccess, UserRole } from '../app/utils/roles';
import React from 'react';

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading
    if (!session) {
      // If not logged in, redirect to login page
      router.push('/');
    } else {
      // Check if user has access to this page
      const page = pathname.split('/')[2] || 'dashboard'; // Assuming dashboard routes are like /dashboard/page
      const userRole = session.user?.role as UserRole;
      
      if (!hasAccess(userRole, page)) {
        // Redirect to dashboard if user doesn't have access
        router.push('/dashboard');
      }
    }
  }, [session, status, pathname, router]);

  if (status === 'loading') {
    return <div>Cargando...</div>;
  }

  return <>{children}</>;
}