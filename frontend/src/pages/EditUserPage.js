import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-number-input";
import countryList from "react-select-country-list";

import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";

import { loadUserData } from "../store/userData";
import { updateUser, removeCreatedUser, deleteUser } from "../store/userList";
import { loadForms } from "../store/forms";
import { loadStreams } from "../store/streams";
import { loadDepartments } from "../store/departments";

import httpService from "../utils/httpService";

const EditUserPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: userId } = useParams();

  const reduxState = useSelector((state) => state);
  const { userInfo } = reduxState.user;
  const { userData: userDetails, loading, error } = reduxState.userData;
  const { userDetails: userInfomation } = reduxState.userDetails;
  const { successCreate } = reduxState.userList;
  const { list: allForms } = reduxState.forms;
  const { list: streams } = reduxState.streams;
  const { list: departments } = reduxState.departments;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [image, setImage] = useState("");
  const [dob, setDob] = useState("");
  const [doa, setDoa] = useState("");
  const [nationality, setNationality] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [currentClass, setCurrentClass] = useState("");
  const [stream, setStream] = useState("");
  const [department, setDepartment] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const role =
    userDetails._id && userDetails.schoolEmail.split("@")[1].split(".")[0];

  useEffect(() => {
    if (!userInfo.is_admin && !userInfomation.isClassTeacher) {
      navigate("/login");
    } else {
      if (successCreate) dispatch(removeCreatedUser());

      if (userDetails.user !== Number(userId)) {
        dispatch(loadUserData(userId));
      } else {
        setName(userDetails.name);
        setDob(userDetails.dob);
        setDoa(userDetails.doa);
        setIsActive(userDetails.isActive);
        setImage(userDetails.passport);
        setPhoneNo(
          role === "students"
            ? userDetails.guardianPhoneNumber
            : userDetails.phoneNumber
        );
        setEmail(
          role === "students"
            ? userDetails.guardianEmailAddress
            : userDetails.emailAddress
        );
        setNationalId(
          role === "students"
            ? userDetails.guardianNationalId
            : userDetails.nationalID
        );
        role === "students"
          ? setGuardianName(userDetails.guardianName)
          : setGender(userDetails.gender);
        role === "students"
          ? setCurrentClass(userDetails.currentClass.name)
          : setAddress(userDetails.address);

        role === "students"
          ? setStream(userDetails.currentClass.stream)
          : setNationality(userDetails.nationality);

        role === "teachers" && setDepartment(userDetails.dept);
      }

      dispatch(loadForms());
      dispatch(loadStreams());
      dispatch(loadDepartments());
    }
  }, [userDetails, dispatch, userId, successCreate, userInfo, navigate]);

  const forms = [];
  allForms.length &&
    allForms.forEach((form) => {
      forms.find((f) => f.name === form.name) || forms.push(form);
    });

  const countryOptions = useMemo(() => countryList().getData(), []);

  const handleUploadFile = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();

    formData.append("image", file);
    formData.append("user_id", userDetails._id);

    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await httpService.post(
        role === "students"
          ? "/api/students/upload-passport/"
          : role === "teachers"
          ? "/api/teachers/upload-passport/"
          : "/api/admins/upload-passport/",
        formData,
        config
      );

      setImage(data);
      setUploading(false);
    } catch (error) {
      setUploading(false);
    }
  };

  const handleDeleteUser = (userId) => {
    if (
      window.confirm(
        `Are you sure you want to delete this ${
          role === "students"
            ? "student"
            : role === "teachers"
            ? "teacher"
            : role === "admin"
            ? "Admin"
            : "staff"
        } ?`
      )
    ) {
      dispatch(deleteUser(role, userId));
      navigate(-1);

      toast.success(
        `${
          role === "students"
            ? "Student"
            : role === "teachers"
            ? "Teacher"
            : role === "admin"
            ? "Admin"
            : "Staff"
        } deleted successfully`
      );
    }
  };

  const user =
    role === "students"
      ? {
          _id: userDetails._id,
          name,
          dob,
          doa,
          isActive,
          passport: image,
          guardianPhoneNumber: phoneNo,
          guardianEmailAddress: email,
          guardianNationalId: nationalId,
          guardianName,
          currentClass: {
            name: currentClass,
            stream,
          },
        }
      : {
          _id: userDetails._id,
          name,
          dob,
          doa,
          isActive,
          passport: image,
          phoneNumber: phoneNo,
          emailAddress: email,
          nationalID: nationalId,
          gender,
          address,
          nationality,
          dept: department,
        };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUser(role, user));

    toast.success("User updated successfully");

    setTimeout(() => {
      window.location.reload();

      navigate(-1);
    }, 200);
  };

  return (
    <div>
      <Row>
        <Col>
          <Button variant="light" onClick={() => navigate(-1)} className="my-3">
            <FontAwesomeIcon icon="fas fa-arrow-left" />
          </Button>
        </Col>

        <Col className="text-center">
          <h1>
            {userDetails.name ? "Edit " : "Register"}{" "}
            {role === "students"
              ? "Student"
              : role === "teachers"
              ? "Teacher"
              : role === "admin"
              ? "Admin"
              : "Staff"}
          </h1>
        </Col>

        <Col className="text-end">
          Name:{" "}
          {userDetails.name
            ? userDetails.name
            : role === "students"
            ? "New Student"
            : role === "teachers"
            ? "New Teacher"
            : role === "admin"
            ? "New Admin"
            : "New Staff"}
          <br />
          {role === "students" ? "Reg No: " : "Code: "}
          {userDetails.code}
          <br />
          {userDetails.schoolEmail}
        </Col>
      </Row>

      <FormContainer>
        {loading ? (
          <Loader />
        ) : error ? (
          toast.error(error)
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                placeholder="Enter name"
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            {role === "students" && (
              <Form.Group controlId="currentClass">
                <Form.Label>Form</Form.Label>
                <Form.Control
                  as="select"
                  value={currentClass}
                  onChange={(e) => setCurrentClass(e.target.value)}
                >
                  <option value="">...Select Form</option>
                  {forms.map((form) => (
                    <option key={form._id} value={form.name}>
                      {form.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            )}

            {role === "students" && (
              <Form.Group controlId="stream">
                <Form.Label>Stream</Form.Label>
                <Form.Control
                  as="select"
                  value={stream}
                  onChange={(e) => setStream(e.target.value)}
                >
                  <option value="">...Select Stream</option>
                  {streams.map((stream) => (
                    <option key={stream._id} value={stream.name}>
                      {stream.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            )}

            <Form.Group controlId="passportUrl">
              <Form.Label>Passport Image</Form.Label>

              <Form.Control
                type="text"
                value={image}
                placeholder="Enter image"
                onChange={(e) => setImage(e.target.value)}
              />

              <Form.Control
                type="file"
                onChange={handleUploadFile}
              ></Form.Control>

              {uploading && <Loader />}
            </Form.Group>

            {role === "students" && (
              <Form.Group controlId="guardianName">
                <Form.Label>Guardian Name</Form.Label>
                <Form.Control
                  type="text"
                  value={guardianName}
                  placeholder="Enter guardian name"
                  onChange={(e) => setGuardianName(e.target.value)}
                />
              </Form.Group>
            )}

            {role === "teachers" && (
              <Form.Group controlId="department">
                <Form.Label>Department</Form.Label>
                <Form.Control
                  as="select"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="">...Select Department</option>
                  {departments.map((department) => (
                    <option key={department._id} value={department.name}>
                      {department.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            )}

            {role !== "students" && (
              <Form.Group controlId="nationality">
                <Form.Label>Nationality</Form.Label>

                <Form.Control
                  as="select"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                >
                  <option value="">...Select nationality</option>
                  {countryOptions.map((country) => (
                    <option key={country.value} value={country.label}>
                      {country.label}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            )}

            <Form.Group controlId="nationalId">
              <Form.Label>
                {role === "students" ? "Guardian National ID" : "National ID"}
              </Form.Label>
              <Form.Control
                type="text"
                value={nationalId}
                placeholder="Enter national ID"
                onChange={(e) => setNationalId(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="phoneNo">
              <Form.Label>
                {role === "students" ? "Guardian Phone No" : "Phone No"}
              </Form.Label>
              <PhoneInput
                defaultCountry="KE"
                value={phoneNo}
                onChange={(phoneNo) => setPhoneNo(phoneNo)}
              />
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>
                {role === "students" ? "Guardian Email" : "Email"}
              </Form.Label>
              <Form.Control
                type="email"
                value={email}
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="dob">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                value={dob}
                placeholder="Enter date of birth"
                onChange={(e) => setDob(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="doa">
              <Form.Label>Date of Admission</Form.Label>
              <Form.Control
                type="date"
                value={doa}
                placeholder="Enter date of admission"
                onChange={(e) => setDoa(e.target.value)}
              />
            </Form.Group>

            {role !== "students" && (
              <Form.Group controlId="gender">
                <Form.Label>Gender</Form.Label>
                <Form.Control
                  as="select"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">...Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Form.Control>
              </Form.Group>
            )}

            {role !== "students" && (
              <Form.Group controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  value={address}
                  placeholder="Enter address"
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Form.Group>
            )}

            <br />

            <Form.Group controlId="isdmin">
              <Form.Check
                type="checkbox"
                label="Is Active"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
            </Form.Group>

            <br />

            <Row>
              <Col>
                <Button
                  type="submit"
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
              </Col>

              {userInfo.is_admin && (
                <Col className="text-end">
                  <Button
                    variant="danger"
                    className="btn-sm"
                    style={{ borderRadius: "5px" }}
                    onClick={() => handleDeleteUser(userDetails._id)}
                  >
                    <FontAwesomeIcon icon="fas fa-trash" /> Delete
                  </Button>
                </Col>
              )}
            </Row>
          </Form>
        )}
      </FormContainer>
    </div>
  );
};

export default EditUserPage;
