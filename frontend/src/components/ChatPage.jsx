export default function ChatPage({ onNavigate }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    onNavigate("/");
  };

  return (
    <div className="h-screen bg-[#0a0f18] text-white font-sans flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#131c2b] bg-[#0a0f18]/80 backdrop-blur-md">
        <span className="text-xl font-bold tracking-tight">
          <span className="text-[#4a9eff]">WorkShop</span>
          <span className="text-[#00e5ff]">-X</span>
        </span>
        <button onClick={handleLogout} className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
          Logout
        </button>
      </nav>
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-xl bg-[#0d1117] border border-[#1e2d3d] rounded-2xl p-8 text-center">
          <p className="text-[#4a9eff] text-xs uppercase tracking-widest mb-3">Connected</p>
          <h1 className="text-3xl font-bold mb-3">Backend login works</h1>
          <p className="text-gray-400 text-sm">
            You are signed in and ready for the next WorkShop-X screen.
          </p>
        </div>
      </main>
    </div>
  );
}
