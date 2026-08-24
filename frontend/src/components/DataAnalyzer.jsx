import { useRef, useState } from "react";
import api from "../api/api";

export default function DataAnalyzer({ onNavigate }) {
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState(null);
    const [input, setInput] = useState("");
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const handleFileChange = (event) => {
        const selected = event.target.files[0] || null;
        setFile(selected); setFileName(selected?.name || ""); setAnalysis(null); setError("");
    };

    const runAnalyzer = async () => {
        setIsAnalyzing(true);
        setError("");
        try {
            if (!input.trim() && !file) throw new Error("Add data or choose a file before analyzing.");
            const formData = new FormData();
            if (file) {
                formData.append("file", file);
            } else {
                const isJson = input.trimStart().startsWith("[") || input.trimStart().startsWith("{");
                formData.append("file", new Blob([input], { type: isJson ? "application/json" : "text/csv" }), isJson ? "pasted-data.json" : "pasted-data.csv");
            }
            const { data } = await api.post("/analyze", formData);
            setAnalysis({ ...data.analysis, charts: data.charts || [] });
        } catch (err) {
            setAnalysis(null); setError(err.message);
        } finally {setIsAnalyzing(false);}
    };

    return (
        <div className="h-screen overflow-x-hidden bg-[#292929] px-4 py-4 font-mono text-white md:px-8 overflow-y-auto scrollbar-thin scrollbar-thumb-[#7aa88a]">
            <section className="mx-auto max-w-7xl">
                <header className="mb-4 border-b border-[#243724] pb-5">
                    <p className="mb-2 text-xs uppercase tracking-[0.3em] text-[#adc9ae]">WorkShop-X</p>
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Data Analyzer</h1>
                            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-400">Inspect your dataset, find its shape, and surface patterns worth exploring.</p>
                        </div>
                        <button onClick={() => onNavigate("/home")} className="rounded-lg border border-[#243724] bg-[#101a10] px-4 py-2 text-sm text-gray-200 transition hover:border-[#7aa88a]/70 hover:text-[#adc9ae]">Back</button>
                    </div>
                </header>

                <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
                    <div className="rounded-xl border border-[#243724] bg-[#0e140e]/80 p-5 shadow-2xl shadow-[#172617]/20">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-[#adc9ae]">01 / Input</p>
                                <h2 className="mt-1 text-lg font-bold">Bring in your data</h2>
                            </div>
                            <span className="rounded border border-[#243724] bg-[#172617] px-2 py-1 text-[10px] text-gray-400">CSV / JSON</span>
                        </div>

                        <textarea
                            value={input}
                            onChange={(event) => {setInput(event.target.value);setFile(null);setFileName("");setAnalysis(null);setError("");}}
                            className="h-64 w-full resize-none rounded-lg border border-[#243724] bg-[#070a07] p-4 text-sm leading-6 text-[#d4e6d5] outline-none transition placeholder:text-gray-600 focus:border-[#7aa88a]"
                            placeholder="Paste rows or JSON here..."
                            aria-label="Dataset input"
                        />
                        <input ref={fileInputRef} type="file" accept=".csv,.json,.xlsx" className="hidden" onChange={handleFileChange} />
                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <button
                                type="button"
                                className="rounded-lg border border-[#618c61] bg-[#172617] px-4 py-2 text-sm text-[#d4e6d5] transition hover:bg-[#1f331f] hover:text-white"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Upload file
                            </button>
                            <span className="truncate text-xs text-gray-500">{fileName || "No file selected"}</span>
                            <button type="button" onClick={runAnalyzer} disabled={isAnalyzing} className="rounded-lg bg-[#618c61] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7aa88a] disabled:cursor-not-allowed disabled:opacity-50">
                                {isAnalyzing ? "Analyzing..." : "Analyze dataset"}
                            </button>
                        </div>
                        {error && <p role="alert" className="mt-3 text-sm text-red-400">{error}</p>}
                    </div>

                    <div className="rounded-xl border border-[#243724] bg-[#101a10] p-5">
                        <div className="mb-5">
                            <p className="text-xs uppercase tracking-[0.2em] text-[#adc9ae]">02 / Snapshot</p>
                            <h2 className="mt-1 text-lg font-bold">Dataset overview</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                ["Rows", analysis?.rows ?? "--"],
                                ["Columns", analysis?.columns ?? "--"],
                                ["Missing", analysis?.missing ?? "--"],
                                ["Data types", analysis ? new Set(analysis.types.map(({ type }) => type)).size : "--"],
                            ].map(([label, value]) => (
                                <div key={label} className="rounded-lg border border-[#243724] bg-[#0e140e] p-4">
                                    <p className="text-xs text-gray-500">{label}</p>
                                    <p className="mt-2 text-2xl font-bold text-[#adc9ae]">{value}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 rounded-lg border border-dashed border-[#243724] p-4 text-sm leading-6 text-gray-500">
                            {analysis ? `${analysis.missing} missing values found across ${analysis.columns} columns.` : "Analyze a dataset to populate its quality checks and column-level details."}
                        </div>
                        {analysis && <div className="mt-3 space-y-2 text-sm">{analysis.types.map(({ name, type }) => <div key={name} className="flex justify-between border-b border-[#243724] pb-2"><span className="truncate text-[#d4e6d5]">{name}</span><span className="text-[#adc9ae]">{type}</span></div>)}</div>}
                    </div>
                </div>

                <section className="mt-5 rounded-xl border border-[#243724] bg-[#0e140e]/80 p-5">
                    <div className="mb-5 flex flex-col justify-between gap-2 md:flex-row md:items-end">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-[#adc9ae]">03 / Explore</p>
                            <h2 className="mt-1 text-lg font-bold">Patterns and visualizations</h2>
                        </div>
                        <p className="text-xs text-gray-500">{analysis?.charts?.length || 0} relationship charts</p>
                    </div>
                    {analysis?.charts?.length ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            {analysis.charts.map(({ title, image }) => (
                                <figure key={title} className="overflow-hidden rounded-lg border border-[#243724] bg-[#101a10] p-3">
                                    <img src={`data:image/png;base64,${image}`} alt={title} className="h-auto w-full rounded bg-white" />
                                    <figcaption className="px-1 pt-3 text-sm text-[#d4e6d5]">{title}</figcaption>
                                </figure>
                            ))}
                        </div>
                    ) : (
                        <p className="rounded-lg border border-dashed border-[#243724] p-6 text-sm text-gray-500">Analyze data with at least two related columns to generate relationship charts.</p>
                    )}
                </section>
            </section>
        </div>
    );
}