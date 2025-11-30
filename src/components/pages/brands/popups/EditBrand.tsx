import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import MediaGalleryModal from "src/components/features/modals/media-gallery-modal";
import { BrandValidationSchema } from "src/validations/validationSchemas";
import { Brand } from "../BrandsList";
import { useGetBrandById, useUpdateBrand } from "src/services/brand.service";
import { generateFilePath } from "src/services/url.service";
import { errorMsg } from "src/utils/toast";
import _ from "lodash";
import { useUploadFile } from "src/services/fileUpload.service";

type Props = {
  isOpen: boolean;
  toggle: () => void;
  brandId: string;
};

const EditBrand = ({ isOpen, toggle, brandId }: Props) => {
  // STATES
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isUploadOpen2, setIsUploadOpen2] = useState<boolean>(false);

  // QUERIES
  const {
    data: brand,
    isLoading,
    error: brandError,
  } = useGetBrandById(brandId, !!brandId);

  // MUTATIONS
  const { mutateAsync: uploadFile } = useUploadFile();
  const { mutateAsync: updateBrand } = useUpdateBrand();

  //FORMINK
  const formik = useFormik({
    initialValues: {
      name: "",
      imageUrl: "" as any,
      imageUrl2: "" as any,
      priority: 1,
    },
    validationSchema: BrandValidationSchema,

    onSubmit: (values) => {
      console.log(values, "VALUES");
      handleEditBrand(values);
    },
  });

  //HANDLERS
  const handleEditBrand = async (values: any) => {
    try {
      if (typeof values?.imageUrl !== "string") {
        let formData = new FormData();
        formData.append("file", values?.imageUrl.file);
        let response = await uploadFile(formData);
        values.imageUrl = response.data.data;
      }
      if (typeof values?.imageUrl2 !== "string") {
        let formData = new FormData();
        formData.append("file", values?.imageUrl2.file);
        let response = await uploadFile(formData);
        values.imageUrl2 = response.data.data;
      }

      const res = await updateBrand({ id: brandId, data: values });
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
    if (brand && isOpen) {
      formik.setFieldValue("name", brand?.name || "");
      formik.setFieldValue("imageUrl", brand?.imageUrl || "");
      formik.setFieldValue("imageUrl2", brand?.imageUrl2 || "");
      formik.setFieldValue("priority", brand?.priority || "");
    }
  }, [isOpen, brand]);

  console.log(formik.errors, "ERRORS");
  return (
    <>
      <Modal show={isOpen} onHide={toggle} centered={true} size="lg">
        <Modal.Header>
          {/* <Modal.Title>Are you sure?</Modal.Title> */}
          <h3 className="my-2">Edit Brand</h3>
        </Modal.Header>
        <Form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            <Row className=" px-md-3 ">
              <Col className="px-2 py-1" lg={6}>
                {formik.values.imageUrl ? (
                  <Col lg={12} className="px-0 py-1">
                    <div>
                      Primary Logo (Dark Version)
                      <div
                        className="product_image_div mt-1"
                        style={{ height: "180px" }}
                      >
                        <img
                          // src={generateFilePath(img)}
                          src={
                            typeof formik.values.imageUrl === "string"
                              ? generateFilePath(formik.values.imageUrl)
                              : formik.values.imageUrl.copy_link
                              ? formik.values.imageUrl.copy_link
                              : URL.createObjectURL(
                                  formik.values.imageUrl?.file
                                )
                          }
                          alt="brand logo"
                          width="150"
                          // height="150"
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
                  <Col lg={12} className="px-0 py-1 ">
                    <div>
                      Primary Logo (Dark Version)
                      <div
                        className="product_image_div mt-1"
                        onClick={() => setIsUploadOpen(true)}
                        style={{ height: "180px" }}
                      >
                        <Button variant="dark" className="">
                          Upload Primary Logo
                        </Button>
                      </div>
                    </div>
                  </Col>
                )}
                {formik.touched.imageUrl && formik.errors.imageUrl && (
                  <div className="text-danger small mt-1 px-2">
                    {formik.errors.imageUrl}
                  </div>
                )}
              </Col>
              <Col className="px-2 py-1" lg={6}>
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
              </Col>
            </Row>
            <Row className="px-1 px-md-3 pt-md-3 ">
              <Col lg={12} className="px-4 py-1  ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">Brand</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter brand name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    isInvalid={!!formik.errors.name && formik.touched.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={12} className="px-4 py-1  ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">Priority</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter priority"
                    name="priority"
                    value={formik.values.priority}
                    onChange={formik.handleChange}
                    isInvalid={
                      !!formik.errors.priority && formik.touched.priority
                    }
                  />
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

      <MediaGalleryModal
        isOpen={isUploadOpen}
        onClose={(files: any) => {
          if (files.length > 0) {
            formik.setFieldValue("imageUrl", files[0]);
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

export default EditBrand;
