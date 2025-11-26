// App.tsx hoặc router config
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LarkLogin from "./components/larkLogin";
// import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LarkLogin />} />
        <Route path="/auth/callback" element={<LarkLogin />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </BrowserRouter>
  );
}