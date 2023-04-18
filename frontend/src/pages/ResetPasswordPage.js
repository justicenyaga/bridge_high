import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, InputGroup, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import Joi from "joi";
import { toast } from "react-toastify";

import FormContainer from "../components/FormContainer";

import { resetPassword, clearError } from "../store/user";

const ChangePasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [current_password, setCurrentPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [message, setMessage] = useState("");

  const reduxState = useSelector((state) => state);
  const { userInfo, reset_success, error } = reduxState.user;

  const toggleShowCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  useEffect(() => {
    if (!userInfo._id) navigate("/login");
    dispatch(clearError());
  }, [userInfo, navigate, dispatch, error, reset_success, message]);

  const schema = Joi.object({
    current_password: Joi.string().required().label("Current Password"),

    new_password: Joi.string()
      .min(8)
      .max(30)
      .regex(/^(?=.*[a-z])/)
      .message("New Password must contain at least one lowercase letter")
      .regex(/^(?=.*[A-Z])/)
      .message("New Password must contain at least one uppercase letter")
      .regex(/^(?=.*\d)/)
      .message("New Password must contain at least one number")
      .regex(/^(?=.*[@$!%*?&])/)
      .message("New Password must contain at least one special character")
      .required()
      .label("New Password")
      .messages({
        "string.base": "Password should be a string",
        "string.min": "New Password must be at least 8 characters long",
        "string.max": "New Password cannot be more than 30 characters",
        "any.required": "New Password is required",
      }),

    confirm_password: Joi.string()
      .valid(Joi.ref("new_password"))
      .required()
      .label("Confirm Password")
      .messages({
        "any.only": "Confirm Password must match New Password",
        "any.required": "Confirm Password is required",
      }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      current_password,
      new_password,
      confirm_password,
    };

    const { error } = schema.validate(data, {
      abortEarly: false,
      errors: { label: "key", wrap: { label: false } },
    });

    if (error) {
      toast.error(error.details[0].message);
    } else {
      dispatch(resetPassword(current_password, new_password));
      setMessage("");
    }
  };

  return (
    <FormContainer>
      <h1>Reset Password</h1>

      {error && toast.error(error)}
      {reset_success && toast.success("Password reset successfully")}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="current">
          <Form.Label>Current Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={showCurrentPassword ? "text" : "password"}
              value={current_password}
              placeholder="Enter current password"
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Form.Text
              onClick={toggleShowCurrentPassword}
              className="text-muted"
              style={{
                cursor: "pointer",
                position: "absolute",
                right: "10px",
                top: "40%",
                transform: "translateY(-50%)",
              }}
            >
              {showCurrentPassword ? (
                <FontAwesomeIcon icon="fas fa-eye-slash" />
              ) : (
                <FontAwesomeIcon icon="fas fa-eye" />
              )}
            </Form.Text>
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="new">
          <Form.Label>New Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={showNewPassword ? "text" : "password"}
              value={new_password}
              placeholder="Enter new password"
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <Form.Text
              onClick={toggleShowNewPassword}
              className="text-muted"
              style={{
                cursor: "pointer",
                position: "absolute",
                right: "10px",
                top: "40%",
                transform: "translateY(-50%)",
              }}
            >
              {showNewPassword ? (
                <FontAwesomeIcon icon="fas fa-eye-slash" />
              ) : (
                <FontAwesomeIcon icon="fas fa-eye" />
              )}
            </Form.Text>
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="confirm">
          <Form.Label>Confirm Password</Form.Label>

          <Form.Control
            type={showNewPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={confirm_password}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        {/* add some white spaces before the submit button */}
        <br />
        <br />

        <Button type="submit" variant="primary">
          <FontAwesomeIcon icon="fas fa-save" /> Reset Password
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ChangePasswordPage;
