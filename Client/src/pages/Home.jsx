import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import fotorrethnesh from '../assets/fotorrethnesh.jpg';
import FeedbackForm from "../components/FeedbackForm";
import { useAuth } from "../context/useAuth";
import { useNavigate } from 'react-router-dom';
import heroBg from '../assets/hero-bg.jpg';
import fotostatistics from '../assets/fotostatistics.jpg';
const HomePage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [scholarships, setScholarships] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const response = await fetch("https://localhost:7255/api/scholarship/available");
        if (response.ok) {
          const data = await response.json();
          setScholarships(data);
        }
      } catch (error) {
        console.error("Error fetching scholarships:", error);
      }
    };

    fetchScholarships();
  }, []);
useEffect(() => {

const fetchFeedbacks = async () => {
  try {
    const response = await fetch("https://localhost:7255/api/feedback/featured");
    if (response.ok) {
      const data = await response.json();
      setFeedbacks(data);
    }
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
  }
};

  fetchFeedbacks();
}, []);
  const handleSubmitFeedback = async (feedbackData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://localhost:7255/api/feedback", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({
          comment: feedbackData.comment,
          rating: feedbackData.rating,
          userId: user?.id || null,
          scholarshipId: feedbackData.scholarshipId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit feedback");
      }
      
      alert("Feedback submitted successfully!");
      setShowFeedbackForm(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert(error.message);
    }
  };

 
  const universityLogos = [
    { name: 'Harvard', country: 'USA' },
    { name: 'Oxford', country: 'UK' },
    { name: 'ETH Zurich', country: 'Switzerland' },
    { name: 'University of Tokyo', country: 'Japan' },
    { name: 'Sorbonne', country: 'France' },
    { name: 'University of Toronto', country: 'Canada' }
  ];



  
  const scholarshipTypes = [
    {
      title: 'Full Scholarships',
      desc: 'Covers the whole tuition ',
      icon: '🏆'
    },
    {
      title: 'Partial Scholarships',
      desc: 'Covers a part of the studies',
      icon: '🎓'
    },
    {
      title: 'Research Scholarships',
      desc: 'For masters and Phd Students',
      icon: '🔬'
    },
    {
      title: 'Training Scholarships',
      desc: 'Have the chance to be trained with scholarships for free',
      icon: '⚽'
    }
  ];

  return (
    <div className="m-0 p-0 vw-100 overflow-x-hidden">
     
     <section className="position-relative text-white text-center py-5 vh-100 d-flex align-items-center justify-content-center"
  style={{
    background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroBg}) center/cover no-repeat`
  }}>

  <div className="position-absolute top-0 start-0 w-100 h-100"
    style={{
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      zIndex: 0
    }}>
  </div>
        
        
        <div className="position-fixed bottom-0 end-0 p-3">
          <button 
            className="btn btn-primary rounded-pill shadow-lg"
            onClick={() => setShowFeedbackForm(true)}
            style={{
              backgroundColor: '#004D7C',
              padding: '12px 24px',
              fontSize: '1.1rem'
            }}
          >
            Give Feedback
          </button>
        </div>

       <FeedbackForm 
  show={showFeedbackForm}
  onClose={() => setShowFeedbackForm(false)}
  onSubmit={handleSubmitFeedback}
  scholarships={scholarships}
/>
        

        <div className="container position-relative" style={{ zIndex: 1 }}>
          <h1 className="display-3 fw-bold mb-4">Apply for Scholarships in the most famous Universities </h1>
          <p className="lead fs-4 mb-5">
           The easiest and most efficient platform to secure a brighter academic future
          </p>
          <div className="d-flex justify-content-center gap-3">
            <button
              className={`btn btn-light btn-lg px-4 py-3 fw-bold shadow-lg ${hoveredBtn === 'apply' ? 'animate__animated animate__pulse' : ''}`}
              onMouseEnter={() => setHoveredBtn('apply')}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{ transition: 'all 0.3s ease' }}
              onClick={() => navigate('/scholarships')}
            >
              Apply Now 
            </button>
            <button
              className={`btn btn-outline-light btn-lg px-4 py-3 fw-bold ${hoveredBtn === 'learn' ? 'animate__animated animate__pulse' : ''}`}
              onMouseEnter={() => setHoveredBtn('learn')}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{ transition: 'all 0.3s ease' }}
              onClick={() => navigate('/about')}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

   
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Our Partners </h2>
          <div className="row g-4 justify-content-center">
            {universityLogos.map((uni, idx) => (
              <div key={idx} className="col-6 col-md-4 col-lg-2">
                <div 
                  className={`p-3 bg-white rounded-3 shadow-sm text-center h-100 d-flex flex-column justify-content-center ${hoveredCard === idx ? 'animate__animated animate__pulse border border-primary' : ''}`}
                  onMouseEnter={() => setHoveredCard(idx)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{ 
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    minHeight: '120px'
                  }}
                >
                  <h5 className="fw-bold text-primary">{uni.name}</h5>
                  <small className="text-muted">{uni.country}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

   
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="fw-bold mb-4">Who are we?</h2>
              <p className="lead mb-4">
               We are the first  platform specifically designed to help students find and apply for scholarships easily, quickly and securely.
              </p>
              <ul className="list-unstyled">
                <li className="mb-3">
                  <div className="d-flex align-items-center">
                    <span className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                      <span className="text-primary">✓</span>
                    </span>
                    <span>Scholarships from prestigious world universities</span>
                  </div>
                </li>
                <li className="mb-3">
                  <div className="d-flex align-items-center">
                    <span className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                      <span className="text-primary">✓</span>
                    </span>
                    <span>Simple and expedited application process</span>
                  </div>
                </li>
                <li className="mb-3">
                  <div className="d-flex align-items-center">
                    <span className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                      <span className="text-primary">✓</span>
                    </span>
                    <span>Personalized advice from experts</span>
                  </div>
                </li>
              </ul>
              <button 
                className="btn btn-primary btn-lg mt-3 px-4"
                onClick={() => navigate('/about')}
              >
                Learn More 
              </button>
            </div>
            <div className="col-lg-6">
              <div 
                className="overflow-hidden rounded-4 shadow-lg"
                style={{
                  transform: hoveredCard === 'about-img' ? 'scale(1.03)' : 'scale(1)',
                  transition: 'transform 0.5s ease'
                }}
                onMouseEnter={() => setHoveredCard('about-img')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <img
                  src={fotorrethnesh}
                  className="img-fluid w-100"
                  alt="Rreth nesh"loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

    
      <section 
  className="py-5 text-white position-relative"
  style={{
    background: `linear-gradient(rgba(0, 75, 124, 0.8), rgba(0, 75, 124, 0.8)), url(${fotostatistics}) center/cover no-repeat`
  }}
>
 
  <div className="position-absolute top-0 start-0 w-100 h-100 bg-primary opacity-50" style={{ zIndex: 0 }}></div>
  
  <div className="container position-relative" style={{ zIndex: 1 }}>
    <h2 className="text-center mb-5 fw-bold">Our Statistics</h2>
    <div className="row g-4">
      {[
        { num: 20, text: 'Universities Partners', suffix: '+' },
        { num: 1500, text: 'Registered Students', suffix: '+' },
        { num: 500, text: 'Approved Scholarships', suffix: '+' },
        { num: 100, text: 'Realized Trainings', suffix: '+' },
      ].map((item, idx) => (
        <div key={idx} className="col-md-3 col-6">
          <div className="text-center p-4">
            <h3 className="display-4 fw-bold mb-3 counter" data-target={item.num}>
              {item.num}{item.suffix}
            </h3>
            <p className="fs-5">{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

     
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Types of Scholarships</h2>
          <div className="row g-4">
            {scholarshipTypes.map((type, idx) => (
              <div key={idx} className="col-md-3 col-6">
                <div 
                  className={`p-4 bg-light rounded-4 h-100 d-flex flex-column text-center ${hoveredCard === `scholarship-${idx}` ? 'shadow-lg border border-primary' : 'shadow-sm'}`}
                  onMouseEnter={() => setHoveredCard(`scholarship-${idx}`)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{ 
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                >
                  <div className="display-3 mb-3">{type.icon}</div>
                  <h4 className="fw-bold mb-3">{type.title}</h4>
                  <p className="mb-0">{type.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">How it works?</h2>
          <div className="row g-4">
            {[
              { step: '1', title: 'Register', desc: 'Create your account in a few seconds', icon: '📝' },
              { step: '2', title: 'Find the Scholarship that you want ', desc: 'Use filters to find the perfect scholarship', icon: '🔍' },
              { step: '3', title: 'Apply', desc: 'Fill out the online form with our instructions.', icon: '🚀' },
              { step: '4', title: 'Wait for Approval', desc: 'Follow the application and receive the answer directly', icon: '🎉' },
            ].map((item, idx) => (
              <div key={idx} className="col-md-3 col-6">
                <div className="p-4 bg-white rounded-4 h-100 text-center position-relative">
                  <div 
                    className="position-absolute top-0 start-50 translate-middle bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '50px', height: '50px', marginTop: '-25px' }}
                  >
                    <span className="fs-4 fw-bold">{item.step}</span>
                  </div>
                  <div className="display-4 mb-3">{item.icon}</div>
                  <h4 className="fw-bold mb-3">{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


<section className="py-5">
  <div className="container">
    <h2 className="text-center mb-5 fw-bold">What our Students Says?</h2>
    <div className="row g-4">
      {feedbacks.length > 0 ? (
        feedbacks.slice(0, 3).map((feedback) => (
          <div key={feedback.id} className="col-md-4">
            <div 
  className={`p-4 bg-white rounded-4 shadow-sm h-100 ${feedback.isFeatured ? 'border border-warning border-2' : ''}`}
  style={{ transition: 'all 0.3s ease' }}
>
  {feedback.isFeatured && (
    <div className="text-warning mb-2">★ Featured Review</div>
  )}
              <div className="d-flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`${i < feedback.rating ? 'text-warning' : 'text-muted'}`}>★</span>
                ))}
              </div>
              <blockquote className="mb-4 fst-italic">"{feedback.comment}"</blockquote>
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                  <span className="text-primary">{feedback.userFullName.charAt(0)}</span>
                </div>
                <div>
                  <h6 className="fw-bold mb-0">{feedback.userFullName}</h6>
                  <small className="text-muted">{feedback.scholarshipTitle}</small>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-12 text-center">
          <p>No feedback yet. Be the first to leave your comment!</p>
        </div>
      )}
    </div>
    <div className="text-center mt-4">
      <button 
        className="btn btn-primary"
        onClick={() => setShowFeedbackForm(true)}
      >
       Give Feedback
      </button>
    </div>
  </div>
</section>
      
      <section className="py-5 bg-primary text-white">
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">Ready to Apply for your Scholarship?</h2>
          <p className="lead mb-5">Register now and start your academic journey with us</p>
          <div className="d-flex justify-content-center gap-3">
            <button
              className="btn btn-light btn-lg px-4 py-3 fw-bold shadow-lg"
              style={{ transition: 'all 0.3s ease' }}
              onClick={() => navigate('/register')}
            >
             Register for free
            </button>
            <button
              className="btn btn-outline-light btn-lg px-4 py-3 fw-bold"
              style={{ transition: 'all 0.3s ease' }}
              onClick={() => navigate('/contact')}
            >
              Talk with Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;