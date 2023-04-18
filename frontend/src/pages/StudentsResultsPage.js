import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Row, Col, Form, Table, Button } from "react-bootstrap";

import Loader from "../components/Loader";
import Message from "../components/Message";
import Pagination from "../components/Pagination";

import { loadUserDetails } from "../store/userDetails";
import { loadResults } from "../store/results";
import { loadSubjects } from "../store/subjects";
import { loadSessions } from "../store/sessions";
import { loadForms } from "../store/forms";
import { loadStreams } from "../store/streams";
import { loadTerms } from "../store/terms";
import { loadExams } from "../store/exams";

import { paginate } from "../utils/paginate";

const StudentsResultsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxStore = useSelector((state) => state);
  const { userInfo } = reduxStore.user;
  const { userDetails } = reduxStore.userDetails;
  const { results, loading, error } = reduxStore.results;
  const { list: subjects } = reduxStore.subjects;
  const { list: sessions } = reduxStore.sessions;
  const { list: allForms } = reduxStore.forms;
  const { list: streamsList } = reduxStore.streams;
  const { list: terms } = reduxStore.terms;
  const { examList: exams } = reduxStore.exams;

  const streams = [{ _id: "blah", name: "All Streams" }, ...streamsList];

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

  const [session, setSession] = useState(current_session.name);
  const [term, setTerm] = useState(current_term.name);
  const [form, setForm] = useState("");
  const [stream, setStream] = useState(streams[0].name);
  const [exam, setExam] = useState("");

  const [inActive, setInActive] = useState(false);

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

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
  const filtered_results =
    no_null_results.length &&
    no_null_results.filter(
      (result) =>
        result.currentClass.name === form &&
        result.exam === exam &&
        result.term === term &&
        result.session === session &&
        (stream === "All Streams" || result.currentClass.stream === stream)
    );

  const sorted_results =
    filtered_results &&
    filtered_results.sort((a, b) => {
      if (a.subject_results.mean < b.subject_results.mean) {
        return 1;
      }
      if (a.subject_results.mean > b.subject_results.mean) {
        return -1;
      }
      return 0;
    });

  sorted_results.length <= pageSize && currentPage > 1 && setCurrentPage(1);

  const paged_results = paginate(sorted_results, currentPage, pageSize);

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
    if (!form && forms.length) setForm(forms[0].name);
    if (!exam && exams.length) setExam(exams[0].name);
    if (!stream && streams.length) setStream(streams[0].name);
    if (!term && terms.length) setTerm(terms[0].name);
    if (!session && sessions.length) setSession(sessions[0].name);
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <Row>
        <Col>
          <h1>Results</h1>
        </Col>

        <Col className="text-end">
          <Button className="btn" type="button" style={{ borderRadius: "5px" }}>
            <i className="fa fa-download"></i> Download
          </Button>
        </Col>
      </Row>
      <Row className="my-3">
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

        <Col md={2} xs={6} className="my-1">
          <Form.Check
            type="checkbox"
            label="Inactive students"
            value={inActive}
            onChange={(e) => setInActive(e.target.value)}
          />
        </Col>
      </Row>

      {/* div with a margin bottom of 3 */}

      <div style={{ marginBottom: "1rem" }}>
        {sorted_results.length} students found
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : paged_results.length ? (
        <Table striped hover bordered responsive className="table-sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Reg No</th>
              <th>Name</th>
              {subjects.map((subject) => (
                <th key={subject._id}>{subject.abbr}</th>
              ))}
              <th>Total</th>
              <th>Mean Grade</th>
            </tr>
          </thead>
          <tbody>
            {paged_results.length &&
              paged_results.map((result) => (
                <tr key={result.student.regNo}>
                  <td>{sorted_results.indexOf(result) + 1}</td>

                  <td>{result.student.regNo}</td>
                  <td>
                    <Link to={`/student/${result.student.user_id}/results`}>
                      {result.student.name}
                    </Link>
                  </td>

                  {subjects.map((subject) => (
                    <td key={subject._id}>
                      {result.subject_results[subject.abbr] ? (
                        result.subject_results[subject.abbr] +
                        result.subject_results[subject.abbr + "_grade"]
                      ) : (
                        <FontAwesomeIcon
                          icon="fas fa-minus"
                          style={{ color: "#17a2b8" }}
                        />
                      )}
                    </td>
                  ))}

                  <td>
                    {result.subject_results.total ? (
                      result.subject_results.total
                    ) : (
                      <FontAwesomeIcon
                        icon="fas fa-minus"
                        style={{ color: "#17a2b8" }}
                      />
                    )}
                  </td>
                  <td>
                    {result.subject_results.mean ? (
                      result.subject_results.mean +
                      result.subject_results.mean_grade
                    ) : (
                      <FontAwesomeIcon
                        icon="fas fa-minus"
                        style={{ color: "#17a2b8" }}
                      />
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      ) : (
        <Message variant="info">Nothing to display</Message>
      )}

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Pagination
          itemsCount={sorted_results.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>

      {sorted_results.length > pageSize && (
        <div>
          <Button
            className="btn btn-sm"
            type="button"
            style={{ borderRadius: "5px" }}
            onClick={() => setPageSize(sorted_results.length)}
          >
            Show all {sorted_results.length} students
          </Button>
        </div>
      )}

      {paged_results.length > 10 && (
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

export default StudentsResultsPage;
