import { useFormik } from "formik";
import _ from "lodash";
import React, { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import MediaGalleryModal from "src/components/features/modals/media-gallery-modal";
import { useUploadFile } from "src/services/fileUpload.service";
import { useAddOffer } from "src/services/offer.service";
import { generateFilePath } from "src/services/url.service";
import { errorMsg } from "src/utils/toast";
import { AddsValidationSchema } from "src/validations/validationSchemas";
import { usecreateAdds } from "src/services/adds.service"

type Props = {
  isOpen: boolean;
  toggle: () => void;
};

const AddOffer = ({ isOpen, toggle }: Props) => {
  // STATES
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  // MUTATIONS
  const { mutateAsync: createAdd } = usecreateAdds();
  const { mutateAsync: uploadFile } = useUploadFile();

  //FORMINK
  const formik = useFormik({
    initialValues: {
      imgUrl: "" as any,
      priority: 1,

    },
    validationSchema: AddsValidationSchema,

    onSubmit: (values) => {
      console.log(values, "VALUES");
      handleAddOffer(values);
    },
  });

  const handleAddOffer = async (values: any) => {
    try {
      if (typeof values?.imgUrl !== "string") {
        let formData = new FormData();
        formData.append("file", values?.imgUrl.file);
        let response = await uploadFile(formData);
        values.imgUrl = response.data.data;
      }

      const res = await createAdd(values);
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
          <h3 className="my-2">Add Offer</h3>
        </Modal.Header>
        <Form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            <Row className="px-1 px-md-3 ">
              {formik.values.imgUrl ? (
                <Col lg={12} className="px-2 py-1 ">
                  <div>
                    Offer
                    <div className="user_image_div mt-1">
                      <img
                        src={
                          typeof formik.values.imgUrl === "string"
                            ? generateFilePath(formik.values.imgUrl)
                            : formik.values.imgUrl.copy_link
                              ? formik.values.imgUrl.copy_link
                              : URL.createObjectURL(formik.values.imgUrl?.file)
                        }
                        alt="offer"
                        width={"100%"}
                        height={"100%"}
                        style={{ objectFit: "fill" }}
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
                <Col lg={12} className="px-2 py-1 ">
                  <div>
                    Offer
                    <div
                      className="user_image_div mt-1"
                      onClick={() => setIsUploadOpen(true)}
                    >
                      <Button variant="dark" className="my-5">
                        Upload Offer
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
              <Col lg={12} className="px-4 py-1  ">

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
    </>
  );
};

export default AddOffer;
