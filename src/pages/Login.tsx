import { useState } from 'react';
import type { FormEvent } from 'react';
import { Eye, EyeOff, Loader2, Boxes, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading, isError } = useAuth();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        login({ email, password });
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 text-white flex-col justify-between p-10 xl:p-16">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
                        <Boxes width={22} height={22} />
                    </div>
                    <span className="text-xl font-bold">App Ventas</span>
                </div>

                <div className="space-y-4 max-w-md">
                    <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
                        Gestiona tu negocio en un solo lugar
                    </h1>
                    <p className="text-indigo-100 text-base xl:text-lg leading-relaxed">
                        Productos, categorías, proveedores, compras y ventas — todo conectado y
                        accesible desde cualquier dispositivo.
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-4 max-w-md">
                    {[
                        { n: '+120', l: 'Productos' },
                        { n: '8', l: 'Categorías' },
                        { n: '24/7', l: 'Disponible' },
                    ].map((s) => (
                        <div
                            key={s.l}
                            className="bg-white/10 backdrop-blur rounded-xl px-3 py-4 border border-white/15"
                        >
                            <p className="text-xl font-bold">{s.n}</p>
                            <p className="text-xs text-indigo-100 mt-1">{s.l}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-4 sm:p-8">
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center">
                            <Boxes className="text-white" width={22} height={22} />
                        </div>
                        <span className="text-lg font-bold text-gray-900">App Ventas</span>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Iniciar sesión</h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Ingresa tus credenciales para acceder al panel.
                            </p>
                        </div>

                        {isError && (
                            <div
                                role="alert"
                                className="mb-5 flex items-start gap-2 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm"
                            >
                                <AlertCircle width={18} height={18} className="flex-shrink-0 mt-0.5" />
                                <span>Credenciales inválidas. Verifica e intenta de nuevo.</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Correo electrónico"
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="correo@ejemplo.com"
                                autoComplete="email"
                                required
                                leftIcon={<Mail width={16} height={16} />}
                            />

                            <div>
                                <Input
                                    label="Contraseña"
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                    leftIcon={<Lock width={16} height={16} />}
                                    rightIcon={
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((s) => !s)}
                                            className="text-gray-400 hover:text-gray-600 hover:cursor-pointer"
                                            aria-label={
                                                showPassword
                                                    ? 'Ocultar contraseña'
                                                    : 'Mostrar contraseña'
                                            }
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <EyeOff width={16} height={16} />
                                            ) : (
                                                <Eye width={16} height={16} />
                                            )}
                                        </button>
                                    }
                                />
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 text-gray-600 hover:cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-indigo-500 focus:ring-indigo-500"
                                    />
                                    Recordarme
                                </label>
                                <button
                                    type="button"
                                    className="text-indigo-600 hover:text-indigo-700 hover:underline"
                                >
                                    ¿Olvidaste tu contraseña?
                                </button>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                fullWidth
                                disabled={isLoading}
                                leftIcon={
                                    isLoading ? (
                                        <Loader2 width={18} height={18} className="animate-spin" />
                                    ) : undefined
                                }
                            >
                                {isLoading ? 'Ingresando...' : 'Entrar'}
                            </Button>
                        </form>

                        <p className="mt-6 text-center text-xs text-gray-500">
                            ¿Necesitas ayuda? Contacta al administrador del sistema.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
