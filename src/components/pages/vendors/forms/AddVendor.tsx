import { useFormik } from "formik";
import React, { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import MediaGalleryModal from "src/components/features/modals/media-gallery-modal";
import { useCreateBrand } from "src/services/brand.service";
import { errorMsg } from "src/utils/toast";
import {
  BrandValidationSchema,
  VendorValidationSchema,
} from "src/validations/validationSchemas";
import _ from "lodash";
import {
  useUploadFile,
  useUploadMultiFile,
} from "src/services/fileUpload.service";
import { useAddVendor } from "src/services/vendor.service";
import { generateFilePath } from "src/services/url.service";
import AddBussinessDetails from "./AddBussinessDetails";

type Props = {
  isOpen: boolean;
  toggle: () => void;
};

const AddVendor = ({ isOpen, toggle }: Props) => {
  // STATES
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isKycOpen, setKycOpen] = useState<boolean>(false);

  // MUTATIONS
  const { mutateAsync: createVendor } = useAddVendor();
  const { mutateAsync: uploadFile } = useUploadFile();

  //FORMINK
  const formik = useFormik({
    initialValues: {
      userName: "",
      email: "",
      phoneNumber: "",
      password: "",
      eidNo: "",
      eidFile: "" as any,
      imgUrl: "" as any,
      role: "vendor",
    },
    validationSchema: VendorValidationSchema,

    onSubmit: (values) => {
      console.log(values, "VALUES");
      handleAddVendor(values);
    },
  });

  //HANDLERS
  const handleAddVendor = async (values: any) => {
    try {
      if (typeof values?.imgUrl !== "string") {
        let formData = new FormData();
        formData.append("file", values?.imgUrl.file);
        let response = await uploadFile(formData);
        values.imgUrl = response.data.data;
      }
      if (typeof values?.eidFile !== "string") {
        let formData = new FormData();
        formData.append("file", values?.eidFile);
        let response = await uploadFile(formData);
        values.eidFile = response.data.data;
      }

      const res = await createVendor(values);
      toast(res?.data?.message, {
        containerId: "default",
        className: "no-icon notification-success",
      });
      formik.resetForm();
      toggle();
      setKycOpen(true);
    } catch (error: any) {
      toast(_.capitalize(errorMsg(error).toLowerCase()), {
        containerId: "default",
        className: "no-icon notification-danger",
      });
    }
  };

  console.log(formik.values, "VALUES");
  console.log(formik.errors, "ERRORS");
  return (
    <>
      <Modal show={isOpen} onHide={toggle} centered={true} size="xl">
        <Modal.Header>
          {/* <Modal.Title>Are you sure?</Modal.Title> */}
          <h3 className="my-2">Add Vendor</h3>
        </Modal.Header>
        <Form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            <Row className="px-1 px-md-3 ">
              {formik.values.imgUrl ? (
                <Col lg={3} className="px-2 py-1 ">
                  <div>
                    profile
                    <div className="user_image_div mt-1">
                      <img
                        // src={generateFilePath(img)}
                        src={
                          typeof formik.values.imgUrl === "string"
                            ? generateFilePath(formik.values.imgUrl)
                            : formik.values.imgUrl.copy_link
                            ? formik.values.imgUrl.copy_link
                            : URL.createObjectURL(formik.values.imgUrl?.file)
                        }
                        alt="brand logo"
                        width={"100%"}
                        height={"100%"}
                        style={{ objectFit: "cover" }}
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
                <Col lg={3} className="px-2 py-1 ">
                  <div>
                    Logo
                    <div
                      className="user_image_div mt-1"
                      onClick={() => setIsUploadOpen(true)}
                    >
                      <Button variant="dark" className="my-5">
                        Upload Profile
                      </Button>
                    </div>
                  </div>
                  {formik.touched.imgUrl && formik.errors.imgUrl && (
                    <div className="text-danger small mt-1 px-2">
                      {formik.errors.imgUrl}
                    </div>
                  )}
                </Col>
              )}

              {/* </Row>
            <Row className="px-1 px-md-3 pt-md-3 "> */}
              <Col lg={9} className="px-4 py-1  ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">FullName</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter full name"
                    name="userName"
                    value={formik.values.userName}
                    onChange={formik.handleChange}
                    isInvalid={
                      !!formik.errors.userName && formik.touched.userName
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.userName}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">Email</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    isInvalid={!!formik.errors.email && formik.touched.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">
                    Contact Number
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter contact number"
                    name="phoneNumber"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    isInvalid={
                      !!formik.errors.phoneNumber && formik.touched.phoneNumber
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.phoneNumber}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={6} className="px-4 py-1  ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">EID No</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="784-YYYY-NNNNNNN-C"
                    name="eidNo"
                    value={formik.values.eidNo}
                    onChange={formik.handleChange}
                    isInvalid={!!formik.errors.eidNo && formik.touched.eidNo}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.eidNo}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={6} className="px-4 py-1  ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">
                    Upload EID{" "}
                  </Form.Label>
                  <Form.Control
                    type="file"
                    placeholder="Upload EID Document"
                    name="eidFile"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.currentTarget?.files && e.currentTarget?.files[0]) {
                        formik.setFieldValue(
                          "eidFile",
                          e.currentTarget.files[0]
                        );
                      }
                    }}
                    isInvalid={
                      !!(formik.errors.eidFile && formik.touched.eidFile)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.eidFile}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={12} className="px-4 pb-1  ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    isInvalid={
                      !!formik.errors.password && formik.touched.password
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.password}
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
            formik.setFieldValue("imgUrl", files[0]);
          }
          setIsUploadOpen(!isUploadOpen);
        }}
        objectFit="contain"
        chooseOne={true}
      />

      <AddBussinessDetails
        isOpen={isKycOpen}
        toggle={() => setKycOpen(!isKycOpen)}
      />
    </>
  );
};

export default AddVendor;
