import { useState } from 'react';
import type { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface LayoutProps {
    children: ReactNode;
}

const MainLayout = ({ children }: LayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            <Header onToggleSidebar={toggleSidebar} />

            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-20 focus:left-4 focus:z-50 focus:bg-white focus:px-3 focus:py-2 focus:rounded-lg focus:shadow focus:text-sm focus:text-indigo-700 focus:font-medium"
            >
                Saltar al contenido principal
            </a>

            <div className="flex flex-1 relative min-h-0">
                <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

                <main
                    id="main-content"
                    className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 w-full min-w-0"
                    aria-label="Contenido principal"
                >
                    <div className="mx-auto w-full max-w-7xl">{children}</div>
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default MainLayout;
