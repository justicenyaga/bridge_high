import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Form,
  Table,
  Card,
  ListGroup,
  Button,
} from "react-bootstrap";

import Loader from "../components/Loader";
import Message from "../components/Message";

import { loadUserDetails } from "../store/userDetails";
import { loadUserData } from "../store/userData";
import { loadStudentResults } from "../store/results";
import { loadSubjects } from "../store/subjects";
import { getSelectedT4 } from "../store/selectedT4";
import { getSelectedSubjects } from "../store/selectedSubjects";
import { loadForms } from "../store/forms";
import { loadTerms } from "../store/terms";
import { loadExams } from "../store/exams";
import { loadGradingSystems } from "../store/gradingSystems";

const StudentResultsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: user_id } = useParams();

  const reduxState = useSelector((state) => state);
  const { userInfo } = reduxState.user;
  const { userDetails } = reduxState.userDetails;
  const { userData: studentDetails } = reduxState.userData;
  const { studentResults, loading, error } = reduxState.results;
  const { list: all_forms } = reduxState.forms;
  const { list: subjects } = reduxState.subjects;
  const { list: terms } = reduxState.terms;
  const { examList: exams } = reduxState.exams;
  const { t4 } = reduxState.selectedT4.selectedT4;
  const { selectedSubjects } = reduxState.selectedSubjects;
  const { list: gradingSystems } = reduxState.gradingSystems;

  const gradingSystem = gradingSystems.length && gradingSystems[0];

  let current_term = {};
  if (terms.length > 0) {
    current_term = terms.find((term) => term.isCurrent);
  }

  let current_form_name = "";
  if (userInfo.is_student) {
    current_form_name = userDetails.currentClass.name;
  } else {
    studentDetails.user === Number(user_id) &&
      (current_form_name = studentDetails.currentClass.name);
  }

  const [term, setTerm] = useState("");
  const [form, setForm] = useState("");

  // remove results that have student as null
  const no_null_results = studentResults.filter(
    (result) => result.session !== null
  );

  // filter results to get only the results for the selected form and term
  const filtered_results =
    no_null_results.length &&
    no_null_results.filter(
      (result) => result.term === term && result.currentClass.name === form
    );

  const forms = [];

  all_forms.length &&
    all_forms.forEach((form) => {
      if (!forms.find((_form) => _form.name === form.name)) forms.push(form);
    });

  useEffect(() => {
    if (!userInfo._id) navigate("/login");

    if (userInfo.is_student) {
      if (!userDetails._id) dispatch(loadUserDetails(userInfo._id));
      dispatch(loadStudentResults(userDetails._id));

      dispatch(getSelectedT4(userDetails._id));
      userDetails.hasSelectedSubjects &&
        dispatch(getSelectedSubjects(userDetails._id));
    } else {
      if (studentDetails.user !== Number(user_id))
        dispatch(loadUserData(user_id));
      if (studentDetails._id) {
        dispatch(loadStudentResults(studentDetails._id));

        dispatch(getSelectedT4(studentDetails._id));
        studentDetails.hasSelectedSubjects &&
          dispatch(getSelectedSubjects(studentDetails._id));
      }
    }

    dispatch(loadForms());
    dispatch(loadSubjects());
    dispatch(loadTerms());
    dispatch(loadExams());
    dispatch(loadGradingSystems());
  }, [
    dispatch,
    navigate,
    userInfo._id,
    user_id,
    userDetails._id,
    studentDetails._id,
  ]);

  useEffect(() => {
    if (!form && current_form_name) setForm(current_form_name);
    if (!term && current_term.name) setTerm(current_term.name);
  }, [form, term, current_form_name, current_term.name]);

  const remark = {
    student: 3,
    form: "ONE",
    term: "three",
    comment: "",
  };

  return (
    <div>
      Name: {userInfo.is_student ? userDetails.name : studentDetails.name}
      <p>
        Reg No: {userInfo.is_student ? userDetails.code : studentDetails.code}
      </p>
      <Row className="my-3">
        <Col lg={1} md={2} xs={6} className="my-1">
          Form:
        </Col>

        <Col md={2} xs={6} className="my-1">
          <Form.Select
            size="sm"
            value={form}
            onChange={(e) => setForm(e.target.value)}
          >
            {forms.length &&
              forms.map((_form) => (
                <option key={_form._id} value={_form.name}>
                  {_form.name}
                </option>
              ))}
          </Form.Select>
        </Col>

        <Col lg={1} md={2} xs={6} className="my-1">
          Term:
        </Col>

        <Col md={2} xs={6} className="my-1">
          <Form.Select
            size="sm"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          >
            {terms.map((_term) => (
              <option key={_term._id} value={_term.name}>
                {_term.name}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col lg={6} md={4} className="text-end">
          <Button className="btn" type="button" style={{ borderRadius: "5px" }}>
            <i className="fa fa-download"></i> Download Result
          </Button>
        </Col>
      </Row>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <Table striped hover bordered responsive className="table-sm">
            <thead>
              <tr>
                <th></th>
                {subjects.map(
                  (subject) =>
                    subject.isCompulsory && (
                      <th key={subject._id}>{subject.abbr}</th>
                    )
                )}

                {subjects.map(
                  (subject) =>
                    !subject.isCompulsory &&
                    (subject.dept === "Sciences" ||
                      subject.dept === "Humanities" ||
                      subject.name === "Business Studies") && (
                      <th key={subject._id}>{subject.abbr}</th>
                    )
                )}

                <th>{t4.abbr}</th>

                {/* {userDetails.hasSelectedSubjects
                  ? subjects.map(
                      (subject) =>
                        !subject.isCompulsory &&
                        selectedSubjects._id &&
                        (selectedSubjects.s5.find(
                          (s) => s._id === subject._id
                        ) ||
                          selectedSubjects.h7.find(
                            (s) => s._id === subject._id
                          ) ||
                          selectedSubjects.t8._id === subject._id) && (
                          <th key={subject._id}>{subject.abbr}</th>
                        )
                    )
                  : subjects.map(
                      (subject) =>
                        !subject.isCompulsory &&
                        (subject.dept === "Sciences" ||
                          subject.dept === "Humanities" ||
                          subject.name === "Business Studies") && (
                          <th key={subject._id}>{subject.abbr}</th>
                        )
                    )} */}

                {/* {!userDetails.hasSelectedSubjects && <th>{t4.abbr}</th>} */}

                <th>Total</th>
                <th>Mean Grade</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam._id}>
                  <td>{exam.name}</td>

                  {subjects.map(
                    (subject) =>
                      subject.isCompulsory && (
                        <td key={subject._id}>
                          {filtered_results.length &&
                          filtered_results.find(
                            (result) => result.exam === exam.name
                          ) ? (
                            filtered_results.find(
                              (result) => result.exam === exam.name
                            ).subject_results[subject.abbr] +
                            filtered_results.find(
                              (result) => result.exam === exam.name
                            ).subject_results[subject.abbr + "_grade"]
                          ) : (
                            <FontAwesomeIcon
                              icon="fas fa-minus"
                              style={{ color: "#17a2b8" }}
                            />
                          )}
                        </td>
                      )
                  )}

                  {subjects.map(
                    (subject) =>
                      !subject.isCompulsory &&
                      (subject.dept === "Sciences" ||
                        subject.dept === "Humanities" ||
                        subject.name === "Business Studies") && (
                        <td key={subject._id}>
                          {filtered_results.length &&
                          filtered_results.find(
                            (result) => result.exam === exam.name
                          ) &&
                          filtered_results.find(
                            (result) => result.exam === exam.name
                          ).subject_results[subject.abbr] ? (
                            filtered_results.find(
                              (result) => result.exam === exam.name
                            ).subject_results[subject.abbr] +
                            filtered_results.find(
                              (result) => result.exam === exam.name
                            ).subject_results[subject.abbr + "_grade"]
                          ) : (
                            <FontAwesomeIcon
                              icon="fas fa-minus"
                              style={{ color: "#17a2b8" }}
                            />
                          )}
                        </td>
                      )
                  )}

                  <td>
                    {filtered_results.length &&
                    filtered_results.find(
                      (result) => result.exam === exam.name
                    ) &&
                    filtered_results.find((result) => result.exam === exam.name)
                      .subject_results[t4.abbr] ? (
                      filtered_results.find(
                        (result) => result.exam === exam.name
                      ).subject_results[t4.abbr] +
                      filtered_results.find(
                        (result) => result.exam === exam.name
                      ).subject_results[t4.abbr + "_grade"]
                    ) : (
                      <FontAwesomeIcon
                        icon="fas fa-minus"
                        style={{ color: "#17a2b8" }}
                      />
                    )}
                  </td>

                  {/* {userDetails.hasSelectedSubjects
                    ? subjects.map(
                        (subject) =>
                          !subject.isCompulsory &&
                          selectedSubjects._id &&
                          (selectedSubjects.s5.find(
                            (s) => s._id === subject._id
                          ) ||
                            selectedSubjects.h7.find(
                              (s) => s._id === subject._id
                            ) ||
                            selectedSubjects.t8._id === subject._id) && (
                            <td key={subject._id}>
                              {filtered_results.length &&
                              filtered_results.find(
                                (result) => result.exam === exam.name
                              )
                                ? filtered_results.find(
                                    (result) => result.exam === exam.name
                                  ).subject_results[subject.abbr]
                                : "N/A"}
                            </td>
                          )
                      )
                    : subjects.map(
                        (subject) =>
                          !subject.isCompulsory &&
                          (subject.dept === "Sciences" ||
                            subject.dept === "Humanities" ||
                            subject.name === "Business Studies") && (
                            <td key={subject._id}>
                              {filtered_results.length &&
                              filtered_results.find(
                                (result) => result.exam === exam.name
                              )
                                ? filtered_results.find(
                                    (result) => result.exam === exam.name
                                  ).subject_results[subject.abbr]
                                : "N/A"}
                            </td>
                          )
                      )} */}

                  {/* {!userDetails.hasSelectedSubjects && (
                    <td>
                      {filtered_results.length &&
                      filtered_results.find(
                        (result) => result.exam === exam.name
                      )
                        ? filtered_results.find(
                            (result) => result.exam === exam.name
                          ).subject_results[t4.abbr]
                        : "N/A"}
                    </td>
                  )} */}

                  <td>
                    {filtered_results.length &&
                    filtered_results.find(
                      (result) => result.exam === exam.name
                    ) ? (
                      filtered_results.find(
                        (result) => result.exam === exam.name
                      ).subject_results.total
                    ) : (
                      <FontAwesomeIcon
                        icon="fas fa-minus"
                        style={{ color: "#17a2b8" }}
                      />
                    )}
                  </td>

                  <td>
                    {filtered_results.length &&
                    filtered_results.find(
                      (result) => result.exam === exam.name
                    ) ? (
                      filtered_results.find(
                        (result) => result.exam === exam.name
                      ).subject_results.mean +
                      filtered_results.find(
                        (result) => result.exam === exam.name
                      ).subject_results.mean_grade
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
          <Row>
            <h2>RANKING</h2>
            <Col md={6}>
              <h4>Exam ranking</h4>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col md={4}>
                      <h5>Exam</h5>
                    </Col>
                    <Col md={4}>
                      <h5>Stream Position</h5>
                    </Col>
                    <Col md={4}>
                      <h5>Class Position</h5>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={4}>Opener</Col>
                    <Col md={4}>2/4</Col>
                    <Col md={4}>5/16</Col>
                  </Row>

                  <Row>
                    <Col md={4}>Mid-Term</Col>
                    <Col md={4}></Col>
                    <Col md={4}></Col>
                  </Row>

                  <Row>
                    <Col md={4}>CAT</Col>
                    <Col md={4}></Col>
                    <Col md={4}></Col>
                  </Row>

                  <Row>
                    <Col md={4}>End-Term</Col>
                    <Col md={4}></Col>
                    <Col md={4}></Col>
                  </Row>
                </ListGroup.Item>

                {/* {filtered_results.map((result) => (
                <ListGroup.Item key={result._id}>
                  <Row>
                    <Col md={4}>{result.exam}</Col>
                    <Col md={4}>{result.streamPos}</Col>
                    <Col md={4}>{result.classPos}</Col>
                  </Row>
                </ListGroup.Item>
              ))} */}
              </ListGroup>
            </Col>

            <Col md={3}>
              <h4>Term ranking</h4>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Stream:</Col>
                      <Col>2/4</Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Class:</Col>
                      <Col>6/16</Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>

            <Col md={3}>
              <h4>Teacher's remark</h4>
              {remark.comment}
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default StudentResultsPage;
