import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from "./context/AuthProvider";


import Navbar from './components/Navbar';
import Home from './pages/Home';
import Footer from './components/Footer';
import AdminDashboard from './pages/AdminDashboard';
import LoginForm from './pages/LoginForm';
import RegisterStudentForm from './pages/RegisterStudentForm';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './pages/Unauthorized';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rrugët publike */}
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/register" element={<RegisterStudentForm/>} />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                <Footer />
              </>
            }
          />
          
          {/* Rrugët e mbrojtura */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute roles={['Admin']}>
                <Navbar />
                <Routes>
                  <Route index element={<AdminDashboard />} />
                  {/* Shto rrugë të tjera admin këtu */}
                </Routes>
                <Footer />
              </ProtectedRoute>
            }
          />
          
          {/* Mund të shtoni rrugë të tjera të mbrojtura këtu për Student dhe Provider */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;