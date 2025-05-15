
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <>
      <nav className="navbar fixed-top navbar-light bg-light py-4 px-5">

        <div className="container-fluid">
          
          
          <div className="d-none d-lg-flex align-items-center w-100">
            <Link className="navbar-brand" to="/">Scholarship System</Link>
            
            <div className="mx-auto"> 
              <ul className="navbar-nav d-flex flex-row gap-5"> 
                <li className="nav-item">
                  <Link className="nav-link" to="/home">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/scholarships">Scholarships</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/contactus">ContactUs</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/aboutus">AboutUs</Link>
                </li>
              </ul>
            </div>

            
            <div className="d-flex align-items-center">
              <form className="d-flex me-3">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <button className="btn btn-outline-primary" type="submit">
                  Search
                </button>
              </form>

              <div className="dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Profile
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="/profile">My Profile</Link></li>
                  <li><Link className="dropdown-item" to="/settings">Settings</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item" to="/logout">Logout</Link></li>
                </ul>
              </div>
            </div>
          </div>

         
          <button
            className="navbar-toggler d-lg-none"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>

     
    <div
  className="offcanvas offcanvas-start"
  tabIndex="-1"
  id="offcanvasNavbar"
  aria-labelledby="offcanvasNavbarLabel"
>
  <div className="offcanvas-header">
    <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div className="offcanvas-body">
    <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
      <li className="nav-item">
        <Link className="nav-link" to="/home">Home</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/scholarships">Scholarships</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/contactus">ContactUs</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/aboutus">AboutUs</Link>
      </li>
      <li><hr className="dropdown-divider" /></li>
      <li className="nav-item">
        <Link className="nav-link" to="/profile">My Profile</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/settings">Settings</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/logout">Logout</Link>
      </li>
    </ul>
  </div>
</div>

    </>
  );
}

export default Navbar;