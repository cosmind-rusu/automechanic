'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Users, Truck, Wrench, Clock } from 'lucide-react';
import TaskList from '@/components/TaskList';

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <EmployeeWidget />
        <RepairedVehiclesWidget />
        <DistributorWidget />
      </div>
      <div className="mt-8">
        <ClockInWidget />
        <TaskList />
      </div>
    </div>
  );
};

const EmployeeWidget = () => {
  const router = useRouter();
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/widget/employeeCount');
      const data = await response.json();
      setValue(data.count);
    };
    fetchData();
  }, []);

  return (
    <DashboardWidget
      title="Número de Empleados"
      value={value}
      icon={<Users className="w-8 h-8 text-blue-500" />}
      color="blue"
      onClick={() => router.push('/dashboard/employe')}
    />
  );
};

const RepairedVehiclesWidget = () => {
  const router = useRouter();
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/widget/repairedVehiclesCount');
      const data = await response.json();
      setValue(data.count);
    };
    fetchData();
  }, []);

  return (
    <DashboardWidget
      title="Vehículos en reparación"
      value={value}
      icon={<Wrench className="w-8 h-8 text-orange-500" />}
      color="orange"
      onClick={() => router.push('/dashboard/vehicles')}
    />
  );
};

const DistributorWidget = () => {
  const router = useRouter();
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/widget/distributorCount');
      const data = await response.json();
      setValue(data.count);
    };
    fetchData();
  }, []);

  return (
    <DashboardWidget
      title="Distribuidores"
      value={value}
      icon={<Truck className="w-8 h-8 text-purple-500" />}
      color="purple"
      onClick={() => router.push('/dashboard/distributors')}
       

    />
  );
};

// ClockIn maneja múltiples usuarios usando localStorage
const ClockInWidget = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");

  // Recupera el nombre de usuario de la sesión
  const username = session?.user?.name;
  
  useEffect(() => {
    if (!username) return; // Si no hay usuario autenticado, salir de esta función

    // Usar una clave única basada en el nombre de usuario
    const storedStartTime = localStorage.getItem(`clockInStartTime_${username}`);
    
    if (storedStartTime) {
      setStartTime(new Date(storedStartTime));
      setIsClockedIn(true);
    }
  }, [username]); // Este efecto se ejecuta de nuevo al cambiar de usuario

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
    setLoading(true);
    const response = await fetch('/api/widget/clockin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usuario: username, action: 'clockIn' }),
    });
    const data = await response.json();
    setLoading(false);

    if (data.success) {
      const now = new Date();
      setIsClockedIn(true);
      setStartTime(now);
      localStorage.setItem(`clockInStartTime_${username}`, now.toISOString()); // Guardar con clave de usuario
      alert(`Fichaje de entrada registrado para ${username}`);
    } else {
      alert(data.message || 'Error al registrar el fichaje de entrada');
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    const response = await fetch('/api/widget/clockin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usuario: username, action: 'clockOut' }),
    });
    const data = await response.json();
    setLoading(false);

    if (data.success) {
      setIsClockedIn(false);
      setStartTime(null);
      localStorage.removeItem(`clockInStartTime_${username}`); // Eliminar clave de usuario
      alert(`Fichaje de salida registrado para ${username}`);
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
          disabled={loading || isClockedIn}
          className="px-6 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 disabled:opacity-50"
        >
          Fichar Entrada
        </button>
        <button
          onClick={handleClockOut}
          disabled={loading || !isClockedIn}
          className="px-6 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 disabled:opacity-50"
        >
          Fichar Salida
        </button>
      </div>
    </div>
  );
};

interface DashboardWidgetProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({ title, value, icon, color, onClick }) => (
  <div 
    onClick={onClick}
    className={`
      bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}-500
      transition-all duration-300 ease-in-out
      hover:scale-105 hover:shadow-lg
      cursor-pointer
    `}
  >
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      {icon}
    </div>
    <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
  </div>
);

export default Dashboard;
