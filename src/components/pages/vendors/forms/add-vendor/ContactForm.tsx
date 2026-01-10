import { Col, Form, Row } from "react-bootstrap";
import Select from "react-select";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";

export const languageOptions = [
  { value: "english", label: "English" },
  { value: "arabic", label: "Arabic" },
  { value: "french", label: "French" },
  { value: "spanish", label: "Spanish" },
  { value: "german", label: "German" },
  { value: "italian", label: "Italian" },
  { value: "portuguese", label: "Portuguese" },
  { value: "russian", label: "Russian" },
  { value: "chinese", label: "Chinese" },
  { value: "japanese", label: "Japanese" },
  { value: "korean", label: "Korean" },
  { value: "hindi", label: "Hindi" },
  { value: "bengali", label: "Bengali" },
  { value: "tamil", label: "Tamil" },
  { value: "telugu", label: "Telugu" },
  { value: "malayalam", label: "Malayalam" },
  { value: "urdu", label: "Urdu" },
  { value: "turkish", label: "Turkish" },
  { value: "persian", label: "Persian" },
  { value: "dutch", label: "Dutch" },
  { value: "polish", label: "Polish" },
  { value: "swedish", label: "Swedish" },
  { value: "norwegian", label: "Norwegian" },
  { value: "finnish", label: "Finnish" },
  { value: "thai", label: "Thai" },
  { value: "vietnamese", label: "Vietnamese" },
  { value: "indonesian", label: "Indonesian" },
  { value: "malay", label: "Malay" },
  { value: "swahili", label: "Swahili" },
  { value: "hebrew", label: "Hebrew" },
  { value: "greek", label: "Greek" },
  { value: "hungarian", label: "Hungarian" },
  { value: "czech", label: "Czech" },
  { value: "romanian", label: "Romanian" },
  { value: "slovak", label: "Slovak" },
  { value: "ukrainian", label: "Ukrainian" },
];

export default function ContactForm({ formik, isEdit = false }: any) {
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
      {/* <Col lg={6} className="px-2 py-1">
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
      </Col> */}

      <Col lg={12} className="px-2 py-1">
        <Form.Group>
          <Form.Label className="col-form-label">
            Phone Number
          </Form.Label>

          <PhoneInput
            international
            defaultCountry="IN"
            countryCallingCodeEditable={true}   // ✅ manual +91 allowed
            placeholder="Phone Number"
            value={formik.values.phoneNumber}
            onChange={(value) =>
              formik.setFieldValue("phoneNumber", value)
            }
            onBlur={() =>
              formik.setFieldTouched("phoneNumber", true)
            }
            disabled={isEdit}
            className={`phone-bootstrap ${formik.touched.phoneNumber &&
              formik.errors.phoneNumber
              ? "is-invalid"
              : ""
              }`}
          />

          {formik.touched.phoneNumber &&
            formik.errors.phoneNumber && (
              <div className="invalid-feedback d-block">
                {formik.errors.phoneNumber}
              </div>
            )}
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
          options={languageOptions}
          isMulti={true}
          placeholder="Preferred Language for Communication"
          value={languageOptions.filter((opt) =>
            formik.values.language?.includes(opt.value)
          )}
          // value={["english", "arabic", "german", "spanish", "french"]
          //   .map((loc) => ({ value: loc, label: loc?.toUpperCase() }))
          //   .filter((opt) => formik.values.language.includes(opt.value))}
          onChange={(selected) => {
            console.log({ selected });
            formik.setFieldValue(
              "language",
              selected?.map((s: any) => s.value)
            );
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

      <Col lg={12} className=" px-2 py-1 ">
        <Form.Group className="align-items-center">
          <Form.Label className="col-form-label">Priority</Form.Label>
          <Form.Control
            style={{ color: "#000" }}
            //   size="md"
            as="select"
            name="priority"
            value={formik.values.priority}
            onChange={(e) =>
              formik.setFieldValue("priority", Number(e.target.value))
            }
          // isInvalid={
          //   !!formik.errors.priority && formik.touched.priority
          // }
          >
            <option disabled selected hidden value="">
              Select Priority
            </option>
            {[0, 1, 2, 3, 4, 5].map((item: number, index: number) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </Form.Control>
          {/* <Form.Control.Feedback type="invalid">
            {formik.errors.priority}
          </Form.Control.Feedback> */}
        </Form.Group>
      </Col>


    </Row>
  );
}
