import React from "react";
import { Row, Col, Form, Table, Button, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function MakeRemarks() {
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={8} lg={6}>
          <h4>Four North Term Two 2023/2024 Remarks</h4>

          <div>
            <Table striped hover bordered responsive className="table-sm my-3">
              <thead>
                <tr>
                  <th></th>
                  <th>Reg No</th>
                  <th>Name</th>
                  <th>Remarks</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>1</td>
                  <td>0001</td>
                  <td>Jared Kiama</td>
                  <td>
                    <Form.Control
                      as="textarea"
                      rows="2"
                      //   value={description}
                      placeholder="Enter comment"
                      //   onChange={(e) => setDescription(e.target.value)}
                    />
                  </td>
                </tr>

                <tr>
                  <td>2</td>
                  <td>0002</td>
                  <td>Kelvin Mwirigi</td>
                  <td>
                    <Form.Control
                      as="textarea"
                      rows="2"
                      //   value={description}
                      placeholder="Enter comment"
                      //   onChange={(e) => setDescription(e.target.value)}
                    />
                  </td>
                </tr>

                <tr>
                  <td>3</td>
                  <td>0008</td>
                  <td>Dismus Mwangi</td>
                  <td>
                    <Form.Control
                      as="textarea"
                      rows="2"
                      //   value={description}
                      placeholder="Enter comment"
                      //   onChange={(e) => setDescription(e.target.value)}
                    />
                  </td>
                </tr>

                <tr>
                  <td>4</td>
                  <td>0010</td>
                  <td>Moffat Kinyanjui</td>
                  <td>
                    <Form.Control
                      as="textarea"
                      rows="2"
                      //   value={description}
                      placeholder="Enter comment"
                      //   onChange={(e) => setDescription(e.target.value)}
                    />
                  </td>
                </tr>
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
        </Col>
      </Row>
    </Container>
  );
}

export default MakeRemarks;
