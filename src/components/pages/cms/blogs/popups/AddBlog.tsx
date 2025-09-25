import { useFormik } from "formik";
import _ from "lodash";
import React, { useState } from "react";
import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import MediaGalleryModal from "src/components/features/modals/media-gallery-modal";
import { useGetAllBlogCategories } from "src/services/blog.category.service";
import { useGetAllBlogTags } from "src/services/blog.tag.service";
import { useUploadFile } from "src/services/fileUpload.service";
import { useAddOffer } from "src/services/offer.service";
import { generateFilePath } from "src/services/url.service";
import { errorMsg } from "src/utils/toast";
// import DatePicker from 'react-datepicker';
import { DatePicker } from "rsuite";
import {
  BlogValidationSchema,
  OfferValidationSchema,
} from "src/validations/validationSchemas";
// import 'rsuite/dist/rsuite.min.css';
import 'rsuite/DatePicker/styles/index.css';



type Props = {
  isOpen: boolean;
  toggle: () => void;
};

const AddBlog = ({ isOpen, toggle }: Props) => {
  // STATES
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  // QUERIES
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  }: any = useGetAllBlogCategories();
  const {
    data: tags,
    isLoading: isTagsLoading,
    error: tagsError,
  }: any = useGetAllBlogTags();

  // MUTATIONS
  const { mutateAsync: createOffer } = useAddOffer();
  const { mutateAsync: uploadFile } = useUploadFile();

  //FORMINK
  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      tags: [] as string[],
      category: "",
      date: null,
      imageUrl: "" as any,
    },
    validationSchema: BlogValidationSchema,

    onSubmit: (values) => {
      console.log(values, "VALUES");
      handleAddOffer(values);
    },
  });
  const options = [
    { value: "sports", label: "Sports" },
    { value: "music", label: "Music" },
    { value: "tech", label: "Tech" },
    { value: "art", label: "Art" },
  ];

  const handleAddOffer = async (values: any) => {
    try {
      if (typeof values?.imageUrl !== "string") {
        let formData = new FormData();
        formData.append("file", values?.imageUrl.file);
        let response = await uploadFile(formData);
        values.imageUrl = response.data.data;
      }

      const res = await createOffer(values);
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
          <h3 className="my-2">Add Blog</h3>
        </Modal.Header>
        <Form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            <Row className="px-1 px-md-3 ">
              {formik.values.imageUrl ? (
                <Col lg={12} className="px-2 py-1 ">
                  <div>
                    Blog Image
                    <div className="user_image_div mt-1">
                      <img
                        src={
                          typeof formik.values.imageUrl === "string"
                            ? generateFilePath(formik.values.imageUrl)
                            : formik.values.imageUrl.copy_link
                            ? formik.values.imageUrl.copy_link
                            : URL.createObjectURL(formik.values.imageUrl?.file)
                        }
                        alt="blog"
                        width={"100%"}
                        height={"100%"}
                        style={{ objectFit: "fill" }}
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
                    Blog Image
                    <div
                      className="user_image_div mt-1"
                      onClick={() => setIsUploadOpen(true)}
                    >
                      <Button variant="dark" className="my-5">
                        Upload Blog Image
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
                  <Form.Label className="col-form-label">Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter title"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    isInvalid={!!formik.errors.title && formik.touched.title}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.title}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={12} className=" px-2 py-1 ">
                <Form.Group className="align-items-center">
                  <Form.Label className="col-form-label">Category</Form.Label>
                  <Form.Control
                    style={{ color: "#000" }}
                    //   size="md"
                    as="select"
                    name="category"
                    value={formik.values.category}
                    onChange={(e) =>
                      formik.setFieldValue("category", e.target.value)
                    }
                    isInvalid={
                      !!formik.errors.category && formik.touched.category
                    }
                  >
                    <option disabled selected hidden value="">
                      Select Category
                    </option>
                    {categories &&
                      categories[0]?.categories.map(
                        (item: string, index: number) => (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        )
                      )}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.category}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={12} className=" px-2 py-1 ">
                {/* <Form.Group className="align-items-center">
                  <Form.Label className="col-form-label">Tags</Form.Label>
                  <Form.Control
                    style={{ color: "#000" }}
                    //   size="md"
                    as="select"
                    name="tags"
                    value={formik.values.tags}
                    onChange={(e) =>
                      formik.setFieldValue("tags", e.target.value)
                    }
                    // isInvalid={
                    //   !!formik.errors.tags && formik.touched.tags
                    // }
                  >
                    <option disabled selected hidden value="">
                      Select Tags
                    </option>
                    {categories &&
                      categories[0]?.categories.map(
                        (item: string, index: number) => (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        )
                      )}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.tags}
                  </Form.Control.Feedback>
                </Form.Group> */}
                <Form.Label className="col-form-label">Tags</Form.Label>
                <Select
                  isMulti
                  name="tags"
                  options={options}
                  placeholder="Select Tags"
                  value={options.filter((opt) =>
                    formik.values.tags.includes(opt.value)
                  )}
                  onChange={(selected) =>
                    formik.setFieldValue(
                      "tags",
                      selected.map((opt) => opt.value)
                    )
                  }
                  onBlur={() => formik.setFieldTouched("tags", true)}
                  classNamePrefix={
                    formik.touched.tags && formik.errors.tags
                      ? "is-invalid"
                      : ""
                  }
                />
                {formik.touched.tags && formik.errors.tags && (
                  <div
                    className="text-danger mt-1"
                    style={{ fontSize: "11px" }}
                  >
                    {formik.errors.tags}
                  </div>
                )}
              </Col>
              <Col lg={12}>
                  {/* <DatePicker
                      selected={formik.values.date}
                      onChange={(date: Date) => formik.setFieldValue("date", date)}
                    /> */}
                  <DatePicker placeholder="Select Date" style={{zIndex:9999}} />
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

export default AddBlog;
