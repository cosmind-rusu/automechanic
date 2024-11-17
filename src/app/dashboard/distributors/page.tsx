'use client';
import React, { useState, useEffect } from "react";
import { Plus, ChevronLeft, ChevronRight, Edit, Trash2, Phone, Home, X } from "lucide-react";
import Image from "next/image";

type Distributor = {
  id?: string;
  nombre: string;
  telefono: string;
  direccion: string;
  imagen: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export default function DistributorsPage() {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentDistributor, setCurrentDistributor] = useState<Distributor | null>(null);

  useEffect(() => {
    fetchDistributors();
  }, [currentPage]);

  const fetchDistributors = async () => {
    try {
      const response = await fetch(`/api/distributors?page=${currentPage}&limit=12`);
      if (!response.ok) throw new Error("Failed to fetch distributors");

      const data = await response.json();
      setDistributors(data.distributors);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError("Error loading distributors");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (distributor: Distributor) => {
    try {
      const url = distributor.id ? `/api/distributors/${distributor.id}` : "/api/distributors";
      const method = distributor.id ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(distributor),
      });
      if (!response.ok) throw new Error("Failed to save distributor");

      setIsFormOpen(false);
      setCurrentDistributor(null);
      fetchDistributors();
    } catch (err) {
      setError("Error saving distributor");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este distribuidor?")) {
      try {
        const response = await fetch(`/api/distributors/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete distributor");

        fetchDistributors();
      } catch (err) {
        setError("Error deleting distributor");
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setError("La imagen no debe superar los 5 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (currentDistributor) {
        setCurrentDistributor({ ...currentDistributor, imagen: reader.result as string });
      }
    };
    if (file) reader.readAsDataURL(file);
  };

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Distribuidores</h1>
        <button
          onClick={() => {
            setCurrentDistributor({ nombre: "", telefono: "", direccion: "", imagen: null });
            setIsFormOpen(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Añadir Distribuidor
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {distributors.map((distributor) => (
          <div key={distributor.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="h-48 w-full relative">
              <Image
                src={distributor.imagen ? `data:image/jpeg;base64,${distributor.imagen}` : "/placeholder.png"}
                alt={distributor.nombre}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-4 flex-grow">
              <h2 className="font-bold text-xl mb-2">{distributor.nombre}</h2>
              <div className="flex items-center text-gray-700 mb-2">
                <Phone size={16} className="mr-2" />
                <p className="text-sm">{distributor.telefono}</p>
              </div>
              <div className="flex items-start text-gray-600">
                <Home size={16} className="mr-2 mt-1" />
                <p className="text-sm">{distributor.direccion}</p>
              </div>
            </div>
            <div className="px-4 py-2 bg-gray-100 flex justify-end">
              <button
                onClick={() => {
                  setCurrentDistributor(distributor);
                  setIsFormOpen(true);
                }}
                className="text-blue-500 hover:text-blue-700 mr-2"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleDelete(distributor.id!)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="mr-2 px-4 py-2 border rounded-md disabled:opacity-50"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="px-4 py-2">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="ml-2 px-4 py-2 border rounded-md disabled:opacity-50"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {isFormOpen && currentDistributor && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{currentDistributor.id ? 'Editar' : 'Añadir'} Distribuidor</h2>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSave(currentDistributor); }}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
                <input
                  type="text"
                  value={currentDistributor.nombre}
                  onChange={(e) => setCurrentDistributor({ ...currentDistributor, nombre: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={currentDistributor.telefono}
                  onChange={(e) => setCurrentDistributor({ ...currentDistributor, telefono: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Dirección</label>
                <textarea
                  value={currentDistributor.direccion}
                  onChange={(e) => setCurrentDistributor({ ...currentDistributor, direccion: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Imagen</label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
              <div className="flex items-center justify-between">
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Guardar
                </button>
                <button type="button" onClick={() => setIsFormOpen(false)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
