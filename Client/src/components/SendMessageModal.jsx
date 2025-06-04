import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';

function SendMessageModal({ show, onHide, providerId, scholarshipId, onMessageSent, providerName }) {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!providerId || typeof providerId !== 'number') {
            console.warn("Invalid providerId passed to modal:", providerId);
        }
    }, [providerId]);

    const handleSubmit = async () => {
        if (!message.trim()) {
            setError('Message cannot be empty');
            return;
        }

        if (!providerId || typeof providerId !== 'number') {
            setError('Invalid recipient (provider) ID');
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
                    subject: `Question about scholarship`,
                    content: message,
                    recipientId: providerId,
                    scholarshipId: scholarshipId || null,
                    parentMessageId: null
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error: ${response.status}. ${errorText}`);
            }

            setSuccess(true);
            setTimeout(() => {
                onHide();
                setMessage('');
                setSuccess(false);
                if (onMessageSent) {
                    onMessageSent();
                }
            }, 1500);
        } catch (err) {
            console.error("Error sending message:", err);
            setError(err.message);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Contact {providerName || 'Provider'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">Message sent successfully!</Alert>}
                <Form.Group className="mb-3">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control
                        type="text"
                        value="Question about scholarship"
                        readOnly
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Your Message</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={isSending || success}
                        placeholder="Write your message here..."
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={!message.trim() || isSending}
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
