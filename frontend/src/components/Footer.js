import React from "react";
import { Row, Col, Container } from "react-bootstrap";

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col className="my-3 text-center">2023 &copy; Bridge School</Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
