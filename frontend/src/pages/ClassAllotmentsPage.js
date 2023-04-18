import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

import Loader from "../components/Loader";

import { loadUsers } from "../store/userList";

const ClassAllotmentsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxStore = useSelector((state) => state);
  const { teacherList, loading, error } = reduxStore.userList;
  const { userInfo } = reduxStore.user;

  const activeTeachers = teacherList.filter((teacher) => teacher.isActive);

  useEffect(() => {
    if (!userInfo.is_admin) navigate("/");

    dispatch(loadUsers("teachers"));
  }, [dispatch, userInfo, navigate]);

  return (
    <div>
      <h1>Subjects-Classes Allotted</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        toast.error(error)
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th></th>
              <th>Code</th>
              <th>Name</th>
              <th>Class {"->"} Subject</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {activeTeachers.map((teacher) => (
              <tr key={teacher._id}>
                <td>{activeTeachers.indexOf(teacher) + 1}</td>
                <td>{teacher.code}</td>
                <td>{teacher.name}</td>
                <td>
                  {teacher.subjects_class.length &&
                    teacher.subjects_class.map((subject_class) => (
                      <div key={subject_class._id}>
                        {subject_class.class} {"->"} {subject_class.subject}
                      </div>
                    ))}
                </td>

                <td>
                  <LinkContainer
                    to={`/admin/teachers/class-allotments/${teacher.user}`}
                  >
                    <Button variant="light" className="btn btn-sm">
                      <FontAwesomeIcon icon="fas fa-edit" />
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ClassAllotmentsPage;
