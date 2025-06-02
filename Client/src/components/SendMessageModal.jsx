
import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';

function SendMessageModal({ show, onHide, providerId, scholarshipId }) {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const token = localStorage.getItem("token");

    const handleSubmit = async () => {
        if (!message.trim()) {
            setError('Message cannot be empty');
            return;
        }

        setIsSending(true);
        setError(null);
        try {
            const response = await fetch('https://localhost:7255/api/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    content: message,
                    recipientId: providerId,
                    scholarshipId: scholarshipId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            setSuccess(true);
            setTimeout(() => {
                onHide();
                setMessage('');
                setSuccess(false);
            }, 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Contact Provider</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">Message sent successfully!</Alert>}
                <Form.Group>
                    <Form.Label>Your Message</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={isSending || success}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide} disabled={isSending}>
                    Cancel
                </Button>
                <Button 
                    variant="primary" 
                    onClick={handleSubmit} 
                    disabled={isSending || success || !message.trim()}
                >
                    {isSending ? (
                        <>
                            <Spinner animation="border" size="sm" /> Sending...
                        </>
                    ) : 'Send Message'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default SendMessageModal;