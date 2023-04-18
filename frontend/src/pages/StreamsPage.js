import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

import Loader from "../components/Loader";

import { loadStreams, createStream, deleteStream } from "../store/streams";

const StreamsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxStore = useSelector((state) => state);
  const {
    list: streams,
    loading,
    error,
    successCreate,
    successDelete,
  } = reduxStore.streams;
  const { userInfo } = reduxStore.user;

  useEffect(() => {
    if (!userInfo.is_admin) navigate("/");

    if (successCreate) {
      const createdStream = reduxStore.streams.createdStream;
      navigate(`/admin/management/streams/${createdStream._id}`);
    }

    dispatch(loadStreams());
  }, [dispatch, successCreate, successDelete, userInfo, navigate]);

  const handleCreateStream = () => {
    dispatch(createStream());
  };

  const handleDeleteStream = (streamId) => {
    if (window.confirm("Are you sure you want to delete this stream?")) {
      dispatch(deleteStream(streamId));
      toast.success("Stream deleted successfully");
      window.location.reload();
    }
  };

  return (
    <div>
      <Row>
        <Col>
          <h1>Streams</h1>
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
            onClick={handleCreateStream}
          >
            <FontAwesomeIcon icon="fas fa-plus" /> Create Stream
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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {streams.map((stream) => (
              <tr key={stream._id}>
                <td>{streams.indexOf(stream) + 1}</td>
                <td>{stream.name}</td>

                <td>
                  <LinkContainer to={`/admin/management/streams/${stream._id}`}>
                    <Button variant="light" className="btn btn-sm">
                      <FontAwesomeIcon icon="fas fa-edit" />
                    </Button>
                  </LinkContainer>{" "}
                  <Button
                    variant="danger"
                    className="btn btn-sm"
                    onClick={() => handleDeleteStream(stream._id)}
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

export default StreamsPage;
