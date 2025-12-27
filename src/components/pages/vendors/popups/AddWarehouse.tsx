import { useFormik } from "formik";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  StockValidationSchema,
  WarehouseValidationSchema,
} from "src/validations/validationSchemas";
import _, { capitalize } from "lodash";
import { errorMsg } from "src/utils/toast";
import MediaGalleryModal from "src/components/features/modals/media-gallery-modal";
import { useEffect, useState } from "react";
import { useGetAllProducts } from "src/services/product.service";
import Select from "react-select";
import { useGetAllVendors } from "src/services/vendor.service";
import { useCreateStock } from "src/services/stock.service";
import { Country, State, City } from "country-state-city";
import { useCreateWarehouse } from "src/services/warehouse.service";
import { useUploadFile } from "src/services/fileUpload.service";

type Props = {
  isOpen: boolean;
  toggle: () => void;
  vendorId: string;
};

const AddWarehouse = ({ isOpen, toggle, vendorId }: Props) => {
  // STATES
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [locations, setLocations] = useState<
    { label: string; value: string }[]
  >([]);
  const uaeCountry: any = Country.getAllCountries().find(
    (c) => c.isoCode === "AE"
  ); // UAE country code
  const allCities: { label: string; value: string }[] = [];
  const res = State.getStatesOfCountry(uaeCountry.isoCode);
  useEffect(() => {
    res?.map((state) => {
      City.getCitiesOfState(uaeCountry.isoCode, state.isoCode).forEach(
        (city) => {
          // allCities.push({
          //   label: `${city.name}, ${state.name}`, // optional: add state
          //   value: city.name,
          // });
          allCities.push({ label: city.name, value: city.name });
        }
      );
    });
    console.log("loc", allCities);
    setLocations(allCities);
  }, []);

  //QUERIES
  const { data: products, isLoading: isProductsLoading }: any =
    useGetAllProducts({
      query: { status: "approved", isSuspend: "false" },
      enabled: isOpen,
    });

  const { data: vendors, isLoading, error } = useGetAllVendors(isOpen);

  // MUTATIONS
  const { mutateAsync: createWarehouse } = useCreateWarehouse();
  const { mutateAsync: uploadFile } = useUploadFile();

  //FORMINK
  const formik = useFormik({
    initialValues: {
      shop_name: "",
      location: "",
      address: "",
      shop_photo_logo: "" as any,
    },
    validationSchema: WarehouseValidationSchema,

    onSubmit: (values) => {
      console.log(values, "VALUES");
      handleAddWarehouse(values);
    },
  });

  //HANDLERS
  const handleAddWarehouse = async (values: any) => {
    try {
      if (typeof values?.shop_photo_logo !== "string") {
        let formData = new FormData();
        formData.append("file", values?.shop_photo_logo.file);
        let response = await uploadFile(formData);
        values.shop_photo_logo = response.data.data;
      }
      const res = await createWarehouse({
        vendorId: vendorId,
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
      <Modal show={isOpen} onHide={toggle} centered={true}>
        <Modal.Header>
          {/* <Modal.Title>Are you sure?</Modal.Title> */}
          <h3 className="my-2">Add Warehouse</h3>
        </Modal.Header>
        <Form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            <Row className="px-1 px-md-3  ">
              <Col className="px-2 py-1" lg={12}>
                {formik.values.shop_photo_logo ? (
                  <Col lg={12} className="px-0 py-1">
                    <div>
                      Warehouse Image
                      <div
                        className="warehouse_image_div mt-1"
                        style={{ height: "180px", width: "100%" }}
                      >
                        <img
                          src={
                            typeof formik.values.shop_photo_logo === "string"
                              ? formik.values.shop_photo_logo
                              : formik.values.shop_photo_logo.copy_link
                              ? formik.values.shop_photo_logo.copy_link
                              : URL.createObjectURL(
                                  formik.values.shop_photo_logo?.file
                                )
                          }
                          alt="brand logo"
                          width={"100%"}
                          height={"100%"}
                          style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                            background: "#000",
                          }}
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
                      Warehouse Image
                      <div
                        className="product_image_div mt-1"
                        onClick={() => setIsUploadOpen(true)}
                        style={{ height: "180px" }}
                      >
                        <Button variant="dark" className="">
                          Upload Warehouse Image
                        </Button>
                      </div>
                    </div>
                  </Col>
                )}
                {formik.touched.shop_photo_logo &&
                  formik.errors.shop_photo_logo && (
                    <div className="text-danger small mt-1 px-2">
                      {formik.errors.shop_photo_logo}
                    </div>
                  )}
              </Col>
              <Col lg={12} className="px-4 py-1  ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">
                    Warehouse Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Warehouse Name"
                    name="shop_name"
                    value={formik.values.shop_name}
                    onChange={formik.handleChange}
                    isInvalid={
                      !!formik.errors.shop_name && formik.touched.shop_name
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.shop_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={12} className="px-4 py-1  ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">
                    Warehouse Address
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Warehouse Address"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    isInvalid={
                      !!formik.errors.address && formik.touched.address
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.address}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={12} className="px-2 py-1">
                <Form.Group>
                  <Form.Label className="col-form-label">Location</Form.Label>
                  <Select
                    options={locations}
                    value={locations.filter((opt) =>
                      formik.values.location.includes(opt.value)
                    )}
                    onChange={(selected: any) =>
                      formik.setFieldValue("location", selected?.value || "")
                    }
                    placeholder="Select Location"
                    isSearchable
                    classNamePrefix="react-select"
                    autoFocus
                  />
                  {formik.errors.location && formik.touched.location && (
                    <div className="invalid-feedback d-block">
                      {formik.errors.location}
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
                <Button variant="dark" type="submit">
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
          formik.setFieldValue("shop_photo_logo", files[0]);
          setIsUploadOpen(!isUploadOpen);
        }}
        objectFit="contain"
      />
    </>
  );
};

export default AddWarehouse;
