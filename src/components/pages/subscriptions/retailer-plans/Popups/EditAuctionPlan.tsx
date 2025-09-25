import { useFormik } from "formik";
import React, { useEffect } from "react";
import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { errorMsg } from "src/utils/toast";
import { VendorValidationSchema } from "src/validations/validationSchemas";
import _ from "lodash";

type Props = {
  id: string;
  isOpen: boolean;
  toggle: () => void;
};

const EditAuctionPlan = ({ id, isOpen, toggle }: Props) => {
  //DATA
  // const { data: auctionPlan, isLoading } = useGetAuctionPlanById(id, !!id);

  //MUTATION
  // const { mutateAsync: updateAuctionPlan } = useUpdateAuctionPlanById();

  //FORMIK
  const formik = useFormik({
    initialValues: {
      maxAllowedTeams: 10,
      price: 499,
      isFree: false,
      isUnlimitedTeamsAllowed: false,
    },
    enableReinitialize: true,
    validationSchema: VendorValidationSchema,

    onSubmit: (values) => {
      console.log("FORM DATA", values);
      handleUpdateAuctionPlan(values);
    },
  });

  const handleUpdateAuctionPlan = async (values: any) => {
    try {
      // const res = await updateAuctionPlan({ id, ...values });
      // toast(res?.data?.message, {
      //   containerId: "default",
      //   className: "no-icon notification-success",
      // });
      formik.resetForm();
      toggle();
    } catch (error) {
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
          {/* <Modal.Title>Are you sure?</Modal.Title> */}
          <h3 className="my-2">Edit Auction Plan</h3>
        </Modal.Header>
        <Form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            <Row className="px-3">
              <Col lg={12} className="px-3">
                <Form.Check
                  id="check-2"
                  type="checkbox"
                  label="Is Free ?"
                  name="isFree"
                  style={{ color: "#000" }}
                  // isInvalid={Boolean(formik.errors.registrationFee && formik.touched.registrationFee)}
                  checked={formik.values.isFree}
                  onChange={(e) => {
                    const { checked } = e.target;
                    formik.setFieldValue("isFree", checked);
                    if(checked){
                      formik.setFieldValue("price", 0);
                    }
                  }}
                />
              </Col>
              <Col lg={12} className="px-4 py-1 mb-3">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter price"
                    name="price"
                    step="0.01"
                    disabled={formik.values.isFree}
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    isInvalid={!!formik.errors.price && !!formik.touched.price}
                    autoFocus
                    style={{ color: "#000" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.price}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={12} className="px-3 py-1">
                <Form.Check
                  id="check-2"
                  type="checkbox"
                  label="is Unlimited Teams are Allowed ?"
                  name="isUnlimitedTeamsAllowed"
                  style={{ color: "#000" }}
                  // isInvalid={Boolean(formik.errors.registrationFee && formik.touched.registrationFee)}
                  checked={formik.values.isUnlimitedTeamsAllowed}
                  onChange={(e) => {
                    const { checked } = e.target;
                    formik.setFieldValue("isUnlimitedTeamsAllowed", checked);
                    if(checked){
                      formik.setFieldValue("maxAllowedTeams", 0);
                    }
                  }}
                />
              </Col>
              <Col lg={12} className="px-4">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">
                    Maximum Teams
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Maximum Teams"
                    name="maxAllowedTeams"
                    value={formik.values.maxAllowedTeams}
                    onChange={formik.handleChange}
                    disabled={formik.values.isUnlimitedTeamsAllowed}
                    isInvalid={
                      !!formik.errors.maxAllowedTeams &&
                      !!formik.touched.maxAllowedTeams
                    }
                    style={{ color: "#000" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.maxAllowedTeams}
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

export default EditAuctionPlan;
