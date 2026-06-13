import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Layouts
import PublicLayout from "./components/layout/PublicLayout";
import AppLayout from "./components/layout/AppLayout";

// Public pages
import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import ResetPassword from "./pages/ResetPassword/ResetPassword";

// Authenticated pages
import Dashboard from "./pages/Dashboard/Dashboard";
import AssessmentCatalog from "./pages/AssessmentIntro/AssessmentIntro";
import Quiz from "./pages/Quiz/Quiz";
import Report from "./pages/Report/Report";
import Sessions from "./pages/Sessions/Sessions";
import ActionPlan from "./pages/ActionPlan/ActionPlan";
import Benchmarks from "./pages/Benchmarks/Benchmarks";

// Admin pages
import AdminAnalytics from "./pages/admin/AdminAnalytics/AdminAnalytics";
import AdminSessions from "./pages/admin/AdminSessions/AdminSessions";
import AdminUsers from "./pages/admin/AdminUsers/AdminUsers";
import AdminUserDetail from "./pages/admin/AdminUserDetail/AdminUserDetail";
import AdminImport from "./pages/admin/AdminImport/AdminImport";

// 404
import NotFound from "./pages/NotFound/NotFound";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes — landing & login render full-bleed with their own chrome */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<PublicLayout />}>
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Authenticated routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assessments" element={<AssessmentCatalog />} />
          {/* Legacy per-assessment links resolve to the catalog */}
          <Route path="/assessments/:slug" element={<AssessmentCatalog />} />
          <Route path="/sessions/:sessionId/quiz" element={<Quiz />} />
          <Route path="/sessions/:sessionId/report" element={<Report />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/action-plan" element={<ActionPlan />} />
          <Route path="/benchmarks" element={<Benchmarks />} />
        </Route>

        {/* Admin routes */}
        <Route
          element={
            <ProtectedRoute adminOnly>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminAnalytics />} />
          <Route path="/admin/sessions" element={<AdminSessions />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/users/:userId" element={<AdminUserDetail />} />
          <Route path="/admin/import" element={<AdminImport />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
