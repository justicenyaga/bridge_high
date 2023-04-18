import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Nav, Navbar, NavDropdown, NavLink } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { logout } from "../store/user";

const Header = () => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);
  const { userDetails } = useSelector((state) => state.userDetails);

  const handleLogout = () => {
    dispatch(logout());
  };

  return userInfo._id ? (
    <header>
      <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <img src="/images/logo.png" alt="BRIDGE SCHOOL" height={30} />
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {(userInfo.is_student || userInfo.is_teacher) &&
                !userDetails.isClassTeacher &&
                !userInfo.is_admin && (
                  <LinkContainer
                    to={
                      userInfo.is_student ? "/student/register" : "/registers"
                    }
                  >
                    <Nav.Link>
                      <FontAwesomeIcon icon="	far fa-calendar-check" /> Register
                    </Nav.Link>
                  </LinkContainer>
                )}

              {(userDetails.isClassTeacher || userInfo.is_admin) && (
                <NavDropdown
                  title={
                    <>
                      <FontAwesomeIcon icon="far fa-calendar-check" /> Register
                    </>
                  }
                  id="register"
                >
                  <LinkContainer to="/register/edit">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon="fas fa-edit" /> Edit
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/registers">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon="fas fa-eye" /> View
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}

              {userInfo.is_student ? (
                <LinkContainer to="/student/results">
                  <Nav.Link>
                    <FontAwesomeIcon icon="far fa-clipboard" /> Results
                  </Nav.Link>
                </LinkContainer>
              ) : (
                <NavDropdown
                  title={
                    <>
                      <FontAwesomeIcon icon="far fa-clipboard" /> Results
                    </>
                  }
                  id="results"
                >
                  <LinkContainer to="/results/edit">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon="fas fa-edit" /> Edit
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/results">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon="fas fa-eye" /> View
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}

              {/* <NavDropdown
                title={
                  <>
                    <FontAwesomeIcon icon="fas fa-chart-line" /> Finance
                  </>
                }
                id="finance"
              ></NavDropdown> */}
            </Nav>

            <Nav className="ms-auto">
              {userDetails.isClassTeacher ||
                (userInfo.is_admin && (
                  <NavDropdown
                    title={
                      <>
                        <FontAwesomeIcon icon="fas fa-layer-group" /> Class
                      </>
                    }
                    id="class-management"
                  >
                    <LinkContainer to="/class/students">
                      <NavDropdown.Item>
                        <FontAwesomeIcon icon="fas fa-user" /> Students
                      </NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to="/class/t4-selection">
                      <NavDropdown.Item>
                        <FontAwesomeIcon icon="far fa-check-square" /> Technical
                        Selection
                      </NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to="/class/subject-selection">
                      <NavDropdown.Item>
                        <FontAwesomeIcon icon="far fa-check-square" /> Subject
                        Selection
                      </NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to="/class/remarks">
                      <NavDropdown.Item>
                        <FontAwesomeIcon icon="far fa-comment" /> Remarks
                      </NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                ))}

              {userInfo.is_admin && (
                <NavDropdown
                  title={
                    <>
                      <FontAwesomeIcon icon="fas fa-chalkboard-teacher" />{" "}
                      Teachers
                    </>
                  }
                  id="teachers-management"
                >
                  <LinkContainer to="/admin/teachers/subject-allotments">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon="fas fa-book" /> Subject Allotments
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/teachers/class-allotments">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon="fas fa-person-chalkboard" /> Class
                      Allotments
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/teachers/class-teachers">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon="fas fa-layer-group" /> Class
                      Teachers
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}

              {userInfo.is_admin && (
                <NavDropdown
                  title={
                    <>
                      <FontAwesomeIcon icon="fas fa-cogs" /> School
                    </>
                  }
                  id="management"
                >
                  <LinkContainer to="/admin/management/departments">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon="fas fa-building" /> Departments
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/management/sessions">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon="far fa-calendar-alt" /> Sessions
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/management/terms">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon="fas fa-sitemap" /> Terms
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/management/streams">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon="fas fa-stream" /> Streams
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/management/classes">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon="fas fa-layer-group" /> Classes
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/management/subjects">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon="fas fa-book" /> Subjects
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/management/exams">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon="fas fa-pen" /> Exams
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/management/calenders">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon="far fa-calendar-alt" /> School
                      Calenders
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/management/grading-systems">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon="fas fa-graduation-cap" /> Grading
                      Systems
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}

              {userInfo.is_admin && (
                <NavDropdown
                  title={
                    <>
                      <FontAwesomeIcon icon="fas fa-users" /> Users
                    </>
                  }
                  id="usersmenu"
                >
                  <LinkContainer to="/admin/students">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon="fas fa-user" /> Students
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/teachers">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon="fas fa-user-circle" /> Teachers
                    </NavDropdown.Item>
                  </LinkContainer>

                  {/* <LinkContainer to="/admin/staff">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon="fas fa-user-secret" /> Other Staffs
                    </NavDropdown.Item>
                  </LinkContainer> */}

                  <LinkContainer to="/admin/admins">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon="fas fa-user-shield" /> Admins
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}

              <NavDropdown title={userInfo.name} id="username">
                <LinkContainer to="/">
                  <NavDropdown.Item>
                    <FontAwesomeIcon icon="far fa-user" /> Profile
                  </NavDropdown.Item>
                </LinkContainer>

                <LinkContainer to="/reset-password">
                  <NavDropdown.Item>
                    <FontAwesomeIcon icon="fas fa-key" /> Reset Password
                  </NavDropdown.Item>
                </LinkContainer>

                <NavDropdown.Item onClick={handleLogout}>
                  <FontAwesomeIcon icon="fas fa-sign-out-alt" /> Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  ) : (
    <></>
  );
};

export default Header;
