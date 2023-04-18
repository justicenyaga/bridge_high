import React, { useState } from "react";
import {
  Row,
  Col,
  Form,
  Table,
  Card,
  ListGroup,
  Button,
} from "react-bootstrap";
import RegisterIcon from "../components/RegisterIcon";

function StudentRegisterPage() {
  function studentObjectMap(student) {
    return {
      ...student,
      nationalId: student.guardianId,
      phoneNo: student.guardianPhoneNo,
      email: student.guardianEmail,
    };
  }

  const userObject = studentObjectMap({
    _id: "0008",
    name: "Dismus Mwangi",
    form: "FOUR",
    stream: "North",
    schoolEmail: "003@students.bridgehigh.co.ke",
    dob: "12/12/2000",
    image: "/images/001.jpg",
    guardianName: "James Wanjohi",
    guardianId: "11171218",
    guardianPhoneNo: "0729344890",
    guardianEmail: "jameswanjohi@email.com",
    feeBilled: 40000,
    feePaid: 37188,
    isActive: true,
  });

  const remark = {
    student: 3,
    form: "ONE",
    term: "three",
    comment: "Can do better, just need to stop playing around.",
  };

  const forms = [
    { _id: 1, name: "ONE" },
    { _id: 2, name: "TW0" },
    { _id: 3, name: "THREE" },
    { _id: 4, name: "FOUR" },
  ];

  const terms = [
    { _id: 1, name: "ONE" },
    { _id: 2, name: "TW0" },
    { _id: 3, name: "THREE" },
  ];

  const [term, setTerm] = useState(terms[1].name);
  const [form, setForm] = useState(forms[3].name);

  const registers = [
    {
      _id: "22030fgfsgf1003",
      student: 3,
      term: "Three",
      form: "ONE",
      week: "ONE",
      day1: "none",
      day2: "none",
      day3: "none",
      day4: true,
      day5: true,
    },
    {
      _id: "2203vbvbvb02003",
      student: 3,
      term: "Three",
      form: "ONE",
      week: "TWO",
      day1: true,
      day2: true,
      day3: true,
      day4: true,
      day5: true,
    },
    {
      _id: "22030sfgsfgfg4345003",
      student: 3,
      term: "Three",
      form: "ONE",
      week: "THREE",
      day1: true,
      day2: true,
      day3: false,
      day4: true,
      day5: true,
    },
    {
      _id: "22045fgsfgfg4305003",
      student: 3,
      term: "Three",
      form: "ONE",
      week: "FOUR",
      day1: true,
      day2: true,
      day3: true,
      day4: true,
      day5: true,
    },
    {
      _id: "22450fgsfgfsg305003",
      student: 3,
      term: "Three",
      form: "ONE",
      week: "FIVE",
      day1: true,
      day2: true,
      day3: true,
      day4: false,
      day5: false,
    },
    {
      _id: "2202343dfgsgfg05003",
      student: 3,
      term: "Three",
      form: "ONE",
      week: "SIX",
      day1: false,
      day2: false,
      day3: true,
      day4: true,
      day5: true,
    },
    {
      _id: "2203sfgsfggr4305003",
      student: 3,
      term: "Three",
      form: "ONE",
      week: "SEVEN",
      day1: true,
      day2: true,
      day3: true,
      day4: true,
      day5: true,
    },
    {
      _id: "22030500vbvxfg3",
      student: 3,
      term: "Three",
      form: "ONE",
      week: "EIGHT",
      day1: true,
      day2: true,
      day3: true,
      day4: true,
      day5: true,
    },
    {
      _id: "220305sk0vbvxfg3",
      student: 3,
      term: "Three",
      form: "ONE",
      week: "NINE",
      day1: true,
      day2: false,
      day3: false,
      day4: false,
      day5: false,
    },
    {
      _id: "220305sk0vbvxfg3",
      student: 3,
      term: "Three",
      form: "ONE",
      week: "TEN",
      day1: false,
      day2: false,
      day3: false,
      day4: false,
      day5: false,
    },
    {
      _id: "220305sk0vbvxfg3",
      student: 3,
      term: "Three",
      form: "ONE",
      week: "ELEVEN",
      day1: false,
      day2: false,
      day3: false,
      day4: false,
      day5: false,
    },
  ];

  return (
    <div>
      Name: {userObject.name}
      <p>Reg No: {userObject._id}</p>
      <Row className="my-3">
        <Col md={1}>Form:</Col>

        <Col md={2}>
          <Form.Select
            size="sm"
            value={form}
            onChange={(e) => setForm(e.target.value)}
          >
            {forms.map((_form) => (
              <option key={_form._id} value={_form.name}>
                {_form.name}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col md={1}>Term:</Col>

        <Col md={2}>
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
      </Row>
      <Table striped hover bordered responsive className="table-sm">
        <thead>
          <tr>
            <th>Week</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
          </tr>
        </thead>
        <tbody>
          {registers.map((register) => (
            <tr key={register._id}>
              <td>{register.week}</td>
              <td>
                <RegisterIcon value={register.day1} />
              </td>
              <td>
                <RegisterIcon value={register.day2} />
              </td>
              <td>
                <RegisterIcon value={register.day3} />
              </td>
              <td>
                <RegisterIcon value={register.day4} />
              </td>
              <td>
                <RegisterIcon value={register.day5} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default StudentRegisterPage;
