import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import Joi from "joi";
import {
  Form,
  Button,
  Row,
  Col,
  Image,
  Card,
  InputGroup,
} from "react-bootstrap";

import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import Loader from "../components/Loader";

import { login, clearError } from "../store/user";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const params = [...searchParams];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const schema = Joi.object({
    // email should contain ".bridgehigh.com"

    email: Joi.string()
      .email({ tlds: { allow: false } })
      .regex(/.bridgehigh.com$/)
      .message("Please enter a valid school email")
      .required()
      .label("School email"),
    password: Joi.string().required().label("Password"),
  });

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const userSlice = useSelector((state) => state.user);
  const { userInfo, loading, error } = userSlice;

  const redirect = params.length > 0 ? params[0][1] : "";

  useEffect(() => {
    if (userInfo._id) navigate(`/${redirect}`);
    dispatch(clearError());
  }, [dispatch, navigate, userInfo, redirect, error]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const { error } = schema.validate(
      { email, password },
      {
        abortEarly: false,
        errors: { label: "key", wrap: { label: false } },
      }
    );
    if (error) return toast.error(error.details[0].message) && null;

    dispatch(login(email, password));
  };

  return (
    <FormContainer>
      <div className="background-image"></div>
      <Card style={{ marginTop: "12vh", minHeight: "65vh" }}>
        <Card.Body>
          <Row
            className="justify-content-md-center"
            style={{ marginTop: "4vh" }}
          >
            <Col xs={12} md={6}>
              <Image
                src="https://bridgehigh.ams3.cdn.digitaloceanspaces.com/bridgehigh/images/logo.png"
                alt="logo"
                fluid
              />
            </Col>
          </Row>

          {error && toast.error(error) && null}
          {loading && <Loader />}

          <Form onSubmit={handleSubmit} style={{ marginTop: "4vh" }}>
            <Form.Group controlId="email">
              <Form.Label>School Email</Form.Label>
              <Form.Control
                type="text"
                value={email}
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Form.Text
                  onClick={toggleShowPassword}
                  className="text-muted"
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    right: "10px",
                    top: "40%",
                    transform: "translateY(-50%)",
                  }}
                >
                  {showPassword ? (
                    <FontAwesomeIcon icon="fas fa-eye-slash" />
                  ) : (
                    <FontAwesomeIcon icon="fas fa-eye" />
                  )}
                </Form.Text>
              </InputGroup>
            </Form.Group>

            <Row
              className="justify-content-md-end"
              style={{ marginTop: "1vh" }}
            >
              <Col xs={12} md={6} className="text-end">
                <Link to="/forgot-password">Forgot Password?</Link>
              </Col>
            </Row>

            <Row
              className="justify-content-md-center"
              style={{ marginTop: "6vh" }}
            >
              <Col xs={12} md={6} className="text-center">
                <Button type="submit" disabled={error} variant="primary">
                  SIGN IN
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </FormContainer>
  );
};

export default LoginPage;
