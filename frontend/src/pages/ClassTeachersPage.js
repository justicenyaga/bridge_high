import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

import Loader from "../components/Loader";

import {
  loadClassTeachers,
  createClassTeacher,
  deleteClassTeacher,
} from "../store/classTeachers";

const ClassTeachersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxStore = useSelector((state) => state);
  const {
    list: classTeachers,
    loading,
    error,
    successCreate,
    successDelete,
  } = reduxStore.classTeachers;
  const { userInfo } = reduxStore.user;

  useEffect(() => {
    if (!userInfo.is_admin) navigate("/");

    if (successCreate) {
      const createdClassTeacher = reduxStore.classTeachers.createdClassTeacher;
      navigate(`/admin/teachers/class-teachers/${createdClassTeacher._id}`);
    }

    dispatch(loadClassTeachers());
  }, [dispatch, successCreate, successDelete, userInfo, navigate]);

  const handleCreateClassTeacher = () => {
    dispatch(createClassTeacher());
  };

  const handleDeleteClassTeacher = (classTeacherId) => {
    if (window.confirm("Are you sure you want to delete this class teacher?")) {
      dispatch(deleteClassTeacher(classTeacherId));
      toast.success("Class teacher deleted successfully");
      window.location.reload();
    }
  };

  return (
    <div>
      <Row>
        <Col>
          <h1>Class Teachers</h1>
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
            onClick={handleCreateClassTeacher}
          >
            <FontAwesomeIcon icon="fas fa-plus" /> Create Class Teacher
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
              <th>Class</th>
              <th>Session</th>
              <th>Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {classTeachers.map((classTeacher) => (
              <tr key={classTeacher._id}>
                <td>{classTeachers.indexOf(classTeacher) + 1}</td>
                <td>{classTeacher.teacher && classTeacher.teacher.name}</td>
                <th>{classTeacher.alloted_class.name}</th>
                <td>{classTeacher.session && classTeacher.session.name}</td>
                <td>
                  {classTeacher.is_active ? (
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
                    to={`/admin/teachers/class-teachers/${classTeacher._id}`}
                  >
                    <Button variant="light" className="btn btn-sm">
                      <FontAwesomeIcon icon="fas fa-edit" />
                    </Button>
                  </LinkContainer>{" "}
                  <Button
                    variant="danger"
                    className="btn btn-sm"
                    onClick={() => handleDeleteClassTeacher(classTeacher._id)}
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

export default ClassTeachersPage;
