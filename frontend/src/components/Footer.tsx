export default function Footer() {
    return (
        <footer className="bg-surface-950 text-surface-400 py-12 border-t border-surface-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                <div className="w-[80px] h-[80px] mb-4 relative bg-white rounded-full shadow-md flex items-center justify-center p-1">
                    <img src="/logo.png" alt="Swat Garden Center Logo" className="w-full h-full object-contain mix-blend-multiply contrast-[2.0] brightness-[1.2]" />
                </div>
                <p>© {new Date().getFullYear()} Swat Garden Center AI. Cultivating beautiful spaces.</p>
            </div>
        </footer>
    );
}
