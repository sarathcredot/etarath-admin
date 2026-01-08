import { TimePicker } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Select from "react-select";
import MediaGalleryModal from "src/components/features/modals/media-gallery-modal";
import { generateFilePath } from "src/services/url.service";

export default function ProfileForm({ formik }: any) {
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  console.log("retailer profile formik = ", formik.values);

  return (
    <Row className="px-1 px-md-3">
      <Col
        lg={12}
        className="px-2 py-1 "
        style={{ display: "flex", alignItems: "center", gap: 10 }}
      >
        <Row className="px-2 ">
          {formik.values.imgUrl ? (
            <Col className="px-2 py-1 ">
              <div>
                profile
                <div className="user_image_div mt-2" style={{ width: "190px" }}>
                  <img
                    // src={generateFilePath(img)}
                    src={
                      typeof formik.values.imgUrl === "string"
                        ? generateFilePath(formik.values.imgUrl)
                        : formik.values.imgUrl.copy_link
                          ? formik.values.imgUrl.copy_link
                          : URL.createObjectURL(formik.values.imgUrl?.file)
                    }
                    alt="profile"
                    width={"100%"}
                    height={"100%"}
                    style={{ objectFit: "cover" }}
                  // crossOrigin="anonymous"
                  />
                  <div
                    onClick={() => setIsUploadOpen(true)}
                    className="edit_div"
                  >
                    <i className="bx bxs-edit fa "></i>
                  </div>
                </div>
              </div>
            </Col>
          ) : (
            <Col className="px-2 py-1 ">
              <div>
                profile
                <div
                  className="user_image_div mt-2"
                  style={{ width: "190px" }}
                  onClick={() => setIsUploadOpen(true)}
                >
                  <Button variant="dark" className="my-5">
                    Upload profile
                  </Button>
                </div>
              </div>
              {formik.touched.imgUrl && formik.errors.imgUrl && (
                <div className="text-danger small mt-1 px-2">
                  {formik.errors.imgUrl}
                </div>
              )}
            </Col>
          )}
        </Row>
        <Row className="mx-0 w-100">
          <Col lg={12} className="px-2 py-1">
            <Form.Group>
              <Form.Label className="col-form-label">User Name</Form.Label>
              <Form.Control
                type="text"
                name="userName"
                placeholder=" User Name"
                value={formik.values.userName}
                onChange={formik.handleChange}
                isInvalid={formik.touched.userName && !!formik.errors.userName}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.userName}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col lg={12} className=" px-2 py-1">
            <Form.Group>
              <Form.Label className="col-form-label">Phone Number</Form.Label>
              <Form.Control
                type="number"
                name="phoneNumber"
                placeholder=" Phone Number"
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
          <Col lg={12} className=" px-2 py-1">
            <Form.Group>
              <Form.Label className="col-form-label">Email</Form.Label>
              <Form.Control
                type="email"
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
        </Row>
      </Col>

      <Col lg={6} className="px-4 py-1  ">
        <Form.Group as={Row} className="align-items-center">
          <Form.Label className="col-form-label">EID No</Form.Label>
          <Form.Control
            type="text"
            placeholder="784-YYYY-NNNNNNN-C"
            name="eidNo"
            value={formik.values.eidNo}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.eidNo && formik.touched.eidNo}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.eidNo}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col lg={6} className="px-4 py-1  ">
        <Form.Group as={Row} className="align-items-center">
          <Form.Label className="col-form-label">EID Expiry Date</Form.Label>
          <Form.Control
            type="date"
            placeholder="EID Expiry Date"
            name="eidExpiryDate"
            value={formik.values.eidExpiryDate}
            onChange={formik.handleChange}
            isInvalid={
              !!formik.errors.eidExpiryDate && formik.touched.eidExpiryDate
            }
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.eidExpiryDate}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>

      <Col lg={12} className="px-4 py-1  ">
        <Form.Group as={Row} className="align-items-center">
          <Form.Label className="col-form-label">Upload EID</Form.Label>
          <Form.Control
            type="file"
            placeholder="Upload EID Document"
            name="eidFile"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.currentTarget?.files && e.currentTarget?.files[0]) {
                formik.setFieldValue("eidFile", e.currentTarget.files[0]);
              }
            }}
            isInvalid={!!(formik.errors.eidFile && formik.touched.eidFile)}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.eidFile}
          </Form.Control.Feedback>
        </Form.Group>
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

      <MediaGalleryModal
        isOpen={isUploadOpen}
        onClose={(files: any) => {
          if (files.length > 0) {
            formik.setFieldValue("imgUrl", files[0]);
          }
          setIsUploadOpen(!isUploadOpen);
        }}
        objectFit="contain"
        chooseOne={true}
      />
    </Row>
  );
}
