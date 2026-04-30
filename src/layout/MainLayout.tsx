import type { ReactNode } from 'react';
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

interface LayoutProps {
    children: ReactNode;
}

const MainLayout = ({ children }: LayoutProps) => {
    return (
        <div className='min-h-screen flex flex-col' >
            <Header />
            <section className='flex flex-1 overflow-hidden'  >
                <Sidebar />
                <main className='flex-1 overflow-y-auto bg-gray-50' >
                    {children}
                </main>
            </section>
            <Footer />
        </div>
    );
}

export default MainLayout;