import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Form, Table, Button, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Message from "../components/Message";
import Loader from "../components/Loader";

import { loadUserData } from "../store/userData";
import { loadSubjects } from "../store/subjects";

function EditClassAllotmentsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: userId } = useParams();

  const reduxState = useSelector((state) => state);
  const { userInfo } = reduxState.user;
  const { userData: userDetails, loading, error } = reduxState.userData;
  const { list: subjects } = reduxState.subjects;
  const { list: allForms } = reduxState.forms;
  const { list: streams } = reduxState.streams;

  const forms = [];
  allForms.forEach((form) => {
    if (!forms.find((f) => f.name === form.name)) forms.push(form);
  });

  const [name, setName] = useState("");
  const [subject1, setSubject1] = useState("");
  const [class1, setClass1] = useState("");
  const [subject2, setSubject2] = useState("");
  const [class2, setClass2] = useState("");
  const [subject3, setSubject3] = useState("");
  const [class3, setClass3] = useState("");
  const [subject4, setSubject4] = useState("");
  const [class4, setClass4] = useState("");
  const [subject5, setSubject5] = useState("");
  const [class5, setClass5] = useState("");
  const [subject6, setSubject6] = useState("");
  const [class6, setClass6] = useState("");
  const [subject7, setSubject7] = useState("");
  const [class7, setClass7] = useState("");
  const [subject8, setSubject8] = useState("");
  const [class8, setClass8] = useState("");
  const [subject9, setSubject9] = useState("");
  const [class9, setClass9] = useState("");
  const [subject10, setSubject10] = useState("");
  const [class10, setClass10] = useState("");

  useEffect(() => {
    if (!userInfo.is_admin) {
      navigate("/login");
    } else {
      // if (successCreate) dispatch(removeCreatedUser());

      if (userDetails.user !== Number(userId)) {
        dispatch(loadUserData(userId));
      } else {
        setName(userDetails.name);
        if (userDetails.subjects.length) {
          const subjectsCount = userDetails.subjects_class.length;

          for (let i = 0; i < subjectsCount; i++) {
            if (i === 0) {
              setSubject1(userDetails.subjects_class[i].subject);
              setClass1(userDetails.subjects_class[i].class);
            } else if (i === 1) {
              setSubject2(userDetails.subjects_class[i].subject);
              setClass2(userDetails.subjects_class[i].class);
            } else if (i === 2) {
              setSubject3(userDetails.subjects_class[i].subject);
              setClass3(userDetails.subjects_class[i].class);
            } else if (i === 3) {
              setSubject4(userDetails.subjects_class[i].subject);
              setClass4(userDetails.subjects_class[i].class);
            } else if (i === 4) {
              setSubject5(userDetails.subjects_class[i].subject);
              setClass5(userDetails.subjects_class[i].class);
            } else if (i === 5) {
              setSubject6(userDetails.subjects_class[i].subject);
              setClass6(userDetails.subjects_class[i].class);
            } else if (i === 6) {
              setSubject7(userDetails.subjects_class[i].subject);
              setClass7(userDetails.subjects_class[i].class);
            } else if (i === 7) {
              setSubject8(userDetails.subjects_class[i].subject);
              setClass8(userDetails.subjects_class[i].class);
            } else if (i === 8) {
              setSubject9(userDetails.subjects_class[i].subject);
              setClass9(userDetails.subjects_class[i].class);
            } else if (i === 9) {
              setSubject10(userDetails.subjects_class[i].subject);
              setClass10(userDetails.subjects_class[i].class);
            }
          }
        }
      }

      dispatch(loadSubjects());
    }
  }, [userDetails, dispatch, userId, userInfo, navigate, userDetails._id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // dispatch(updateUser(role, user));

    // toast.success("User updated successfully");

    // setTimeout(() => {
    //   window.location.reload();

    navigate(-1);
    // }, 200);
  };

  return (
    <Container>
      <Row>
        <Col>
          <Button variant="light" onClick={() => navigate(-1)} className="my-3">
            <FontAwesomeIcon icon="fas fa-arrow-left" />
          </Button>
        </Col>

        <Col className="text-center">
          <h1>Edit Subjects-Classes Allottment</h1>
        </Col>

        <Col className="text-end">
          Name: {userDetails.name}
          <br />
          Code: {userDetails.code}
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col xs={12} md={8} lg={6}>
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
                    <th>Class</th>
                    <th>Stream</th>
                    <th>Subject</th>
                  </tr>
                </thead>

                <tbody>
                  {userDetails._id &&
                    userDetails.subjects_class.length &&
                    userDetails.subjects_class.map((subject_class, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <Form.Control
                            as="select"
                            value={subject_class.class.split(" ")[0]}
                            // onChange={(e) => setClass1(e.target.value)}
                          >
                            <option value="">Select Class</option>
                            {forms.map((form) => (
                              <option key={form._id} value={form.name}>
                                {form.name}
                              </option>
                            ))}
                          </Form.Control>
                        </td>
                        <td>
                          <Form.Control
                            as="select"
                            value={subject_class.class.split(" ")[1]}
                            // onChange={(e) => setClass1(e.target.value)}
                          >
                            <option value="">Select Stream</option>
                            {streams.map((stream) => (
                              <option key={stream._id} value={stream.name}>
                                {stream.name}
                              </option>
                            ))}
                          </Form.Control>
                        </td>

                        <td>
                          <Form.Control
                            as="select"
                            value={subject_class.subject}
                            // onChange={(e) => setSubject1(e.target.value)}
                          >
                            <option value="">Select Subject</option>
                            {subjects.map((subject) => (
                              <option key={subject._id} value={subject.name}>
                                {subject.name}
                              </option>
                            ))}
                          </Form.Control>
                        </td>
                      </tr>
                    ))}

                  {/* add new empty fields to get to 10 */}
                  {userDetails._id &&
                    userDetails.subjects_class.length < 10 &&
                    [...Array(10 - userDetails.subjects_class.length)].map(
                      (x, index) => (
                        <tr key={index}>
                          <td>
                            {userDetails.subjects_class.length + index + 1}
                          </td>

                          <td>
                            <Form.Control
                              as="select"
                              // value={subject_class.class.split(" ")[0]}
                              // onChange={(e) => setClass1(e.target.value)}
                            >
                              <option value="">Select Class</option>
                              {forms.map((form) => (
                                <option key={form._id} value={form.name}>
                                  {form.name}
                                </option>
                              ))}
                            </Form.Control>
                          </td>

                          <td>
                            <Form.Control
                              as="select"
                              // value={subject_class.class.split(" ")[1]}
                              // onChange={(e) => setClass1(e.target.value)}
                            >
                              <option value="">Select Stream</option>
                              {streams.map((stream) => (
                                <option key={stream._id} value={stream.name}>
                                  {stream.name}
                                </option>
                              ))}
                            </Form.Control>
                          </td>

                          <td>
                            <Form.Control
                              as="select"
                              // value={subject_class.subject}
                              // onChange={(e) => setSubject1(e.target.value)}
                            >
                              <option value="">Select Subject</option>
                              {subjects.map((subject) => (
                                <option key={subject._id} value={subject.name}>
                                  {subject.name}
                                </option>
                              ))}
                            </Form.Control>
                          </td>
                        </tr>
                      )
                    )}
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

export default EditClassAllotmentsPage;
