import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

import Message from "../components/Message";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";

import { loadUsers, createUser, deleteUser } from "../store/userList";

import { paginate } from "../utils/paginate";

const TeacherListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxStore = useSelector((state) => state);
  const { userInfo } = reduxStore.user;
  const { teacherList, loading, error, successDelete, successCreate } =
    reduxStore.userList;

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  teacherList.length <= pageSize && currentPage > 1 && setCurrentPage(1);
  const paged_teachers = paginate(teacherList, currentPage, pageSize);

  useEffect(() => {
    if (successCreate) {
      const createdUser = reduxStore.userList.userCreated;
      navigate(`/admin/users/${createdUser.user}`);
    }

    if (!userInfo.is_admin) navigate("/login");

    dispatch(loadUsers("teachers"));
  }, [dispatch, userInfo, successDelete, successCreate, navigate]);

  const handleCreateTeacher = () => {
    dispatch(createUser("teachers"));
  };

  const handleDeleteTeacher = (teacherId) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      dispatch(deleteUser("teachers", teacherId));
      toast.success("Teacher deleted successfully");
      window.location.reload();
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <Row>
        <Col>
          <h1>TEACHERS</h1>
        </Col>

        <Col className="text-end">
          <Button
            className="btn btn-sm"
            style={{
              backgroundColor: "#4CAF50",
              border: "2px solid #4CAF50",
              borderRadius: "5px",
              color: "white",
            }}
            onClick={handleCreateTeacher}
          >
            <FontAwesomeIcon icon="fas fa-plus" />
            Admit Teacher
          </Button>
        </Col>
      </Row>

      <div style={{ marginBottom: "1rem" }}>
        {teacherList.length} teachers found
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped hover bordered responsive className="table-sm">
          <thead>
            <tr>
              <th></th>
              <th>Code</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone No</th>
              <th>Department</th>
              <th>Class Teacher</th>
              <th>Active</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {paged_teachers.map((teacher) => (
              <tr key={teacher._id}>
                <td>{teacherList.indexOf(teacher) + 1}</td>
                <td>{teacher.code}</td>
                <td>{teacher.name}</td>
                <td>{teacher.emailAddress}</td>
                <td>{teacher.phoneNumber}</td>
                <td>{teacher.dept}</td>
                <td>
                  {teacher.isClassTeacher ? (
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
                  {teacher.isActive ? (
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
                  <LinkContainer to={`/admin/users/${teacher.user}`}>
                    <Button variant="light" className="btn btn-sm">
                      <FontAwesomeIcon icon="fas fa-edit" />
                    </Button>
                  </LinkContainer>{" "}
                  <Button
                    variant="danger"
                    className="btn btn-sm"
                    onClick={() => handleDeleteTeacher(teacher._id)}
                  >
                    <FontAwesomeIcon icon="fas fa-trash" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Pagination
          itemsCount={teacherList.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>

      {teacherList.length > pageSize && (
        <div>
          <Button
            className="btn btn-sm"
            type="button"
            style={{ borderRadius: "5px" }}
            onClick={() => setPageSize(teacherList.length)}
          >
            Show all {teacherList.length} students
          </Button>
        </div>
      )}

      {paged_teachers.length > 10 && (
        <div>
          <Button
            className="btn btn-sm"
            type="button"
            style={{ borderRadius: "5px" }}
            onClick={() => setPageSize(10)}
          >
            Show 10 students per page
          </Button>
        </div>
      )}
    </div>
  );
};

export default TeacherListPage;
