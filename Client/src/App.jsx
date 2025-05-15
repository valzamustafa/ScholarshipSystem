import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Footer from './components/Footer';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
  <Routes>
    <Route
      path="/admin"
      element={<AdminDashboard />}
    />
    <Route
      path="*"
      element={
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
      
          </Routes>
          <Footer />
        </>
      }
    />
  </Routes>
</BrowserRouter>

  );
}

export default App;