import { useEffect, useState } from "react";

const words = [
  "Linear Regression",
  "Logistic Regression",
  "Random Forest",
  "Decision Tree",
  "KNN",
  "Gradient Descent",
  "EDA",
  "Feature Scaling",
  "Normalization",
  "Missing Values",
  "Correlation",
  "Prediction",
  "Classification",
  "Regression",
  "Training",
  "Validation",
  "Accuracy",
  "Precision",
  "Recall",
  "F1 Score",
  "Dataset",
  "Features",
  "Target",
];

export default function FloatingWords() {
  const [floatingWords, setFloatingWords] = useState([]);

  useEffect(() => {
  const interval = setInterval(() => {
    const amount = 5;
    const newWords = Array.from({ length: amount }, () => ({id: `${Date.now()}-${Math.random()}`,text: words[Math.floor(Math.random() * words.length)],left: Math.random() * 90 + 5,duration: Math.random() * 2 + 4,}));
    setFloatingWords((current) => [...current,...newWords,]);
    newWords.forEach((word) => {setTimeout(() => {setFloatingWords((current) =>current.filter((item) => item.id !== word.id));}, word.duration * 1000);});
  }, 600);
  return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {floatingWords.map((word) => (<span key={word.id} className="absolute bottom-[-20px] whitespace-nowrap font-mono text-sm text-[#adc9ae] animate-float" style={{ left: `${word.left}%`, animationDuration: `${word.duration}s`, }} > {word.text} </span>))}
    </div>
  );
}