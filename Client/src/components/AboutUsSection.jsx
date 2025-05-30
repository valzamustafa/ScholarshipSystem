import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AboutUsSection = () => {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    axios.get('https://localhost:7255/api/aboutus')
      .then(res => setSections(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <section
      className="py-5"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8f9fa, #dee2e6)',
      }}
    >
      <div className="container-fluid px-5">

        <div className="text-center mb-5">
          <h1 className="fw-bold display-2 text-primary mb-3">
            Who We Are
          </h1>
          <p className="fs-4 text-secondary w-75 mx-auto">
            We are committed to shaping a better future through innovation, integrity, and collaboration. Our mission is to create lasting impact by empowering communities and individuals.
          </p>
        </div>

        <h2 className="text-center fw-bold display-4 mb-5 text-dark border-bottom border-3 pb-3">
          What We Do
        </h2>

        <div className="row g-5">
          {sections.map((sec, index) => (
            <div key={sec.id} className="col-lg-6">
              <div
                className={`card border-0 h-100 shadow-lg rounded-4 overflow-hidden ${
                  index % 2 === 0 ? 'bg-white' : 'bg-light'
                }`}
                style={{
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {sec.imageUrl && (
                  <img
                    src={sec.imageUrl}
                    alt="About"
                    className="card-img-top"
                    style={{
                      height: '280px',
                      objectFit: 'cover',
                    }}
                  />
                )}
                <div className="card-body p-4">
                  <h5 className="card-title fw-bold fs-3 text-primary mb-3">
                    {sec.title}
                  </h5>
                  <p className="card-text fs-6 text-secondary">
                    {sec.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-5">
          <p className="fst-italic fs-5 text-muted">
            More sent content is added dynamically by the admin. Stay tuned for updates!
          </p>
        </div>

      </div>
    </section>
  );
};

export default AboutUsSection;
