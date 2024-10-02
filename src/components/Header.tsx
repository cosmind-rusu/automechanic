import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Taller Mecánico
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/dashboard" className="hover:text-blue-200">Dashboard</Link></li>
            <li><Link href="/orders" className="hover:text-blue-200">Órdenes</Link></li>
            <li><Link href="/inventory" className="hover:text-blue-200">Inventario</Link></li>
            <li><Link href="/learning" className="hover:text-blue-200">Aprendizaje</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;