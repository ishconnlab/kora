import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Vehicles from '../pages/Vehicles';
import Customers from '../pages/Customers';
import Promotions from '../pages/Promotions';
import Assignment from '../pages/Assignment';
import Reports from '../pages/Reports';
import Users from '../pages/Users';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/promotions/:promotionId/assign" element={<Assignment />} />
        <Route path="/users" element={<AdminRoute><Users /></AdminRoute>} />
        <Route path="/reports" element={<Reports />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
