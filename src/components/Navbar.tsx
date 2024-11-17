// /components/Navbar.tsx
'use client'
import React from 'react';
import { useSession } from 'next-auth/react';

const Navbar = () => {
  const { data: session } = useSession();

  if (!session?.user) return null;

  const { name, image, role } = session.user;

  return (
    <div className="flex justify-between items-center bg-white shadow px-6 h-16">
      <div className="text-lg font-semibold">Dashboard</div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className="font-semibold">{name}</div>
          <div className="text-sm text-gray-500 italic">{role}</div>
        </div>
        <img
          src={image || '/default-profile.png'}
          alt="User profile"
          className="w-10 h-10 rounded-full border border-gray-300"
        />
      </div>
    </div>
  );
};

export default Navbar;
