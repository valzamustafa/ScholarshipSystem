import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import axios from 'axios';

function ContactUsPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await axios.post('https://localhost:7255/api/contact', formData);
            setSuccess(true);
            setFormData({ name: '', email: '', message: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-primary-subtle   m-0 p-0 vw-100 overflow-x-hidden">
            <Container className="bg-white rounded-4 p-5 shadow-lg" style={{ maxWidth: '1000px' }}>
                <Row>
                    {/* Left Side - Form */}
                    <Col md={6} className="mb-4 mb-md-0">
                        <h2 className="fw-bold mb-3 text-primary">Let's talk</h2>
                        <p className="text-muted mb-4">
                            To request a quote or want to meet up for coffee, contact us directly or fill out the form and we will get back to you promptly.
                        </p>

                        {error && <Alert variant="danger">{error}</Alert>}
                        {success && <Alert variant="success">Your message has been sent!</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Your Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="email"
                                    placeholder="Your Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    placeholder="Type something if you want..."
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-100 py-2 rounded-pill"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                            </Button>
                        </Form>
                    </Col>

                    {/* Right Side - Contact Info */}
                    <Col md={6} className="d-flex flex-column justify-content-center bg-light rounded-3 p-4">
                        <div className="mb-3 d-flex align-items-start">
                            <FiMapPin className="me-3 mt-1 text-primary" size={20} />
                            <div>
                                <strong>Address</strong>
                                <p className="mb-0">151 New Park Ave, Hartford, CT 06106</p>
                            </div>
                        </div>
                        <div className="mb-3 d-flex align-items-start">
                            <FiPhone className="me-3 mt-1 text-primary" size={20} />
                            <div>
                                <strong>Phone</strong>
                                <p className="mb-0">+1 (203) 302-9545</p>
                            </div>
                        </div>
                        <div className="mb-4 d-flex align-items-start">
                            <FiMail className="me-3 mt-1 text-primary" size={20} />
                            <div>
                                <strong>Email</strong>
                                <p className="mb-0">contactus@inveritasoft.com</p>
                            </div>
                        </div>
                        <div className="d-flex gap-3">
                            <a href="#"><i className="fab fa-facebook-f text-primary fs-5"></i></a>
                            <a href="#"><i className="fab fa-twitter text-primary fs-5"></i></a>
                            <a href="#"><i className="fab fa-instagram text-primary fs-5"></i></a>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default ContactUsPage;
