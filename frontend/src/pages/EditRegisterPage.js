import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Row, Col, Form, Table, Button, ListGroup } from "react-bootstrap";

import Loader from "../components/Loader";
import Message from "../components/Message";

import { loadUserDetails } from "../store/userDetails";
import { loadResults } from "../store/results";
import { loadSessions } from "../store/sessions";
import { loadForms } from "../store/forms";
import { loadStreams } from "../store/streams";
import { loadTerms } from "../store/terms";

function EditRegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxStore = useSelector((state) => state);
  const { userInfo } = reduxStore.user;
  const { userDetails } = reduxStore.userDetails;
  const { results, loading, error } = reduxStore.results;
  const { list: allSubjects } = reduxStore.subjects;
  const { list: sessions } = reduxStore.sessions;
  const { list: allForms } = reduxStore.forms;
  const { list: streams } = reduxStore.streams;
  const { list: terms } = reduxStore.terms;

  // temporary weeks data
  const weeks = [
    { _id: 1, name: "ONE" },
    { _id: 2, name: "TW0" },
    { _id: 3, name: "THREE" },
    { _id: 4, name: "FOUR" },
    { _id: 5, name: "FIVE" },
    { _id: 6, name: "SIX" },
    { _id: 7, name: "SEVEN" },
    { _id: 8, name: "EIGHT" },
    { _id: 9, name: "NINE" },
    { _id: 10, name: "TEN" },
    { _id: 11, name: "ELEVEN" },
    { _id: 12, name: "TWELVE" },
  ];

  // remove duplicate forms
  let forms = [];

  allForms.length &&
    allForms.forEach((form) => {
      if (!forms.find((f) => f.name === form.name)) {
        forms.push(form);
      }
    });

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

  const [week, setWeek] = useState(weeks[10].name);

  useEffect(() => {
    if (userInfo.is_student) navigate("/student/registers");

    if (!userInfo._id) {
      navigate("/login");
    } else {
      if (!userDetails._id) {
        dispatch(loadUserDetails(userInfo._id));
      } else {
        dispatch(loadResults());
        dispatch(loadSessions());
        dispatch(loadForms());
        dispatch(loadTerms());
        dispatch(loadStreams());
      }
    }
  }, [dispatch, userInfo, userDetails, navigate]);

  useEffect(() => {
    if (!form && forms.length) setForm(forms[0].name);
    if (!term && terms.length) setTerm(terms[0].name);
    if (!session && sessions.length) setSession(sessions[0].name);
    if (!stream && streams.length) setStream(streams[0].name);
    if (!week && weeks.length) setWeek(weeks[0].name);
  }, [
    form,
    forms,
    term,
    terms,
    session,
    sessions,
    stream,
    streams,
    week,
    weeks,
  ]);

  console.log(form);

  return (
    <div>
      <Row>
        <Col className="text-start">
          <h1>Edit Register</h1>
        </Col>

        <Col className="text-end">Class: FOUR {stream}</Col>
      </Row>

      <Row>
        <Col md={2} xs={6} className="mb-3">
          <Form.Select
            size="sm"
            value={week}
            onChange={(e) => setWeek(e.target.value)}
          >
            {weeks.map((week) => (
              <option key={week._id} value={week.name}>
                Week {week.name}
              </option>
            ))}
          </Form.Select>
        </Col>

        {userInfo.is_admin && (
          <Col md={10}>
            <Row>
              <Col md={3} xs={6} className="mb-3">
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

              <Col md={3} xs={6} className="mb-3">
                <Form.Select
                  size="sm"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                >
                  {terms.map((term) => (
                    <option key={term._id} value={term.name}>
                      Term {term.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={3} xs={6} className="mb-3">
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

              <Col md={3} xs={6} className="mb-3">
                <Form.Select
                  size="sm"
                  value={stream}
                  onChange={(e) => setStream(e.target.value)}
                >
                  {streams.map((stream) => (
                    <option key={stream._id} value={stream.name}>
                      {stream.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          </Col>
        )}
      </Row>

      <Table striped bordered hover responsive className="table-sm">
        <thead>
          <tr>
            <th>Reg no</th>
            <th>Name</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>0001</td>
            <td>Jared Kiama</td>
            <td>
              <Form.Check type="checkbox" checked />
            </td>
            <td>
              <Form.Check type="checkbox" checked />
            </td>
            <td>
              <Form.Check type="checkbox" checked />
            </td>
            <td>
              <Form.Check type="checkbox" checked />
            </td>
            <td>
              <Form.Check type="checkbox" checked />
            </td>
          </tr>

          <tr>
            <td>0002</td>
            <td>Kelvin Mwirigi</td>
            <td>
              <Form.Check type="checkbox" checked />
            </td>
            <td>
              <Form.Check type="checkbox" checked />
            </td>
            <td>
              <Form.Check type="checkbox" checked />
            </td>
            <td>
              <Form.Check type="checkbox" checked />
            </td>
            <td>
              <Form.Check type="checkbox" checked />
            </td>
          </tr>

          <tr>
            <td>0008</td>
            <td>Dismus Mwangi</td>
            <td>
              <Form.Check type="checkbox" />
            </td>
            <td>
              <Form.Check type="checkbox" />
            </td>
            <td>
              <Form.Check type="checkbox" />
            </td>
            <td>
              <Form.Check type="checkbox" />
            </td>
            <td>
              <Form.Check type="checkbox" />
            </td>
          </tr>

          <tr>
            <td>0010</td>
            <td>Moffat Kinyanjui</td>
            <td>
              <Form.Check type="checkbox" checked />
            </td>
            <td>
              <Form.Check type="checkbox" checked />
            </td>
            <td>
              <Form.Check type="checkbox" checked />
            </td>
            <td>
              <Form.Check type="checkbox" checked />
            </td>
            <td>
              <Form.Check type="checkbox" checked />
            </td>
          </tr>
        </tbody>
      </Table>

      <Button variant="primary" type="submit" className="mt-3">
        <FontAwesomeIcon icon="fas fa-save" /> Save
      </Button>
    </div>
  );
}

export default EditRegisterPage;
