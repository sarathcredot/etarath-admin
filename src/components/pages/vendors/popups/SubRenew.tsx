import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import Select from "react-select";

import { toast } from "react-toastify";
import MediaGalleryModal from "src/components/features/modals/media-gallery-modal";
import { subValidationSchema, VendorSubscriptionValidationSchema } from "src/validations/validationSchemas";
// import { Brand } from "../BrandsList";
import { useGetBrandById, useUpdateBrand } from "src/services/brand.service";
import { useGetSubscriptionOrderById, usePurchasePlan, useUpdateExpireData } from "src/services/subscription-orders";
import { errorMsg } from "src/utils/toast";
import _ from "lodash";
import { useUploadFile } from "src/services/fileUpload.service";
import { useGetAllPlansByRole } from "src/services/subscription.service";

type Props = {
  isOpen: boolean;
  toggle: () => void;
  orderId: string;
  data: any
};

export const durationTypes = [
  {
    value: "monthly",
    label: "Monthly",
  },
  {
    value: "yearly",
    label: "Yearly",
  },
];

const SubRenew = ({ isOpen, toggle, orderId, data }: Props) => {
  // STATES
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isUploadOpen2, setIsUploadOpen2] = useState<boolean>(false);


  const { data: plans, isLoading } = useGetAllPlansByRole("vendor") as {
    data: any;
    isLoading: boolean;
  };



  // QUERIES
  // const {
  //   data: brand,
  //   isLoading,
  //   error: brandError,
  // } = useGetBrandById(brandId, !!brandId);

  // MUTATIONS
  const { mutateAsync: uploadFile } = useUploadFile();
  const { mutateAsync: updateOrder } = useUpdateExpireData();
  const { mutateAsync: purchasePlan } = usePurchasePlan();

  //FORMINK
  const formik = useFormik({
    initialValues: {
      subId: "",
      endDate: "" as any,

    },
    validationSchema: subValidationSchema,

    onSubmit: (values) => {
      console.log(values, "VALUES");
      handleEditBrand(values);
    },
  });


  const subscriptionFormik = useFormik({
    initialValues: {
      planId: "",
      durationType: "",
    },

    validationSchema: VendorSubscriptionValidationSchema,

    onSubmit: async (values) => {
      console.log("SUBSCRIPTION SUBMIT:", values);
      toast.loading("Renewing subscription plan", {
        containerId: "default",
        className: "no-icon notification-warning",
      });
      try {
        const res = await purchasePlan({
          userId: data?.userId,
          planId: values.planId,
          durationType: values.durationType,
        });
        if (res.status === 200) {
          toast.dismiss();
          toast("Subscription Plan Renewed successfully!", {
            containerId: "default",
            className: "no-icon notification-success",
          });

          toggle()

        }
      } catch (error: any) {
        toast.dismiss();
        toast(_.capitalize(errorMsg(error).toLowerCase()), {
          containerId: "default",
          className: "no-icon notification-danger",
        });

        toggle()
      }
    },
  });


  useEffect(() => {
    if (data) {
      subscriptionFormik.setValues({
        planId: data?.planId || "",
        durationType: data?.durationType || "",
      });
    }
  }, [orderId, data]);


  //HANDLERS
  const handleEditBrand = async (values: any) => {
    try {


      const res = await updateOrder({ id: orderId, data: values });
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
    if (data && isOpen) {
      formik.setFieldValue("subId", data?.subId || "");
      formik.setFieldValue("endDate", data?.plan_end_date ? new Date(data?.plan_end_date)
        .toISOString()
        .split("T")[0]
        : "",
      );


    }
  }, [isOpen, data]);

  console.log(formik.errors, "ERRORS");
  return (
    <>
      <Modal show={isOpen} onHide={toggle} centered={true} size="lg">
        <Modal.Header>
          {/* <Modal.Title>Are you sure?</Modal.Title> */}
          <h3 className="my-2">Renew subscription</h3>
        </Modal.Header>
        <Form onSubmit={subscriptionFormik.handleSubmit}>
          <Modal.Body>
            <Row className=" px-md-3 ">

              {/* <Col className="px-2 py-1" lg={6}>
                {formik.values.imageUrl2 ? (
                  <Col lg={12} className="px-0 py-1">
                    <div>
                      Alternate Logo (Light Version)
                      <div
                        className="product_image_div mt-1"
                        style={{ height: "180px" }}
                      >
                        <img
                          // src={generateFilePath(img)}
                          src={
                            typeof formik.values.imageUrl2 === "string"
                              ? generateFilePath(formik.values.imageUrl2)
                              : formik.values.imageUrl2.copy_link
                              ? formik.values.imageUrl2.copy_link
                              : URL.createObjectURL(
                                  formik.values.imageUrl2?.file
                                )
                          }
                          alt="brand logo"
                          width="150"
                          height="150"
                          // crossOrigin="anonymous"
                        />
                        <div
                          onClick={() => setIsUploadOpen2(true)}
                          className="edit_div"
                        >
                          <i className="bx bxs-edit fa "></i>
                        </div>
                      </div>
                    </div>
                  </Col>
                ) : (
                  <Col lg={12} className="px-0 py-1 ">
                    <div>
                      Alternate Logo (Light Version)
                      <div
                        className="product_image_div mt-1"
                        onClick={() => setIsUploadOpen2(true)}
                        style={{ height: "180px" }}
                      >
                        <Button variant="dark" className="">
                          Upload Alternate Logo
                        </Button>
                      </div>
                    </div>
                  </Col>
                )}
                {formik.touched.imageUrl2 && formik.errors.imageUrl2 && (
                  <div className="text-danger small mt-1 px-2">
                    {formik.errors.imageUrl2}
                  </div>
                )}
              </Col> */}
            </Row>
            <Row className="px-1 px-md-3 pt-md-3 ">


              {/* <Col lg={12} className="px-4 py-1  ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">subscription Id</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="subId"
                    name="subId"
                    disabled={true}
                    value={formik.values.subId}
                    onChange={formik.handleChange}
                    isInvalid={!!formik.errors.subId && formik.touched.subId}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.subId}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={12} className="px-4 py-1  ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">Expire data</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="endDate"
                    name="endDate"
                    value={formik.values.endDate}
                    onChange={formik.handleChange}
                    isInvalid={
                      !!formik.errors.endDate && !!formik.touched.endDate
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.endDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col> */}


              <Col lg={12} className="px-2 py-1  ">
                <Form.Label className="col-form-label">Subscription Plan</Form.Label>
                <Select
                  name="planId"
                  options={plans?.map((item: any) => ({
                    value: item?._id,
                    label: item?.plan?.toUpperCase(),
                  }))}
                  value={plans
                    ?.map((item: any) => ({
                      value: item?._id,
                      label: item?.plan?.toUpperCase(),
                    }))
                    .find((opt: any) => opt.value === subscriptionFormik.values.planId)}
                  // isMulti={false}
                  placeholder="Select Subscription Plan"
                  onChange={(selected: any) => {
                    console.log({ selected });
                    subscriptionFormik.setFieldValue("planId", selected?.value);
                  }}
                  onBlur={() => subscriptionFormik.setFieldTouched("planId", true)}
                  classNamePrefix={
                    subscriptionFormik.touched.planId && subscriptionFormik.errors.planId ? "is-invalid" : ""
                  }
                />
                {subscriptionFormik.touched.planId && subscriptionFormik.errors.planId && (
                  <div className="text-danger mt-1" style={{ fontSize: "11px" }}>
                    {subscriptionFormik.errors.planId}
                  </div>
                )}
              </Col>
              <Col lg={12} className="px-2 py-1  ">
                <Form.Label className="col-form-label">
                  Select subscription duration
                </Form.Label>
                <Select
                  name="durationType"
                  options={durationTypes}
                  value={durationTypes.find(
                    (opt) => opt.value === subscriptionFormik.values.durationType
                  )}
                  isMulti={false}
                  placeholder="Select subscriptionFormikription duration"
                  // value={["english", "arabic", "german", "spanish", "french"]
                  //   .map((loc) => ({ value: loc, label: loc?.toUpperCase() }))
                  //   .filter((opt) => subscriptionFormik.values.brands.includes(opt.value))}
                  onChange={(selected) => {
                    console.log({ selected });
                    subscriptionFormik.setFieldValue("durationType", selected?.value);
                  }}
                  onBlur={() => subscriptionFormik.setFieldTouched("durationType", true)}
                  classNamePrefix={
                    subscriptionFormik.touched.durationType && subscriptionFormik.errors.durationType
                      ? "is-invalid"
                      : ""
                  }
                />
                {subscriptionFormik.touched.durationType && subscriptionFormik.errors.durationType && (
                  <div className="text-danger mt-1" style={{ fontSize: "11px" }}>
                    {subscriptionFormik.errors.durationType}
                  </div>
                )}
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

      <MediaGalleryModal
        isOpen={isUploadOpen}
        onClose={(files: any) => {
          if (files.length > 0) {
            const file = files[0];

            // Handle both local uploads & already-stored gallery items
            const mimeType =
              file?.type || file?.file?.type || file?.copy_link?.mimeType;

            const allowed = ["image/png", "image/svg+xml"];
            // const allowed = ["image/svg+xml"];

            if (!allowed.includes(mimeType)) {
              toast(`Only PNG and SVG files are allowed.`, {
                containerId: "modal",
                className: "no-icon notification-danger",
              });
              return;
            }

            formik.setFieldValue("imageUrl", file);
          }
          setIsUploadOpen(!isUploadOpen);
        }}
        objectFit="contain"
        chooseOne={true}
      />
      <MediaGalleryModal
        isOpen={isUploadOpen2}
        onClose={(files: any) => {
          if (files.length > 0) {
            formik.setFieldValue("imageUrl2", files[0]);
          }
          setIsUploadOpen2(!isUploadOpen2);
        }}
        objectFit="contain"
        chooseOne={true}
      />
    </>
  );
};

export default SubRenew;
