import { useFormik } from "formik";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { StockValidationSchema } from "src/validations/validationSchemas";
import _, { capitalize } from "lodash";
import { errorMsg } from "src/utils/toast";
import MediaGalleryModal from "src/components/features/modals/media-gallery-modal";
import { useEffect, useState } from "react";
import { useGetAllProducts } from "src/services/product.service";
import Select from "react-select";
import { useGetAllVendors } from "src/services/vendor.service";
import { useCreateStock } from "src/services/stock.service";

type Props = {
  isOpen: boolean;
  toggle: () => void;
  vendorId: string;
};

const AddStock = ({ isOpen, toggle, vendorId }: Props) => {
  // STATES
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  //QUERIES
  const { data: products, isLoading: isProductsLoading }: any =
    useGetAllProducts({
      query: { status: "approved", isSuspend: "false" },
      enabled: isOpen,
    });

  const { data: vendors, isLoading, error } = useGetAllVendors(isOpen);

  // MUTATIONS
  const { mutateAsync: createStock } = useCreateStock();

  //FORMINK
  const formik = useFormik({
    initialValues: {
      productId: "",
      stock: "",
      price: "",
      requestedBy: "",
      warrantyPeriod: "",
      warranty_type: "",
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
      const res = await createStock({
        productId: values.productId,
        data: values,
      });
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

  useEffect(() => {
    if (vendorId) {
      formik.setFieldValue("requestedBy", vendorId);
    }
  }, [isOpen, vendorId]);

  return (
    <>
      <Modal show={isOpen} onHide={toggle} centered={true} size="lg">
        <Modal.Header>
          {/* <Modal.Title>Are you sure?</Modal.Title> */}
          <h3 className="my-2">Add Product</h3>
        </Modal.Header>
        <Form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            {/* <Row className="px-1 px-md-3 ">
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
            </Row> */}
            <Row className="px-1 px-md-3  ">
              <Col lg={12} className="px-2 py-1">
                <Form.Group>
                  <Form.Label className="col-form-label">
                    Select Product
                  </Form.Label>
                  <Select
                    options={products?.result?.map((item: any) => ({
                      value: item?._id,
                      label: `${item?.productName} - ${item?.width}/${item?.height} ${item?.size}`,
                    }))}
                    value={products?.result
                      ?.map((item: any) => ({
                        value: item?._id,
                        label: `${item?.productName} - ${item?.width}/${item?.height} ${item?.size}`,
                      }))
                      .find(
                        (opt: any) => opt.value === formik.values.productId
                      )}
                    onChange={(selected: any) =>
                      formik.setFieldValue("productId", selected?.value || "")
                    }
                    placeholder="Select Product"
                    isSearchable
                    classNamePrefix="react-select"
                    autoFocus
                  />
                  {formik.errors.productId && formik.touched.productId && (
                    <div className="invalid-feedback d-block">
                      {formik.errors.productId}
                    </div>
                  )}
                </Form.Group>
              </Col>
              {/* <Col lg={12} className="px-2 py-1">
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
                <Form.Group className="align-items-center">
                  <Form.Label className="col-form-label">
                    Warranty Type
                  </Form.Label>
                  <Form.Control
                    style={{ color: "#000" }}
                    //   size="md"
                    as="select"
                    name="warranty_type"
                    value={formik.values.warranty_type}
                    onChange={(e) =>
                      formik.setFieldValue("warranty_type", e.target.value)
                    }
                    isInvalid={
                      !!formik.errors.warranty_type &&
                      formik.touched.warranty_type
                    }
                  >
                    <option disabled selected hidden value="">
                      Select Type
                    </option>
                    {["month", "year"].map((item: string, index: number) => (
                      <option key={index} value={item}>
                        {capitalize(item)}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.warranty_type}
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
