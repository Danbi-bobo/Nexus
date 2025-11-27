// App.tsx hoặc router config
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LarkLogin from "./components/larkLogin";
import { AuthCallback } from "./pages/AuthCallback";
import { Dashboard } from "./modules/dashboard/components/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LarkLogin />} />
        <Route path="/auth" element={<AuthCallback />} />
        <Route path="/dashboard" element={<Dashboard onNavigate={() => {}} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;