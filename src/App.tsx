import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Categorias from './pages/Categorias';
import Proveedores from './pages/Proveedores';
import Productos from './pages/Productos';
import Compras from './pages/Compras';
import Ventas from './pages/Ventas';
import { QueryProvider } from './providers/QueryProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { GuestRoute } from './components/GuestRoute';

function App() {

    return (
        <QueryProvider>
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
                            <ProtectedRoute>
                                <MainLayout>
                                    <Home />
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/categorias"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <Categorias />
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/proveedores"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <Proveedores />
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/productos"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <Productos />
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/compras"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <Compras />
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/ventas"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <Ventas />
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/inicio" replace />} />
                </Routes>
            </BrowserRouter>
        </QueryProvider>
    )
}

export default App