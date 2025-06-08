import { Link } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';

const Unauthorized = () => {
  return (
    <div
      className="d-flex flex-column m-0 p-0 overflow-x-hidden"
      style={{ height: '100vh', width: '100vw', margin: 0, padding: 0 }}
    >
      <main
        className="d-flex align-items-center justify-content-center"
        style={{ height: '100%', width: '100%' }}
      >
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <FaLock className="text-danger mb-3" size={48} />
              <h1 className="display-4 mb-3">Unauthorized</h1>
              <p className="lead mb-4">You don't have permission to access this page.</p>
              <p className="mb-5">Please log in or check your credentials.</p>

              <div className="d-flex justify-content-center gap-3 mb-5">
                <Link to="/" className="btn btn-primary px-4 py-2">
                  Return to Home
                </Link>
                <Link to="/login" className="btn btn-outline-primary px-4 py-2">
                  Go to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Unauthorized;
