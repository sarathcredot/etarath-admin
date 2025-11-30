import { Col, Form, Row } from "react-bootstrap";
import Select from "react-select";
export default function ContactForm({ formik }: any) {
  return (
    <Row className="px-1 px-md-3">
      <Col lg={6} className="px-2 py-1">
        <Form.Group>
          <Form.Label className="col-form-label">
            Contact Person Name
          </Form.Label>
          <Form.Control
            type="text"
            name="userName"
            placeholder="Contact Person Name"
            value={formik.values.userName}
            onChange={formik.handleChange}
            isInvalid={formik.touched.userName && !!formik.errors.userName}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.userName}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col lg={6} className="px-2 py-1">
        <Form.Group>
          <Form.Label className="col-form-label">Designation</Form.Label>
          <Form.Control
            type="text"
            name="designation"
            placeholder="Designation"
            value={formik.values.designation}
            onChange={formik.handleChange}
            isInvalid={
              formik.touched.designation && !!formik.errors.designation
            }
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.designation}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col lg={6} className="px-2 py-1">
        <Form.Group>
          <Form.Label className="col-form-label">Phone Number</Form.Label>
          <Form.Control
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            isInvalid={
              formik.touched.phoneNumber && !!formik.errors.phoneNumber
            }
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.phoneNumber}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col lg={6} className="px-2 py-1">
        <Form.Group>
          <Form.Label className="col-form-label">Email</Form.Label>
          <Form.Control
            type="text"
            name="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            isInvalid={formik.touched.email && !!formik.errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.email}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col lg={12} className="px-2 py-1  ">
        
        <Form.Label className="col-form-label">
          Preferred Language for Communication
        </Form.Label>
        <Select
          name="language"
          options={["english", "arabic", "german", "spanish", "french"].map(
            (loc) => ({ value: loc, label: loc?.toUpperCase() })
          )}
          isMulti={true}
          placeholder="Preferred Language for Communication"
          // value={["english", "arabic", "german", "spanish", "french"]
          //   .map((loc) => ({ value: loc, label: loc?.toUpperCase() }))
          //   .filter((opt) => formik.values.language.includes(opt.value))}
          onChange={(selected) => {
            console.log({ selected });
            formik.setFieldValue("language", selected?.map((s: any) => s.value));
          }}
          onBlur={() => formik.setFieldTouched("language", true)}
          classNamePrefix={
            formik.touched.language && formik.errors.language
              ? "is-invalid"
              : ""
          }
        />
        {formik.touched.language && formik.errors.language && (
          <div className="text-danger mt-1" style={{ fontSize: "11px" }}>
            {formik.errors.language}
          </div>
        )}
      </Col>
    </Row>
  );
}
