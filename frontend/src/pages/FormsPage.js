import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

import Loader from "../components/Loader";

import {
  loadForms as loadClasses,
  createForm as createClass,
  deleteForm as deleteClass,
} from "../store/forms";

import { loadClassTeachers } from "../store/classTeachers";
import { loadSessions } from "../store/sessions";

const FormsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxStore = useSelector((state) => state);
  const {
    list: classes,
    loading,
    error,
    successCreate,
    successDelete,
  } = reduxStore.forms;
  const { userInfo } = reduxStore.user;

  const { list: classTeachers } = reduxStore.classTeachers;
  const { list: sessions } = reduxStore.sessions;
  const currentSession = sessions.find((session) => session.isCurrent);

  console.log(currentSession);

  useEffect(() => {
    if (!userInfo.is_admin) navigate("/");

    if (successCreate) {
      const createdClass = reduxStore.forms.createdForm;
      navigate(`/admin/management/classes/${createdClass._id}`);
    }

    dispatch(loadClasses());
    dispatch(loadClassTeachers());
    dispatch(loadSessions());
  }, [dispatch, successCreate, successDelete, userInfo, navigate]);

  const handleCreateClass = () => {
    dispatch(createClass());
  };

  const handleDeleteClass = (classId) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      dispatch(deleteClass(classId));
      toast.success("Class deleted successfully");
      window.location.reload();
    }
  };

  return (
    <div>
      <Row>
        <Col>
          <h1>Classes</h1>
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
            onClick={handleCreateClass}
          >
            <FontAwesomeIcon icon="fas fa-plus" /> Create Class
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
              <th>Stream</th>
              <th>Class Teacher</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {classes.map((s_class) => (
              <tr key={s_class._id}>
                <td>{classes.indexOf(s_class) + 1}</td>
                <td>{s_class.name}</td>
                <td>{s_class.stream}</td>

                <td>
                  {classTeachers.find(
                    (classTeacher) =>
                      classTeacher.alloted_class._id === s_class._id &&
                      classTeacher.session._id === currentSession._id &&
                      classTeacher.is_active
                  )?.teacher?.name || "Not Assigned"}
                </td>

                <td>
                  <LinkContainer
                    to={`/admin/management/classes/${s_class._id}`}
                  >
                    <Button variant="light" className="btn btn-sm">
                      <FontAwesomeIcon icon="fas fa-edit" />
                    </Button>
                  </LinkContainer>{" "}
                  <Button
                    variant="danger"
                    className="btn btn-sm"
                    onClick={() => handleDeleteClass(s_class._id)}
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

export default FormsPage;
