import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";

import {
  loadSessions,
  updateSession,
  deleteSession,
  clearCreatedSession,
} from "../store/sessions";

const EditSessionPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: sessionId } = useParams();

  const [name, setName] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);

  const { list, loading, error, successCreate } = useSelector(
    (state) => state.sessions
  );
  const { userInfo } = useSelector((state) => state.user);

  const session = list.find((session) => session._id === Number(sessionId));

  useEffect(() => {
    if (!userInfo.is_admin) navigate("/");

    if (successCreate) dispatch(clearCreatedSession());

    if (!session._id || session._id !== Number(sessionId)) {
      dispatch(loadSessions());
    } else {
      setName(session.name);
      setIsCurrent(session.isCurrent);
    }
  }, [dispatch, session, sessionId, successCreate, userInfo, navigate]);

  const handleDeleteSession = (sessionId) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      dispatch(deleteSession(sessionId));

      navigate(-1);
      toast.success("Session deleted successfully");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(updateSession(sessionId, { name, isCurrent }));
    navigate(-1);

    toast.success("Session updated successfully");
  };

  return (
    <div>
      <Col>
        <Button variant="light" onClick={() => navigate(-1)} className="my-3">
          <FontAwesomeIcon icon="fas fa-arrow-left" />
        </Button>
      </Col>

      <Col className="text-center">
        <h1>Edit Session</h1>
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

            <Form.Group controlId="isCurrent">
              <Form.Check
                type="checkbox"
                label="Is Current"
                checked={isCurrent}
                onChange={(e) => setIsCurrent(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <br />
            <br />
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
                  onClick={() => handleDeleteSession(session._id)}
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

export default EditSessionPage;
