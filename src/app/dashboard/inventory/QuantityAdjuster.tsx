'use client';
import React from 'react';
import { MinusCircle, PlusCircle } from 'lucide-react';

type QuantityAdjusterProps = {
  itemId: string;
  currentQuantity: number;
  onQuantityChange: (id: string, change: number) => void;
};

const QuantityAdjuster: React.FC<QuantityAdjusterProps> = ({ itemId, currentQuantity, onQuantityChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onQuantityChange(itemId, -1)}
        className="text-red-600 hover:text-red-900"
        disabled={currentQuantity <= 0}
      >
        <MinusCircle className="w-5 h-5" />
      </button>
      <span className="text-sm text-gray-900">{currentQuantity}</span>
      <button
        onClick={() => onQuantityChange(itemId, 1)}
        className="text-green-600 hover:text-green-900"
      >
        <PlusCircle className="w-5 h-5" />
      </button>
    </div>
  );
};

export default QuantityAdjuster;
