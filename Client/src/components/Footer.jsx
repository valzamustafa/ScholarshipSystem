import React from 'react';


function Footer() {
  return (
    <footer className="bg-dark text-white text-center text-lg-start overflow-hidden">
      <div className="container-fluid p-4">
        <div className="row">

          <div className="col-lg-6 col-md-12 mb-4 mb-md-0">
            <h5 className="text-uppercase">Scholarship System</h5>
            <p>
              A platform where students can discover and apply for scholarships worldwide.
            </p>
          </div>

          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">Links</h5>
            <ul className="list-unstyled mb-0">
              <li><a href="/home" className="text-white">Home</a></li>
              <li><a href="/scholarships" className="text-white">Scholarships</a></li>
              <li><a href="/contactus" className="text-white">Contact</a></li>
              <li><a href="/aboutus" className="text-white">About</a></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">Contact</h5>
            <ul className="list-unstyled">
              <li>Email: support@scholarships.com</li>
              <li>Phone: +383 44 000 000</li>
            </ul>
          </div>

        </div>
      </div>

      <div className="text-center p-3 bg-dark text-white">
        © {new Date().getFullYear()} Scholarship System. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
