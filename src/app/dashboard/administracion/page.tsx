"use client";
import React, { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import EmployeeHoursTable from "@/components/EmployeeHoursTable";

export default function AdministrationPage() {
  const { data: session, status } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasRoleAccess, setHasRoleAccess] = useState(false);

  // UseEffect para verificar la autenticación y el rol del usuario
  useEffect(() => {
    console.log("Session status:", status);  // Verifica el estado de la sesión
    console.log("Session data:", session);   // Verifica los datos de sesión

    if (status === "authenticated" && session) {
      setIsAuthenticated(true); // Usuario autenticado
      const userRole = session.user.role;

      if (userRole === "JEFE_MECANICO") {
        setHasRoleAccess(true); // Usuario tiene el rol adecuado
      } else {
        console.log("Access denied - user role is:", userRole); // El rol no es el adecuado
      }
    } else if (status === "unauthenticated") {
      signIn(); // Redirige al inicio de sesión si no está autenticado
    }
  }, [status, session]);

  // Renderizado basado en el estado de autenticación y rol
  if (status === "loading") {
    return <div className="text-center p-4">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <div className="text-center p-4">Redirigiendo al inicio de sesión...</div>;
  }

  if (!hasRoleAccess) {
    return <div className="text-center p-4 text-red-500">Acceso denegado. Rol insuficiente.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>
      
      <EmployeeHoursTable />
    </div>
  );
}
