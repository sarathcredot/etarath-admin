import { useFormik } from "formik";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  StockValidationSchema,
  WarehouseValidationSchema,
  AgentValidationSchema
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
import { useCreateAgent } from "src/services/salesAgent.service"
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import LocationInput from "src/components/common/LocationInput";

type Props = {
  isOpen: boolean;
  toggle: () => void;
  vendorId: string;
};

const AddAgent = ({ isOpen, toggle, vendorId }: Props) => {
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
  const { mutateAsync: createAgent } = useCreateAgent();
  const { mutateAsync: uploadFile } = useUploadFile();

  //FORMINK
  const formik = useFormik({
    initialValues: {
      userName: "",
      imgUrl: "" as any,
      email: "",
      phoneNumber: "",
      role: "",
      location: "",
      salesAgentTarget: "" as any,
      salesAgentOwner: "" as any

    },

    validationSchema: AgentValidationSchema,

    onSubmit: (values) => {
      console.log(values, "VALUES");
      handleAddWarehouse(values);
    },
  });

  //HANDLERS
  const handleAddWarehouse = async (values: any) => {
    try {
      console.log("data", values)

      if (typeof values?.imgUrl !== "string") {
        let formData = new FormData();
        formData.append("file", values?.imgUrl.file);
        let response = await uploadFile(formData);
        values.imgUrl = response.data.data;
      }


      const res = await createAgent({
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
      formik.setFieldValue("salesAgentOwner", vendorId);
      formik.setFieldValue("role", "sales_executive");
    }
  }, [isOpen, vendorId]);

  return (
    <>
      <Modal show={isOpen} onHide={toggle} centered={true}>
        <Modal.Header>
          {/* <Modal.Title>Are you sure?</Modal.Title> */}
          <h3 className="my-2">Add Sales executive</h3>
        </Modal.Header>
        <Form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            <Row className="px-1 px-md-3  ">
              <Col className="px-2 py-1" lg={12}>
                {formik.values.imgUrl ? (
                  <Col lg={12} className="px-0 py-1">
                    <div>
                      Profile Image
                      <div
                        className="warehouse_image_div mt-1"
                        style={{ height: "180px", width: "100%" }}
                      >
                        <img
                          src={
                            typeof formik.values.imgUrl === "string"
                              ? formik.values.imgUrl
                              : formik.values.imgUrl.copy_link
                                ? formik.values.imgUrl.copy_link
                                : URL.createObjectURL(
                                  formik.values.imgUrl?.file
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
                      Profile Image
                      <div
                        className="product_image_div mt-1"
                        onClick={() => setIsUploadOpen(true)}
                        style={{ height: "180px" }}
                      >
                        <Button variant="dark" className="">
                          Upload image
                        </Button>
                      </div>
                    </div>
                  </Col>
                )}
                {formik.touched.imgUrl &&
                  formik.errors.imgUrl && (
                    <div className="text-danger small mt-1 px-2">
                      {formik.errors.imgUrl}
                    </div>
                  )}
              </Col>
              <Col lg={12} className="px-4 py-1  ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">
                    Full Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Full Name"
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
              </Col>
              <Col lg={12} className="px-4 py-1  ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">
                    Email
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    isInvalid={
                      !!formik.errors.email && formik.touched.email
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>



              {/* <Col lg={12} className="px-4 py-1  ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">
                    Phone Number
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Phone Number"
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
              </Col> */}

              <Col lg={12} className="px-2 py-1">
                <Form.Group>
                  <Form.Label className="col-form-label">
                    Phone Number
                  </Form.Label>

                  <PhoneInput
                    international
                    defaultCountry="IN"
                    countryCallingCodeEditable={true}   // ✅ manual +91 allowed
                    placeholder="Phone Number"
                    value={formik.values.phoneNumber}
                    onChange={(value) =>
                      formik.setFieldValue("phoneNumber", value)
                    }
                    onBlur={() =>
                      formik.setFieldTouched("phoneNumber", true)
                    }
                    // disabled={isEdit}
                    className={`phone-bootstrap ${formik.touched.phoneNumber &&
                      formik.errors.phoneNumber
                      ? "is-invalid"
                      : ""
                      }`}
                  />

                  {formik.touched.phoneNumber &&
                    formik.errors.phoneNumber && (
                      <div className="invalid-feedback d-block">
                        {formik.errors.phoneNumber}
                      </div>
                    )}
                </Form.Group>
              </Col>




              {/* <Col lg={12} className="px-2 py-1">
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
 */}

              <Col lg={12} className="px-2 py-1">
                <Form.Label className="col-form-label"> Location</Form.Label>

                <LocationInput
                  placeholder="Select Location"
                  value={formik.values.location}
                  onChange={(val: any) => formik.setFieldValue("location", val)}
                  onBlur={() => formik.setFieldTouched("location", true)}
                  isInvalid={formik.touched.location && !!formik.errors.location}
                />

                {formik.touched.location && formik.errors.location && (
                  <div className="text-danger mt-1" style={{ fontSize: "11px" }}>
                    {formik.errors.location}
                  </div>
                )}
              </Col>





              <Col lg={12} className="px-4 py-1  ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">
                    Monthly Target
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Monthly Target"
                    name="salesAgentTarget"
                    value={formik.values.salesAgentTarget}
                    onChange={formik.handleChange}
                  // isInvalid={
                  //   !!formik.errors.salesAgentTarget && formik.touched.salesAgentTarget
                  // }
                  />
                  <Form.Control.Feedback type="invalid">
                    {/* {formik.errors.salesAgentTarget} */}
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
          formik.setFieldValue("imgUrl", files[0]);
          setIsUploadOpen(!isUploadOpen);
        }}
        objectFit="contain"
      />
    </>
  );
};

export default AddAgent;
