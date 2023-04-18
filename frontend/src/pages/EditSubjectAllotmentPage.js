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
import { getSelectedSubjects } from "../store/selectedSubjects";

function EditSubjectAllotmentPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: userId } = useParams();

  const reduxState = useSelector((state) => state);
  const { userInfo } = reduxState.user;
  const { userData: userDetails, loading, error } = reduxState.userData;
  const { list: subjects } = reduxState.subjects;

  const [name, setName] = useState("");
  const [subject1, setSubject1] = useState("");
  const [subject2, setSubject2] = useState("");
  const [subject3, setSubject3] = useState("");

  useEffect(() => {
    if (!userInfo.is_admin) {
      navigate("/login");
    } else {
      // if (successCreate) dispatch(removeCreatedUser());

      if (userDetails.user !== Number(userId)) {
        dispatch(loadUserData(userId));
      } else {
        setName(userDetails.name);
        if (userDetails.subjects.length) {
          const subjectsCount = userDetails.subjects.length;

          for (let i = 0; i < subjectsCount; i++) {
            if (i === 0) setSubject1(userDetails.subjects[i].name);
            if (i === 1) setSubject2(userDetails.subjects[i].name);
            if (i === 2) setSubject3(userDetails.subjects[i].name);
          }
        }
      }

      dispatch(loadSubjects());
    }
  }, [userDetails, dispatch, userId, userInfo, navigate, userDetails._id]);

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
          <h1>Edit Subject Allottment</h1>
        </Col>

        <Col className="text-end">
          Name: {userDetails.name}
          <br />
          Code: {userDetails.code}
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
              <Form.Label>Teacher Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                placeholder="Enter name"
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="subject1">
              <Form.Label>Subject 1</Form.Label>
              <Form.Control
                as="select"
                value={subject1}
                onChange={(e) => setSubject1(e.target.value)}
              >
                <option value="">Select Subject1</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="subject2">
              <Form.Label>Subject 2</Form.Label>
              <Form.Control
                as="select"
                value={subject2}
                onChange={(e) => setSubject2(e.target.value)}
              >
                <option value="">Select Subject2</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="subject3">
              <Form.Label>Subject 3</Form.Label>
              <Form.Control
                as="select"
                value={subject3}
                onChange={(e) => setSubject3(e.target.value)}
              >
                <option value="">Select Subject3</option>
                {subjects.map((subject) => (
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

export default EditSubjectAllotmentPage;
