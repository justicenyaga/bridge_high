import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";

import {
  loadStreams,
  updateStream,
  deleteStream,
  clearCreatedStream,
} from "../store/streams";

const EditStreamPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: streamId } = useParams();

  const [name, setName] = useState("");

  const { list, loading, error, successCreate } = useSelector(
    (state) => state.streams
  );
  const { userInfo } = useSelector((state) => state.user);

  const stream = list.find((stream) => stream._id === Number(streamId));

  useEffect(() => {
    if (!userInfo.is_admin) navigate("/");

    if (successCreate) dispatch(clearCreatedStream());

    if (!stream._id || stream._id !== Number(streamId)) {
      dispatch(loadStreams());
    } else {
      setName(stream.name);
    }
  }, [dispatch, stream, streamId, successCreate, userInfo, navigate]);

  const handleDeleteStream = (streamId) => {
    if (window.confirm("Are you sure you want to delete this stream?")) {
      dispatch(deleteStream(streamId));

      navigate(-1);
      toast.success("Stream deleted successfully");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(updateStream(streamId, { name }));
    navigate(-1);

    toast.success("Stream updated successfully");
  };

  return (
    <div>
      <Col>
        <Button variant="light" onClick={() => navigate(-1)} className="my-3">
          <FontAwesomeIcon icon="fas fa-arrow-left" />
        </Button>
      </Col>

      <Col className="text-center">
        <h1>Edit Stream</h1>
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
                  onClick={() => handleDeleteStream(stream._id)}
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

export default EditStreamPage;
