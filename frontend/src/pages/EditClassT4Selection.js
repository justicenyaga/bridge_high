import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Form, Table, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";

import { loadClassTeacherByTeacherId } from "../store/classTeachers";
import { loadSessions } from "../store/sessions";
import { loadForms } from "../store/forms";
import { loadStreams } from "../store/streams";
import { loadSubjects } from "../store/subjects";
import {
  getAllStudentsSelectedT4,
  getClassSelectedT4,
} from "../store/selectedT4";

function EditClassT4Selection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxStore = useSelector((state) => state);
  const { userInfo } = reduxStore.user;
  const { userDetails } = reduxStore.userDetails;
  const { classTeacher } = reduxStore.classTeachers;
  const {
    studentsSelectedT4: studentList,
    loading,
    error,
  } = reduxStore.selectedT4;

  const { list: sessions } = reduxStore.sessions;
  const { list: allForms } = reduxStore.forms;
  const { list: streamsList } = reduxStore.streams;
  const { list: subjects } = reduxStore.subjects;

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

  const t4Subjects =
    subjects.length &&
    subjects.filter(
      (subject) =>
        subject.dept === "Technicals" && subject.name !== "Business Studies"
    );

  const handleGraduated = (value) => {
    setGraduated(value);
    setInActive(value);
    setForm("FOUR");
  };

  useEffect(() => {
    if (!userInfo.is_admin && !userDetails.isClassTeacher) navigate("/login");
    if (userDetails.isClassTeacher)
      dispatch(loadClassTeacherByTeacherId(userDetails._id));

    userInfo.is_admin && dispatch(getAllStudentsSelectedT4());
    userDetails.isClassTeacher &&
      classTeacher._id &&
      dispatch(getClassSelectedT4(classTeacher.alloted_class._id));
    dispatch(loadSessions());
    dispatch(loadForms());
    dispatch(loadStreams());
  }, [dispatch, userInfo, navigate, userDetails._id, classTeacher._id]);

  useEffect(() => {
    if (!session && sessions.length) setSession(sessions[0].name);
    if (!form && forms.length) setForm(forms[0].name);
    if (!stream && streams.length) setStream(streams[0].name);
  }, [sessions, forms, streams, session, form, stream]);

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={8} lg={6}>
          {userInfo.is_admin ? (
            <h4 className="text-center">
              Edit {`${form} ${stream}`} T4 Selection
            </h4>
          ) : (
            <h4 className="text-center">
              Edit {classTeacher._id && classTeacher.alloted_class.name} T4
              Selection
            </h4>
          )}

          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <div>
              <Table
                striped
                hover
                bordered
                responsive
                className="table-sm my-3"
              >
                <thead>
                  <tr>
                    <th></th>
                    <th>Reg No</th>
                    <th>Name</th>

                    <th>Selected T4</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map((s) => (
                    <tr key={s._id}>
                      <td>{filteredStudents.indexOf(s) + 1}</td>
                      <td>{s.student.code}</td>
                      <td>{s.student.name}</td>
                      <td>
                        <Form.Control
                          as="select"
                          style={{ width: "200px" }}
                          value={s.t4.name}
                        >
                          <option value="">...Select T4</option>
                          {t4Subjects.map((subject) => (
                            <option key={subject._id} value={subject.name}>
                              {subject.name}
                            </option>
                          ))}
                        </Form.Control>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="text-start">
                <Button
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
              </div>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default EditClassT4Selection;
