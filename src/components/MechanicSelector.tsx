import React, { useEffect, useState } from "react";

type Mechanic = {
  id: string;
  name: string;
};

type MechanicSelectorProps = {
  selectedMechanics: string[];
  onChange: (ids: string[]) => void;
};

const MechanicSelector: React.FC<MechanicSelectorProps> = ({
  selectedMechanics,
  onChange,
}) => {
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const response = await fetch("/api/mechanicselector");
        if (!response.ok) {
          throw new Error("Failed to fetch mechanics");
        }
        const data = await response.json();
        setMechanics(data);
      } catch (error) {
        console.error(error);
        setError("Error fetching mechanics");
      } finally {
        setIsLoading(false); // Aseguramos que `isLoading` se actualice
      }
    };

    fetchMechanics();
  }, []);

  if (isLoading) return <p>Cargando mecánicos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Mecánicos asignados
      </label>
      <select
        multiple
        value={selectedMechanics}
        onChange={(e) => {
          const options = Array.from(
            e.target.selectedOptions,
            (option) => option.value
          );
          onChange(options);
        }}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        {mechanics.map((mechanic) => (
          <option key={mechanic.id} value={mechanic.id}>
            {mechanic.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MechanicSelector;
