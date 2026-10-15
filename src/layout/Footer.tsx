const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <footer className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-white text-center text-xs sm:text-sm text-gray-500">
            <p>© {year} · App Ventas · Desarrollado por el equipo de desarrollo.</p>
        </footer>
    );
};

export default Footer;
