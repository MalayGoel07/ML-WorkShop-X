import { useEffect, useState } from "react";
import ChatPage from "./components/ChatPage";
import CBXLanding from "./components/LandingPage";
import LogSignPage from "./components/LogSignPage";

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (nextPath) => {
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
  };

  if (path === "/logsign") {
    return <LogSignPage onNavigate={navigate} />;
  }

  if (path === "/chat") {
    return <ChatPage onNavigate={navigate} />;
  }

  return <CBXLanding onNavigate={navigate} />;
}
