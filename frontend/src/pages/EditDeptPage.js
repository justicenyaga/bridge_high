import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";

import {
  loadDepartments,
  updateDepartment,
  deleteDepartment,
  clearCreatedDepartment,
} from "../store/departments";

const EditStreamPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: deptId } = useParams();

  const [name, setName] = useState("");

  const { list, loading, error, successCreate } = useSelector(
    (state) => state.departments
  );
  const { userInfo } = useSelector((state) => state.user);

  const dept = list.find((dept) => dept._id === Number(deptId));

  useEffect(() => {
    if (!userInfo.is_admin) navigate("/");

    if (successCreate) dispatch(clearCreatedDepartment());

    if (!dept._id || dept._id !== Number(deptId)) {
      dispatch(loadDepartments());
    } else {
      setName(dept.name);
    }
  }, [dispatch, dept, deptId, successCreate, userInfo, navigate]);

  const handleDeleteDept = (deptId) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      dispatch(deleteDepartment(deptId));

      navigate(-1);
      toast.success("Department deleted successfully");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(updateDepartment(deptId, { name }));
    navigate(-1);

    toast.success("Department updated successfully");
  };

  return (
    <div>
      <Col>
        <Button variant="light" onClick={() => navigate(-1)} className="my-3">
          <FontAwesomeIcon icon="fas fa-arrow-left" />
        </Button>
      </Col>

      <Col className="text-center">
        <h1>Edit Department</h1>
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
                  onClick={() => handleDeleteDept(dept._id)}
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

export default EditStreamPage;
