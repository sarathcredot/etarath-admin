import { useFormik } from "formik";
import _ from "lodash";
import React, { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAddBlogTag } from "src/services/blog.tag.service";
import { errorMsg } from "src/utils/toast";
import { BlogTagValidationSchema } from "src/validations/validationSchemas";

type Props = {
  isOpen: boolean;
  toggle: () => void;
};

const AddBlogTag = ({ isOpen, toggle }: Props) => {
  // MUTATIONS
  const { mutateAsync: addBlogTag } = useAddBlogTag();

  //FORMINK
  const formik = useFormik({
    initialValues: {
      tag: "",
    },
    validationSchema: BlogTagValidationSchema,

    onSubmit: (values) => {
      console.log(values, "VALUES");
      handleAddBlogTag(values);
    },
  });

  const handleAddBlogTag = async (values: any) => {
    try {
      const res = await addBlogTag(values);
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
  return (
    <>
      <Modal show={isOpen} onHide={toggle} centered={true}>
        <Modal.Header>
          <h3 className="my-2">Add Blog Tag</h3>
        </Modal.Header>
        <Form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            <Row className="px-1 px-md-3 ">
              <Col lg={12} className="px-4 py-1  ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">Tag</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter tag"
                    name="tag"
                    value={formik.values.tag}
                    onChange={formik.handleChange}
                    isInvalid={!!formik.errors.tag && formik.touched.tag}
                    autoFocus
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.tag}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Row>
              <Col md={12} className="text-right px-0">
                <Button variant="default" onClick={toggle} className="mr-2">
                  Cancel
                </Button>
                <Button
                  variant="dark"
                  // style={{ background: "#000" }}
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

export default AddBlogTag;
