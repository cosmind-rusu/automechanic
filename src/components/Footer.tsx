import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <p>&copy; 2024 Taller Mecánico. Todos los derechos reservados.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-300">Términos de servicio</a>
            <a href="#" className="hover:text-blue-300">Política de privacidad</a>
            <a href="#" className="hover:text-blue-300">Contacto</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;