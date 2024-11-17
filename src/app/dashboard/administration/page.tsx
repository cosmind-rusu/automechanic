"use client";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { startOfWeek, subWeeks, addWeeks, format } from 'date-fns';

type ClockInRecord = {
  id: string;
  usuario: string;
  clockIn: string;
  clockOut: string | null;
};

export default function AdministrationPage() {
  const [clockInRecords, setClockInRecords] = useState<ClockInRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  useEffect(() => {
    fetchClockInRecords();
  }, [currentWeekStart]);

  const fetchClockInRecords = async () => {
    try {
      const response = await fetch(`/api/administration/clockin?weekStart=${currentWeekStart.toISOString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch clock-in records');
      }
      const data = await response.json();
      setClockInRecords(data);
      setIsLoading(false);
    } catch (err) {
      setError('Error loading clock-in records');
      setIsLoading(false);
    }
  };

  const handlePreviousWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  const formatTime = (time: string | null) => {
    return time ? format(new Date(time), 'HH:mm') : 'N/A';
  };

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Horas de Empleados</h1>
        <div className="flex space-x-4">
          <button
            onClick={handlePreviousWeek}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            <ChevronLeft size={20} />
            Semana Anterior
          </button>
          <span className="text-lg font-semibold">{`Semana de ${format(currentWeekStart, 'dd/MM/yyyy')}`}</span>
          <button
            onClick={handleNextWeek}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Semana Siguiente
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrada</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salida</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horas Trabajadas</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clockInRecords.map((record) => {
              const clockInTime = new Date(record.clockIn);
              const clockOutTime = record.clockOut ? new Date(record.clockOut) : null;
              const hoursWorked = clockOutTime
                ? ((clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60)).toFixed(2)
                : 'N/A';

              return (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{record.usuario}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{format(clockInTime, 'dd/MM/yyyy')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatTime(record.clockIn)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatTime(record.clockOut)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{hoursWorked}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
