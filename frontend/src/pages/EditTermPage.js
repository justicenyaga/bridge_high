import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";

import {
  loadTerms,
  updateTerm,
  deleteTerm,
  clearCreatedTerm,
} from "../store/terms";

const EditTermPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: termId } = useParams();

  const [name, setName] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);

  const { list, loading, error, successCreate } = useSelector(
    (state) => state.terms
  );
  const { userInfo } = useSelector((state) => state.user);

  const term = list.find((term) => term._id === Number(termId));

  useEffect(() => {
    if (!userInfo.is_admin) navigate("/");

    if (successCreate) dispatch(clearCreatedTerm());

    if (!term._id || term._id !== Number(termId)) {
      dispatch(loadTerms());
    } else {
      setName(term.name);
      setIsCurrent(term.isCurrent);
    }
  }, [dispatch, term, termId, successCreate, userInfo, navigate]);

  const handleDeleteTerm = (termId) => {
    if (window.confirm("Are you sure you want to delete this term?")) {
      dispatch(deleteTerm(termId));

      navigate(-1);
      toast.success("Term deleted successfully");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(updateTerm(termId, { name, isCurrent }));
    navigate(-1);

    toast.success("Term updated successfully");
  };

  return (
    <div>
      <Col>
        <Button variant="light" onClick={() => navigate(-1)} className="my-3">
          <FontAwesomeIcon icon="fas fa-arrow-left" />
        </Button>
      </Col>

      <Col className="text-center">
        <h1>Edit Term</h1>
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
                  onClick={() => handleDeleteTerm(term._id)}
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

export default EditTermPage;
