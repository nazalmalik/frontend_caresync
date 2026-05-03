// src/App.jsx
import React, { useContext } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import "./utils/axiosConfig";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import Loader from "./components/Loader";
import usePageLoader from "./hooks/usePageLoader";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DoctorsList from "./pages/DoctorsList";
import DoctorDetail from "./pages/DoctorDetail";
import PharmaciesList from "./pages/PharmaciesList";
import Nurse from "./pages/Nurse";
import Profile from "./pages/Profile";


// Dashboard Pages
import Dashboard from "./pages/Dashboard";
import FamilyDashboard from "./pages/FamilyDashboard";
import FamilyDetails from "./pages/FamilyDetails";
import Tasks from "./pages/Tasks";
import Calendar from "./pages/Calendar";
import HealthLogs from "./pages/HealthLogs";
import Reminders from "./pages/Reminders";
import Forum from "./pages/Forum";
import FamilyChat from "./pages/FamilyChat";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import AIInsights from "./pages/AIInsights";
import Emergency from "./pages/Emergency";
import Notes from "./pages/Notes";
import Analytic from "./pages/Analytic"

// Layout
import DashboardLayout from "./layouts/DashboardLayout";

export default function App() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Loader on specific pages
  const loaderPages = ["/", "/doctors", "/pharmacies", "/nurses", "/login", "/signup", "/dashboard","/profile"];
  
  // Show loader if pathname matches exactly or starts with dynamic route
  const showLoader =
    loaderPages.includes(location.pathname) ||
    location.pathname.startsWith("/doctors/"); // For doctor detail page

  const loading = usePageLoader(showLoader ? 800 : 0);

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <>
          <ScrollToTop />

          <Routes>
            {/* Public Layout */}
            <Route
              element={
                <>
                  <Navbar />
                  <main>
                    <Outlet />
                  </main>
                  <Footer />
                </>
              }
            >
              <Route path="/" element={<Home />} />
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/dashboard" />}
              />
              <Route
                path="/signup"
                element={!user ? <Signup /> : <Navigate to="/dashboard" />}
              />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              <Route
                path="/doctors"
                element={<ProtectedRoute><DoctorsList /></ProtectedRoute>}
              />
              <Route
                path="/doctors/:id"
                element={<ProtectedRoute><DoctorDetail /></ProtectedRoute>}
              />
              <Route
                path="/pharmacies"
                element={<ProtectedRoute><PharmaciesList /></ProtectedRoute>}
              />
              <Route
                path="/nurses"
                element={<ProtectedRoute><Nurse /></ProtectedRoute>}
              />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Route>

            {/* Dashboard Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/family-dashboard" element={<FamilyDashboard />} />
              <Route path="/family/:id" element={<FamilyDetails />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/health-logs" element={<HealthLogs />} />
              <Route path="/reminders" element={<Reminders />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/family-chat" element={<FamilyChat />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
              <Route path="/ai-insights" element={<AIInsights />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/analytic" element={<Analytic />} />
            </Route>

            {/* Fallback */}
            <Route
              path="*"
              element={<Navigate to={user ? "/dashboard" : "/login"} />}
            />
          </Routes>
        </>
      )}
    </>
  );
}