import { useFormik } from "formik";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { PLANS, PLANS_KEY_TYPE } from "src/common/constant.common";
import { PlanEditValidationSchema } from "src/validations/validationSchemas";
import _ from "lodash";
import { errorMsg } from "src/utils/toast";
import { SubscriptionPlan } from "src/types/types";
import { useEffect } from "react";
import { useUpdatePlan } from "src/services/subscription.service";

type Props = {
  plan: SubscriptionPlan | null;
  isOpen: boolean;
  toggle: () => void;
};

const EditPlan = ({ plan, isOpen, toggle }: Props) => {
  //MUTATION
  const { mutateAsync: updatePlan } = useUpdatePlan();

  //FORMIK
  const formik = useFormik({
    initialValues: {
      plan: "",
      price_monthly: 0,
      yearly_off: 0,
      trial_period: 0,
      features: [""] as string[],
      description: "",
    },
    validationSchema: PlanEditValidationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      handleEditPlan(values);
    },
  });

  //HANDLERS
  const handleEditPlan = async (values: any) => {
    try {
      const res = await updatePlan({ id: plan?._id || "", data: values });
      toast(res?.data?.message, {
        containerId: "default",
        className: "no-icon notification-success",
      });
      formik.resetForm();
      toggle();
    } catch (error) {
      toast(_.capitalize(errorMsg(error).toLowerCase()), {
        containerId: "default",
        className: "no-icon notification-danger",
      });
    }
  };

  const handleCancel = async () => {
    formik.resetForm();
    toggle();
  };

  useEffect(() => {
    if (plan) {
      formik.setValues({
        plan: plan?.plan || "",
        price_monthly: plan?.price_monthly || 0,
        yearly_off: plan?.yearly_off || 0,
        trial_period: plan?.trial_period || 0,
        description: plan?.description || "",
        features: plan?.features.length > 0 ? plan?.features : [""],
      });
    }
  }, [plan, isOpen]);

  return (
    <>
      <Modal show={isOpen} onHide={toggle} centered={true} size="lg">
        <Modal.Header>
          {/* <Modal.Title>Are you sure?</Modal.Title> */}
          <h3 className="my-2">Edit Vendor Plan</h3>
        </Modal.Header>
        <Form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            <Row className="px-3">
              <Col lg={6} className=" py-1 ">
                <Form.Group className="align-items-center">
                  <Form.Label className="col-form-label">Plan</Form.Label>
                  <Form.Control
                    type="string"
                    placeholder="Plan Name"
                    name="plan"
                    value={formik.values.plan}
                    onChange={formik.handleChange}
                    isInvalid={!!formik.errors.plan && !!formik.touched.plan}
                  />
                  {/* <Form.Control
                    style={{ color: "#000" }}
                    //   size="md"
                    as="select"
                    name="name"
                    value={formik.values.name}
                    onChange={(e) => {
                      const plan = e.target.value as PLANS_KEY_TYPE;
                      console.log(plan, "PLAN_NAME");
                      console.log(PLANS[plan], "PLAN_TYPE");
                      formik.setFieldValue("type", PLANS[plan]);
                      formik.setFieldValue("name", plan);
                    }}
                    isInvalid={!!formik.errors.name && !!formik.touched.name}
                  >
                    {(Object.keys(PLANS) as Array<keyof typeof PLANS>).map(
                      (plan) => (
                        <option key={plan} value={plan}>
                          {_.capitalize(plan.toLowerCase())}
                        </option>
                      )
                    )}
                  </Form.Control> */}
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.plan}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={6} className="px-4 py-1 ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Plan price"
                    name="price_monthly"
                    step="0.01"
                    value={formik.values.price_monthly}
                    onChange={formik.handleChange}
                    isInvalid={
                      !!formik.errors.price_monthly &&
                      !!formik.touched.price_monthly
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.price_monthly}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={6} className="px-4 py-1 ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">
                    Trial Period
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Plan price"
                    name="trial_period"
                    min={0}
                    value={formik.values.trial_period}
                    onChange={formik.handleChange}
                    isInvalid={
                      !!formik.errors.trial_period &&
                      !!formik.touched.trial_period
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.trial_period}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={6} className="px-4 py-1 ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">
                    Trial Period
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Plan price"
                    name="yearly_off"
                    min={0}
                    value={formik.values.yearly_off}
                    onChange={formik.handleChange}
                    isInvalid={
                      !!formik.errors.yearly_off && !!formik.touched.yearly_off
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.yearly_off}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={12} className="px-4 py-1 ">
                <Form.Group
                  as={Row}
                  className=" "
                  style={{ flexDirection: "column" }}
                >
                  <Form.Label className="col-form-label">Features</Form.Label>
                  {formik?.values?.features?.map(
                    (feature: string, index: number) => {
                      const featureError =
                        ((formik.touched.features as boolean[] | undefined)?.[
                          index
                        ] &&
                          (formik.errors.features as string[] | undefined)?.[
                            index
                          ]) ||
                        "";

                      return (
                        <>
                          <div
                            key={index}
                            className="d-flex  mb-1"
                            style={{ gap: 5 }}
                          >
                            <Form.Control
                              type="text"
                              placeholder={`Feature ${index + 1}`}
                              name={`features[${index}]`}
                              value={feature}
                              onChange={(e) => {
                                const updatedFeatures = [
                                  ...formik?.values?.features,
                                ];
                                updatedFeatures[index] = e.target.value;
                                formik.setFieldValue(
                                  "features",
                                  updatedFeatures
                                );
                              }}
                              onBlur={() =>
                                formik.setFieldTouched(
                                  `features[${index}]`,
                                  true
                                )
                              }
                              isInvalid={!!featureError}
                            />
                            {formik?.values?.features?.length - 1 === index && (
                              <Button
                                variant="dark"
                                style={{ background: "#000" }}
                                type="button"
                                onClick={() => {
                                  formik.setFieldValue("features", [
                                    ...formik?.values?.features,
                                    "",
                                  ]);
                                }}
                              >
                                +
                              </Button>
                            )}
                            {index !== 0 && (
                              <Button
                                variant="danger "
                                // style={{ background: "#000" }}
                                type="button"
                                onClick={() => {
                                  const updatedFeatures = [
                                    ...formik?.values?.features,
                                  ];
                                  updatedFeatures.splice(index, 1);
                                  formik.setFieldValue(
                                    "features",
                                    updatedFeatures
                                  );
                                }}
                              >
                                -
                              </Button>
                            )}
                          </div>
                          <Form.Control.Feedback type="invalid">
                            {featureError}
                          </Form.Control.Feedback>
                        </>
                      );
                    }
                  )}
                  {/* For top-level array error (like empty features) */}
                  {typeof formik.errors.features === "string" && (
                    <div className="text-danger mt-1">
                      {formik.errors.features}
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col lg={12} className=" pb-2 px-2">
                <Form.Group className="align-items-center">
                  <Form.Label className="col-form-label">
                    Description
                  </Form.Label>
                  <Form.Control
                    style={{ color: "#000" }}
                    as="textarea"
                    rows={4}
                    placeholder="Enter description"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    isInvalid={
                      !!formik.errors.description &&
                      !!formik.touched.description
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.description}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={12} className=" pb-2 px-2"></Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Row>
              <Col md={12} className="text-right">
                <Button
                  variant="default"
                  onClick={handleCancel}
                  className="mr-2"
                >
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

export default EditPlan;
