import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="container text-center py-5">
      <h1 className="text-danger">401 - Unauthorized</h1>
      <p>You don't have permission to access this page.</p>
      <Link to="/" className="btn btn-primary">
        Return to Home
      </Link>
    </div>
  );
};

export default Unauthorized;