import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from "./context/AuthProvider";

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import LoginForm from './pages/LoginForm';
import RegisterStudentForm from './pages/RegisterStudentForm';
import RegisterProviderForm from './pages/RegisterProviderForm';

import AdminDashboard from './pages/AdminDashboard';
import ProviderDashboard from './pages/ProviderDashboard';

import ProtectedRoute from './components/ProtectedRoute';

import Unauthorized from './pages/Unauthorized';
import PendingApproval from './pages/PendingApproval';
import MyProfile from './pages/MyProfile';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterStudentForm />} />
          <Route path="/register/provider" element={<RegisterProviderForm />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/pending-approval" element={<PendingApproval />} />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute roles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/provider/*"
            element={
              <ProtectedRoute roles={['Provider']}>
                <ProviderDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute roles={['Student']}>
                <MyProfile />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
