import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";

import { loadUserData } from "../store/userData";
import { loadSubjects } from "../store/subjects";
import { getSelectedT4 } from "../store/selectedT4";

function EditStudentT4Selection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: userId } = useParams();

  const reduxState = useSelector((state) => state);
  const { userInfo } = reduxState.user;
  const { userData: userDetails, loading, error } = reduxState.userData;
  const { userDetails: userInfomation } = reduxState.userDetails;
  const { selectedT4 } = reduxState.selectedT4;
  const { list: subjects } = reduxState.subjects;

  const [name, setName] = useState("");
  const [t4, setT4] = useState("");

  const t4Subjects =
    subjects.length &&
    subjects.filter(
      (subject) =>
        subject.dept === "Technicals" && subject.name !== "Business Studies"
    );

  useEffect(() => {
    if (!userInfo.is_admin && !userInfomation.isClassTeacher) {
      navigate("/login");
    } else {
      // if (successCreate) dispatch(removeCreatedUser());

      if (userDetails.user !== Number(userId)) {
        dispatch(loadUserData(userId));
      } else {
        setName(userDetails.name);
        setT4(selectedT4.t4.name);
      }

      userDetails._id && dispatch(getSelectedT4(userDetails._id));
      dispatch(loadSubjects());
    }
  }, [
    userDetails,
    dispatch,
    userId,
    userInfo,
    navigate,
    selectedT4,
    userDetails._id,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // dispatch(updateUser(role, user));

    // toast.success("User updated successfully");

    // setTimeout(() => {
    //   window.location.reload();

    navigate(-1);
    // }, 200);
  };

  return (
    <div>
      <Row>
        <Col>
          <Button variant="light" onClick={() => navigate(-1)} className="my-3">
            <FontAwesomeIcon icon="fas fa-arrow-left" />
          </Button>
        </Col>

        <Col className="text-center">
          <h1>Edit Student T4 Selection</h1>
        </Col>

        <Col className="text-end">
          Name: {userDetails.name}
          <br />
          Reg No: {userDetails.code}
        </Col>
      </Row>

      <div className="my-5">
        <FormContainer>
          {/* {loading ? (
          <Loader />
        ) : error ? (
          toast.error(error)
        ) : ( */}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Student Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                placeholder="Enter name"
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="t4">
              <Form.Label>Selected T4</Form.Label>
              <Form.Control
                as="select"
                value={t4}
                onChange={(e) => setT4(e.target.value)}
              >
                <option value="">...Select T4</option>
                {t4Subjects.map((subject) => (
                  <option key={subject._id} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <div className="my-3">
              <Button
                type="submit"
                className="btn-sm"
                style={{
                  backgroundColor: "#6c757d",
                  borderColor: "#6c757d",
                  borderRadius: "5px",
                  color: "white",
                }}
              >
                <FontAwesomeIcon icon="fas fa-save" /> Update
              </Button>
            </div>
          </Form>
        </FormContainer>
      </div>
    </div>
  );
}

export default EditStudentT4Selection;
