import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      
      <Routes>
        <Route path="/" element={<Home />} />

      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
