import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Form, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

import Message from "../components/Message";
import Loader from "../components/Loader";

import { loadClassTeacherByTeacherId } from "../store/classTeachers";
import { loadSessions } from "../store/sessions";
import { loadForms } from "../store/forms";
import { loadStreams } from "../store/streams";
import {
  getAllStudentsSelectedSubjects,
  getClassSelectedSubjects,
} from "../store/selectedSubjects";

function SubjectsSelection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxStore = useSelector((state) => state);
  const { userInfo } = reduxStore.user;
  const { userDetails } = reduxStore.userDetails;
  const { classTeacher } = reduxStore.classTeachers;
  const {
    studentsSelectedSubjects: studentList,
    loading,
    error,
  } = reduxStore.selectedSubjects;

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

  const streams = [{ _id: "blah", name: "All Streams" }, ...streamsList];

  const forms = [];
  allForms.forEach((form) => {
    if (!forms.find((f) => f.name === form.name)) forms.push(form);
  });

  const allStudents = inActive
    ? studentList
    : studentList.filter((s) => s.student.isActive);

  const underGraduates = allStudents.filter(
    (s) =>
      s.s_class.name === form &&
      (stream === "All Streams" || s.s_class.stream === stream) &&
      !s.student.isGraduated
  );

  const graduates = studentList.filter(
    (s) =>
      s.s_class.name === form &&
      (stream === "All Streams" || s.s_class.stream === stream) &&
      s.student.isGraduated &&
      s.student.graduatedAt === session
  );

  let filteredStudents = graduated ? graduates : underGraduates;

  if (userDetails.isClassTeacher && studentList.length)
    filteredStudents = studentList.filter(
      (s) =>
        s.s_class._id === classTeacher.alloted_class._id && s.student.isActive
    );

  console.log("filteredStudents", studentList);

  const handleGraduated = (value) => {
    setGraduated(value);
    setInActive(value);
    setForm("FOUR");
  };

  // const handleCreateStudent = () => {
  //   dispatch(createUser("students"));
  // };

  // const handleDeleteStudent = (studentId) => {
  //   if (window.confirm("Are you sure you want to delete this student?"))
  //     dispatch(deleteUser("students", studentId));

  //   toast.success("Student deleted successfully");
  //   window.location.reload();
  // };

  useEffect(() => {
    // if (successCreate) {
    //   const createdUser = reduxStore.userList.userCreated;
    //   navigate(`/admin/users/${createdUser.user}`);
    // }

    if (!userInfo.is_admin && !userDetails.isClassTeacher) navigate("/login");
    if (userDetails.isClassTeacher)
      dispatch(loadClassTeacherByTeacherId(userDetails._id));

    userInfo.is_admin && dispatch(getAllStudentsSelectedSubjects());
    userDetails.isClassTeacher &&
      classTeacher._id &&
      dispatch(getClassSelectedSubjects(classTeacher.alloted_class._id));
    dispatch(loadSessions());
    dispatch(loadForms());
    dispatch(loadStreams());
  }, [
    dispatch,
    userInfo,
    navigate,
    // successDelete,
    // successCreate,
    userDetails._id,
    classTeacher._id,
  ]);

  useEffect(() => {
    if (!session && sessions.length) setSession(sessions[0].name);
    if (!form && forms.length) setForm(forms[0].name);
    if (!stream && streams.length) setStream(streams[0].name);
  }, [sessions, forms, streams, session, form, stream]);

  return (
    <div>
      <h1>Subject Selections</h1>

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
              // onClick={handleCreateStudent}
            >
              <FontAwesomeIcon icon="fas fa-plus" />
              Admit Student
            </Button>
          </Col>
        </Row>
      )}

      <Row className="my-1 justify-content-end">
        <Col md={2} xs={12} className="text-end my-1">
          <Button
            className="btn btn-sm"
            style={{
              backgroundColor: "#6c757d",
              borderColor: "#6c757d",
              borderRadius: "5px",
              color: "white",
            }}
            // onClick={() => navigate( userInfo.is_admin ? `admin/classes/t4-selection/${}`)}
            onClick={() =>
              navigate(
                `/class/subject-selection/${classTeacher.alloted_class._id}`
              )
            }
          >
            <FontAwesomeIcon icon="fas fa-edit" /> Edit Entire Class
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
              <th>Reg No</th>
              <th>Name</th>
              <th>S5</th>
              <th>H6</th>
              <th>H7</th>
              <th>T8</th>
              <th>Active</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((s) => (
              <tr key={s._id}>
                <td>{filteredStudents.indexOf(s) + 1}</td>
                <td>{s.student.code}</td>
                <td>{s.student.name}</td>
                <td>
                  {s.s5.length && s.s5.length === 2 ? "Physics" : s.s5[0].name}
                </td>
                <td>
                  {s.s5.length && s.s5.length === 2 ? "Biology" : s.h7[0].name}
                </td>
                <td>
                  {s.s5.length && s.s5.length === 2
                    ? s.h7[0].name
                    : s.h7[1].name}
                </td>
                <td>{s.t8.name}</td>
                <td>
                  {s.student.isActive ? (
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
                        ? `/admin/classes/subject-selection/student/${s.student.user}`
                        : `/class/subject-selection/student/${s.student.user}`
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
                      // onClick={() => handleDeleteStudent(s._id)}
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
    </div>
  );
}

export default SubjectsSelection;
