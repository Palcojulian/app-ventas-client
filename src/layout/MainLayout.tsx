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
        <div className="min-h-screen flex flex-col">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={closeSidebar}
                    aria-hidden="true"
                />
            )}

            <Header onToggleSidebar={toggleSidebar} />

            <section className="flex flex-1 overflow-hidden relative">
                <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

                <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-10 w-full">
                    {children}
                </main>
            </section>

            <Footer />
        </div>
    );
};

export default MainLayout;
