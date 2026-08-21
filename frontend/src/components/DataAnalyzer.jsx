import { useRef, useState } from "react";

export default function DataAnalyzer({ onNavigate }) {
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState("");
    const handleFileChange = (event) => {setFileName(event.target.files[0]?.name || "");};

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
                            <button type="button" className="rounded-lg bg-[#618c61] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7aa88a]">
                                Analyze dataset
                            </button>
                        </div>
                    </div>

                    <div className="rounded-xl border border-[#243724] bg-[#101a10] p-5">
                        <div className="mb-5">
                            <p className="text-xs uppercase tracking-[0.2em] text-[#adc9ae]">02 / Snapshot</p>
                            <h2 className="mt-1 text-lg font-bold">Dataset overview</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                ["Rows", "--"],
                                ["Columns", "--"],
                                ["Missing", "--"],
                                ["Data types", "--"],
                            ].map(([label, value]) => (
                                <div key={label} className="rounded-lg border border-[#243724] bg-[#0e140e] p-4">
                                    <p className="text-xs text-gray-500">{label}</p>
                                    <p className="mt-2 text-2xl font-bold text-[#adc9ae]">{value}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 rounded-lg border border-dashed border-[#243724] p-4 text-sm leading-6 text-gray-500">
                            Upload a dataset to populate its quality checks and column-level details.
                        </div>
                    </div>
                </div>

                <section className="mt-5 rounded-xl border border-[#243724] bg-[#0e140e]/80 p-5">
                    <div className="mb-5 flex flex-col justify-between gap-2 md:flex-row md:items-end">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-[#adc9ae]">03 / Explore</p>
                            <h2 className="mt-1 text-lg font-bold">Patterns and visualizations</h2>
                        </div>
                        <p className="text-xs text-gray-500">Charts will appear after analysis</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        {[
                            ["Correlation map", "Compare relationships between features."],
                            ["Distribution", "See how values spread across columns."],
                            ["Missing values", "Locate gaps before modeling."],
                        ].map(([title, description]) => (
                            <div key={title} className="flex min-h-40 flex-col justify-between rounded-lg border border-[#243724] bg-[#101a10] p-4 transition hover:border-[#618c61]">
                                <div className="flex items-start justify-between gap-3">
                                    <h3 className="font-semibold text-[#d4e6d5]">{title}</h3>
                                    <span className="h-2 w-2 rounded-full bg-[#618c61]" />
                                </div>
                                <p className="text-sm leading-6 text-gray-500">{description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </section>
        </div>
    );
}