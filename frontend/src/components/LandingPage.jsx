const models = [
  { role: "Linear Regression", model: "Regression" },
  { role: "Logistic Regression", model: "Classification" },
  { role: "Gradient Descent", model: "Optimization" },
  { role: "Decision Tree", model: "Classification" },
  { role: "Random Forest", model: "Ensemble" },
  { role: "K-Means Clustering", model: "Clustering" },
];

const modelAccuracies = [
  { model: "Linear Regression", accuracy: "82.4%" },
  { model: "Logistic Regression", accuracy: "88.1%" },
  { model: "Decision Tree", accuracy: "85.7%" },
  { model: "Random Forest", accuracy: "93.2%" },
];

const placementRows = Array.from({ length: 100 }, (_, index) => {
  const serialNo = index + 1;
  const cgpa = (6 + ((serialNo * 37) % 40) / 10).toFixed(1);
  const iq = 90 + ((serialNo * 13) % 51);
  const placementPossibility = Math.min(98,Math.max(24, Math.round(Number(cgpa) * 8 + (iq - 90) * 0.7)));
  return { serialNo, cgpa, iq, placementPossibility: `${placementPossibility}%`,};});

export default function CBXLanding() {const openLogin = () => {window.location.href = "/logsign";};

  return (
    <div className="h-screen bg-[#0a0f18] text-white font-sans pt-14 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-400">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="strip absolute w-full h-px top-[20%]" style={{ animationDuration: '2.8s' }}></div>
        <div className="strip absolute w-full h-[3px] top-[20%] blur-sm opacity-50" style={{ animationDuration: '2.8s' }}></div>
        <div className="strip absolute w-full h-px top-[50%] opacity-40" style={{ animationDuration: '3.5s', animationDelay: '-1.5s' }}></div>
        <div className="strip absolute w-full h-[3px] top-[50%] blur-sm opacity-30" style={{ animationDuration: '3.5s', animationDelay: '-1.5s' }}></div>
        <div className="strip absolute w-full h-px top-[78%] opacity-30" style={{ animationDuration: '4s', animationDelay: '-2.8s' }}></div>
      </div>       
      <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 border-b border-[#131c2b] bg-[#0a0f18]/80 backdrop-blur-md z-50">        
        <span className="text-xl font-bold tracking-tight">
          <span className="text-[#4a9eff]">WorkShop</span>
          <span className="text-[#00e5ff]">-X</span>
        </span>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#models" className="hover:text-white transition-colors">Models</a>
          <a href="#demo" className="hover:text-white transition-colors">Demo</a>
        </div>
        <button onClick={openLogin} className="bg-[#4a9eff] hover:bg-[#3a8eef] text-white text-sm px-4 py-1.5 rounded-lg transition-colors">Get Started</button>
      </nav>

      <section className="max-w-5xl mx-auto pt-6 pb-6 text-center backdrop-blur-sm z-50">
        <div className="inline-flex items-center gap-2 bg-[#0d1117] border border-[#1e2d3d] rounded-full px-4 py-1.5 text-xs text-[#4a9eff] mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse inline-block"></span>
          Multi-model ML WorkShop
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 leading-tight"> One interface
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4a9eff] to-[#00e5ff]"> Many Models</span>
        </h1>
        <p className="text-gray-400 text-[16px] max-w-xl mx-auto mb-10">WorKshop-X routes your data to the right data management system, then give details and distributes data to all avaible models.</p>
        <div className="flex items-center justify-center gap-4">
          <button onClick={openLogin} className="bg-[#4a9eff] hover:bg-[#3a8eef] text-white px-6 py-2.5 rounded-lg font-medium transition-colors">Start Testing</button>
          <a href="#models" className="border border-[#1e2d3d] hover:border-[#4a9eff] text-gray-300 hover:text-white px-6 py-2.5 rounded-lg font-medium transition-colors">View Models</a>
        </div>
      </section>

      <section id="demo" className="max-w-4xl mx-auto px-8 pb-8 backdrop-blur-sm z-50">
        <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#1e2d3d]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00e5ff]"></span>
              <span className="text-[#4a9eff] font-bold text-sm tracking-wide">WorkShop-X</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#1e2d3d] flex items-center justify-center text-xs text-gray-300">P</div>
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-[#131c2b] border border-[#1e2d3d] rounded-xl overflow-hidden text-sm text-gray-300">
              <div className="max-h-[320px] overflow-auto">
                <table className="w-full min-w-[560px] border-collapse text-left">
                  <thead className="sticky top-0 bg-[#0d1117] text-[#4a9eff] text-xs uppercase tracking-widest">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Serial No.</th>
                      <th className="px-4 py-3 font-semibold">CGPA</th>
                      <th className="px-4 py-3 font-semibold">IQ</th>
                      <th className="px-4 py-3 font-semibold">Placement Possibility</th>
                    </tr>
                  </thead>
                  <tbody>
                    {placementRows.map((row) => (
                      <tr key={row.serialNo} className="border-t border-[#1e2d3d] hover:bg-[#0d1117] transition-colors">
                        <td className="px-4 py-3 font-mono text-gray-400">{row.serialNo}</td>
                        <td className="px-4 py-3">{row.cgpa}</td>
                        <td className="px-4 py-3">{row.iq}</td>
                        <td className="px-4 py-3 text-[#00e5ff] font-medium">{row.placementPossibility}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-[#131c2b] border border-[#1e2d3d] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#4a9eff] font-semibold text-xs uppercase tracking-widest">ML Model Accuracy</span>
                <span className="text-gray-500 text-xs">Latest run</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {modelAccuracies.map((item) => (
                  <div key={item.model} className="flex items-center justify-between rounded-lg bg-[#0d1117] border border-[#1e2d3d] px-4 py-3">
                    <span className="text-sm text-gray-300">{item.model}</span>
                    <span className="text-sm font-semibold text-[#00e5ff]">{item.accuracy}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-600 px-1">
              <span>Machine Learning Visuals</span>
              <span>Powered by Sklearn</span>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="max-w-5xl mx-auto px-8 pb-10 backdrop-blur-sm z-50">
        <p className="text-xs tracking-widest text-[#4a9eff] uppercase mb-3 text-center">Why WorkShop-X</p>
        <h2 className="text-3xl font-bold text-center mb-8">Built different</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { title: "Enhanced Routing", desc: "Routes the input data, analyzes your data and peform EDA, distributes data to all models.", icon: "⇄" },
            { title: "ML Models", desc: "Dedicated models for Regression, Classification, Clustering, and Optimization run in parallel for the task at hand.", icon: "◈" },
            { title: "Ultima Output", desc: "ML model synthesizes output responses into one table, with final accuracies.", icon: "⊕" },
          ].map((f) => (
            <div key={f.title} className="bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-6 hover:border-[#4a9eff]/40 transition-colors">
              <div className="text-2xl mb-4 text-[#00e5ff]">{f.icon}</div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="models" className="max-w-5xl mx-auto px-8 pb-8 backdrop-blur-sm z-50">
        <p className="text-xs tracking-widest text-[#4a9eff] uppercase mb-3 text-center">Under the hood</p>
        <h2 className="text-3xl font-bold text-center mb-8">The Models lineup</h2>
        <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-2xl overflow-hidden">
          {models.map((m, i) => (
            <div key={m.role} className={`flex items-center justify-between px-6 py-4 text-sm ${i < models.length - 1 ? "border-b border-[#1e2d3d]" : ""} hover:bg-[#131c2b] transition-colors`} >
              <span className="text-white font-medium">{m.role}</span>
              <div className="flex items-center gap-2 text-gray-400 font-mono text-xs">
                {m.model}
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[#131c2b] py-8 text-center px-8 backdrop-blur-sm z-50">
        <h2 className="text-3xl font-bold mb-4">Ready to try models?</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto text-sm">WorkShop-X brings together all the ML models and perform proper data management.</p>
        <button className="bg-[#4a9eff] hover:bg-[#3a8eef] text-white px-8 py-3 rounded-lg font-medium transition-colors">Launch WorkShop-X</button>
      </section>

      <footer className="border-t border-[#131c2b] px-8 py-6 flex items-center justify-between text-xs text-gray-600 backdrop-blur-sm z-50">
        <span><span className="text-[#4a9eff]">WorkShop</span><span className="text-[#00e5ff]">-X</span><span> : </span><span>Multi-model ML visualization system</span></span>
        <span>Multi-model | ML</span>
      </footer>
    </div>
  );
}
