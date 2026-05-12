import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { CircleUser } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, isError } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login({ email, password });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-96 border border-gray-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mb-4">
                        <CircleUser className="text-white" width={32} height={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-700">Iniciar Sesión</h1>
                    <p className="text-gray-500 text-sm mt-1">Ingresa tus credenciales para continuar</p>
                </div>

                {isError && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center border border-red-100">
                        Credenciales inválidas
                    </div>
                )}

                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-600 text-sm font-medium mb-2">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="correo@ejemplo.com"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-600 text-sm font-medium mb-2">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                    {isLoading ? 'Cargando...' : 'Entrar'}
                </button>
            </form>
        </div>
    );
};

export default Login;