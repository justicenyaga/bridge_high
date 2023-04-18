import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Row, Col, Form, Table, Button } from "react-bootstrap";

import Loader from "../components/Loader";
import Message from "../components/Message";
import RegisterIcon from "../components/RegisterIcon";

import { loadUserDetails } from "../store/userDetails";
import { loadClassRegisters } from "../store/registers";
import { loadSessions } from "../store/sessions";
import { loadForms } from "../store/forms";
import { loadStreams } from "../store/streams";
import { loadTerms } from "../store/terms";

function ClassRegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxStore = useSelector((state) => state);
  const { userInfo } = reduxStore.user;
  const { userDetails } = reduxStore.userDetails;
  const { registers, loading, error } = reduxStore.registers;
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

  // remove duplicate form names
  const forms = [];

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

  const [session, setSession] = useState(current_session);
  const [term, setTerm] = useState(current_term.name);
  const [form, setForm] = useState("");
  const [stream, setStream] = useState(streams[0].name);
  const [week, setWeek] = useState(weeks[10].name);

  useEffect(() => {
    if (userInfo.is_student) navigate("/student/results");

    if (!userInfo._id) {
      navigate("/login");
    } else {
      if (!userDetails._id) {
        dispatch(loadUserDetails(userInfo._id));
      } else {
        dispatch(loadClassRegisters(session._id));
        dispatch(loadSessions());
        dispatch(loadForms());
        dispatch(loadStreams());
        dispatch(loadTerms());
      }
    }
  }, [dispatch, userInfo, userDetails, navigate, session]);

  useEffect(() => {
    if (!form && forms.length) setForm(forms[0].name);
    if (!stream && streams.length) setStream(streams[0].name);
    if (!term && terms.length) setTerm(terms[0].name);
    if (!session && sessions.length) setSession(sessions[0]);
    if (!week && weeks.length) setWeek(weeks[10].name);
  }, [
    form,
    forms,
    stream,
    streams,
    term,
    terms,
    session,
    sessions,
    week,
    weeks,
  ]);

  const filtered_registers = registers.filter(
    (register) =>
      register.term.name === term &&
      register.current_class.name === form &&
      register.current_class.stream === stream
  );

  console.log(filtered_registers);

  return (
    <div>
      <Row>
        <Col>
          <h1>Class registers</h1>
        </Col>

        <Col className="text-end">
          <Button className="btn" type="button" style={{ borderRadius: "5px" }}>
            <i className="fa fa-download"></i> Download
          </Button>
        </Col>
      </Row>

      <Row className="my-3 justify-content-center">
        <Col md={2} xs={6} className="my-1">
          <Form.Select
            size="sm"
            value={session.name}
            onChange={(e) =>
              setSession(sessions.find((s) => s.name === e.target.value))
            }
          >
            {sessions.map((_session) => (
              <option key={_session._id} value={_session.name}>
                {_session.name}
              </option>
            ))}
          </Form.Select>
        </Col>

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

        <Col md={2} xs={6} className="my-1">
          <Form.Select
            size="sm"
            value={week}
            onChange={(e) => setWeek(e.target.value)}
          >
            {weeks.map((_week) => (
              <option key={_week._id} value={_week.name}>
                Week {_week.name}
              </option>
            ))}
          </Form.Select>
        </Col>

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
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>Reg No</th>
              <th>Name</th>
              <th>Monday</th>
              <th>Tuesday</th>
              <th>Wednesday</th>
              <th>Thursday</th>
              <th>Friday</th>
            </tr>
          </thead>
          <tbody>
            {/* dummy table body */}
            <tr>
              <td>0001</td>
              <td>
                <Link to={`/student/14/register`}>Jared Kiama</Link>
              </td>
              <td>
                <RegisterIcon value={true} />
              </td>
              <td>
                <RegisterIcon value={true} />
              </td>
              <td>
                <RegisterIcon value={true} />
              </td>
              <td>
                <RegisterIcon value={true} />
              </td>
              <td>
                <RegisterIcon value={true} />
              </td>
            </tr>

            <tr>
              <td>0002</td>
              <td>
                <Link to={`/student/14/register`}>Kelvin Mwirigi</Link>
              </td>
              <td>
                <RegisterIcon value={true} />
              </td>
              <td>
                <RegisterIcon value={true} />
              </td>
              <td>
                <RegisterIcon value={true} />
              </td>
              <td>
                <RegisterIcon value={true} />
              </td>
              <td>
                <RegisterIcon value={true} />
              </td>
            </tr>

            <tr>
              <td>0008</td>
              <td>
                <Link to={`/student/14/register`}>Dismus Mwangi</Link>
              </td>
              <td>
                <RegisterIcon value={false} />
              </td>
              <td>
                <RegisterIcon value={false} />
              </td>
              <td>
                <RegisterIcon value={false} />
              </td>
              <td>
                <RegisterIcon value={false} />
              </td>
              <td>
                <RegisterIcon value={false} />
              </td>
            </tr>

            <tr>
              <td>0010</td>
              <td>
                <Link to={`/student/14/register`}>Moffat Kinyanjui</Link>
              </td>
              <td>
                <RegisterIcon value={true} />
              </td>
              <td>
                <RegisterIcon value={true} />
              </td>
              <td>
                <RegisterIcon value={true} />
              </td>
              <td>
                <RegisterIcon value={true} />
              </td>
              <td>
                <RegisterIcon value={true} />
              </td>
            </tr>
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default ClassRegisterPage;
