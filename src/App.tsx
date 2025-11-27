import { BrowserRouter, Routes, Route } from "react-router-dom";
import LarkLogin from "./components/larkLogin";
import { AuthCallback } from "./pages/AuthCallback";
import { Dashboard } from "./modules/dashboard/components/Dashboard";
import { Categories } from "./modules/categories/components/Categories";
import { MainLayout } from "./components/layout/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LarkLogin />} />
        <Route path="/auth" element={<AuthCallback />} />
        
        {/* Protected Routes */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard onNavigate={() => {}} />} />
          <Route path="/explorer" element={<div className="p-8"><h1 className="text-2xl font-bold">Explorer</h1><p>Coming soon...</p></div>} />
          <Route path="/categories" element={<Categories />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;