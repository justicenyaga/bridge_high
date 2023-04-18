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

function EditStudentSubjectSelection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: userId } = useParams();

  const reduxState = useSelector((state) => state);
  const { userInfo } = reduxState.user;
  const { userData: userDetails, loading, error } = reduxState.userData;
  const { userDetails: userInfomation } = reduxState.userDetails;
  const { selectedSubjects } = reduxState.selectedSubjects;
  const { list: subjects } = reduxState.subjects;

  const [name, setName] = useState("");
  const [t8, setT8] = useState("");
  const [s5, setS5] = useState("");
  const [h6, setH6] = useState("");
  const [h7, setH7] = useState("");

  const t8Subjects =
    subjects.length &&
    subjects.filter((subject) => subject.dept === "Technicals");

  const s5Subjects =
    subjects.length &&
    subjects.filter(
      (subject) => subject.name === "Biology" || subject.name === "Physics"
    );

  const h6Subjects =
    subjects.length &&
    subjects.filter(
      (subject) => subject.dept === "Humanities" || subject.name === "Biology"
    );

  const h7Subjects =
    subjects.length &&
    subjects.filter((subject) => subject.dept === "Humanities");

  useEffect(() => {
    if (!userInfo.is_admin && !userInfomation.isClassTeacher) {
      navigate("/login");
    } else {
      // if (successCreate) dispatch(removeCreatedUser());

      if (userDetails.user !== Number(userId)) {
        dispatch(loadUserData(userId));
      } else {
        setName(userDetails.name);

        if (selectedSubjects._id) {
          setT8(selectedSubjects.t8.name);
          setS5(
            selectedSubjects.s5.length && selectedSubjects.s5.length === 2
              ? "Physics"
              : selectedSubjects.s5[0].name
          );
          setH6(
            selectedSubjects.s5.length && selectedSubjects.s5.length === 2
              ? "Biology"
              : selectedSubjects.h7[0].name
          );
          setH7(
            selectedSubjects.s5.length && selectedSubjects.s5.length === 2
              ? selectedSubjects.h7[0].name
              : selectedSubjects.h7[1].name
          );
        }
      }

      userDetails._id && dispatch(getSelectedSubjects(userDetails._id));
      dispatch(loadSubjects());
    }
  }, [
    userDetails,
    dispatch,
    userId,
    userInfo,
    navigate,
    selectedSubjects,
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
          <h1>Edit Student Subject Selection</h1>
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

            <Form.Group controlId="s5">
              <Form.Label>Selected S5</Form.Label>
              <Form.Control
                as="select"
                value={s5}
                onChange={(e) => setS5(e.target.value)}
              >
                <option value="">...Select S5</option>
                {s5Subjects.map((subject) => (
                  <option key={subject._id} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="h6">
              <Form.Label>Selected H6</Form.Label>
              <Form.Control
                as="select"
                value={h6}
                onChange={(e) => setH6(e.target.value)}
              >
                <option value="">...Select H6</option>
                {h6Subjects.map((subject) => (
                  <option key={subject._id} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="h7">
              <Form.Label>Selected H7</Form.Label>
              <Form.Control
                as="select"
                value={h7}
                onChange={(e) => setH7(e.target.value)}
              >
                <option value="">...Select H7</option>
                {h7Subjects.map((subject) => (
                  <option key={subject._id} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="t8">
              <Form.Label>Selected T8</Form.Label>
              <Form.Control
                as="select"
                value={t8}
                onChange={(e) => setT8(e.target.value)}
              >
                <option value="">...Select T8</option>
                {t8Subjects.map((subject) => (
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

export default EditStudentSubjectSelection;
