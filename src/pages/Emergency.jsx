import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Container, Card, Button, Form, Alert, Row, Col } from "react-bootstrap";
import { Send, ShieldCheck, Pill, UserSearch, PhoneCall, Radio } from "lucide-react";
import "./Emergency.css";

const Emergency = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSendAlert = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Please write an emergency message.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      await axiosInstance.post("/api/emergency/send", { message });
      setSuccess("Alert successfully broadcasted.");
      setMessage("");
    } catch (err) {
      setError("Failed to dispatch alert.");
    } finally {
      setLoading(false);
    }
  };

  const protocolTips = [
    {
      icon: <Pill size={24} />,
      title: "Be Specific",
      text: "Mention exact medication names and dosages clearly."
    },
    {
      icon: <UserSearch size={24} />,
      title: "Identify",
      text: "State the patient's name if multiple people are at home."
    },
    {
      icon: <PhoneCall size={24} />,
      title: "Prioritize",
      text: "For critical life-safety, call emergency services first."
    },
    {
      icon: <Radio size={24} />,
      title: "Stay Online",
      text: "Keep the app open to receive family acknowledgments."
    }
  ];

  return (
    <div className="emergency-dashboard">
      <Container className="py-5">
        {/* ACTION SECTION */}
        <div className="d-flex flex-column align-items-center mb-5">
          <div className="main-alert-header text-center mb-4">
            <h1 className="fw-bold tracking-tight">Emergency Central</h1>
            <p className="text-muted">Direct line to your family safety network</p>
          </div>

          <Card className="central-action-card border-0">
            <Card.Body className="p-4 p-md-5">
              <div className="status-header mb-4">
                <div className="pulse-dot"></div>
                <span className="status-text">System Active & Ready</span>
              </div>

              {error && <Alert variant="danger" className="modern-alert">{error}</Alert>}
              {success && <Alert variant="success" className="modern-alert d-flex align-items-center">
                  <ShieldCheck className="me-2" size={18} /> {success}
                </Alert>}

              <Form onSubmit={handleSendAlert}>
                <Form.Group className="mb-4">
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Describe the situation here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="dispatch-textarea"
                  />
                </Form.Group>

                <Button type="submit" disabled={loading} className="btn-dispatch">
                  {loading ? "Transmitting..." : <><Send size={18} className="me-2" /> Send Alert</>}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>

        {/* TIPS SECTION - 4 CONTAINERS IN A ROW */}
        <div className="protocol-container">
          <Row className="g-3">
            {protocolTips.map((tip, index) => (
              <Col key={index} md={6} lg={3}>
                <div className="protocol-card">
                  <div className="protocol-icon mb-3">
                    {tip.icon}
                  </div>
                  <h6 className="fw-bold mb-2" style={{color:"white"}}>{tip.title}</h6>
                  <p className="small  mb-0" style={{color:"white"}} >{tip.text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default Emergency;