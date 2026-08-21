const roadmapSections = [
    {
        title: "Introduction",
        topics: ["What is machine learning?", "What's the prerequisites?"],
    },
    {
        title: "Mathematics",
        topics: ["Linear algebra", "Calculus","Statistics and probability"],
    },
    {
        title: "Python",
        topics: ["Python basics", "Data structures", "Libraries for machine learning"],
    },
    {
        title: "Data",
        topics: ["Data Sources", "Data Formate", "Data Cleaning", "Data Preprocessing"],
    },
    {
        title: "Machine Learning",
        topics: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning"],
    },
    {
        title: "Classification",
        topics: ["KNN", "Logistic Regression", "SVM", "Decision Trees", "Random Forest", "Gradient Boosting"],
    },
    {
        title: "Regression",
        topics: ["Linear Regression", "Polynomial Regression", "Ridge Regression", "Lasso Regression"],
    },
    {
        title: "Clustering",
        topics: ["K-Means", "Hierarchical Clustering", "DBSCAN"],
    },
    {
        title: "Model Evaluation",
        topics: ["Accuracy", "Precision", "Recall", "F1 Score"],
    },
    {
        title: "Deep Learning",
        topics: ["Neural Networks", "Convolutional Neural Networks", "Recurrent Neural Networks"],
    },
];

export default function Roadmap({ onNavigate }) {
	return (
        <div className="h-screen overflow-x-hidden overflow-y-auto bg-[#292929] px-4 py-8 font-mono text-white md:px-8 overflow-y-auto scrollbar-thin scrollbar-thumb-[#7aa88a]">
            <div className="mx-auto max-w-5xl">
                <header className="mb-10 flex flex-col justify-between gap-4 border-b border-[#243724] pb-6 md:flex-row md:items-end">
                    <div>
                        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-[#adc9ae]">WorkShop-X / Roadmap</p>
                        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Machine learning</h1>
                        <p className="mt-2 text-sm leading-6 text-gray-400">Build the foundations in the order that makes every next step easier.</p>
                    </div>
                    <button type="button" onClick={() => onNavigate("/home")} className="rounded-lg border border-[#243724] bg-[#101a10] px-4 py-2 text-sm text-gray-200 transition hover:border-[#7aa88a] hover:text-[#adc9ae]">Back</button>
                </header>

                <div className="relative">
                    <div className="absolute bottom-8 left-1/2 top-8 hidden w-px -translate-x-1/2 bg-[#365536] md:block" />
                    <div className="relative space-y-8">
                        {roadmapSections.map((section, index) => (
                            <div key={section.title} className="grid items-center gap-5 md:grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)]">
                                <div className="rounded-xl border border-[#243724] bg-[#101a10] p-5 transition hover:border-[#618c61] md:text-right">
                                    <p className="text-sm leading-7 text-gray-400">{section.topics.join("  /  ")}</p>
                                </div>
                                <div className="z-10 flex items-center justify-center">
                                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#7aa88a] bg-[#172617] text-sm font-bold text-[#adc9ae]">0{index + 1}</span>
                                </div>
                                <div className="rounded-xl border border-[#243724] bg-[#0e140e] p-5">
                                    <span className="text-xs uppercase tracking-[0.25em] text-[#7aa88a]">Step 0{index + 1}</span>
                                    <h2 className="mt-2 text-xl font-bold text-[#adc9ae]">{section.title}</h2>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}