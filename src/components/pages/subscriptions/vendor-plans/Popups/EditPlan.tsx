import { useFormik } from "formik";
import { Button,  Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { PLANS, PLANS_KEY_TYPE } from "src/common/constant.common";
import { VendorValidationSchema } from "src/validations/validationSchemas";
import _ from "lodash";
import { errorMsg } from "src/utils/toast";

type Props = {
  id: string;
  isOpen: boolean;
  toggle: () => void;
};

const EditPlan = ({ id, isOpen, toggle }: Props) => {
  //DATA
  // const { data: plan, isLoading } = useGetPosterPlanById(id, !!id);

  //MUTATION
  // const { mutateAsync: updatePlan } = useUpdatePosterPlanById();

  //FORMIK
  const formik = useFormik({
    initialValues: {
      name: 'plan?.name',
      type: 'plan?.type',
      price: 'plan?.price',
      description: 'plan?.description',
    },
    validationSchema: VendorValidationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      handleEditPlan(values);
    },
  });

  //HANDLERS
  const handleEditPlan = async (values: any) => {
    try {
      // const res = await updatePlan({ id, ...values });
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

  const handleCancel = async () => {
    formik.resetForm();
    toggle();
  };

  return (
    <>
      <Modal show={isOpen} onHide={toggle} centered={true}>
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
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={6} className="px-4 py-1 ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Plan price"
                    name="price"
                    step="0.01"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    isInvalid={!!formik.errors.price && !!formik.touched.price}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.price}
                  </Form.Control.Feedback>
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
