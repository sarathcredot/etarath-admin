import React from "react";
import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { VendorValidationSchema } from "src/validations/validationSchemas";

type Props = {
  isOpen: boolean;
  toggle: () => void;
  organiserId: any;
};

const EditRetailer = ({ isOpen, toggle, organiserId }: Props) => {
  //DATA
  // const { data: organiser } = useGetOrganiserById(organiserId, !!organiserId);

  //MUTATION
  // const { mutateAsync: updateOrganiser } = useUpdateOrganiser();

  //HANDLERS
  const handleEditRetailer = async (values: any) => {
    // try {
    //   const obj = {
    //     id: '121312321312',
    //     fullName: values.fullName,
    //     phoneNumber: values.phoneNumber,
    //     // isVerified: values.isVerified,
    //   };
    //   const resp = await updateOrganiser(obj);
    //   toast(resp?.data?.message, {
    //     containerId: "default",
    //     className: "no-icon notification-success",
    //   });
    //   toggle();
    // } catch (error) {
    //   toast("Can't update Organiser right now, please try again later!", {
    //     containerId: "default",
    //     className: "no-icon notification-success",
    //   });
    //   toggle();
    // }
  };

  //FORM
  const formik = useFormik({
    initialValues: {
      fullName: "",
      phoneNumber: "",
      isVerified: false,
    },
    validationSchema: VendorValidationSchema,
    enableReinitialize: true,
    onSubmit: handleEditRetailer,
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
          <h3 className="my-2">Edit Organizer</h3>
        </Modal.Header>
        <Form onSubmit={formik.handleSubmit}>
          <Modal.Body className="pb-4">
            <Row className="px-3">
              <Col lg={12} className="px-4 py-1">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter full name"
                    autoFocus
                    name="fullName"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    isInvalid={
                      !!(formik.errors.fullName && formik.touched.fullName)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.fullName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={12} className="px-4 py-1">
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
              </Col>
              {/* <Col lg={12} className="px-4 py-1">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">
                    Verification Status
                  </Form.Label>
                  <Form.Control
                    //   size="md"
                    as="select"
                    name="isVerified"
                    value={formik.values.isVerified ? "COMPLETED" : "PENDING"}
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue("isVerified", value === "COMPLETED");
                    }}
                    isInvalid={
                      !!(formik.errors.isVerified && formik.touched.isVerified)
                    }
                  >
                    <option value={"PENDING"}>Pending</option>
                    <option value={"COMPLETED"}>Completed</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.isVerified}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col> */}
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
                  style={{ background: "#000" }}
                >
                  Confirm
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default EditRetailer;
