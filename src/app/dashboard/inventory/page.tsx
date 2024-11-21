'use client';
import React, { useState, useEffect } from 'react';
import AddEditItemForm from './AddEditItemForm';
import { Plus, AlertTriangle, Edit, Trash2 } from 'lucide-react';

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  alerts: {
    id: string;
    message: string;
    createdAt: string;
  }[];
};

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const fetchInventoryItems = async () => {
    try {
      const response = await fetch('/api/inventory');
      if (!response.ok) throw new Error('Failed to fetch inventory items');
      const data = await response.json();
      setInventoryItems(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading inventory items:', error);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: {
    name: string;
    category: string;
    quantity: number;
    minQuantity: number;
  }) => {
    const url = currentItem ? `/api/inventory/${currentItem.id}` : '/api/inventory';
    const method = currentItem ? 'PUT' : 'POST';
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to save inventory item');
      fetchInventoryItems();
      setIsModalOpen(false);
      setCurrentItem(null);
    } catch (error) {
      console.error('Error saving inventory item:', error);
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete inventory item');
      fetchInventoryItems();
    } catch (error) {
      console.error('Error deleting inventory item:', error);
    }
  };

  const handleQuantityChange = async (id: string, change: number) => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, quantityChange: change }),
      });
      if (!response.ok) throw new Error('Failed to update quantity');
      fetchInventoryItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  if (isLoading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventario</h1>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setCurrentItem(null);
          }}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Añadir Item
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad Mínima
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alertas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventoryItems.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{item.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.quantity}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.minQuantity}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.alerts.length > 0 ? (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  ) : (
                    <span className="text-sm text-gray-500">Sin alertas</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleQuantityChange(item.id, -1)}
                    className="text-red-600 hover:text-red-900 mr-2"
                  >
                    -
                  </button>
                  <button
                    onClick={() => handleQuantityChange(item.id, 1)}
                    className="text-green-600 hover:text-green-900 mr-2"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <AddEditItemForm
              initialData={
                currentItem || { name: '', category: '', quantity: 0, minQuantity: 0 }
              }
              onSubmit={handleSubmit}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
