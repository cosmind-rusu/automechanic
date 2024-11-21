import React, { useEffect, useState } from 'react';

type GeneralAlert = {
  severity: string;
  id: string;
  titulo: string;
  mensaje: string;
  activa: boolean;
};

export default function DashboardAlert() {
  const [alerts, setAlerts] = useState<GeneralAlert[]>([]);

  useEffect(() => {
    fetchActiveAlerts();
  }, []);

  const fetchActiveAlerts = async () => {
    try {
      const response = await fetch('/api/alerts');
      const data = await response.json();
      setAlerts(data.filter((alert: GeneralAlert) => alert.activa));
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  return (
    <div>
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-4 mb-4 rounded ${
            alert.severity === 'CRITICAL'
              ? 'bg-red-100 border-red-500 text-red-800'
              : alert.severity === 'WARNING'
              ? 'bg-yellow-100 border-yellow-500 text-yellow-800'
              : 'bg-blue-100 border-blue-500 text-blue-800'
          }`}
        >
          <h3 className="font-bold">{alert.titulo}</h3>
          <p>{alert.mensaje}</p>
        </div>
      ))}
    </div>
  );
}
