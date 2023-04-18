import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

import Loader from "../components/Loader";

import { loadUsers } from "../store/userList";

const SubjectsAllotmentsPage = () => {
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
      <h1>Subjects Allotted</h1>

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
              <th>Subject 1</th>
              <th>Subject 2</th>
              <th>Subject 3</th>
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
                  {teacher.subjects[0] ? (
                    teacher.subjects[0].name
                  ) : (
                    <FontAwesomeIcon
                      icon="fas fa-minus"
                      style={{ color: "#17a2b8" }}
                    />
                  )}
                </td>
                <td>
                  {teacher.subjects[1] ? (
                    teacher.subjects[1].name
                  ) : (
                    <FontAwesomeIcon
                      icon="fas fa-minus"
                      style={{ color: "#17a2b8" }}
                    />
                  )}
                </td>
                <td>
                  {teacher.subjects[2] ? (
                    teacher.subjects[2].name
                  ) : (
                    <FontAwesomeIcon
                      icon="fas fa-minus"
                      style={{ color: "#17a2b8" }}
                    />
                  )}
                </td>

                <td>
                  <LinkContainer
                    to={`/admin/teachers/subject-allotments/${teacher.user}`}
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

export default SubjectsAllotmentsPage;
