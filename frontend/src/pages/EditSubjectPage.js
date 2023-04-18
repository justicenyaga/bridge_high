import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";

import {
  loadSubjects,
  updateSubject,
  deleteSubject,
  clearCreatedSubject,
} from "../store/subjects";
import { loadDepartments } from "../store/departments";

const EditSubjectPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: subjectId } = useParams();

  const [name, setName] = useState("");
  const [abbr, setAbbr] = useState("");
  const [dept, setDept] = useState("");
  const [isCompulsory, setIsCompulsory] = useState(false);

  const { list, loading, error, successCreate } = useSelector(
    (state) => state.subjects
  );
  const { userInfo } = useSelector((state) => state.user);
  const { list: depts } = useSelector((state) => state.departments);

  const subject =
    list.length && list.find((subject) => subject._id === Number(subjectId));

  useEffect(() => {
    if (!userInfo.is_admin) navigate("/");

    if (successCreate) dispatch(clearCreatedSubject());

    if (!subject._id || subject._id !== Number(subjectId)) {
      dispatch(loadSubjects());
    } else {
      setName(subject.name);
      setAbbr(subject.abbr);
      setDept(subject.dept);
      setIsCompulsory(subject.isCompulsory);
    }

    dispatch(loadDepartments());
  }, [dispatch, subject, subjectId, successCreate, userInfo, navigate]);

  const handleDeleteSubject = (subjectId) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      dispatch(deleteSubject(subjectId));

      navigate(-1);
      toast.success("Subject deleted successfully");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(updateSubject(subjectId, { name, abbr, dept, isCompulsory }));
    navigate(-1);

    toast.success("Subject updated successfully");
  };

  return (
    <div>
      <Col>
        <Button variant="light" onClick={() => navigate(-1)} className="my-3">
          <FontAwesomeIcon icon="fas fa-arrow-left" />
        </Button>
      </Col>

      <Col className="text-center">
        <h1>Edit Subject</h1>
      </Col>

      {loading ? (
        <Loader />
      ) : error ? (
        toast.error(error)
      ) : (
        <FormContainer>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="abbr">
              <Form.Label>Abbreviation</Form.Label>
              <Form.Control
                type="abbr"
                placeholder="Enter abbreviation"
                value={abbr}
                onChange={(e) => setAbbr(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="dept">
              <Form.Label>Department</Form.Label>
              <Form.Control
                as="select"
                value={dept}
                onChange={(e) => setDept(e.target.value)}
              >
                <option value="">...Select Department</option>
                {depts.map((dept) => (
                  <option key={dept._id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="isCompulsory">
              <Form.Check
                type="checkbox"
                label="Is Compulsory"
                checked={isCompulsory}
                onChange={(e) => setIsCompulsory(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <br />

            <Row>
              <Col>
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
              </Col>

              <Col className="text-end">
                <Button
                  variant="danger"
                  className="btn-sm"
                  style={{ borderRadius: "5px" }}
                  onClick={() => handleDeleteSubject(subject._id)}
                >
                  <FontAwesomeIcon icon="fas fa-trash" /> Delete
                </Button>
              </Col>
            </Row>
          </Form>
        </FormContainer>
      )}
    </div>
  );
};

export default EditSubjectPage;
