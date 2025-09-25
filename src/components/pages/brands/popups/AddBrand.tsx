import { useFormik } from "formik";
import React, { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import MediaGalleryModal from "src/components/features/modals/media-gallery-modal";
import { useCreateBrand } from "src/services/brand.service";
import { errorMsg } from "src/utils/toast";
import { BrandValidationSchema } from "src/validations/validationSchemas";
import _ from "lodash";
import {
  useUploadFile,
  useUploadMultiFile,
} from "src/services/fileUpload.service";

type Props = {
  isOpen: boolean;
  toggle: () => void;
};

const AddBrand = ({ isOpen, toggle }: Props) => {
  // STATES
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  // MUTATIONS
  const { mutateAsync: createBrand } = useCreateBrand();
  const { mutateAsync: uploadFile } = useUploadFile();

  //FORMINK
  const formik = useFormik({
    initialValues: {
      name: "",
      imageUrl: "" as any,
    },
    validationSchema: BrandValidationSchema,

    onSubmit: (values) => {
      console.log(values, "VALUES");
      handleAddBrand(values);
    },
  });

  //HANDLERS
  const handleAddBrand = async (values: any) => {
    try {
      if (typeof values?.imageUrl !== "string") {
        let formData = new FormData();
        formData.append("file", values?.imageUrl.file);
        let response = await uploadFile(formData);
        values.imageUrl = response.data.data;
      }

      const res = await createBrand(values);
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

  console.log(formik.errors, "ERRORS");
  return (
    <>
      <Modal show={isOpen} onHide={toggle} centered={true} size="xl">
        <Modal.Header>
          {/* <Modal.Title>Are you sure?</Modal.Title> */}
          <h3 className="my-2">Add Brand</h3>
        </Modal.Header>
        <Form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            <Row className="px-1 px-md-3 ">
              {formik.values.imageUrl ? (
                <Col className="px-2 py-1 ">
                  <div>
                    Logo
                    <div className="product_image_div mt-1">
                      <img
                        // src={generateFilePath(img)}
                        src={
                          typeof formik.values.imageUrl === "string"
                            ? formik.values.imageUrl
                            : formik.values.imageUrl.copy_link
                            ? formik.values.imageUrl.copy_link
                            : URL.createObjectURL(formik.values.imageUrl?.file)
                        }
                        alt="brand logo"
                        width="150"
                        height="150"
                        crossOrigin="anonymous"
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
                <Col lg={12} className="px-2 py-1 ">
                  <div>
                    Logo
                    <div
                      className="product_image_div mt-1"
                      onClick={() => setIsUploadOpen(true)}
                    >
                      <Button variant="dark" className="my-5">
                        Upload Brand Logo
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
    </>
  );
};

export default AddBrand;
