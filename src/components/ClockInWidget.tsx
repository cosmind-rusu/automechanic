// components/ClockInWidget.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Clock } from 'lucide-react';

const ClockInWidget = () => {
  const { data: session } = useSession();
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");
  const username = session?.user?.name;

  useEffect(() => {
    if (!username) return;

    const storedStartTime = localStorage.getItem(`clockInStartTime_${username}`);
    if (storedStartTime) {
      setStartTime(new Date(storedStartTime));
      setIsClockedIn(true);
    }
  }, [username]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isClockedIn && startTime) {
      timer = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        const hours = String(Math.floor(diff / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
        const seconds = String(diff % 60).padStart(2, "0");
        setElapsedTime(`${hours}:${minutes}:${seconds}`);
      }, 1000);
    } else {
      setElapsedTime("00:00:00");
    }
    return () => clearInterval(timer);
  }, [isClockedIn, startTime]);

  const handleClockIn = async () => {
    const response = await fetch('/api/widget/clockin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: username, action: 'clockIn' }),
    });
    const data = await response.json();

    if (data.success) {
      const now = new Date();
      setIsClockedIn(true);
      setStartTime(now);
      localStorage.setItem(`clockInStartTime_${username}`, now.toISOString());
    } else {
      alert(data.message || 'Error al registrar el fichaje de entrada');
    }
  };

  const handleClockOut = async () => {
    const response = await fetch('/api/widget/clockin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: username, action: 'clockOut' }),
    });
    const data = await response.json();

    if (data.success) {
      setIsClockedIn(false);
      setStartTime(null);
      localStorage.removeItem(`clockInStartTime_${username}`);
    } else {
      alert(data.message || 'Error al registrar el fichaje de salida');
    }
  };

  return (
    <div className="bg-gradient-to-l from-orange-400 to-blue-900 text-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Clock In</h2>
        <Clock className="w-8 h-8" />
      </div>
      {isClockedIn && (
        <p className="text-4xl font-semibold mb-6">Tiempo trabajado: {elapsedTime}</p>
      )}
      <div className="flex space-x-6">
        <button
          onClick={handleClockIn}
          disabled={isClockedIn}
          className="px-6 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 disabled:opacity-50"
        >
          Fichar Entrada
        </button>
        <button
          onClick={handleClockOut}
          disabled={!isClockedIn}
          className="px-6 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 disabled:opacity-50"
        >
          Fichar Salida
        </button>
      </div>
    </div>
  );
};

export default ClockInWidget;
