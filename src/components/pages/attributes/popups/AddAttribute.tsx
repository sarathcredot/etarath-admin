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
      priority: 0
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
                    isInvalid={
                      !!formik.errors.priority && formik.touched.priority
                    }
                  >
                    <option disabled selected hidden value="">
                      Select Priority
                    </option>
                    {[1, 2, 3, 4, 5].map((item: number, index: number) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.priority}
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
                <button
                  // variant="dark"
                  // style={{ background: "#000" }}
                  className="btn-black"
                  type="submit"
                >
                  Submit
                </button>
              </Col>
            </Row>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AddAttribute;
