import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const RegisterIcon = ({ value }) => {
  return value === "none" ? (
    <FontAwesomeIcon icon="fas fa-minus" />
  ) : value ? (
    <FontAwesomeIcon icon="fas fa-check" style={{ color: "green" }} />
  ) : (
    <FontAwesomeIcon icon="fas fa-times" style={{ color: "red" }} />
  );
};

export default RegisterIcon;
