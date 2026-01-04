import { DatePicker } from "antd";
import dayjs from "dayjs";
import { useFormik } from "formik";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import MediaGalleryModal from "src/components/features/modals/media-gallery-modal";
import { Editor } from "react-draft-wysiwyg";
import { useGetAllBlogCategories } from "src/services/blog.category.service";
import { useUpdateBlog, useGetSingleBlog } from "src/services/blog.service";
import { useGetAllBlogTags } from "src/services/blog.tag.service";
import { useUploadFile } from "src/services/fileUpload.service";
import { useAddOffer } from "src/services/offer.service";
import { generateFilePath } from "src/services/url.service";
import { errorMsg } from "src/utils/toast";
// import DatePicker from 'react-datepicker';
import {
  BlogValidationSchema,
  OfferValidationSchema,
} from "src/validations/validationSchemas";
import {
  ContentState,
  convertFromHTML,
  convertToRaw,
  EditorState,
} from "draft-js";
import draftToHtml from "draftjs-to-html";

type Props = {
  isOpen: boolean;
  toggle: () => void;
  blogId: string;
};

interface BlogFormValues {
  title: string;
  content: EditorState;
  tags: string[];
  category: string;
  date: string | null;
  imgUrl: any;
}
export const dateFormat = "DD-MM-YYYY";

const EditBlog = ({ isOpen, toggle, blogId }: Props) => {
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

  const {
    data: blog,
    isLoading: isBlogLoading,
    error: blogError,
  }: any = useGetSingleBlog(blogId, !!blogId);

  console.log({ tags });

  // MUTATIONS
  const { mutateAsync: updateBlog } = useUpdateBlog();
  const { mutateAsync: uploadFile } = useUploadFile();

  //FORMINK
  const formik = useFormik<BlogFormValues>({
    initialValues: {
      title: "",
      content: EditorState.createEmpty(),
      tags: [] as string[],
      category: "",
      date: null,
      imgUrl: "" as any,
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
      const payload = {
        ...values,
        content: draftToHtml(convertToRaw(values.content.getCurrentContent())),
      };

      if (typeof payload.imgUrl !== "string") {
        const formData = new FormData();
        formData.append("file", payload.imgUrl.file);
        const response = await uploadFile(formData);
        payload.imgUrl = response.data.data;
      }

      const res = await updateBlog({id:blogId , data:payload});
      toast(res?.data?.message, {
        containerId: "default",
        className: "no-icon notification-success",
      });
      formik.resetForm({
        values: {
          ...formik.initialValues,
          content: EditorState.createEmpty(),
        },
      });
      toggle();
    } catch (error: any) {
      toast(_.capitalize(errorMsg(error).toLowerCase()), {
        containerId: "default",
        className: "no-icon notification-danger",
      });
    }
  };

  useEffect(() => {
    if (blog) {
      let contentState = EditorState.createEmpty();

      if (blog.content) {
        const blocksFromHTML = convertFromHTML(blog.content);
        contentState = EditorState.createWithContent(
          ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
          )
        );
      }

      formik.setValues({
        title: blog.title || "",
        content: contentState,
        tags: blog.tags || [],
        category: blog.category || "",
        date: blog.date || null,
        imgUrl: blog.imgUrl || "",
      });
    }
  }, [blog]);
  console.log(formik.errors, "FORMIK ERRORS");

  return (
    <>
      <Modal show={isOpen} onHide={toggle} size="lg" centered={true}>
        <Modal.Header>
          <h3 className="my-2">Add Blog</h3>
        </Modal.Header>
        <Form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            <Row className="px-1 px-md-3 ">
              {formik.values.imgUrl ? (
                <Col lg={12} className="px-2 py-1 ">
                  <div>
                    Blog Image
                    <div className="user_image_div mt-1">
                      <img
                        src={
                          typeof formik.values.imgUrl === "string"
                            ? generateFilePath(formik.values.imgUrl)
                            : formik.values.imgUrl.copy_link
                              ? formik.values.imgUrl.copy_link
                              : URL.createObjectURL(formik.values.imgUrl?.file)
                        }
                        alt="blog"
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
                  {formik.touched.imgUrl && formik.errors.imgUrl && (
                    <div className="text-danger small mt-1 px-2">
                      {formik.errors.imgUrl}
                    </div>
                  )}
                </Col>
              )}

              <Col lg={6} className="px-4 py-1  ">
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
              <Col lg={6} className=" px-2 py-1 ">
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
                      categories?.data?.[0]?.categories?.map(
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
              <Col lg={6} className=" px-2 py-1 ">
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
                  options={
                    tags
                      ? tags?.data?.[0]?.tags?.map((tag: string) => ({
                        label: tag,
                        value: tag,
                      }))
                      : []
                  }
                  placeholder="Select Tags"
                  value={
                    tags
                      ? tags?.data?.[0]?.tags
                        .map((tag: string) => ({ label: tag, value: tag }))
                        .filter((opt: { label: string; value: string }) =>
                          formik.values.tags.includes(opt.value)
                        )
                      : []
                  }
                  onChange={(selected: any) =>
                    formik.setFieldValue(
                      "tags",
                      selected ? selected.map((opt: any) => opt.value) : []
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
              <Col lg={6} className="px-4 py-1">
                <Form.Group as={Row} style={{ flexDirection: "column" }}>
                  <Form.Label className="col-form-label">Date</Form.Label>

                  <DatePicker
                    className={
                      formik.errors.date && formik.touched.date
                        ? "is-invalid"
                        : ""
                    }
                    format={dateFormat}
                    value={
                      formik.values.date
                        ? dayjs(formik.values.date)
                        : null
                    }
                    onChange={(date) => {
                      requestAnimationFrame(() => {
                        formik.setFieldValue(
                          "date",
                          date ? date.toISOString() : ""
                        );
                      });
                    }}
                    getPopupContainer={(triggerNode) => {
                      const modal = triggerNode.closest(
                        ".modal-body"
                      ) as HTMLElement | null;
                      return modal || document.body;
                    }}
                    style={{ height: "38px" }}
                  />

                  {formik.errors.date && formik.touched.date && (
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.date}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col lg={12} className="px-4 pb-1">
                <Form.Group as={Row} style={{ flexDirection: "column" }}>
                  <Form.Label className="col-form-label">Content</Form.Label>

                  <Editor
                    editorState={formik.values.content}
                   editorClassName="editor-content"
                    editorStyle={{ minHeight: "200px" }}
                    onEditorStateChange={(state: EditorState) =>
                      formik.setFieldValue("content", state)
                    }
                  />

                  {formik.errors.content && formik.touched.content && (
                    <div
                      className="text-danger mt-1"
                      style={{ fontSize: "11px" }}
                    >
                      {formik.errors.content}
                    </div>
                  )}
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

export default EditBlog;
