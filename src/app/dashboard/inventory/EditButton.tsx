'use client';

import React from 'react';
import { Edit } from 'lucide-react';

type EditButtonProps = {
  onClick: () => void;
};

export default function EditButton({ onClick }: EditButtonProps) {
  return (
    <button
      onClick={onClick}
      className="text-indigo-600 hover:text-indigo-900"
    >
      <Edit size={18} />
    </button>
  );
}
