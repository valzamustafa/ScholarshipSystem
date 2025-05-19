import React from "react";

function Home() {
  return (
    <div className="m-0 p-0 vw-100 overflow-x-hidden ">
    
      <section
        className="text-center py-5"
        style={{ backgroundColor: '#004D7C', color: 'white' }}
      >
        <div className="container px-3 mt-5">
          <h1 className="display-4 fw-bold">Welcome to the Scholarship Platform</h1>
          <p className="lead">Find scholarships from around the world in one place.</p>
          <button className="btn btn-light mt-3 px-4 fw-semibold">Get Started</button>
        </div>
      </section>

      <section className="container my-5">
        <h2 className="mb-4 text-center" style={{ color: '#004D7C', fontWeight: '700' }}>
          Featured Scholarships
        </h2>
        <div className="row gx-3 gy-4">
          {[{
            title: "Global Scholars Fund",
            description: "Full tuition for top students worldwide."
          }, {
            title: "Tech Girls Program",
            description: "Summer program for girls in STEM fields."
          }, {
            title: "Local Excellence Award",
            description: "Support for students in Kosovo with high GPA."
          }].map((scholarship, idx) => (
            <div key={idx} className="col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title" style={{ color: '#004D7C', fontWeight: '600' }}>
                    {scholarship.title}
                  </h5>
                  <p className="card-text flex-grow-1">{scholarship.description}</p>
                  <a
                    href="#"
                    className="btn mt-auto"
                    style={{
                      backgroundColor: '#004D7C',
                      color: 'white',
                      fontWeight: '600',
                      borderRadius: '25px',
                    }}
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

  
      <section className="container my-5 px-3">
        <h2 className="text-center mb-3" style={{ color: '#004D7C', fontWeight: '700' }}>
          Why Choose Our Platform?
        </h2>
        <p className="text-center fs-5">
          We centralize all scholarships in one place, accessible to students worldwide — high schoolers, university students, or trainees.
        </p>
      </section>

     
      <section className="bg-light py-5 m-0">
        <div className="container px-3">
          <h3 className="text-center mb-4" style={{ color: '#004D7C', fontWeight: '700' }}>
            What our users say
          </h3>
          <blockquote className="blockquote text-center fst-italic" style={{ maxWidth: '600px', margin: 'auto' }}>
            <p>"This platform helped me find a scholarship in Germany!"</p>
            <footer className="blockquote-footer">Arta, Student</footer>
          </blockquote>
        </div>
      </section>
    </div>
  );
}

export default Home;
