import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

import Message from "../components/Message";
import Loader from "../components/Loader";

import { loadUsers, createUser, deleteUser } from "../store/userList";

const AdminListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxStore = useSelector((state) => state);
  const { userInfo } = reduxStore.user;
  const { adminList, loading, error, successDelete, successCreate } =
    reduxStore.userList;

  useEffect(() => {
    if (successCreate) {
      const createdUser = reduxStore.userList.userCreated;
      navigate(`/admin/users/${createdUser.user}`);
    }

    if (!userInfo.is_admin) navigate("/login");

    dispatch(loadUsers("admin"));
  }, [dispatch, userInfo, successDelete, successCreate, navigate]);

  const handleCreateAdmin = () => {
    dispatch(createUser("admin"));
  };

  const handleDeleteAdmin = (teacherId) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      dispatch(deleteUser("admin", teacherId));
      toast.success("Admin deleted successfully");
      window.location.reload();
    }
  };

  return (
    <div>
      <Row>
        <Col>
          <h1>ADMINS</h1>
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
            onClick={handleCreateAdmin}
          >
            <FontAwesomeIcon icon="fas fa-plus" /> Create Admin
          </Button>
        </Col>
      </Row>

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
              <th>Active</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {adminList.map((admin) => (
              <tr key={admin._id}>
                <td>{adminList.indexOf(admin) + 1}</td>
                <td>{admin.code}</td>
                <td>{admin.name}</td>
                <td>{admin.emailAddress}</td>
                <td>{admin.phoneNumber}</td>
                <td>
                  {admin.isActive ? (
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
                  <LinkContainer to={`/admin/users/${admin.user}`}>
                    <Button variant="light" className="btn btn-sm">
                      <FontAwesomeIcon icon="fas fa-edit" />
                    </Button>
                  </LinkContainer>{" "}
                  <Button
                    variant="danger"
                    className="btn btn-sm"
                    onClick={() => handleDeleteAdmin(admin._id)}
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

export default AdminListPage;
