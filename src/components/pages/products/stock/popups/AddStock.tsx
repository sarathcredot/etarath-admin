import { useFormik } from "formik";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  ProductValidationSchema,
  StockValidationSchema,
} from "src/validations/validationSchemas";
import _ from "lodash";
import { errorMsg } from "src/utils/toast";
import MediaGalleryModal from "src/components/features/modals/media-gallery-modal";
import { useState } from "react";
import { useGetAllBrands } from "src/services/brand.service";
import { useGetAllAttributes } from "src/services/attribute.service";
import {
  useCreateProduct,
  useGetProductById,
} from "src/services/product.service";
import { useUploadMultiFile } from "src/services/fileUpload.service";
import { generateFilePath } from "src/services/url.service";
import { Product } from "../../ProductsList";
import Select from "react-select";
import { useGetAllVendors } from "src/services/vendor.service";
import { useCreateStock } from "src/services/stock.service";

type Props = {
  isOpen: boolean;
  toggle: () => void;
  productId: string;
};

const AddStock = ({ isOpen, toggle, productId }: Props) => {
  // STATES
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isEditUploadedOpen, setIsEditUploadedOpen] = useState<boolean>(false);
  const [editImageIndex, setEditImageIndex] = useState<number>(0);

  //QUERIES

  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useGetProductById(productId ? productId : "", !!productId) as {
    data: Product | undefined;
    isLoading: boolean;
    error: unknown;
  };

  const {
    data: brands,
    isLoading: brandsLoading,
    error: brandsError,
  } = useGetAllBrands(isOpen);

  const {
    data: attributes,
    isLoading: attributesLoading,
    error: attributesError,
  } = useGetAllAttributes(isOpen);

  const { data: vendors, isLoading, error } = useGetAllVendors(isOpen);

  // MUTATIONS
  const { mutateAsync: createStock } = useCreateStock();
  const { mutateAsync: uploadMultiFile } = useUploadMultiFile();

  //FORMINK
  const formik = useFormik({
    initialValues: {
      stock: "",
      price: "",
      requestedBy: "",
      warrantyPeriod: "",
    },
    validationSchema: StockValidationSchema,

    onSubmit: (values) => {
      console.log(values, "VALUES");
      handleAddStock(values);
    },
  });

  //HANDLERS
  const handleAddStock = async (values: any) => {
    try {
      const res = await createStock({ productId, data: values });
      console.log(res, "= = = RESPONSE  ");
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
      <Modal show={isOpen} onHide={toggle} centered={true} size="lg">
        <Modal.Header>
          {/* <Modal.Title>Are you sure?</Modal.Title> */}
          <h3 className="my-2">Add Stock</h3>
        </Modal.Header>
        <Form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            <Row className="px-1 px-md-3 ">
              {product &&
                product?.imageUrl?.map((img, index) => (
                  <Col key={index} className="px-2 py-1 ">
                    <div>
                      <div className="product_image_div mt-1">
                        <img
                          src={generateFilePath(img)}
                          alt="product"
                          width="100"
                          height="100"
                          crossOrigin="anonymous"
                        />
                      </div>
                    </div>
                  </Col>
                ))}
            </Row>
            <Row className="px-1 px-md-3 pt-md-3 ">
              <Col lg={12} className="px-4 py-1  ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">
                    Product Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={product?.productName || ""}
                    disabled
                  />
                </Form.Group>
              </Col>
              {/*<Col lg={6} className=" px-4 py-1 ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">Brand</Form.Label>
                  <Form.Control
                    type="text"
                    value={product?.brand?.name || ""}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col lg={6} className="px-4 py-1 ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">Category</Form.Label>
                  <Form.Control
                    type="text"
                    value={product?.category || ""}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col lg={6} className=" px-4 py-1 ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">Origin</Form.Label>
                  <Form.Control
                    type="text"
                    value={product?.origin || ""}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col lg={6} className=" px-4 py-1 ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">Year</Form.Label>
                  <Form.Control
                    type="text"
                    value={product?.yearOfManufacturer || ""}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col lg={4} className="px-4 py-1 ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">Width</Form.Label>
                  <Form.Control
                    type="text"
                    value={product?.width || ""}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col lg={4} className="px-4 py-1 ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">Height</Form.Label>
                  <Form.Control
                    type="text"
                    value={product?.height || ""}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col lg={4} className="px-4 py-1 ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">Rim Size</Form.Label>
                  <Form.Control
                    type="text"
                    value={product?.size || ""}
                    disabled
                  />
                </Form.Group>
              </Col> */}
              <Col lg={6} className="px-4 py-1  ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter the quantity"
                    name="stock"
                    value={formik.values.stock}
                    onChange={formik.handleChange}
                    isInvalid={!!formik.errors.stock && formik.touched.stock}
                    autoFocus
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.stock}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={6} className="px-4 py-1  ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">Sale Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter sale price"
                    name="price"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    isInvalid={!!formik.errors.price && formik.touched.price}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.price}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={6} className="px-4 py-1  ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">
                    Warranty Period
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter warranty period"
                    name="warrantyPeriod"
                    value={formik.values.warrantyPeriod}
                    onChange={formik.handleChange}
                    isInvalid={
                      !!formik.errors.warrantyPeriod &&
                      formik.touched.warrantyPeriod
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.warrantyPeriod}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={6} className="px-2 py-1">
                <Form.Group>
                  <Form.Label className="col-form-label">Vendor</Form.Label>
                  <Select
                    options={vendors?.map((item: any) => ({
                      value: item?._id,
                      label: item?.userName || item?.email,
                    }))}
                    value={vendors
                      ?.map((item: any) => ({
                        value: item?._id,
                        label: item?.userName || item?.email,
                      }))
                      .find(
                        (opt: any) => opt.value === formik.values.requestedBy
                      )}
                    onChange={(selected: any) =>
                      formik.setFieldValue("requestedBy", selected?.value || "")
                    }
                    placeholder="Select Vendor"
                    isSearchable
                    classNamePrefix="react-select"
                  />
                  {formik.errors.requestedBy && formik.touched.requestedBy && (
                    <div className="invalid-feedback d-block">
                      {formik.errors.requestedBy}
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
        limit={4}
        onClose={(files: any) => {
          formik.setFieldValue("imageUrl", files);
          setIsUploadOpen(!isUploadOpen);
        }}
        objectFit="contain"
      />
    </>
  );
};

export default AddStock;
