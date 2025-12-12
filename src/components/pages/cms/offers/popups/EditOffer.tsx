import { useFormik } from "formik";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import MediaGalleryModal from "src/components/features/modals/media-gallery-modal";
import { useUploadFile } from "src/services/fileUpload.service";
import {
  useAddOffer,
  useGetSingleOffer,
  useUpdateOffer,
} from "src/services/offer.service";
import { generateFilePath } from "src/services/url.service";
import { errorMsg } from "src/utils/toast";
import { OfferValidationSchema } from "src/validations/validationSchemas";

type Props = {
  isOpen: boolean;
  offerId: string;
  toggle: () => void;
};

const EditOffer = ({ isOpen, toggle, offerId }: Props) => {
  // STATES
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  // QUERIES
  const { data: offer } = useGetSingleOffer(offerId, !!offerId);

  // MUTATIONS
  const { mutateAsync: updateOffer } = useUpdateOffer();
  const { mutateAsync: uploadFile } = useUploadFile();

  //FORMINK
  const formik = useFormik({
    initialValues: {
      imageUrl: "" as any,
      priority: 1,
      link: "",
    },
    validationSchema: OfferValidationSchema,

    onSubmit: (values) => {
      console.log(values, "VALUES");
      handleEditOffer(values);
    },
  });

  const handleEditOffer = async (values: any) => {
    try {
      if (typeof values?.imageUrl !== "string") {
        let formData = new FormData();
        formData.append("file", values?.imageUrl.file);
        let response = await uploadFile(formData);
        values.imageUrl = response.data.data;
      }

      const res = await updateOffer({ id: offerId, data: values });
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
    if (offer) {
      formik.setValues({ ...formik.values, ...offer });
    }
  }, [offer]);

  return (
    <>
      <Modal show={isOpen} onHide={toggle} centered={true}>
        <Modal.Header>
          <h3 className="my-2">Add Offer</h3>
        </Modal.Header>
        <Form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            <Row className="px-1 px-md-3 ">
              {formik.values.imageUrl ? (
                <Col lg={12} className="px-2 py-1 ">
                  <div>
                    Offer
                    <div
                      className="user_image_div mt-1"
                      style={{ height: "100%" }}
                    >
                      <img
                        src={
                          typeof formik.values.imageUrl === "string"
                            ? generateFilePath(formik.values.imageUrl)
                            : formik.values.imageUrl.copy_link
                            ? formik.values.imageUrl.copy_link
                            : URL.createObjectURL(formik.values.imageUrl?.file)
                        }
                        alt="offer"
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
                  {formik.touched.imageUrl && formik.errors.imageUrl && (
                    <div className="text-danger small mt-1 px-2">
                      {formik.errors.imageUrl}
                    </div>
                  )}
                </Col>
              )}
              <Col lg={12} className="px-4 py-1  ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">Link</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Link"
                    name="link"
                    value={formik.values.link}
                    onChange={formik.handleChange}
                    isInvalid={!!formik.errors.link && formik.touched.link}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.link}
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

export default EditOffer;
