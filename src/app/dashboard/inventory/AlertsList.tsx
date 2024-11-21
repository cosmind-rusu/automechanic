import React from 'react';

type Alert = {
  id: string;
  message: string;
  currentQty: number;
  minQty: number;
  createdAt: string;
};

type AlertsListProps = {
  alerts: Alert[];
};

const AlertsList: React.FC<AlertsListProps> = ({ alerts }) => {
  if (alerts.length === 0) {
    return null; // No mostrar nada si no hay alertas
  }

  return (
    <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      <h3 className="text-lg font-bold">Alertas Activas</h3>
      <ul className="list-disc list-inside">
        {alerts.map((alert) => (
          <li key={alert.id}>
            {alert.message} (Actual: {alert.currentQty}, Mínimo: {alert.minQty}) -{' '}
            {new Date(alert.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlertsList;
