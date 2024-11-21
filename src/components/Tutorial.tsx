// app/components/Tutorial.tsx
'use client';

import React, { useState } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

const Tutorial = () => {
  const [run, setRun] = useState(true);

  const steps: Step[] = [
    {
      target: '.tutorial-dashboard',
      content: 'Este es el Dashboard donde encontrarás el resumen principal.',
    },
    {
      target: '.tutorial-vehicles',
      content: 'Aquí puedes gestionar los vehículos registrados.',
    },
    {
      target: '.tutorial-employees',
      content: 'En esta sección puedes administrar a los empleados.',
    },
    {
      target: '.tutorial-inventory',
      content: 'Consulta y gestiona el inventario desde esta página.',
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as 'finished' | 'skipped')) {
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      showProgress
      styles={{
        options: {
          arrowColor: '#fff',
          backgroundColor: '#333',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
          primaryColor: '#007bff',
          textColor: '#fff',
          zIndex: 1000,
        },
      }}
      callback={handleJoyrideCallback}
    />
  );
};

export default Tutorial;
