import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

import Loader from "../components/Loader";

import { loadSessions, createSession, deleteSession } from "../store/sessions";

const SessionsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxStore = useSelector((state) => state);
  const {
    list: sessions,
    loading,
    error,
    successCreate,
    successDelete,
  } = reduxStore.sessions;
  const { userInfo } = reduxStore.user;

  useEffect(() => {
    if (!userInfo.is_admin) navigate("/");

    if (successCreate) {
      const createdSession = reduxStore.sessions.createdSession;
      navigate(`/admin/management/sessions/${createdSession._id}`);
    }

    dispatch(loadSessions());
  }, [dispatch, successCreate, successDelete, userInfo, navigate]);

  const handleCreateSession = () => {
    dispatch(createSession());
  };

  const handleDeleteSession = (sessionId) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      dispatch(deleteSession(sessionId));
      toast.success("Session deleted successfully");
      window.location.reload();
    }
  };

  return (
    <div>
      <Row>
        <Col>
          <h1>Sessions</h1>
        </Col>

        <Col className="text-end">
          <Button
            className="btn"
            style={{
              backgroundColor: "#4CAF50",
              border: "2px solid #4CAF50",
              borderRadius: "5px",
              color: "white",
            }}
            onClick={handleCreateSession}
          >
            <FontAwesomeIcon icon="fas fa-plus" /> Create Session
          </Button>
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        toast.error(error)
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Current</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session._id}>
                <td>{sessions.indexOf(session) + 1}</td>
                <td>{session.name}</td>

                <td>
                  {session.isCurrent ? (
                    <FontAwesomeIcon
                      icon="fas fa-check"
                      style={{ color: "green" }}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon="fas fa-times"
                      style={{ color: "red" }}
                    />
                  )}
                </td>

                <td>
                  <LinkContainer
                    to={`/admin/management/sessions/${session._id}`}
                  >
                    <Button variant="light" className="btn btn-sm">
                      <FontAwesomeIcon icon="fas fa-edit" />
                    </Button>
                  </LinkContainer>{" "}
                  <Button
                    variant="danger"
                    className="btn btn-sm"
                    onClick={() => handleDeleteSession(session._id)}
                  >
                    <FontAwesomeIcon icon="fas fa-trash" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default SessionsPage;
