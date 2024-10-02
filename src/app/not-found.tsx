import { AlertTriangle, Wrench, Home } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-200 rounded-lg shadow-xl text-center">
        <div className="flex flex-col items-center space-y-2">
          <div className="relative">
            <AlertTriangle className="w-24 h-24 text-orange-500" />
{/*             <Wrench className="w-12 h-12 text-gray-700 absolute bottom-0 right-0 transform rotate-45" /> */}
            <img src="../public/FaSolidCarCrash.svg" alt="" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800">Error 404</h1>
          <p className="text-xl text-gray-600">¡Uy! Parece que esta pieza no encaja</p>
        </div>
        <div className="space-y-4">
          <p className="text-gray-600">
            La página que estás buscando puede haber sido removida, renombrada o está temporalmente fuera de servicio, como un coche en reparación.
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded transition duration-300 ease-in-out"
          >
            <Home className="w-5 h-5 mr-2" />
            Volver al Taller
          </Link>
        </div>
      </div>
    </div>
  )
}