import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

import Loader from "../components/Loader";

import { loadSubjects, createSubject, deleteSubject } from "../store/subjects";

const SubjectListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxStore = useSelector((state) => state);
  const {
    list: subjects,
    loading,
    error,
    successCreate,
    successDelete,
  } = reduxStore.subjects;
  const { userInfo } = reduxStore.user;

  useEffect(() => {
    if (!userInfo.is_admin) navigate("/");

    if (successCreate) {
      const createdSubject = reduxStore.subjects.createdSubject;
      navigate(`/admin/management/subjects/${createdSubject._id}`);
    }

    dispatch(loadSubjects());
  }, [dispatch, successCreate, successDelete, userInfo, navigate]);

  const handleCreateSubject = () => {
    dispatch(createSubject());
  };

  const handleDeleteSubject = (subjectId) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      dispatch(deleteSubject(subjectId));
      toast.success("Subject deleted successfully");
      window.location.reload();
    }
  };

  return (
    <div>
      <Row>
        <Col>
          <h1>Subjects</h1>
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
            onClick={handleCreateSubject}
          >
            <FontAwesomeIcon icon="fas fa-plus" /> Create Subject
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
              <th>Abbreviation</th>
              <th>Department</th>
              <th>Compulsory</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject._id}>
                <td>{subjects.indexOf(subject) + 1}</td>
                <td>{subject.name}</td>
                <td>{subject.abbr}</td>
                <td>{subject.dept}</td>
                <td>
                  {subject.isCompulsory ? (
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
                  <LinkContainer
                    to={`/admin/management/subjects/${subject._id}`}
                  >
                    <Button variant="light" className="btn btn-sm">
                      <FontAwesomeIcon icon="fas fa-edit" />
                    </Button>
                  </LinkContainer>{" "}
                  <Button
                    variant="danger"
                    className="btn btn-sm"
                    onClick={() => handleDeleteSubject(subject._id)}
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

export default SubjectListPage;
