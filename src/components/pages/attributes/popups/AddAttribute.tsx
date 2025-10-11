import { useFormik } from "formik";
import _ from "lodash";
import React, { useEffect } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAddAttribute } from "src/services/attribute.service";
import { errorMsg } from "src/utils/toast";
import { AttributeValidationSchema } from "src/validations/validationSchemas";

type Props = {
  isOpen: boolean;
  toggle: () => void;
  type: string;
};

const AddAttribute = ({ isOpen, toggle, type }: Props) => {
  // MUTATIONS
  const { mutateAsync: addAttribute } = useAddAttribute();

  //FORMINK
  const formik = useFormik({
    initialValues: {
      attribute: "",
      type: "",
    },
    validationSchema: AttributeValidationSchema,

    onSubmit: (values) => {
      console.log(values, "VALUES");
      handleAddAttribute(values);
    },
  });
  console.log({ type });
  //HANDLERS
  const handleAddAttribute = async (values: any) => {
    try {
      const res = await addAttribute(values);
      toast(res?.data?.message, {
        containerId: "default",
        className: "no-icon notification-success",
      });
      formik.resetForm();
      toggle();
    } catch (error: any) {
      toast(_.capitalize(errorMsg(error).toLowerCase()), {
        containerId: "default",
        className: "no-icon notification-danger",
      });
    }
  };

  useEffect(() => {
    if (isOpen && type) {
      formik.setFieldValue("type", type);
    } else {
      formik.setFieldValue("type", "");
    }
  }, [isOpen, toggle, type]);

  console.log(formik.errors, "ERRORS");
  return (
    <>
      <Modal show={isOpen} onHide={toggle} centered={true}>
        <Modal.Header>
          {/* <Modal.Title>Are you sure?</Modal.Title> */}
          <h3 className="my-0">Add Attribute</h3>
        </Modal.Header>
        <Form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            <Row className="px-1 px-md-3 pb-3 ">
              <Col lg={12} className="px-4 py-1  ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">Attribute</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter attribute"
                    name="attribute"
                    value={formik.values.attribute}
                    onChange={formik.handleChange}
                    isInvalid={
                      !!formik.errors.attribute && formik.touched.attribute
                    }
                    autoFocus
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.attribute}
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
                  style={{ background: "#000" }}
                  type="submit"
                >
                  Submit
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AddAttribute;
