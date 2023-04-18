import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";

import {
  loadExams,
  updateExam,
  deleteExam,
  clearCreatedExam,
} from "../store/exams";

const EditExamPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: examId } = useParams();

  const [name, setName] = useState("");

  const { examList, loading, error, successCreate } = useSelector(
    (state) => state.exams
  );
  const { userInfo } = useSelector((state) => state.user);

  const exam = examList.find((exam) => exam._id === Number(examId));

  useEffect(() => {
    if (!userInfo.is_admin) navigate("/");

    if (successCreate) dispatch(clearCreatedExam());

    if (!exam._id || exam._id !== Number(examId)) {
      dispatch(loadExams());
    } else {
      setName(exam.name);
    }
  }, [dispatch, exam, examId, successCreate, userInfo, navigate]);

  const handleDeleteExam = (examId) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      dispatch(deleteExam(examId));

      navigate(-1);
      toast.success("Exam deleted successfully");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(updateExam(examId, { name }));
    navigate(-1);

    toast.success("Exam updated successfully");
  };

  return (
    <div>
      <Col>
        <Button variant="light" onClick={() => navigate(-1)} className="my-3">
          <FontAwesomeIcon icon="fas fa-arrow-left" />
        </Button>
      </Col>

      <Col className="text-center">
        <h1>Edit Exam</h1>
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
                  onClick={() => handleDeleteExam(exam._id)}
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

export default EditExamPage;
