import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

import Loader from "../components/Loader";

import {
  loadDepartments,
  createDepartment,
  deleteDepartment,
} from "../store/departments";

const DeptListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxStore = useSelector((state) => state);
  const {
    list: depts,
    loading,
    error,
    successCreate,
    successDelete,
  } = reduxStore.departments;
  const { userInfo } = reduxStore.user;

  useEffect(() => {
    if (!userInfo.is_admin) navigate("/");

    if (successCreate) {
      const createdDept = reduxStore.departments.createdDepartment;
      navigate(`/admin/management/departments/${createdDept._id}`);
    }

    dispatch(loadDepartments());
  }, [dispatch, successCreate, successDelete, userInfo, navigate]);

  const handleCreateDepartment = () => {
    dispatch(createDepartment());
  };

  const handleDeleteDepartment = (deptId) => {
    if (window.confirm("Are you sure you want to delete this Department?")) {
      dispatch(deleteDepartment(deptId));

      setTimeout(() => {
        toast.success("Department deleted successfully");

        window.location.reload();
      }, 10);
    }
  };

  return (
    <div>
      <Row>
        <Col>
          <h1>Departments</h1>
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
            onClick={handleCreateDepartment}
          >
            <FontAwesomeIcon icon="fas fa-plus" /> Create Department
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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {depts.map((dept) => (
              <tr key={dept._id}>
                <td>{depts.indexOf(dept) + 1}</td>
                <td>{dept.name}</td>

                <td>
                  <LinkContainer
                    to={`/admin/management/departments/${dept._id}`}
                  >
                    <Button variant="light" className="btn btn-sm">
                      <FontAwesomeIcon icon="fas fa-edit" />
                    </Button>
                  </LinkContainer>{" "}
                  <Button
                    variant="danger"
                    className="btn btn-sm"
                    onClick={() => handleDeleteDepartment(dept._id)}
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

export default DeptListPage;
