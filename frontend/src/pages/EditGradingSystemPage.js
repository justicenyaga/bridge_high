import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";

import {
  loadGradingSystems,
  updateGradingSystem,
  deleteGradingSystem,
  clearCreatedGradingSystem,
} from "../store/gradingSystems";

import { loadSessions } from "../store/sessions";

const EditGradingSystemPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [session, setSession] = useState("");
  const [A, setA] = useState();
  const [A_minus, setA_minus] = useState();
  const [B_plus, setB_plus] = useState();
  const [B, setB] = useState();
  const [B_minus, setB_minus] = useState();
  const [C_plus, setC_plus] = useState();
  const [C, setC] = useState();
  const [C_minus, setC_minus] = useState();
  const [D_plus, setD_plus] = useState();
  const [D, setD] = useState();
  const [D_minus, setD_minus] = useState();

  const { list, loading, error, successCreate } = useSelector(
    (state) => state.gradingSystems
  );

  const { list: sessions } = useSelector((state) => state.sessions);

  const { userInfo } = useSelector((state) => state.user);

  const gradingSystem = list.find((g_system) => g_system._id === Number(id));

  useEffect(() => {
    if (!userInfo.is_admin) navigate("/");

    if (successCreate) dispatch(clearCreatedGradingSystem());

    if (!gradingSystem._id || gradingSystem._id !== Number(id)) {
      dispatch(loadGradingSystems());
    } else {
      setSession(gradingSystem.session);
      setA(gradingSystem.A);
      setA_minus(gradingSystem.A_minus);
      setB_plus(gradingSystem.B_plus);
      setB(gradingSystem.B);
      setB_minus(gradingSystem.B_minus);
      setC_plus(gradingSystem.C_plus);
      setC(gradingSystem.C);
      setC_minus(gradingSystem.C_minus);
      setD_plus(gradingSystem.D_plus);
      setD(gradingSystem.D);
      setD_minus(gradingSystem.D_minus);
    }

    dispatch(loadSessions());
  }, [dispatch, gradingSystem, id, successCreate, userInfo, navigate]);

  const handleDeleteGradingSystem = (id) => {
    if (
      window.confirm("Are you sure you want to delete this grading system?")
    ) {
      dispatch(deleteGradingSystem(id));

      navigate(-1);
      toast.success("Grading system deleted successfully");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      session,
      A,
      A_minus,
      B_plus,
      B,
      B_minus,
      C_plus,
      C,
      C_minus,
      D_plus,
      D,
      D_minus,
    };

    dispatch(updateGradingSystem(id, data));
    navigate(-1);

    toast.success("Grading system updated successfully");
  };

  return (
    <div>
      <Col>
        <Button variant="light" onClick={() => navigate(-1)} className="my-3">
          <FontAwesomeIcon icon="fas fa-arrow-left" />
        </Button>
      </Col>

      <Col className="text-center">
        <h1>Edit Grading System</h1>
      </Col>

      {loading ? (
        <Loader />
      ) : error ? (
        toast.error(error)
      ) : (
        <FormContainer>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="session">
              <Form.Label>Session</Form.Label>
              <Form.Control
                as="select"
                value={session}
                onChange={(e) => setSession(e.target.value)}
              >
                <option value="">...Select Session</option>
                {sessions.map((session) => (
                  <option key={session._id} value={session.name}>
                    {session.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="A">
              <Form.Label>A Minimum score</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter the minimum score for A"
                value={A}
                onChange={(e) => setA(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="A_minus">
              <Form.Label>A- Minimum score</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter the minimum score for A-"
                value={A_minus}
                onChange={(e) => setA_minus(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="B_plus">
              <Form.Label>B+ Minimum score</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter the minimum score for B+"
                value={B_plus}
                onChange={(e) => setB_plus(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="B">
              <Form.Label>B Minimum score</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter the minimum score for B"
                value={B}
                onChange={(e) => setB(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="B_minus">
              <Form.Label>B- Minimum score</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter the minimum score for B-"
                value={B_minus}
                onChange={(e) => setB_minus(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="C_plus">
              <Form.Label>C+ Minimum score</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter the minimum score for C+"
                value={C_plus}
                onChange={(e) => setC_plus(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="C">
              <Form.Label>C Minimum score</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter the minimum score for C"
                value={C}
                onChange={(e) => setC(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="C_minus">
              <Form.Label>C- Minimum score</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter the minimum score for C-"
                value={C_minus}
                onChange={(e) => setC_minus(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="D_plus">
              <Form.Label>D+ Minimum score</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter the minimum score for D+"
                value={D_plus}
                onChange={(e) => setD_plus(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="D">
              <Form.Label>D Minimum score</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter the minimum score for D"
                value={D}
                onChange={(e) => setD(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="D_minus">
              <Form.Label>D- Minimum score</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter the minimum score for D-"
                value={D_minus}
                onChange={(e) => setD_minus(e.target.value)}
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
                  onClick={() => handleDeleteGradingSystem(gradingSystem._id)}
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

export default EditGradingSystemPage;
