import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FarmerDashboard from "./pages/FarmerDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import AddCrop from "./pages/AddCrop";
import HistoryPage from "./pages/HistoryPage";
import AdminDashboard from "./pages/AdminDashboard";
import Weather from "./pages/Weather";
import MyOrders from "./pages/MyOrders";
import OrderTracking from "./pages/OrderTracking";

import CropRecommendation from "./pages/CropRecommendation";
import YieldPrediction from "./pages/YieldPrediction";
import DiseaseDetection from "./pages/DiseaseDetection";
import Fertilizer from "./pages/Fertilizer";
import FarmerConnect from "./pages/FarmerConnect";

import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword";

import Profile from "./pages/Profile";
import LearnMore from "./pages/LearnMore";
import FarmerOrders from "./pages/FarmerOrders";

import "leaflet/dist/leaflet.css";

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;

  return children;
};

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ FIX ADDED HERE */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/test" element={<h1>TEST WORKING</h1>} />

        {/* FEATURES */}
        <Route path="/weather" element={<Weather />} />
        <Route path="/crop-recommendation" element={<CropRecommendation />} />
        <Route path="/yield-prediction" element={<YieldPrediction />} />
        <Route path="/disease-detection" element={<DiseaseDetection />} />
        <Route path="/fertilizer" element={<Fertilizer />} />
        <Route path="/farmer-connect" element={<FarmerConnect />} />
        <Route path="/learn-more" element={<LearnMore />} />
<Route path="/farmer-orders" element={<FarmerOrders />} />

        {/* FARMER */}
        <Route
          path="/farmer-dashboard"
          element={
            <ProtectedRoute role="farmer">
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-crop"
          element={
            <ProtectedRoute role="farmer">
              <AddCrop />
            </ProtectedRoute>
          }
        />

        {/* BUYER */}
        <Route
          path="/buyer-dashboard"
          element={
            <ProtectedRoute role="buyer">
              <BuyerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute role="buyer">
              <MyOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/track/:orderId"
          element={
            <ProtectedRoute role="buyer">
              <OrderTracking />
            </ProtectedRoute>
          }
        />

        {/* COMMON */}
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />

        {/*profile*/}
        <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>

        {/* ADMIN */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;