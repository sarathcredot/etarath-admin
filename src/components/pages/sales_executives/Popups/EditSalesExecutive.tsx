import React, { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { AgentValidationSchema } from "src/validations/validationSchemas";
import { generateFilePath } from "src/services/url.service";
import MediaGalleryModal from "src/components/features/modals/media-gallery-modal";
import { uploadFile } from "src/services/fileUpload.service";
import { useUpdateAgent } from "src/services/salesAgent.service";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";



type Props = {
  isOpen: boolean;
  toggle: () => void;
  agentId: any;
  data?: any
};

const EditSalesExecutive = ({ isOpen, toggle, agentId, data }: Props) => {
  //DATA
  // const { data: organiser } = useGetOrganiserById(organiserId, !!organiserId);

  //MUTATION
  // const { mutateAsync: updateOrganiser } = useUpdateOrganiser();

  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  const { mutateAsync: updateAgent } = useUpdateAgent();


  //HANDLERS
  const handleEditExecutive = async (values: any) => {
    console.log("edit")
    try {
      if (typeof values?.imgUrl !== "string") {
        let formData = new FormData();
        formData.append("file", values?.imgUrl.file);
        let response = await uploadFile(formData);
        values.imgUrl = response.data.data;
      }

      const res = await updateAgent({
        id: agentId,
        data: values
      });

      toast(res?.data?.message, {
        containerId: "default",
        className: "no-icon notification-success",
      });
      formik.resetForm();
      toggle();

    } catch (error) {
      toast("Can't update Sales Executive right now, please try again later!", {
        containerId: "default",
        className: "no-icon notification-warning",
      });
      toggle();
    }
  };

  //FORM
  const formik = useFormik({
    initialValues: {
      userName: data?.userName,
      phoneNumber: data?.phoneNumber,
      email: data?.email,
      isVerified: data?.isSuspend,
      imgUrl: data?.imgUrl || " "
    },
    validationSchema: AgentValidationSchema,
    enableReinitialize: true,
    onSubmit: handleEditExecutive,
  });

  return (
    <>
      <Modal
        show={isOpen}
        onHide={toggle}
        centered
      // size="lg"
      >
        <Modal.Header>
          <h3 className="my-2">Edit Sales Executive</h3>
        </Modal.Header>
        <Form onSubmit={formik.handleSubmit}>
          <Modal.Body className="pb-4">
            <Row className="px-3">

              <div style={{ width: "200px" }} className="user_image_div mt-1">
                <img
                  // src={generateFilePath(img)}
                  src={
                    typeof formik.values.imgUrl === "string"
                      ? generateFilePath(formik.values.imgUrl)
                      : formik.values.imgUrl.copy_link
                        ? formik.values.imgUrl.copy_link
                        : URL.createObjectURL(formik.values.imgUrl?.file)
                  }
                  alt="brand logo"
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

              <Col lg={12} className="px-4 py-1">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter full name"
                    autoFocus
                    name="userName"
                    value={formik.values.userName}
                    onChange={formik.handleChange}
                    isInvalid={
                      !!(formik.errors.userName && formik.touched.userName)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.userName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* <Col lg={12} className="px-4 py-1">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">
                    Phone Number
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter phone number"
                    name="phoneNumber"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    disabled
                    isInvalid={
                      !!(
                        formik.errors.phoneNumber && formik.touched.phoneNumber
                      )
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
                    // disabled={isEdit}
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


              <Col lg={12} className="px-4 py-1">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">
                    Email
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}

                    isInvalid={
                      !!(
                        formik.errors.email && formik.touched.email
                      )
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Row>
              <Col md={12} className="text-right">
                <Button variant="default" onClick={toggle} className="mr-2">
                  Cancel
                </Button>
                <Button
                  variant="dark"
                  type="submit"
                // style={{ background: "#000" }}
                >
                  Confirm
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Form>
      </Modal>
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
    </>

  );
};

export default EditSalesExecutive;
