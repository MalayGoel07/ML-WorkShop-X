import { useEffect, useState } from "react";
import FloatingWords from "../components/FloatingWords";

const terminalRoutes = {
  ai: "/ai",
  analyze: "/analyze",
  roadmap: "/roadmap",
  compare: "/compare",
  create: "/createdata",
  lab: "/lab",
  profile: "/profile",
};

const terminalCommands = {
  help: "Commands: help, clear, ai, analyze, roadmap, compare, create, lab, data, profile, logout",
  ai: "Opening assistant lab...",
  analyze: "Data analyzer ready!",
  roadmap: "Roadmap loading...",
  compare: "Comparator workspace ready!",
  compiler: "Sandbox compiler ready!",
  create: "Creating window for fresh data, formable with your own tweaks",
  lab: "Starting full progression of workshop...",
  data: "Data creator ready!",
  practice: "Practice problems ready!",
  profile: "Opening profile...",
  feedback: "Opening feedback...",
  about: "Opening about page...",
};

const keyRows = [
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "bksp"],
  ["tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]"],
  ["caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "enter"],
  ["shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "shift"],
  ["ctrl", "alt", "fn", "space", "alt", "<", ">"],
];

export default function HomePage({ onNavigate }) {
  const [terminal, setTerminal] = useState("> help");
  const [caps, setCaps] = useState(false);
  const navigate = (route) => {
    if (typeof onNavigate === "function") {onNavigate(route);}
    else {
      console.warn( "[HomePage] onNavigate prop missing or not a function — falling back to window.location");
      window.location.href = route;
    }
  };

  const handleLogout = () => {localStorage.removeItem("token");navigate("/");};
  const getCurrentLineLength = (value) => {
    const lastPromptIndex = value.lastIndexOf("> ");
    return lastPromptIndex === -1 ? 0 : value.length - (lastPromptIndex + 2);
  };

  const handleCommand = (value) => {
    if (value === "bksp") {setTerminal((current) =>getCurrentLineLength(current) > 0 ? current.slice(0, -1) : current);return;}
    if (value === "enter") {
      const command = terminal.split("\n").at(-1).replace("> ", "").trim().toLowerCase();
      if (command === "clear") {setTerminal("> ");return;}
      if (command === "logout") { handleLogout();return;}
      const route = terminalRoutes[command];
      if (route) navigate(route);
      const response = terminalCommands[command] || "Command not found";
      setTerminal(`${terminal}\n${response}\n> `);
      return;
    }
    if (value === "tab") {setTerminal((current) => `${current}    `);return;}
    if (value === "caps") {setCaps((current) => !current);return;}
    if (value === "space") {setTerminal((current) => `${current} `);return;}
    if (value.length === 1) {setTerminal((current) => `${current}${caps ? value.toUpperCase() : value}`);}
  };

  useEffect(() => {
    const handlePhysicalKeyboard = (event) => {
      const key = event.key;
      if (key === "Backspace") { handleCommand("bksp"); return; }
      if (key === "Enter") { handleCommand("enter"); return; }
      if (key === "Tab") { event.preventDefault(); handleCommand("tab"); return; }
      if (key === "CapsLock") { handleCommand("caps"); return; }
      if (key === " ") { event.preventDefault(); handleCommand("space"); return; }
      if (key.length === 1) { handleCommand(key.toLowerCase()); }
    };
    window.addEventListener("keydown", handlePhysicalKeyboard);
    return () => { window.removeEventListener("keydown", handlePhysicalKeyboard); };
  }, [caps, terminal]);

  return (
    <div className="min-h-screen bg-[#292929] text-white font-mono overflow-x-hidden">
      <FloatingWords />
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-[#172617] bg-[#0e140e]/80 px-5 py-2 backdrop-blur-lg md:px-8">
        <button onClick={() => navigate("/home")} className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#adc9ae] to-[#618c61]">WorkShop-X</button>
        <div className="flex items-center gap-4">
          <button onClick={handleLogout} className="rounded-lg border border-[#243724] bg-[#101a10] px-4 py-2 text-sm text-gray-200 transition hover:border-[#7aa88a]/70 hover:text-[#adc9ae]">Logout</button>
          <button className="rounded-[30px] border border-[#243724] bg-[#101a10] px-4 py-2 text-sm text-gray-200 transition hover:border-[#7aa88a]/70 hover:text-[#adc9ae]">P</button>
        </div>
      </nav>

      <main className="p-4">
        <section className="mx-auto mt-4 max-w-7xl px-3 md:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)_80px]">
            <div id="terminal">
              <div className="rounded-xl border border-dashed border-[#243724] bg-[#0e140e]/35 p-4">
                <div className="mx-auto h-64 max-w-2xl overflow-hidden rounded-lg border border-[#243724] bg-[#070a07] p-4 font-mono text-xs leading-5 text-[#adc9ae] shadow-2xl shadow-[#243724]/20">
                  <pre className="whitespace-pre-wrap break-words">
                    {terminal}_
                  </pre>
                </div>

                <div className="mx-auto mt-4 max-w-2xl overflow-x-auto rounded-xl border border-[#243724] bg-[#101a10]/90 p-3">
                  <div className="w-max space-y-1 md:mx-auto">
                    {keyRows.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex justify-center gap-2">
                        {row.map((key) => {
                          const wide = key === "space" ? "w-50" : key.length > 1 ? "w-11" : "w-7";
                          return (
                            <button
                              key={`${rowIndex}-${key}`}
                              onClick={() => handleCommand(key)}
                              className={`${wide} h-9 rounded border border-[#243724] border-b-[#050805] bg-[#172617] text-[11px] text-[#d4e6d5] transition hover:bg-[#1f331f] active:translate-y-0.5 active:border-b`}
                            >
                              {key === "space" ? "" : key}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div role="button" tabIndex={0} onClick={() => navigate("/createdata")} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") navigate("/createdata"); }} className="flex-1 cursor-pointer rounded-xl border border-[#243724] bg-[#101a10] p-5 transition hover:border-[#618c61] hover:bg-[#142014] focus:outline-none focus:ring-2 focus:ring-[#7aa88a]">
                <h2 className="mb-2 text-lg font-bold text-[#adc9ae]">Create Data</h2>
                <p className="text-sm leading-6 text-gray-400">
                  Experiment with custom learning data and test your
                  ideas in an interactive workspace.
                </p>
              </div>

              <div role="button" tabIndex={0} onClick={() => navigate("/analyze")} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") navigate("/analyze"); }} className="flex-1 cursor-pointer rounded-xl border border-[#243724] bg-[#101a10] p-5 transition hover:border-[#618c61] hover:bg-[#142014] focus:outline-none focus:ring-2 focus:ring-[#7aa88a]">
                <h2 className="mb-2 text-lg font-bold text-[#adc9ae]">Analyze Data</h2>
                <p className="text-sm leading-6 text-gray-400">
                  Explore datasets, inspect missing values, understand
                  features, and perform exploratory data analysis.
                </p>
              </div>

              <div role="button" tabIndex={0} onClick={() => navigate("/compare")} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") navigate("/compare"); }} className="flex-1 cursor-pointer rounded-xl border border-[#243724] bg-[#101a10] p-5 transition hover:border-[#618c61] hover:bg-[#142014] focus:outline-none focus:ring-2 focus:ring-[#7aa88a]">
                <h2 className="mb-2 text-lg font-bold text-[#adc9ae]">Compare Models</h2>
                <p className="text-sm leading-6 text-gray-400">
                  Train different algorithms and compare their performance,
                  metrics, and predictions side by side.
                </p>
              </div>
            </div>

            <div className="flex min-h-full flex-col items-center justify-between rounded-[30px] w-14 border border-[#243724] hover:border-[#618c61] bg-[#161616] px-2 py-8">
              <button onClick={() => navigate("/history")} className="w-full rounded-[30px] border border-[#243724] bg-[#172617] py-3 text-xs text-[#d4e6d5] hover:border-[#618c61] transition hover:bg-[#1f331f] hover:text-[#adc9ae]">His</button>
              <button onClick={() => navigate("/roadmap")} className="w-full rounded-[30px] border border-[#243724] bg-[#172617] py-3 text-xs text-[#d4e6d5] hover:border-[#618c61] transition hover:bg-[#1f331f] hover:text-[#adc9ae]">Map</button>
              <button onClick={() => navigate("/ai")} className="w-full rounded-[30px] border border-[#243724] bg-[#172617] py-3 text-xs text-[#d4e6d5] hover:border-[#618c61] transition hover:bg-[#1f331f] hover:text-[#adc9ae]">AI</button>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}