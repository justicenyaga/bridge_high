import React, { useState, useEffect } from "react";
import { Image, Row, Col, ListGroup, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { loadUserDetails } from "../store/userDetails";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxState = useSelector((state) => state);
  const { userInfo } = reduxState.user;
  const { userDetails, loading, error } = reduxState.userDetails;

  useEffect(() => {
    if (!userInfo._id) {
      navigate("/login");
    } else {
      if (!userDetails._id) {
        dispatch(loadUserDetails(userInfo._id));
      }
    }
  }, [dispatch, navigate, userInfo, userDetails]);

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <Row>
      <Col md={3}>
        <Image
          src={
            userDetails.passport
              ? userDetails.passport
              : "https://bridgehigh.ams3.cdn.digitaloceanspaces.com/bridgehigh/images/default.png"
          }
          alt={userDetails.name}
          fluid
        />
      </Col>

      <Col md={userInfo.is_sStaff ? 9 : 6}>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <Row>
              <Col>Name</Col>
              <Col>{userDetails.name}</Col>
            </Row>
          </ListGroup.Item>

          <ListGroup.Item>
            <Row>
              <Col>
                {userInfo.is_sStaff
                  ? "Staff code"
                  : userInfo.is_teacher
                  ? "Teacher code"
                  : userInfo.is_admin
                  ? "Admin code"
                  : "Registration No"}
              </Col>
              <Col>{userDetails.code}</Col>
            </Row>
          </ListGroup.Item>

          <ListGroup.Item>
            <Row>
              <Col>School Email</Col>
              <Col>{userDetails.schoolEmail}</Col>
            </Row>
          </ListGroup.Item>

          {userInfo.is_student && (
            <ListGroup.Item>
              <Row>
                <Col>DOB</Col>
                <Col>{userDetails.dob}</Col>
              </Row>
            </ListGroup.Item>
          )}

          <ListGroup.Item>
            <Row>
              <Col>DOA</Col>
              <Col>{userDetails.doa}</Col>
            </Row>
          </ListGroup.Item>

          {userInfo.is_student && (
            <ListGroup.Item>
              <Row>
                <Col>Guardian Name</Col>
                <Col>{userDetails.guardianName}</Col>
              </Row>
            </ListGroup.Item>
          )}

          {!userInfo.is_student && (
            <ListGroup.Item>
              <Row>
                <Col>Nationality</Col>
                <Col>{userDetails.nationality}</Col>
              </Row>
            </ListGroup.Item>
          )}

          <ListGroup.Item>
            <Row>
              <Col>
                {userInfo.is_student ? "Guardian National Id" : "National Id"}
              </Col>
              <Col>
                {userInfo.is_student
                  ? userDetails.guardianNationalId
                  : userDetails.nationalID}
              </Col>
            </Row>
          </ListGroup.Item>

          <ListGroup.Item>
            <Row>
              <Col>
                {userInfo.is_student ? "Guardian Phone Number" : "Phone Number"}
              </Col>
              <Col>
                {userInfo.is_student
                  ? userDetails.guardianPhoneNumber
                  : userDetails.phoneNumber}
              </Col>
            </Row>
          </ListGroup.Item>

          <ListGroup.Item>
            <Row>
              <Col>
                {userInfo.is_student
                  ? "Guardian Email Address"
                  : "Email Address"}
              </Col>
              <Col>
                {userInfo.is_student
                  ? userDetails.guardianEmailAddress
                  : userDetails.emailAddress}
              </Col>
            </Row>
          </ListGroup.Item>

          {userInfo.is_student && (
            <ListGroup.Item>
              <Row>
                <Col>Total Billed</Col>
                <Col>{`${userDetails.feeBilled} Ksh`}</Col>
              </Row>
            </ListGroup.Item>
          )}

          {userInfo.is_student && (
            <ListGroup.Item>
              <Row>
                <Col>total Paid</Col>
                <Col>{`${userDetails.feePaid} Ksh`}</Col>
              </Row>
            </ListGroup.Item>
          )}

          {!userInfo.is_student && (
            <ListGroup.Item>
              <Row>
                <Col>Address</Col>
                <Col>{userDetails.address}</Col>
              </Row>
            </ListGroup.Item>
          )}
        </ListGroup>
      </Col>

      {!userInfo.is_sStaff && (
        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              {userInfo.is_student && (
                <ListGroup.Item>
                  <Row>
                    <Col>Form:</Col>
                    <Col>
                      {userDetails._id && userDetails.currentClass.name}
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

              {userInfo.is_student && (
                <ListGroup.Item>
                  <Row>
                    <Col>Stream:</Col>
                    <Col>
                      {userDetails._id && userDetails.currentClass.stream}
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

              {userInfo.is_student && (
                <ListGroup.Item>
                  <Row>
                    <Col>Bal:</Col>
                    <Col>{`${(
                      userDetails.feeBilled - userDetails.feePaid
                    ).toFixed(0)} Ksh`}</Col>
                  </Row>
                </ListGroup.Item>
              )}

              {userInfo.is_teacher && (
                <ListGroup.Item>
                  <Row>
                    <Col>Department:</Col>
                    <Col>{userDetails.dept}</Col>
                  </Row>
                </ListGroup.Item>
              )}

              {userInfo.is_teacher && (
                <ListGroup.Item>
                  <Row>
                    <Col>Subjects:</Col>

                    <Col>
                      {userDetails._id &&
                        userDetails.subjects.length &&
                        userDetails.subjects.map(
                          (subject) => subject.name + " "
                        )}
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>{userDetails.isActive ? "Active" : "Not active"}</Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      )}
    </Row>
  );
};

export default HomePage;
