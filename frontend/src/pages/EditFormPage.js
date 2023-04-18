import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";

import {
  loadForms,
  updateForm,
  deleteForm,
  clearCreatedForm,
} from "../store/forms";
import { loadStreams } from "../store/streams";

const EditFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: classId } = useParams();

  const [name, setName] = useState("");
  const [stream, setStream] = useState("");

  const { list, loading, error, successCreate } = useSelector(
    (state) => state.forms
  );
  const { list: streams } = useSelector((state) => state.streams);
  const { userInfo } = useSelector((state) => state.user);

  const s_class = list.find((s_class) => s_class._id === Number(classId));

  useEffect(() => {
    if (!userInfo.is_admin) navigate("/");

    if (successCreate) dispatch(clearCreatedForm());

    if (!s_class._id || s_class._id !== Number(classId)) {
      dispatch(loadForms());
    } else {
      setName(s_class.name);
      setStream(s_class.stream);
    }

    dispatch(loadStreams());
  }, [dispatch, s_class, classId, successCreate, userInfo, navigate]);

  const handleDeleteClass = (classId) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      dispatch(deleteForm(classId));

      navigate(-1);
      toast.success("Class deleted successfully");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(updateForm(classId, { name, stream }));
    navigate(-1);

    toast.success("Class updated successfully");
  };

  return (
    <div>
      <Col>
        <Button variant="light" onClick={() => navigate(-1)} className="my-3">
          <FontAwesomeIcon icon="fas fa-arrow-left" />
        </Button>
      </Col>

      <Col className="text-center">
        <h1>Edit Class</h1>
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

            <Form.Group controlId="name">
              <Form.Label>Stream</Form.Label>
              <Form.Control
                as="select"
                value={stream}
                onChange={(e) => setStream(e.target.value)}
              >
                <option value="">...Select Stream</option>
                {streams.map((stream) => (
                  <option key={stream._id} value={stream.name}>
                    {stream.name}
                  </option>
                ))}
              </Form.Control>
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
                  onClick={() => handleDeleteClass(s_class._id)}
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

export default EditFormPage;
