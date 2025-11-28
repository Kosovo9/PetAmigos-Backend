<div className="min-h-screen bg-black text-white flex font-sans">
    {/* Sidebar */}
    <motion.aside
        initial={{ width: 280 }}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-[#0a0a0a] border-r border-white/10 flex flex-col fixed h-full z-50 transition-all duration-300"
    >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
            {isSidebarOpen ? (
                <span className="text-2xl font-black bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                    PETMATCH ADMIN
                </span>
            ) : (
                <span className="text-2xl font-black text-pink-500">PM</span>
            )}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-gray-400 hover:text-white transition-colors"
            >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-8 px-4 space-y-2">
            {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link key={item.href} href={item.href}>
                        <div className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                            ? 'bg-pink-600/20 text-pink-400 border border-pink-600/30 shadow-[0_0_15px_rgba(236,72,153,0.2)]'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}>
                            <item.icon size={24} className={isActive ? 'animate-pulse' : ''} />
                            {isSidebarOpen && (
                                <span className="font-medium whitespace-nowrap">{item.label}</span>
                            )}
                        </div>
                    </Link>
                );
            })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/10">
            <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center'}`}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center font-bold">
                    A
                </div>
                {isSidebarOpen && (
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold truncate">Admin User</p>
                        <p className="text-xs text-gray-500 truncate">Super Admin</p>
                    </div>
                )}
                {isSidebarOpen && (
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            router.push('/login');
                        }}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                        <LogOut size={20} />
                    </button>
                )}
            </div>
        </div>
    </motion.aside>

    {/* Main Content */}
    <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-[280px]' : 'ml-[80px]'}`}>
        {/* Topbar */}
        <header className="h-20 bg-black/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40 px-8 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-200">
                Panel de Control <span className="text-pink-500">v2.0</span>
            </h2>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-sm font-mono">
                    <Activity size={16} />
                    SYSTEM: ONLINE
                </div>
            </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
            {children}
        </div>
    </main>
</div>
    );
}
