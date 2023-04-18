import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";

import {
  loadClassTeachers,
  updateClassTeacher,
  deleteClassTeacher,
  clearCreatedClassTeacher,
} from "../store/classTeachers";

import { loadSessions } from "../store/sessions";
import { loadForms } from "../store/forms";
import { loadUsers } from "../store/userList";

const EditClassTeacherPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [teacher, setTeacher] = useState("");
  const [form, setForm] = useState("");
  const [session, setSession] = useState("");
  const [is_active, setIs_active] = useState(false);

  const { list, loading, error, successCreate } = useSelector(
    (state) => state.classTeachers
  );

  const { teacherList } = useSelector((state) => state.userList);
  const { list: sessions } = useSelector((state) => state.sessions);
  const { list: forms } = useSelector((state) => state.forms);

  const { userInfo } = useSelector((state) => state.user);

  const classTeacher = list.find(
    (classTeacher) => classTeacher._id === Number(id)
  );

  useEffect(() => {
    if (!userInfo.is_admin) navigate("/");

    if (successCreate) dispatch(clearCreatedClassTeacher());

    if (!classTeacher._id || classTeacher._id !== Number(id)) {
      dispatch(loadClassTeachers());
    } else {
      setTeacher(classTeacher.teacher._id);
      setForm(classTeacher.alloted_class._id);
      setSession(classTeacher.session._id);
      setIs_active(classTeacher.is_active);
    }

    dispatch(loadUsers("teachers"));
    dispatch(loadSessions());
    dispatch(loadForms());
  }, [dispatch, classTeacher, id, successCreate, userInfo, navigate]);

  const handleDeleteClassTeacher = (classTeacherId) => {
    if (window.confirm("Are you sure you want to delete this classTeacher?")) {
      dispatch(deleteClassTeacher(classTeacherId));

      navigate(-1);
      toast.success("ClassTeacher deleted successfully");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!teacher || !form || !session)
      return toast.error("Please fill all fields");

    const class_teacher = list.find(
      (class_teacher) =>
        class_teacher.alloted_class._id === form &&
        class_teacher.session._id === session &&
        class_teacher.is_active
    );

    if (
      class_teacher &&
      class_teacher.teacher._id !== teacher &&
      class_teacher._id !== Number(id)
    ) {
      return toast.error(
        `${class_teacher.alloted_class.name} has been assigned to ${class_teacher.teacher.name}`
      );
    }

    const c_teacher = list.find(
      (c_teacher) => c_teacher.teacher._id === teacher && c_teacher.is_active
    );

    if (
      c_teacher &&
      c_teacher.alloted_class._id !== form &&
      c_teacher._id !== Number(id)
    ) {
      return toast.error(
        `${c_teacher.teacher.name} is already assigned to ${c_teacher.alloted_class.name}`
      );
    }

    const data = {
      teacher,
      alloted_class: form,
      session,
      is_active,
    };

    dispatch(updateClassTeacher(id, data));
    navigate(-1);

    toast.success("ClassTeacher updated successfully");
  };

  return (
    <div>
      <Col>
        <Button variant="light" onClick={() => navigate(-1)} className="my-3">
          <FontAwesomeIcon icon="fas fa-arrow-left" />
        </Button>
      </Col>

      <Col className="text-center">
        <h1>Edit Class Teacher</h1>
      </Col>

      {loading ? (
        <Loader />
      ) : error ? (
        toast.error(error)
      ) : (
        <FormContainer>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Teacher</Form.Label>
              <Form.Control
                as="select"
                value={teacher}
                onChange={(e) => setTeacher(Number(e.target.value))}
              >
                <option value="">...Select Teacher</option>
                {teacherList.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="form">
              <Form.Label>Class</Form.Label>
              <Form.Control
                as="select"
                value={form}
                onChange={(e) => setForm(Number(e.target.value))}
              >
                <option value="">...Select Form</option>
                {forms.map((form) => (
                  <option key={form._id} value={form._id}>
                    {form.name + " " + form.stream}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="session">
              <Form.Label>Session</Form.Label>
              <Form.Control
                as="select"
                value={session}
                onChange={(e) => setSession(Number(e.target.value))}
              >
                <option value="">...Select Session</option>
                {sessions.map((session) => (
                  <option key={session._id} value={session._id}>
                    {session.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="isCurrent">
              <Form.Check
                type="checkbox"
                label="Is Active"
                checked={is_active}
                onChange={(e) => setIs_active(e.target.checked)}
              ></Form.Check>
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
                  onClick={() => handleDeleteClassTeacher(classTeacher._id)}
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

export default EditClassTeacherPage;
