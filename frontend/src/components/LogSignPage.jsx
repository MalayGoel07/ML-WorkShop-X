import { useState } from "react";
import api from "../api/api";

export default function LogSignPage({ onNavigate }) {
  const [mode, setMode] = useState("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    try {
      if (mode === "login") {
        const formData = new FormData();
        formData.append("username", email);
        formData.append("password", password);
        const { data } = await api.post("/auth/login", formData);
        localStorage.setItem("token", data.access_token);
        onNavigate("/chat");

      } else {
        if (password !== confirmPassword) return setError("Passwords don't match");
        const { data } = await api.post("/auth/signup", {
          username: email,
          email: email,
          full_name: fullName,
          password: password,
        });
        localStorage.setItem("token", data.access_token);
        onNavigate("/chat");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    }
  };
  return (
    <div className="h-screen bg-[#0a0f18] text-white font-sans overflow-hidden flex flex-col">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="strip absolute w-full h-px top-[20%]" style={{ animationDuration: '2.8s' }}></div>
        <div className="strip absolute w-full h-[3px] top-[20%] blur-sm opacity-50" style={{ animationDuration: '2.8s' }}></div>
        <div className="strip absolute w-full h-px top-[55%] opacity-40" style={{ animationDuration: '3.5s', animationDelay: '-1.5s' }}></div>
        <div className="strip absolute w-full h-[3px] top-[55%] blur-sm opacity-30" style={{ animationDuration: '3.5s', animationDelay: '-1.5s' }}></div>
        <div className="strip absolute w-full h-px top-[80%] opacity-20" style={{ animationDuration: '4s', animationDelay: '-2.8s' }}></div>
      </div>
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#131c2b] bg-[#0a0f18]/80 backdrop-blur-md z-50">
        <span className="text-xl font-bold tracking-tight">
          <span className="text-[#4a9eff]">CB</span>
          <span className="text-[#00e5ff]">-X</span>
        </span>
        <div className="flex items-center gap-8">
            <span className="text-xs text-gray-500 tracking-widest uppercase">Multi-model AI Orchestration</span>
            <button onClick={() => onNavigate("/")} className="text-gray-400 hover:text-blue-400 text-[14px] tracking-wide transition-colors">Back</button>
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center gap-10 px-8 z-10">
        <div className="w-[360px] bg-[#0d1117] border border-[#1e2d3d] rounded-2xl overflow-hidden flex-shrink-0">
          <div className="flex border-b border-[#1e2d3d]">
            <button onClick={() => setMode("login")} className={`flex-1 py-3 text-sm font-medium tracking-wide transition-colors ${mode === "login" ? "text-[#4a9eff] border-b-2 border-[#4a9eff] bg-[#0d1117]": "text-gray-500 hover:text-gray-300"}`}>Login</button>
            <button onClick={() => setMode("signup")} className={`flex-1 py-3 text-sm font-medium tracking-wide transition-colors ${ mode === "signup" ? "text-[#4a9eff] border-b-2 border-[#4a9eff] bg-[#0d1117]" : "text-gray-500 hover:text-gray-300" }`} >Sign Up</button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-white font-semibold text-lg mb-1">{mode === "login" ? "Welcome back" : "Create account"}</p>
              <p className="text-gray-500 text-xs">{mode === "login"? "Sign in to your CB-X workspace": "Start orchestrating AI models today"}</p>
            </div>
            {mode === "signup" && (
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Full Name</label>
                <input value={fullName} onChange={e => setFullName(e.target.value)} type="text" placeholder="John Doe" className="w-full bg-[#131c2b] border border-[#1e2d3d] rounded-lg px-4 py-2.5 text-sm text-gray-300 outline-none focus:border-[#4a9eff]/50 transition-colors placeholder-gray-600"/>
              </div>
            )}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" className="w-full bg-[#131c2b] border border-[#1e2d3d] rounded-lg px-4 py-2.5 text-sm text-gray-300 outline-none focus:border-[#4a9eff]/50 transition-colors placeholder-gray-600"  />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Password</label>
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" className="w-full bg-[#131c2b] border border-[#1e2d3d] rounded-lg px-4 py-2.5 text-sm text-gray-300 outline-none focus:border-[#4a9eff]/50 transition-colors placeholder-gray-600"  />
            </div>

            {mode === "signup" && (
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Confirm Password</label>
                <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} type="password" placeholder="••••••••" className="w-full bg-[#131c2b] border border-[#1e2d3d] rounded-lg px-4 py-2.5 text-sm text-gray-300 outline-none focus:border-[#4a9eff]/50 transition-colors placeholder-gray-600"/>
              </div>
            )}
            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            {mode === "login" && (<div className="flex justify-end"><button className="text-xs text-[#4a9eff] hover:text-[#00e5ff] transition-colors">Forgot password?</button></div>)}
            <button onClick={handleSubmit} className="w-full bg-[#4a9eff] hover:bg-[#3a8eef] text-white py-2.5 rounded-lg text-sm font-medium transition-colors">{mode === "login" ? "Sign In" : "Create Account"}</button>
            <p className="text-center text-xs text-gray-500">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-[#4a9eff] hover:text-[#00e5ff] transition-colors">{mode === "login" ? "Sign up" : "Log in"} </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
