import { Link } from 'react-router-dom';
import { Boxes, Home } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md text-center">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center">
                    <Boxes className="text-indigo-600" width={28} height={28} />
                </div>
                <h1 className="mt-5 text-6xl font-bold text-gray-900">404</h1>
                <h2 className="mt-2 text-xl font-semibold text-gray-700">
                    Página no encontrada
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                    La ruta que buscas no existe o fue movida. Vuelve al inicio para
                    continuar trabajando.
                </p>
                <Link
                    to="/inicio"
                    className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium text-sm"
                >
                    <Home width={16} height={16} />
                    Ir al inicio
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
