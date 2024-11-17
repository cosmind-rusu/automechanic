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
    console.log("RouteGuard - session status:", status);
    console.log("RouteGuard - session data:", session);
    console.log("RouteGuard - pathname:", pathname);

    // Permitir acceso a /dashboard/healtz sin autenticación ni verificación de rol
    if (pathname === '/dashboard/healtz') {
      return;
    }

    if (status === 'loading') return; // No hacer nada mientras se carga la sesión

    if (status === 'unauthenticated') {
      console.log("User unauthenticated - redirecting to login");
      router.replace('/'); // Redirigir al inicio de sesión si el usuario no está autenticado
      return;
    }

    if (status === 'authenticated' && session) {
      const userRole = session.user.role as UserRole;

      // Restricción de acceso para /dashboard/administration
      if (pathname === '/dashboard/administration') {
        if (userRole !== 'JEFE_MECANICO') {
          console.log("Access denied - user role is:", userRole);
          router.replace('/dashboard'); // Redirigir al dashboard si no tiene el rol adecuado
          return;
        }
      } else {
        // Verificar acceso a otras páginas según el rol del usuario
        const page = pathname.split('/')[2] || 'dashboard';
        console.log("RouteGuard - userRole:", userRole);
        console.log("RouteGuard - accessing page:", page);

        if (!hasAccess(userRole, page)) {
          console.log("User does not have access to this page - redirecting to dashboard");
          router.replace('/dashboard'); // Redirigir al dashboard si el usuario no tiene acceso a la página
        }
      }
    }
  }, [status, session, pathname, router]);

  if (status === 'loading') {
    return <div>Cargando...</div>; // Mostrar pantalla de carga mientras se carga la sesión
  }

  return <>{children}</>;
}
