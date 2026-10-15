import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Categorias from './pages/Categorias';
import Proveedores from './pages/Proveedores';
import Productos from './pages/Productos';
import Compras from './pages/Compras';
import Ventas from './pages/Ventas';
import { QueryProvider } from './providers/QueryProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { GuestRoute } from './components/GuestRoute';
import { ToastProvider } from './components/ui/Toast';

const WithLayout = ({ children }: { children: ReactNode }) => (
    <MainLayout>{children}</MainLayout>
);

const ProtectedPage = ({ children }: { children: ReactNode }) => (
    <ProtectedRoute>
        <WithLayout>{children}</WithLayout>
    </ProtectedRoute>
);

function App() {
    return (
        <QueryProvider>
            <ToastProvider>
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/login"
                            element={
                                <GuestRoute>
                                    <Login />
                                </GuestRoute>
                            }
                        />
                        <Route
                            path="/inicio"
                            element={
                                <ProtectedPage>
                                    <Home />
                                </ProtectedPage>
                            }
                        />
                        <Route
                            path="/categorias"
                            element={
                                <ProtectedPage>
                                    <Categorias />
                                </ProtectedPage>
                            }
                        />
                        <Route
                            path="/proveedores"
                            element={
                                <ProtectedPage>
                                    <Proveedores />
                                </ProtectedPage>
                            }
                        />
                        <Route
                            path="/productos"
                            element={
                                <ProtectedPage>
                                    <Productos />
                                </ProtectedPage>
                            }
                        />
                        <Route
                            path="/compras"
                            element={
                                <ProtectedPage>
                                    <Compras />
                                </ProtectedPage>
                            }
                        />
                        <Route
                            path="/ventas"
                            element={
                                <ProtectedPage>
                                    <Ventas />
                                </ProtectedPage>
                            }
                        />
                        <Route path="/404" element={<NotFound />} />
                        <Route path="*" element={<Navigate to="/inicio" replace />} />
                    </Routes>
                </BrowserRouter>
            </ToastProvider>
        </QueryProvider>
    );
}

export default App;
