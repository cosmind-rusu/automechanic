'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Home, Car, Boxes, Truck, Users, Menu, X, LogOut, NotebookPen } from 'lucide-react';
import { workshopName } from "../../config";  // Importa la variable de configuración

// Definimos la configuración de navegación por roles
const roleBasedNavItems = {
  default: [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/dashboard/vehicles', icon: Car, label: 'Vehículos' },
    { href: '/dashboard/inventory', icon: Boxes, label: 'Inventario' },
    { href: '/dashboard/distributors', icon: Truck, label: 'Distribuidores' },
  ],
  JEFE_MECANICO: [
    { href: '/dashboard/employe', icon: Users, label: 'Empleados' },
    { href: '/dashboard/administration', icon: NotebookPen, label: 'Administración' }
  ],
  // Otros roles específicos si deseas añadir opciones personalizadas por rol
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();

  // Verifica el rol del usuario
  const userRole = session?.user?.role;

  // Combina las opciones de navegación estándar con las específicas del rol
  const navItems = [
    ...roleBasedNavItems.default,
    ...(userRole === 'JEFE_MECANICO' ? roleBasedNavItems.JEFE_MECANICO : []),
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getInitials = (name: string) => {
    return name?.split(' ').map((n) => n[0]).join('').toUpperCase() || '';
  };

  const handleSignOut = async () => {
    const confirmSignOut = window.confirm("¿Estás seguro de que quieres cerrar sesión?");
    if (confirmSignOut) {
      await signOut({ redirect: false });
      router.push('/'); // Redirige al usuario a la página de inicio
    }
  };

  if (status === 'loading') {
    return <div className="text-center p-4">Cargando...</div>; // Mostrar un mensaje de carga
  }

  return (
    <>
      <button
        className="fixed top-4 left-4 z-20 md:hidden text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <div className={`fixed inset-y-0 left-0 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition duration-200 ease-in-out z-10`}>
        <div className="bg-gray-900 text-white h-full w-64 md:w-20 lg:w-64 overflow-y-auto flex flex-col">
          <div className="p-4 flex items-center justify-between">
            <span className="text-xl font-bold md:hidden lg:inline">
              {workshopName}
            </span>
            <button className="md:hidden" onClick={() => setIsOpen(false)}>
              <X size={24} />
            </button>
          </div>
          {session?.user && (
            <div className="p-4 flex items-center space-x-4">
              <div className="bg-orange-500 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                {getInitials(session.user.name || "")}
              </div>
              <div className="flex flex-col md:hidden lg:flex">
                <span className="font-semibold">{session.user.name}</span>
                <span className="text-xs italic text-gray-400">
                  {session.user.role}
                </span>
              </div>
            </div>
          )}
          <nav className="mt-8 flex-grow">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-4 hover:bg-gray-800 ${
                      pathname === item.href ? "bg-gray-800" : ""
                    }`}
                  >
                    <item.icon size={24} />
                    <span className="ml-4 md:hidden lg:inline">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          {session?.user && (
            <div className="p-4">
              <button
                onClick={handleSignOut}
                className="flex items-center justify-center w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                <LogOut size={20} className="mr-2" />
                <span className="md:hidden lg:inline">Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
