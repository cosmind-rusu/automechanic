"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Server, AlertTriangle, Copy } from "lucide-react";

type CheckResult = {
  label: string;
  status: "ok" | "error";
  message: string;
  response?: any;
  endpoint?: string;
};

export default function HealthCheckPage() {
  const { data: session, status: authStatus } = useSession();
  const [checks, setChecks] = useState<CheckResult[]>([]);
  const [apiChecks, setApiChecks] = useState<CheckResult[]>([]);
  const [systemInfo, setSystemInfo] = useState<{ os: string; browser: string }>({
    os: "Unknown",
    browser: "Unknown",
  });
  const [expandedApis, setExpandedApis] = useState<string[]>([]);
  const [copiedApi, setCopiedApi] = useState<string | null>(null);

  const apiEndpoints = [
    { endpoint: "/api/distributors", label: "API de Distribuidores" },
    { endpoint: "/api/employees", label: "API de Empleados" },
    { endpoint: "/api/inventory", label: "API de Inventario" },
    { endpoint: "/api/vehicles", label: "API de Vehiculos" }, 
    { endpoint: "/api/administration", label: "API de Administracion" },
    { endpoint: "/api/forgot-password", label: "API de Olvide mi contraseña" },
    { endpoint: "/api/reset-password", label: "API de Resetear la contraseña" },
    { endpoint: "/api/chat", label: "API de Mini Mech" },
    { endpoint: "/api/mechanicselector", label: "API de Selector de mecanicos para vehiculos" },
    
  ];

  useEffect(() => {
    runHealthChecks();
    runApiChecks();
    detectSystemInfo();
  }, []);

  const runHealthChecks = async () => {
    const results: CheckResult[] = [];

    if (authStatus === "authenticated" && session) {
      const userRole = session.user?.role;
      results.push({
        label: "Autenticación",
        status: "ok",
        message: `Usuario autenticado como ${session.user?.name} con rol ${userRole}`,
      });

      if (userRole === "JEFE_MECANICO") {
        results.push({
          label: "Permisos de Rol",
          status: "ok",
          message: "El usuario tiene permisos de administrador",
        });
      } else {
        results.push({
          label: "Permisos de Rol",
          status: "error",
          message: "El usuario no tiene permisos de administrador",
        });
      }
    } else if (authStatus === "unauthenticated") {
      results.push({
        label: "Autenticación",
        status: "error",
        message: "Usuario no autenticado",
      });
    } else {
      results.push({
        label: "Autenticación",
        status: "error",
        message: "Error al comprobar la autenticación",
      });
    }

    try {
      const response = await fetch("/api/healtz/database");
      const dbStatus = await response.json();
      results.push({
        label: "Base de Datos",
        status: dbStatus.ok ? "ok" : "error",
        message: dbStatus.ok
          ? "Conexión a la base de datos exitosa"
          : "Error en la conexión a la base de datos",
      });
    } catch (error) {
      results.push({
        label: "Base de Datos",
        status: "error",
        message: "Error al verificar la base de datos",
      });
    }

    setChecks(results);
  };

  const runApiChecks = async () => {
    const apiResults = await Promise.all(
      apiEndpoints.map(async ({ endpoint, label }) =>
        checkApiStatus(endpoint, label)
      )
    );
    setApiChecks(apiResults);
  };

  const checkApiStatus = async (
    endpoint: string,
    label: string
  ): Promise<CheckResult> => {
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      if (response.ok) {
        return {
          label,
          status: "ok",
          message: `${label} está funcionando correctamente`,
          response: data,
          endpoint,
        };
      } else {
        return {
          label,
          status: "error",
          message: `${label} no está disponible (código: ${response.status})`,
          response: null,
          endpoint,
        };
      }
    } catch (error) {
      return {
        label,
        status: "error",
        message: `Error al conectar con ${label}`,
        response: null,
        endpoint,
      };
    }
  };

  const detectSystemInfo = () => {
    const userAgent = navigator.userAgent;
    let os = "Unknown";
    let browser = "Unknown";

    if (userAgent.includes("Win")) os = "Windows";
    else if (userAgent.includes("Mac")) os = "macOS";
    else if (userAgent.includes("Linux")) os = "Linux";
    else if (userAgent.includes("Android")) os = "Android";
    else if (userAgent.includes("iOS")) os = "iOS";

    if (userAgent.includes("Firefox"))
      browser = `Firefox ${/Firefox\/(\d+\.\d+)/.exec(userAgent)?.[1]}`;
    else if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
      browser = `Chrome ${/Chrome\/(\d+\.\d+)/.exec(userAgent)?.[1]}`;
    } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
      browser = `Safari ${/Version\/(\d+\.\d+)/.exec(userAgent)?.[1]}`;
    } else if (userAgent.includes("Edg"))
      browser = `Edge ${/Edg\/(\d+\.\d+)/.exec(userAgent)?.[1]}`;
    else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
      browser = `Opera ${/OPR\/(\d+\.\d+)/.exec(userAgent)?.[1]}`;
    }

    setSystemInfo({ os, browser });
  };

  const toggleResponse = (label: string) => {
    setExpandedApis((prev) =>
      prev.includes(label) ? prev.filter((api) => api !== label) : [...prev, label]
    );
  };

  const handleCopy = (endpoint: string) => {
    navigator.clipboard.writeText(endpoint).then(() => {
      setCopiedApi(endpoint);
      setTimeout(() => setCopiedApi(null), 2000);
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Health Check</h1>

      <ul className="space-y-4">
        {checks.map((check, index) => (
          <li
            key={index}
            className={`p-4 rounded-lg flex items-center space-x-4 ${
              check.status === "ok" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {check.status === "ok" ? (
              <CheckCircle className="text-green-600 w-6 h-6 animate-bounce" />
            ) : (
              <XCircle className="text-red-600 w-6 h-6 animate-pulse" />
            )}
            <div>
              <h2 className="font-semibold text-lg">{check.label}</h2>
              <p className="text-sm">{check.message}</p>
            </div>
          </li>
        ))}

        <li className="p-4 rounded-lg bg-blue-100 flex items-center space-x-4">
          <Server className="text-blue-500 w-6 h-6 animate-pulse" />
          <div>
            <h2 className="font-semibold text-lg">Sistema Operativo</h2>
            <p className="text-sm">{systemInfo.os}</p>
          </div>
        </li>

        <li className="p-4 rounded-lg bg-blue-100 flex items-center space-x-4">
          <Server className="text-blue-500 w-6 h-6 animate-pulse" />
          <div>
            <h2 className="font-semibold text-lg">Navegador</h2>
            <p className="text-sm">{systemInfo.browser}</p>
          </div>
        </li>
      </ul>

      <h2 className="text-2xl font-bold mt-10 mb-6">API Checks</h2>
      <ul className="space-y-4">
        {apiChecks.map((check, index) => (
          <li
            key={index}
            className={`p-4 rounded-lg ${
              check.status === "ok" ? "bg-green-100" : "bg-red-100"
            } flex flex-col space-y-2`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {check.status === "ok" ? (
                  <CheckCircle className="text-green-600 w-5 h-5 animate-bounce" />
                ) : (
                  <AlertTriangle className="text-red-600 w-5 h-5 animate-pulse" />
                )}
                <h2 className="font-semibold text-lg">{check.label}</h2>
              </div>

              <button
                onClick={() => handleCopy(check.endpoint || "")}
                className="flex items-center text-gray-500 text-sm hover:text-gray-800 transition"
              >
                <Copy className="w-4 h-4 mr-1" />
                {copiedApi === check.endpoint ? "¡Copiado!" : "Copiar ruta"}
              </button>
            </div>

            <p className="text-sm text-gray-600">
              <span className="font-semibold">Ruta:</span> {check.endpoint}
            </p>
            <p className="text-sm">{check.message}</p>

            <button
              onClick={() => toggleResponse(check.label)}
              className="text-blue-500 mt-2 underline flex items-center"
            >
              {expandedApis.includes(check.label) ? (
                <>
                  Ocultar <ChevronUp className="w-4 h-4 ml-1" />
                </>
              ) : (
                <>
                  Ver <ChevronDown className="w-4 h-4 ml-1" />
                </>
              )}
            </button>

            {expandedApis.includes(check.label) && (
              <pre className="bg-gray-50 rounded p-3 mt-2 border border-gray-200 overflow-auto text-xs max-h-48 transition-all duration-300 ease-in-out transform">
                {JSON.stringify(check.response, null, 2)}
              </pre>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
