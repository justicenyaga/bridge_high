import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Form, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

import Message from "../components/Message";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";

import { loadUsers, createUser, deleteUser } from "../store/userList";
import { loadClassTeacherByTeacherId } from "../store/classTeachers";
import { loadSessions } from "../store/sessions";
import { loadForms } from "../store/forms";
import { loadStreams } from "../store/streams";

import { paginate } from "../utils/paginate";

const StudentListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxStore = useSelector((state) => state);
  const { userInfo } = reduxStore.user;
  const { userDetails } = reduxStore.userDetails;
  const { studentList, loading, error, successDelete, successCreate } =
    reduxStore.userList;
  const { classTeacher } = reduxStore.classTeachers;

  const { list: sessions } = reduxStore.sessions;
  const { list: allForms } = reduxStore.forms;
  const { list: streamsList } = reduxStore.streams;

  const current_session =
    sessions.length && sessions.find((session) => session.isCurrent);

  const [session, setSession] = useState(current_session.name);
  const [form, setForm] = useState("");
  const [stream, setStream] = useState("");
  const [inActive, setInActive] = useState(false);
  const [graduated, setGraduated] = useState(false);

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const streams = [{ _id: "blah", name: "All Streams" }, ...streamsList];

  const forms = [];
  allForms.forEach((form) => {
    if (!forms.find((f) => f.name === form.name)) forms.push(form);
  });

  const allStudents = inActive
    ? studentList
    : studentList.filter((s) => s.isActive);

  const underGraduates = allStudents.filter(
    (student) =>
      student.currentClass.name === form &&
      (stream === "All Streams" || student.currentClass.stream === stream) &&
      !student.isGraduated
  );

  const graduates = studentList.filter(
    (student) =>
      student.currentClass.name === form &&
      (stream === "All Streams" || student.currentClass.stream === stream) &&
      student.isGraduated &&
      student.graduatedAt === session
  );

  let filtered_students = graduated ? graduates : underGraduates;

  if (userDetails.isClassTeacher && studentList.length)
    filtered_students = studentList.filter(
      (student) =>
        student.currentClass._id === classTeacher.alloted_class._id &&
        student.isActive
    );

  filtered_students.length <= pageSize && currentPage > 1 && setCurrentPage(1);
  const pagedStudents = paginate(filtered_students, currentPage, pageSize);

  const handleGraduated = (value) => {
    setGraduated(value);
    setInActive(value);
    setForm("FOUR");
  };

  useEffect(() => {
    if (successCreate) {
      const createdUser = reduxStore.userList.userCreated;
      navigate(`/admin/users/${createdUser.user}`);
    }

    if (!userInfo.is_admin && !userDetails.isClassTeacher) navigate("/login");
    if (userDetails.isClassTeacher)
      dispatch(loadClassTeacherByTeacherId(userDetails._id));

    dispatch(loadUsers("students"));
    dispatch(loadSessions());
    dispatch(loadForms());
    dispatch(loadStreams());
  }, [
    dispatch,
    userInfo,
    navigate,
    successDelete,
    successCreate,
    userDetails._id,
  ]);

  useEffect(() => {
    if (!session && sessions.length) setSession(sessions[0].name);
    if (!form && forms.length) setForm(forms[0].name);
    if (!stream && streams.length) setStream(streams[0].name);
  }, [sessions, forms, streams, session, form, stream]);

  const handleCreateStudent = () => {
    dispatch(createUser("students"));
  };

  const handleDeleteStudent = (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?"))
      dispatch(deleteUser("students", studentId));

    toast.success("Student deleted successfully");
    window.location.reload();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h1>STUDENTS</h1>

      {userDetails.isClassTeacher ? (
        <h3>{classTeacher._id && classTeacher.alloted_class.name}</h3>
      ) : (
        <Row className="my-3">
          <Col md={2} xs={6} className="my-1">
            <Form.Select
              size="sm"
              value={form}
              onChange={(e) => setForm(e.target.value)}
            >
              {forms.map((_form) => (
                <option key={_form._id} value={_form.name}>
                  Form {_form.name}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={2} xs={6} className="my-1">
            <Form.Select
              size="sm"
              value={stream}
              onChange={(e) => setStream(e.target.value)}
            >
              {streams.map((_stream) => (
                <option key={_stream._id} value={_stream.name}>
                  {_stream.name}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={2} xs={6} className="my-1">
            <Form.Check
              type="checkbox"
              label="Include Inactive"
              value={inActive}
              onChange={(e) => setInActive(e.target.checked)}
            />
          </Col>

          <Col md={2} xs={6} className="my-1">
            <Form.Check
              type="checkbox"
              label="Graduated Students"
              value={graduated}
              onChange={(e) => handleGraduated(e.target.checked)}
            />
          </Col>

          <Col md={2} xs={6} className="my-1">
            <Form.Select
              size="sm"
              value={session}
              onChange={(e) => setSession(e.target.value)}
            >
              {sessions.map((_session) => (
                <option key={_session._id} value={_session.name}>
                  {_session.name}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={2} xs={12} className="text-end my-1">
            <Button
              className="btn btn-sm"
              style={{
                backgroundColor: "#4CAF50",
                border: "2px solid #4CAF50",
                borderRadius: "5px",
                color: "white",
              }}
              onClick={handleCreateStudent}
            >
              <FontAwesomeIcon icon="fas fa-plus" />
              Admit Student
            </Button>
          </Col>
        </Row>
      )}

      <div style={{ marginBottom: "1rem" }}>
        {filtered_students.length} students found
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
              <th>Reg No</th>
              <th>Name</th>
              <th>Form</th>
              <th>Stream</th>
              <th>Date of Admission</th>
              <th>Active</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {pagedStudents.map((student) => (
              <tr key={student._id}>
                <td>{filtered_students.indexOf(student) + 1}</td>
                <td>{student.code}</td>
                <td>{student.name}</td>
                <td>{student.currentClass.name}</td>
                <td>{student.currentClass.stream}</td>
                <td>{student.doa}</td>
                <td>
                  {student.isActive ? (
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
                    to={
                      userInfo.is_admin
                        ? `/admin/users/${student.user}`
                        : `/class/students/${student.user}`
                    }
                  >
                    <Button variant="light" className="btn btn-sm">
                      <FontAwesomeIcon icon="fas fa-edit" />
                    </Button>
                  </LinkContainer>{" "}
                  {userInfo.is_admin && (
                    <Button
                      variant="danger"
                      className="btn btn-sm"
                      onClick={() => handleDeleteStudent(student._id)}
                    >
                      <FontAwesomeIcon icon="fas fa-trash" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Pagination
          itemsCount={filtered_students.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>

      {filtered_students.length > pageSize && (
        <div>
          <Button
            className="btn btn-sm"
            type="button"
            style={{ borderRadius: "5px" }}
            onClick={() => setPageSize(filtered_students.length)}
          >
            Show all {filtered_students.length} students
          </Button>
        </div>
      )}

      {pagedStudents.length > 10 && (
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

export default StudentListPage;
