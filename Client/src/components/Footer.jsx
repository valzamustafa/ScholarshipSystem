
import { Link } from 'react-router-dom';

function Footer() {
 

  return (
    <footer style={{ backgroundColor: '#004D7C', color: 'white' }} className="pt-3 pb-2">
      <div className="container">

        <div className="row text-center pt-3 mb-4">
          <h5 className="fw-bold mb-3">Core Values Behind Our Scholarship Platform</h5>
         
        </div>

        <div className="bg-light text-dark rounded-4 p-3 text-center mb-3">
          <h6 className="fw-bold mb-1">Looking for opportunities?</h6>
          <p className="small mb-2">Join us and find the right scholarships.</p>
          <Link to="/register">
            <button className="btn btn-sm btn-primary px-3 py-1" style={{ backgroundColor: '#004D7C' }}>
              Get Started
            </button>
          </Link>
        </div>

        <div className="row text-start">
          <div className="col-md-3 mb-2">
            <h6 className="fw-bold small">Platform</h6>
            <ul className="list-unstyled small">
              <li><Link to="/scholarships" className="text-white text-decoration-none">Browse Scholarships</Link></li>
              <li><Link to="/#how-it-works" className="text-white text-decoration-none">How It Works</Link></li>
              <li><Link to="/guide" className="text-white text-decoration-none">Student Guide</Link></li>
            </ul>
          </div>
          <div className="col-md-3 mb-2">
            <h6 className="fw-bold small">Providers</h6>
            <ul className="list-unstyled small">
              
              <li><Link to="/login?role=provider" className="text-white text-decoration-none">Provider Login</Link></li>
            </ul>
          </div>
          <div className="col-md-3 mb-2">
            <h6 className="fw-bold small">About</h6>
            <ul className="list-unstyled small">
              <li><Link to="/about" className="text-white text-decoration-none">Our Mission</Link></li>
              <li><Link to="/about#team" className="text-white text-decoration-none">Team</Link></li>
              <li><Link to="/contactus" className="text-white text-decoration-none">Contact</Link></li>
            </ul>
          </div>
          <div className="col-md-3 mb-2">
            <h6 className="fw-bold small">Connect</h6>
            <div className="d-flex gap-2 fs-6">
              <a href="#" className="text-white"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-white"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-white"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" className="text-white"><i className="fab fa-telegram-plane"></i></a>
            </div>
          </div>
        </div>

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center border-top border-white pt-2 mt-3">
          <p className="small mb-2 mb-md-0">© {new Date().getFullYear()} ScholarHub. All rights reserved.</p>
          <div className="d-flex align-items-center gap-1">
            <i className="fas fa-shield-alt text-warning"></i>
            <span className="small">GDPR & Data Secure</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
