import { HashRouter, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import FeaturesPage from "@/pages/FeaturesPage";
import PricingPage from "@/pages/PricingPage";
import About from "@/pages/About";
import Dashboard from "@/pages/Dashboard";
import UploadPage from "@/pages/Upload";
import Study from "@/pages/Study";
import Exam from "@/pages/Exam";
import Analytics from "@/pages/Analytics";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/uploads" element={<UploadPage />} />
        <Route path="/study" element={<Study />} />
        <Route path="/exam" element={<Exam />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </HashRouter>
  );
}
