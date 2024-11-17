"use client";
import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { format, startOfWeek, addWeeks, subWeeks, isSameWeek } from "date-fns";

interface ClockInRecord {
  id: string;
  usuario: string;
  clockIn: string;
  clockOut: string | null;
}

const EmployeeHoursTable = () => {
  const [clockInRecords, setClockInRecords] = useState<ClockInRecord[]>([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  useEffect(() => {
    fetchClockInRecords(currentWeekStart);
  }, [currentWeekStart]);

  const fetchClockInRecords = async (weekStart: Date) => {
    try {
      const response = await fetch(`/api/administration/clockin?weekStart=${weekStart.toISOString()}`);
      const data = await response.json();
      setClockInRecords(data);
    } catch (error) {
      console.error("Error fetching clock-in records:", error);
    }
  };

  const handlePreviousWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  };

  const handleNextWeek = () => {
    const nextWeek = addWeeks(currentWeekStart, 1);
    if (!isSameWeek(nextWeek, new Date(), { weekStartsOn: 1 })) {
      setCurrentWeekStart(nextWeek);
    }
  };

  const formatTime = (time: string | null) => {
    return time ? format(new Date(time), "HH:mm") : "N/A";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Clock className="w-6 h-6 mr-2" /> Horas de los Empleados
      </h2>
      <div className="flex justify-between mb-4">
        <button onClick={handlePreviousWeek} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Semana Anterior
        </button>
        <span className="font-semibold">{`Semana de ${format(currentWeekStart, "dd/MM/yyyy")}`}</span>
        <button onClick={handleNextWeek} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Siguiente Semana
        </button>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Usuario</th>
            <th className="px-4 py-2 border">Fecha</th>
            <th className="px-4 py-2 border">Entrada</th>
            <th className="px-4 py-2 border">Salida</th>
            <th className="px-4 py-2 border">Horas Trabajadas</th>
          </tr>
        </thead>
        <tbody>
          {clockInRecords.map((record) => {
            const clockInTime = new Date(record.clockIn);
            const clockOutTime = record.clockOut ? new Date(record.clockOut) : null;
            const hoursWorked = clockOutTime
              ? ((clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60)).toFixed(2)
              : "N/A";

            return (
              <tr key={record.id}>
                <td className="px-4 py-2 border">{record.usuario}</td>
                <td className="px-4 py-2 border">{format(clockInTime, "dd/MM/yyyy")}</td>
                <td className="px-4 py-2 border">{formatTime(record.clockIn)}</td>
                <td className="px-4 py-2 border">{formatTime(record.clockOut)}</td>
                <td className="px-4 py-2 border">{hoursWorked}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeHoursTable;
