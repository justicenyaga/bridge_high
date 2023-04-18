import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

import Loader from "../components/Loader";

import {
  loadGradingSystems,
  createGradingSystem,
  deleteGradingSystem,
} from "../store/gradingSystems";

const GradingSystemsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxStore = useSelector((state) => state);
  const {
    list: gradingSystems,
    loading,
    error,
    successCreate,
    successDelete,
  } = reduxStore.gradingSystems;
  const { userInfo } = reduxStore.user;

  useEffect(() => {
    if (!userInfo.is_admin) navigate("/");

    if (successCreate) {
      const createdGradingSystem =
        reduxStore.gradingSystems.createdGradingSystem;
      navigate(`/admin/management/grading-systems/${createdGradingSystem._id}`);
    }

    dispatch(loadGradingSystems());
  }, [dispatch, successCreate, successDelete, userInfo, navigate]);

  const handleCreateGradingSystem = () => {
    dispatch(createGradingSystem());
  };

  const handleDeleteGradingSystem = (id) => {
    if (window.confirm("Are you sure you want to delete this gradingSystem?")) {
      dispatch(deleteGradingSystem(id));
      toast.success("GradingSystem deleted successfully");
      window.location.reload();
    }
  };

  return (
    <div>
      <Row>
        <Col>
          <h1>Grading Systems</h1>
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
            onClick={handleCreateGradingSystem}
          >
            <FontAwesomeIcon icon="fas fa-plus" /> Create Grading System
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
              <th>Session</th>
              <th>A</th>
              <th>A-</th>
              <th>B+</th>
              <th>B</th>
              <th>B-</th>
              <th>C+</th>
              <th>C</th>
              <th>C-</th>
              <th>D+</th>
              <th>D</th>
              <th>D-</th>
              <th>E</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {gradingSystems.map((gradingSystem) => (
              <tr key={gradingSystem._id}>
                <td>{gradingSystems.indexOf(gradingSystem) + 1}</td>
                <td>{gradingSystem.session}</td>

                <td>100 - {gradingSystem.A}</td>

                <td>
                  {gradingSystem.A - 1} - {gradingSystem.A_minus}
                </td>

                <td>
                  {gradingSystem.A - 1} - {gradingSystem.B_plus}
                </td>

                <td>
                  {gradingSystem.B_plus - 1} - {gradingSystem.B}
                </td>

                <td>
                  {gradingSystem.B - 1} - {gradingSystem.B_minus}
                </td>

                <td>
                  {gradingSystem.B_minus - 1} - {gradingSystem.C_plus}
                </td>

                <td>
                  {gradingSystem.C_plus - 1} - {gradingSystem.C}
                </td>

                <td>
                  {gradingSystem.C - 1} - {gradingSystem.C_minus}
                </td>

                <td>
                  {gradingSystem.C_minus - 1} - {gradingSystem.D_plus}
                </td>

                <td>
                  {gradingSystem.D_plus - 1} - {gradingSystem.D}
                </td>

                <td>
                  {gradingSystem.D - 1} - {gradingSystem.D_minus}
                </td>

                <td>{gradingSystem.D_minus - 1} - 0</td>

                <td>
                  <LinkContainer
                    to={`/admin/management/grading-systems/${gradingSystem._id}`}
                  >
                    <Button variant="light" className="btn btn-sm">
                      <FontAwesomeIcon icon="fas fa-edit" />
                    </Button>
                  </LinkContainer>{" "}
                  <Button
                    variant="danger"
                    className="btn btn-sm"
                    onClick={() => handleDeleteGradingSystem(gradingSystem._id)}
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

export default GradingSystemsPage;
