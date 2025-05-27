import React from "react";

function Home() {
  return (
    <div className="m-0 p-0 vw-100 overflow-x-hidden">
     
      <section
        className="text-center py-5"
        style={{ backgroundColor: '#004D7C', color: 'white' }}
      >
        <div className="container px-3 mt-5">
          <h1 className="display-4 fw-bold">Discover Global Scholarships</h1>
          <p className="lead">Empowering students to study anywhere in the world.</p>
          <button className="btn btn-light mt-3 px-4 py-2 fw-semibold rounded-pill">
            Get Started
          </button>
        </div>
      </section>

    
      <section className="container my-5">
        <h2 className="mb-4 text-center fw-bold" style={{ color: '#004D7C' }}>
          Featured Scholarships
        </h2>
        <div className="row gx-3 gy-4">
          {[{
            title: "Global Scholars Fund",
            description: "Covers full tuition for exceptional students globally."
          }, {
            title: "Tech Girls Program",
            description: "Empowers young women in STEM with summer internships."
          }, {
            title: "Local Excellence Award",
            description: "Supports high-achieving students in Kosovo."
          }].map((scholarship, idx) => (
            <div key={idx} className="col-md-4">
              <div className="card h-100 shadow border-0 rounded-4">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title" style={{ color: '#004D7C', fontWeight: '600' }}>
                    {scholarship.title}
                  </h5>
                  <p className="card-text flex-grow-1">{scholarship.description}</p>
                  <a
                    href="#"
                    className="btn mt-auto rounded-pill"
                    style={{
                      backgroundColor: '#004D7C',
                      color: 'white',
                      fontWeight: '600',
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

      <section className="bg-light py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-4" style={{ color: '#004D7C' }}>
            How It Works
          </h2>
          <div className="row justify-content-center gx-4 gy-4">
            {[
              { icon: "📄", title: "Create Profile", desc: "Build your student profile easily." },
              { icon: "🔍", title: "Search Scholarships", desc: "Filter based on your needs." },
              { icon: "📝", title: "Apply Online", desc: "Submit your application instantly." }
            ].map((step, idx) => (
              <div key={idx} className="col-md-4">
                <div className="p-4 bg-white shadow-sm rounded-4 h-100">
                  <div className="display-5">{step.icon}</div>
                  <h5 className="mt-3" style={{ color: '#004D7C' }}>{step.title}</h5>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

   
      <section className="container my-5 px-3">
        <h2 className="text-center mb-4 fw-bold" style={{ color: '#004D7C' }}>
          What our users say
        </h2>
        <div className="row justify-content-center gx-4 gy-4">
          {[
            { name: "Arta, Kosovo", quote: "This platform helped me find a scholarship in Germany!" },
            { name: "Jona, Albania", quote: "Everything was simple, fast, and professional." }
          ].map((testimonial, idx) => (
            <div key={idx} className="col-md-5">
              <div className="bg-white p-4 rounded-4 shadow-sm h-100">
                <blockquote className="blockquote fst-italic mb-2">
                  <p>“{testimonial.quote}”</p>
                </blockquote>
                <footer className="blockquote-footer">{testimonial.name}</footer>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="py-5 text-center"
        style={{ backgroundColor: '#004D7C', color: 'white' }}
      >
        <div className="container">
          <h3 className="fw-bold">Ready to start your journey?</h3>
          <p className="lead">Join thousands of students who’ve already found scholarships.</p>
          <button className="btn btn-light px-5 py-2 mt-2 rounded-pill fw-semibold">
            Join Now
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
