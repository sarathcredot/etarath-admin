import { Col, Form, Row } from "react-bootstrap";

export default function ContactForm({ formik }:any) {
  return (
    <Row className="px-1 px-md-3">
      <Col lg={6} className="px-4 py-1">
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="owner_name"
            placeholder="Enter Shop Name"
            value={formik.values.owner_name}
            onChange={formik.handleChange}
            isInvalid={formik.touched.owner_name && !!formik.errors.owner_name}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.owner_name}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>

      {/* Add your FULL profile form content here exactly as you wrote it */}
    </Row>
  );
}
