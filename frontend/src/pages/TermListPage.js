import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

import Loader from "../components/Loader";

import { loadTerms, createTerm, deleteTerm } from "../store/terms";

const TermListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxStore = useSelector((state) => state);
  const {
    list: terms,
    loading,
    error,
    successCreate,
    successDelete,
  } = reduxStore.terms;
  const { userInfo } = reduxStore.user;

  useEffect(() => {
    if (!userInfo.is_admin) navigate("/");

    if (successCreate) {
      const createdTerm = reduxStore.terms.createdTerm;
      navigate(`/admin/management/terms/${createdTerm._id}`);
    }

    dispatch(loadTerms());
  }, [dispatch, successCreate, successDelete, userInfo, navigate]);

  const handleCreateTerm = () => {
    dispatch(createTerm());
  };

  const handleDeleteTerm = (termId) => {
    if (window.confirm("Are you sure you want to delete this term?")) {
      dispatch(deleteTerm(termId));
      toast.success("Term deleted successfully");
      window.location.reload();
    }
  };

  return (
    <div>
      <Row>
        <Col>
          <h1>Terms</h1>
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
            onClick={handleCreateTerm}
          >
            <FontAwesomeIcon icon="fas fa-plus" /> Create Term
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
            {terms.map((term) => (
              <tr key={term._id}>
                <td>{terms.indexOf(term) + 1}</td>
                <td>{term.name}</td>
                <td>
                  {term.isCurrent ? (
                    <FontAwesomeIcon
                      icon="fas fa-check"
                      style={{
                        color: "green",
                      }}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon="fas fa-times"
                      style={{ color: "red" }}
                    />
                  )}
                </td>

                <td>
                  <LinkContainer to={`/admin/management/terms/${term._id}`}>
                    <Button variant="light" className="btn btn-sm">
                      <FontAwesomeIcon icon="fas fa-edit" />
                    </Button>
                  </LinkContainer>{" "}
                  <Button
                    variant="danger"
                    className="btn btn-sm"
                    onClick={() => handleDeleteTerm(term._id)}
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

export default TermListPage;
