'use client';
import { useState } from "react";
import { Wrench, User, Lock } from "lucide-react";
import { workshopName } from "../../../config";

export default function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // Step 1: Enter username, Step 2: Reset password

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: username }), // Asegúrate de que `usuario` esté correcto
      });

      if (response.ok) {
        setMessage("Usuario encontrado. Ahora puedes restablecer tu contraseña.");
        setStep(2); // Proceed to reset password
      } else {
        const data = await response.json();
        setError(data.error || "Usuario no encontrado. Por favor, verifica el nombre de usuario.");
      }
    } catch (error) {
      setError("Ocurrió un error. Por favor, inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: username, newPassword }),
      });

      if (response.ok) {
        setMessage("Contraseña restablecida correctamente. Ahora puedes iniciar sesión.");
        setStep(1); // Reset to initial step
        setUsername("");
        setNewPassword("");
      } else {
        const data = await response.json();
        setError(data.error || "Error al restablecer la contraseña. Inténtalo nuevamente.");
      }
    } catch (error) {
      setError("Ocurrió un error. Por favor, inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-200 rounded-lg shadow-xl border-t-4 border-orange-500">
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center justify-center w-20 h-20 bg-orange-500 rounded-full">
            <Wrench className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">{workshopName}</h2>
          <p className="text-sm text-gray-600">Restablecer contraseña</p>
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {message && <p className="text-green-500 text-center">{message}</p>}
        
        {step === 1 ? (
          <form onSubmit={handleUsernameSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="text-gray-700">Nombre de usuario</label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="TuNombreDeUsuario"
                  required
                  className="pl-10 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full py-2"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
            <button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-md disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Verificando...' : 'Verificar usuario'}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-gray-700">Nueva contraseña</label>
              <div className="relative">
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nueva contraseña"
                  required
                  className="pl-10 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full py-2"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
            <button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-md disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Restableciendo...' : 'Restablecer contraseña'}
            </button>
          </form>
        )}
        <div className="text-sm text-center">
          <a href="/" className="text-orange-600 hover:underline">
            Volver al inicio de sesión
          </a>
        </div>
      </div>
    </div>
  );
}
