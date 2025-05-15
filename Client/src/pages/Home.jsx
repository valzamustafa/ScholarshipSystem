import React from "react";


function Home() {
  return (
    <div className="m-0 p-0 vw-100 overflow-x-hidden">

     
      <section className="text-center py-5 bg-primary text-white m-0">
        <div className="container p-0">
          <div className="py-5 px-3">
            <h1 className="display-4">Welcome to the Scholarship Platform</h1>
            <p className="lead">Find scholarships from around the world in one place.</p>
            <button className="btn btn-light mt-3">Get Started</button>
          </div>
        </div>
      </section>

     
      <section className="container my-5 ">
        <div className="px-3">
          <h2 className="mb-4 text-center">Featured Scholarships</h2>
          <div className="row gx-3 gy-4 mx-0">
            <div className="col-md-4">
              <div className="card h-100 ">
                <div className="card-body">
                  <h5 className="card-title">Global Scholars Fund</h5>
                  <p className="card-text">Full tuition for top students worldwide.</p>
                  <a href="#" className="btn btn-primary">Learn More</a>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow">
                <div className="card-body">
                  <h5 className="card-title">Tech Girls Program</h5>
                  <p className="card-text">Summer program for girls in STEM fields.</p>
                  <a href="#" className="btn btn-primary">Learn More</a>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow">
                <div className="card-body">
                  <h5 className="card-title">Local Excellence Award</h5>
                  <p className="card-text">Support for students in Kosovo with high GPA.</p>
                  <a href="#" className="btn btn-primary">Learn More</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container my-5">
        <div className="px-3">
          <h2 className="text-center mb-3">Why Choose Our Platform?</h2>
          <p className="text-center">
            We centralize all scholarships in one place, accessible to students worldwide — high schoolers, university students, or trainees.
          </p>
        </div>
      </section>

      
      <section className="bg-light py-5 m-0">
        <div className="container mt-4">
          <div className="px-3">
            <h3 className="text-center mb-4">What our users say</h3>
            <blockquote className="blockquote text-center">
              <p>"This platform helped me find a scholarship in Germany!"</p>
              <footer className="blockquote-footer">Arta, Student</footer>
            </blockquote>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;