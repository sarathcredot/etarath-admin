import { useFormik } from "formik";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { PLANS, PLANS_KEY_TYPE } from "src/common/constant.common";
import { ProductValidationSchema } from "src/validations/validationSchemas";
import _ from "lodash";
import { errorMsg } from "src/utils/toast";
import MediaGalleryModal from "src/components/features/modals/media-gallery-modal";
import { useState } from "react";
import { Brand } from "../../brands/BrandsList";
import { useGetAllBrandsCommon } from "src/services/brand.service";
import { useGetAllAttributesCommon } from "src/services/attribute.service";
import { useCreateProduct } from "src/services/product.service";
import { useUploadMultiFile } from "src/services/fileUpload.service";
import { generateFilePath } from "src/services/url.service";
import { useGetAllCategories } from "src/services/product-category.service";

type Props = {
  isOpen: boolean;
  toggle: () => void;
};

const AddProduct = ({ isOpen, toggle }: Props) => {
  // STATES
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isEditUploadedOpen, setIsEditUploadedOpen] = useState<boolean>(false);
  const [editImageIndex, setEditImageIndex] = useState<number>(0);

  // QUERIES
  const {
    data: brands,
    isLoading: brandsLoading,
    error: brandsError,
  } = useGetAllBrandsCommon(isOpen);
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetAllCategories(isOpen);

  const {
    data: attributes,
    isLoading: attributesLoading,
    error: attributesError,
  } = useGetAllAttributesCommon(isOpen);

  // MUTATIONS
  const { mutateAsync: createProduct } = useCreateProduct();
  const { mutateAsync: uploadMultiFile } = useUploadMultiFile();

  //FORMINK
  const formik = useFormik({
    initialValues: {
      productName: "",
      brand: "",
      category: "",
      mrp: "",
      origin: "",
      yearOfManufacturer: "",
      width: "",
      height: "",
      size: "",
      imageUrl: [] as any[],
      description: "",
      features: [""] as string[],
    },
    validationSchema: ProductValidationSchema,

    onSubmit: (values) => {
      console.log(values, "VALUES");
      handleAddProduct(values);
    },
  });

  const handleEditImage = (index: number) => {
    setEditImageIndex(index);
    setIsEditUploadedOpen(true);
  };

  //HANDLERS
  const handleAddProduct = async (values: any) => {
    try {
      // Separate files vs already uploaded URLs
      const files = values.imageUrl.filter(
        (img: any) => typeof img !== "string"
      );
      const urls = values.imageUrl.filter(
        (img: any) => typeof img === "string"
      );

      let uploadedUrls: string[] = [];

      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file: any) => {
          formData.append("files", file?.file);
        });

        const response = await uploadMultiFile(formData);
        uploadedUrls = response.data.data; // assuming API returns array of urls
      }

      // merge old urls + new uploaded urls
      values.imageUrl = [...urls, ...uploadedUrls];

      console.log(values, "VALUES = = = ");

      const res = await createProduct(values);
      console.log(res, "RESPONSE = = = ");
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
  console.log(formik.values?.features, "FEATURES");

  return (
    <>
      <Modal show={isOpen} onHide={toggle} centered={true} size="xl">
        <Modal.Header>
          {/* <Modal.Title>Are you sure?</Modal.Title> */}
          <h3 className="my-2">Add Product</h3>
        </Modal.Header>
        <Form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            <Row className="px-1 px-md-3 ">
              {formik.values.imageUrl?.length > 0 ? (
                formik.values?.imageUrl?.map(
                  (img, index) => (
                    console.log(img, "IMAGE"),
                    (
                      <Col className="px-2 py-1 ">
                        <div>
                          Image {index + 1}
                          <div className="product_image_div mt-1">
                            <img
                              // src={generateFilePath(img)}
                              src={
                                typeof img === "string"
                                  ? generateFilePath(img)
                                  : img.copy_link
                                  ? img.copy_link
                                  : URL.createObjectURL(img?.file)
                              }
                              alt="product"
                              width="150"
                              height="150"
                              // crossOrigin="anonymous"
                            />
                            <div
                              onClick={() => handleEditImage(index)}
                              className="edit_div"
                            >
                              <i className="bx bxs-edit fa "></i>
                            </div>
                          </div>
                        </div>
                      </Col>
                    )
                  )
                )
              ) : (
                <Col lg={12} className="px-2 py-1  ">
                  <div>
                    Product Images
                    <div
                      className={`product_image_div mt-1 ${
                        formik.touched.imageUrl && formik.errors.imageUrl
                          ? "border border-danger"
                          : ""
                      }`}
                      onClick={() => setIsUploadOpen(true)}
                    >
                      <Button variant="dark" className="my-5">
                        Upload  Product Images (4)
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
                  <Form.Label className="col-form-label">
                    Product Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter product name"
                    name="productName"
                    value={formik.values.productName}
                    onChange={formik.handleChange}
                    isInvalid={
                      !!formik.errors.productName && formik.touched.productName
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.productName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={12}>
                <Row>
                  <Col className="px-2 py-1 ">
                    <Form.Group className="align-items-center">
                      <Form.Label className="col-form-label">
                        Category
                      </Form.Label>
                      <Form.Control
                        style={{ color: "#000" }}
                        //   size="md"
                        as="select"
                        name="category"
                        value={formik.values.category}
                        onChange={formik.handleChange}
                        isInvalid={
                          !!formik.errors.category && formik.touched.category
                        }
                      >
                        <option disabled selected hidden value="">
                          Select Category
                        </option>
                        {categories?.map((item: any, index: number) => (
                          <option key={index} value={item?.categoryName}>
                            {item?.categoryName}
                          </option>
                        ))}
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.category}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col className="px-4 py-1 ">
                    <Form.Group as={Row} className="align-items-center">
                      <Form.Label className="col-form-label">Width</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter tyre width"
                        name="width"
                        value={formik.values.width}
                        onChange={formik.handleChange}
                        isInvalid={
                          !!formik.errors.width && formik.touched.width
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.width}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  {formik.values?.category === "Tubes" ||
                  formik.values?.category === "Agriculture" ? null : (
                    <Col className="px-4 py-1 ">
                      <Form.Group as={Row} className="align-items-center">
                        <Form.Label className="col-form-label">
                          Height
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Enter tyre height"
                          name="height"
                          value={formik.values.height}
                          onChange={formik.handleChange}
                          isInvalid={
                            !!formik.errors.height && formik.touched.height
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.height}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  )}
                  <Col className="px-4 py-1 ">
                    <Form.Group as={Row} className="align-items-center">
                      <Form.Label className="col-form-label">
                        Rim Size
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter tyre rim size"
                        name="size"
                        value={formik.values.size}
                        onChange={formik.handleChange}
                        isInvalid={!!formik.errors.size && formik.touched.size}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.size}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>

              <Col lg={6} className=" px-2 py-1 ">
                <Form.Group className="align-items-center">
                  <Form.Label className="col-form-label">Brand</Form.Label>
                  <Form.Control
                    style={{ color: "#000" }}
                    //   size="md"
                    as="select"
                    name="brand"
                    value={formik.values.brand}
                    onChange={formik.handleChange}
                    isInvalid={!!formik.errors.brand && formik.touched.brand}
                  >
                    <option disabled selected hidden value="">
                      Select Brand
                    </option>
                    {brands?.map((item: any, index: number) => (
                      <option key={index} value={item?._id}>
                        {item?.name}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.brand}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={6} className="px-4 py-1 ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">MRP</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter MRP"
                    name="mrp"
                    value={formik.values.mrp}
                    onChange={formik.handleChange}
                    isInvalid={!!formik.errors.mrp && formik.touched.mrp}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.mrp}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={6} className=" px-2 py-1 ">
                <Form.Group className="align-items-center">
                  <Form.Label className="col-form-label">Origin</Form.Label>
                  <Form.Control
                    style={{ color: "#000" }}
                    //   size="md"
                    as="select"
                    name="origin"
                    value={formik.values.origin}
                    onChange={formik.handleChange}
                    isInvalid={!!formik.errors.origin && formik.touched.origin}
                  >
                    <option disabled selected hidden value="">
                      Select Origin
                    </option>
                    {attributes &&
                      attributes?.origin?.map((item: any, index: number) => (
                        <option key={index} value={item?._id}>
                          {item?.value}
                        </option>
                      ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.origin}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={6} className=" px-2 py-1 ">
                <Form.Group className="align-items-center">
                  <Form.Label className="col-form-label">Year</Form.Label>
                  <Form.Control
                    style={{ color: "#000" }}
                    //   size="md"
                    as="select"
                    name="yearOfManufacturer"
                    value={formik.values.yearOfManufacturer}
                    onChange={formik.handleChange}
                    isInvalid={
                      !!formik.errors.yearOfManufacturer &&
                      formik.touched.yearOfManufacturer
                    }
                  >
                    <option disabled selected hidden value="">
                      Select year
                    </option>
                    {attributes &&
                      attributes?.yearOfManufacturer?.map(
                        (item: any, index: number) => (
                          <option key={index} value={item?._id}>
                            {item?.value}
                          </option>
                        )
                      )}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.yearOfManufacturer}
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
                                // style={{ background: "#000" }}
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
        limit={4}
        onClose={(files: any) => {
          formik.setFieldValue("imageUrl", files);
          setIsUploadOpen(!isUploadOpen);
        }}
        objectFit="contain"
      />
      <MediaGalleryModal
        isOpen={isEditUploadedOpen}
        onClose={(files: any) => {
          if (!files || files.length === 0) {
            setIsEditUploadedOpen(false);
            setEditImageIndex(0);
            return;
          }
          console.log("files = ", files);
          const images = [...formik.values.imageUrl]; // clone
          images[editImageIndex] = files[0];

          formik.setFieldValue("imageUrl", images);
          setIsEditUploadedOpen(false);
          setEditImageIndex(0);
        }}
        chooseOne={true}
        objectFit="contain"
      />
    </>
  );
};

export default AddProduct;
