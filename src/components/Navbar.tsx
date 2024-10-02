'use client'
import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const { data: session } = useSession();
  
  const getInitials = (name: string) => {
    return name?.split(' ').map((n) => n[0]).join('').toUpperCase() || '';
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center ml-8 md:ml-0">
            <span className="text-xl font-bold text-gray-800">Taller Mecánico</span>
          </div>
          <div className="flex items-center">
            {session?.user && (
              <div className="flex items-center space-x-4">
                <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">
                  {getInitials(session.user.name || '')}
                </div>
                <button 
                  onClick={() => signOut()} 
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-2 rounded flex items-center"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;