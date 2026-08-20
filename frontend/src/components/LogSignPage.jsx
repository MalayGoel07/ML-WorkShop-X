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
        onNavigate("/home");

      } else {
        if (password !== confirmPassword) return setError("Passwords don't match");
        const { data } = await api.post("/auth/signup", {
          username: email,
          email: email,
          full_name: fullName,
          password: password,
        });
        localStorage.setItem("token", data.access_token);
        onNavigate("/home");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    }
  };
  return (
    <div className="h-screen bg-[#292929] text-white font-sans overflow-hidden flex flex-col">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="strip absolute w-full h-px top-[20%]" style={{ animationDuration: '2.8s' }}></div>
        <div className="strip absolute w-full h-[3px] top-[20%] blur-sm opacity-50" style={{ animationDuration: '2.8s' }}></div>
        <div className="strip absolute w-full h-px top-[55%] opacity-40" style={{ animationDuration: '3.5s', animationDelay: '-1.5s' }}></div>
        <div className="strip absolute w-full h-[3px] top-[55%] blur-sm opacity-30" style={{ animationDuration: '3.5s', animationDelay: '-1.5s' }}></div>
        <div className="strip absolute w-full h-px top-[80%] opacity-20" style={{ animationDuration: '4s', animationDelay: '-2.8s' }}></div>
      </div>
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#172617] bg-[#0e140e]/80 backdrop-blur-md z-50">
        <span className="text-xl font-bold tracking-tight">
          <span className="text-[#adc9ae]">WorkShop</span>
          <span className="text-[#adc9ae]">-X</span>
        </span>
        <div className="flex items-center gap-8">
            <span className="text-xs text-gray-500 tracking-widest uppercase">Multi-model ML System</span>
            <button onClick={() => onNavigate("/")} className="bg-[#7aa88a] hover:bg-[#618c61] text-white text-sm px-4 py-1.5 rounded-lg transition-colors">Back</button>
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center gap-10 px-8 z-10">
        <div className="w-[360px] bg-[#0e140e] border border-[#243724] rounded-2xl overflow-hidden flex-shrink-0">
          <div className="flex border-b border-[#243724]">
            <button onClick={() => setMode("login")} className={`flex-1 py-3 text-sm font-medium tracking-wide transition-colors ${mode === "login" ? "text-[#adc9ae] border-b-2 border-[#adc9ae] bg-[#0e140e]": "text-gray-500 hover:text-gray-300"}`}>Login</button>
            <button onClick={() => setMode("signup")} className={`flex-1 py-3 text-sm font-medium tracking-wide transition-colors ${ mode === "signup" ? "text-[#adc9ae] border-b-2 border-[#adc9ae] bg-[#0e140e]" : "text-gray-500 hover:text-gray-300" }`} >Sign Up</button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-white font-semibold text-lg mb-1">{mode === "login" ? "Welcome back" : "Create account"}</p>
              <p className="text-gray-500 text-xs">{mode === "login"? "Sign in to your workspace": "Start Tweaking ML models today"}</p>
            </div>
            {mode === "signup" && (
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Full Name</label>
                <input value={fullName} onChange={e => setFullName(e.target.value)} type="text" placeholder="John Doe" className="w-full bg-[#101a10] border border-[#243724] rounded-lg px-4 py-2.5 text-sm text-gray-300 outline-none focus:border-[#7aa88a]/50 transition-colors placeholder-gray-600"/>
              </div>
            )}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" className="w-full bg-[#101a10] border border-[#243724] rounded-lg px-4 py-2.5 text-sm text-gray-300 outline-none focus:border-[#7aa88a]/50 transition-colors placeholder-gray-600"  />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Password</label>
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" className="w-full bg-[#101a10] border border-[#243724] rounded-lg px-4 py-2.5 text-sm text-gray-300 outline-none focus:border-[#7aa88a]/50 transition-colors placeholder-gray-600"  />
            </div>

            {mode === "signup" && (
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Confirm Password</label>
                <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} type="password" placeholder="••••••••" className="w-full bg-[#101a10] border border-[#243724] rounded-lg px-4 py-2.5 text-sm text-gray-300 outline-none focus:border-[#7aa88a]/50 transition-colors placeholder-gray-600"/>
              </div>
            )}
            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            {mode === "login" && (<div className="flex justify-end"><button className="text-xs text-[#adc9ae] hover:text-[#b6dbb7] transition-colors">Forgot password?</button></div>)}
            <button onClick={handleSubmit} className="w-full bg-[#618c61] hover:bg-[#275728] text-white py-2.5 rounded-lg text-sm font-medium transition-colors">{mode === "login" ? "Sign In" : "Create Account"}</button>
            <p className="text-center text-xs text-gray-500">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-[#adc9ae] hover:text-[#b6dbb7] transition-colors">{mode === "login" ? "Sign up" : "Log in"} </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
