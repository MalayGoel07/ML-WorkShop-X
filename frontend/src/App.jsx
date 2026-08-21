import { useEffect, useState } from "react";
import HomePage from "./components/HomePage";
import CBXLanding from "./components/LandingPage";
import LogSignPage from "./components/LogSignPage";
import DataAnalyzer from "./components/DataAnalyzer";
import Roadmap from "./components/Roadmap";
import CreateData from "./components/CreateData";

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (nextPath) => {window.history.pushState({}, "", nextPath);setPath(nextPath);};

  if (path === "/logsign") {return <LogSignPage onNavigate={navigate} />;}
  if (path === "/home") {return <HomePage onNavigate={navigate} />;}
  if (path === "/analyze") {return <DataAnalyzer onNavigate={navigate} />;}
  if (path === "/roadmap") {return <Roadmap onNavigate={navigate} />;}
  if (path === "/createdata") {return <CreateData onNavigate={navigate} />;}

  return <CBXLanding onNavigate={navigate} />;
}
