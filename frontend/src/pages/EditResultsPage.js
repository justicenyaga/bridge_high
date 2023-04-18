import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Row, Col, Form, Table, Button, ListGroup } from "react-bootstrap";

import Loader from "../components/Loader";
import Message from "../components/Message";

import { loadUserDetails } from "../store/userDetails";
import { loadResults } from "../store/results";
import { loadSubjects } from "../store/subjects";
import { loadSessions } from "../store/sessions";
import { loadForms } from "../store/forms";
import { loadStreams } from "../store/streams";
import { loadTerms } from "../store/terms";
import { loadExams } from "../store/exams";

const EditResultsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxStore = useSelector((state) => state);
  const { userInfo } = reduxStore.user;
  const { userDetails } = reduxStore.userDetails;
  const { results, loading, error } = reduxStore.results;
  const { list: allSubjects } = reduxStore.subjects;
  const { list: sessions } = reduxStore.sessions;
  const { list: allForms } = reduxStore.forms;
  const { list: streamsList } = reduxStore.streams;
  const { list: terms } = reduxStore.terms;
  const { examList: exams } = reduxStore.exams;

  const streams = [{ _id: "blah", name: "All Streams" }, ...streamsList];

  // remove duplicate forms
  let forms = [];

  allForms.length &&
    allForms.forEach((form) => {
      if (!forms.find((f) => f.name === form.name)) {
        forms.push(form);
      }
    });

  let teaching_subjects = [];
  if (userInfo.is_teacher) forms = [];

  if (userInfo.is_teacher) {
    const all_t_forms = userDetails.subjects_class;

    all_t_forms.forEach((t_form) => {
      if (!forms.find((f) => f.class === t_form.class)) forms.push(t_form);
    });

    teaching_subjects = userDetails.subjects;
  }

  const subjects = userInfo.is_admin ? allSubjects : teaching_subjects;

  let current_term = {};
  let current_session = {};

  if (terms.length > 0) {
    current_term = terms.find((term) => term.isCurrent);
    current_session = sessions.find((session) => session.isCurrent);
  }

  const [session, setSession] = useState(current_session.name);
  const [term, setTerm] = useState(current_term.name);
  const [form, setForm] = useState("");
  const [stream, setStream] = useState(streams[0].name);
  const [exam, setExam] = useState("");
  const [subject, setSubject] = useState("");
  const [sub_abbr, setSubAbbr] = useState("");

  const [inActive, setInActive] = useState(false);

  // remove empty arrays in the results
  const no_empty_results = results.filter((result) => result.length > 0);

  // remove results that have student as null
  const no_null_results = [];

  no_empty_results.forEach((e_result) => {
    e_result.forEach((result) => {
      if (result.student.regNo) {
        no_null_results.push(result);
      }
    });
  });

  // filter results to get only the results for the selected session, term, form, stream and exam
  const filtered_results = userInfo.is_admin
    ? no_null_results.length &&
      no_null_results.filter(
        (result) =>
          result.currentClass.name === form &&
          result.exam === exam &&
          result.term === term &&
          result.session === session &&
          (stream === "All Streams" || result.currentClass.stream === stream)
      )
    : no_null_results.length &&
      no_null_results.filter(
        (result) =>
          result.currentClass.name === form.split(" ")[0] &&
          result.exam === exam &&
          result.term === current_term.name &&
          result.session === current_session.name &&
          result.currentClass.stream === form.split(" ")[1]
      );

  useEffect(() => {
    if (userInfo.is_student) navigate("/student/results");

    if (!userInfo._id) {
      navigate("/login");
    } else {
      if (!userDetails._id) {
        dispatch(loadUserDetails(userInfo._id));
      } else {
        dispatch(loadResults());
        dispatch(loadSessions());
        dispatch(loadForms());
        dispatch(loadStreams());
        dispatch(loadSubjects());
        dispatch(loadTerms());
        dispatch(loadExams());
      }
    }
  }, [dispatch, userInfo, userDetails, navigate]);

  useEffect(() => {
    if (!form && forms.length)
      userInfo.is_admin ? setForm(forms[0].name) : setForm(forms[0].class);
    if (!exam && exams.length) setExam(exams[0].name);
    if (!stream && streams.length) setStream(streams[0].name);
    if (!term && terms.length) setTerm(terms[0].name);
    if (!session && sessions.length) setSession(sessions[0].name);
    if (!subject && subjects.length) setSubject(subjects[0].name);
    if (!sub_abbr && subjects.length) setSubAbbr(subjects[0].abbr);
  }, [
    form,
    forms,
    exam,
    exams,
    stream,
    streams,
    term,
    terms,
    session,
    sessions,
  ]);

  const marks = {};
  filtered_results.length &&
    filtered_results.map((result) => {
      marks[result.student.regNo] = result.subject_results[sub_abbr];
    });

  console.log(marks);

  return (
    <div>
      <h1>Edit Results</h1>

      <Row>
        <Col md={3}>
          <ListGroup>
            {userInfo.is_admin
              ? forms.map((_form) => (
                  <ListGroup.Item
                    key={_form._id}
                    onClick={() => setForm(_form.name)}
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        _form.name === form ? "#4ba8fa" : "white",
                    }}
                  >
                    {"FORM " + _form.name}
                  </ListGroup.Item>
                ))
              : forms.map((_form) => (
                  <ListGroup.Item
                    key={forms.indexOf(_form)}
                    onClick={() => setForm(_form.class)}
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        _form.class === form ? "#4ba8fa" : "white",
                    }}
                  >
                    {"FORM " + _form.class}
                  </ListGroup.Item>
                ))}
          </ListGroup>
        </Col>

        {
          <Col md={9}>
            <Row className="my-3">
              {userInfo.is_admin && (
                <Col md={2} xs={6} className="my-1">
                  <Form.Select
                    size="sm"
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                  >
                    {sessions.map((session) => (
                      <option key={session._id} value={session.name}>
                        {session.name}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              )}

              {userInfo.is_admin && (
                <Col md={2} xs={6} className="my-1">
                  <Form.Select
                    size="sm"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                  >
                    {terms.map((_term) => (
                      <option key={_term._id} value={_term.name}>
                        Term {_term.name}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              )}

              {userInfo.is_admin && (
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
              )}

              <Col md={2} xs={6} className="my-1">
                <Form.Select
                  size="sm"
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    setSubAbbr(
                      subjects.find((sub) => sub.name === e.target.value).abbr
                    );
                  }}
                >
                  {subjects.map((_subject) => (
                    <option key={_subject._id} value={_subject.name}>
                      {_subject.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={2} xs={6} className="my-1">
                <Form.Select
                  size="sm"
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                >
                  {exams.map((_exam) => (
                    <option key={_exam._id} value={_exam.name}>
                      {_exam.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            <Table striped hover bordered responsive className="table-sm">
              <thead>
                <tr>
                  <th>Reg No</th>
                  <th>Name</th>
                  <th>Marks</th>
                </tr>
              </thead>

              <tbody>
                {filtered_results.map((result) => (
                  <tr key={result._id}>
                    <td>{result.student.regNo}</td>
                    <td>{result.student.name}</td>
                    <td>
                      <Form.Control
                        type="text"
                        style={{ width: "50px" }}
                        value={
                          marks[result.student.regNo]
                            ? marks[result.student.regNo]
                            : 0
                        }
                        onChange={(e) => {
                          marks[result.student.regNo] = e.target.value;
                          console.log(marks);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button>
              <FontAwesomeIcon icon="fas fa-save" /> Save
            </Button>
          </Col>
        }
      </Row>
    </div>
  );
};

export default EditResultsPage;
