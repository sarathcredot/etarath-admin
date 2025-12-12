import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import MediaGalleryModal from "src/components/features/modals/media-gallery-modal";
import { errorMsg } from "src/utils/toast";
import { VendorEditKycValidationSchema } from "src/validations/validationSchemas";
import _ from "lodash";
import { useUploadFile } from "src/services/fileUpload.service";
import {
  useGetKycDetailsByVendorId,
  useUpdateVendorKyc,
} from "src/services/vendor-kyc.service";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import Select from "react-select";

type Props = {
  isOpen: boolean;
  toggle: () => void;
  userId: string;
};

const BUSSINESS_TYPES = [
  "TIRE TRADING",
  "TIRE WHOLESALER",
  "TIRE RETAILER",
  "TIRE IMPORTER",
  "TIRE EXPORTER",
  "TIRE DISTRIBUTOR",
  "TIRE MANUFACTURER",
  "TIRE RESELLER",
  "TIRE SERVICE CENTER",
  "TIRE RECYCLING FACILITY",
];

const locations = [
  { value: "AFG", label: "AFG" },
  { value: "ALB", label: "ALB" },
  { value: "DZA", label: "DZA" },
  { value: "USA", label: "USA" },
  { value: "ARG", label: "ARG" },
  { value: "ARM", label: "ARM" },
  { value: "AUS", label: "AUS" },
  { value: "AUT", label: "AUT" },
  { value: "BGD", label: "BGD" },
  { value: "BEL", label: "BEL" },
  { value: "BRA", label: "BRA" },
  { value: "GBR", label: "GBR" },
  { value: "BGR", label: "BGR" },
  { value: "CAN", label: "CAN" },
  { value: "CHL", label: "CHL" },
  { value: "CHN", label: "CHN" },
  { value: "COL", label: "COL" },
  { value: "HRV", label: "HRV" },
  { value: "CZE", label: "CZE" },
  { value: "DNK", label: "DNK" },
  { value: "NLD", label: "NLD" },
  { value: "EGY", label: "EGY" },
  { value: "ARE", label: "ARE" },
  { value: "EST", label: "EST" },
  { value: "FIN", label: "FIN" },
  { value: "FRA", label: "FRA" },
  { value: "GEO", label: "GEO" },
  { value: "DEU", label: "DEU" },
  { value: "GRC", label: "GRC" },
  { value: "HUN", label: "HUN" },
  { value: "ISL", label: "ISL" },
  { value: "IND", label: "IND" },
  { value: "IDN", label: "IDN" },
  { value: "IRN", label: "IRN" },
  { value: "IRQ", label: "IRQ" },
  { value: "IRL", label: "IRL" },
  { value: "ISR", label: "ISR" },
  { value: "ITA", label: "ITA" },
  { value: "JPN", label: "JPN" },
  { value: "JOR", label: "JOR" },
  { value: "KEN", label: "KEN" },
  { value: "KWT", label: "KWT" },
  { value: "LVA", label: "LVA" },
  { value: "LBN", label: "LBN" },
  { value: "LTU", label: "LTU" },
  { value: "MYS", label: "MYS" },
  { value: "MEX", label: "MEX" },
  { value: "MAR", label: "MAR" },
  { value: "NPL", label: "NPL" },
  { value: "NZL", label: "NZL" },
  { value: "NGA", label: "NGA" },
  { value: "NOR", label: "NOR" },
  { value: "PAK", label: "PAK" },
  { value: "PER", label: "PER" },
  { value: "PHL", label: "PHL" },
  { value: "POL", label: "POL" },
  { value: "PRT", label: "PRT" },
  { value: "QAT", label: "QAT" },
  { value: "ROU", label: "ROU" },
  { value: "RUS", label: "RUS" },
  { value: "SAU", label: "SAU" },
  { value: "SRB", label: "SRB" },
  { value: "SGP", label: "SGP" },
  { value: "SVK", label: "SVK" },
  { value: "SVN", label: "SVN" },
  { value: "ZAF", label: "ZAF" },
  { value: "KOR", label: "KOR" },
  { value: "ESP", label: "ESP" },
  { value: "LKA", label: "LKA" },
  { value: "SWE", label: "SWE" },
  { value: "CHE", label: "CHE" },
  { value: "SYR", label: "SYR" },
  { value: "THA", label: "THA" },
  { value: "TUR", label: "TUR" },
  { value: "UGA", label: "UGA" },
  { value: "UKR", label: "UKR" },
  { value: "URY", label: "URY" },
  { value: "UZB", label: "UZB" },
  { value: "VEN", label: "VEN" },
  { value: "VNM", label: "VNM" },
  { value: "YEM", label: "YEM" },
  { value: "ZMB", label: "ZMB" },
  { value: "ZWE", label: "ZWE" },
];

const EditBussinessDetails = ({ isOpen, toggle, userId }: Props) => {
  console.log(userId, "= = VENDOR ID");
  // STATES
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  // QUERIES
  const {
    data: kycDetails,
    isLoading,
    refetch,
  } = useGetKycDetailsByVendorId(userId ? userId : "", !!userId);

  // MUTATIONS
  const { mutateAsync: updateVendorKyc } = useUpdateVendorKyc();
  const { mutateAsync: uploadFile } = useUploadFile();

  //FORMINK
  const formikKyc = useFormik({
    initialValues: {
      shop_name: "",
      business_type: "",
      shop_location: "",
      tradeLicenseNumber: "",
      documents: {
        tradeLicense: "" as any,
      },
      shop_address: "",
      city: "",
      post: "",
      business_hours: "",
      shop_contact_number: "",
      shop_photo_logo: "" as any,
    },
    validationSchema: VendorEditKycValidationSchema,

    onSubmit: (values) => {
      console.log(values, "VALUES");
      handleEditVendorKyc(values);
    },
  });

  //HANDLERS
  const handleEditVendorKyc = async (values: any) => {
    if (userId) {
      try {
        if (typeof values?.documents?.tradeLicense !== "string") {
          let formData = new FormData();
          formData.append("file", values?.documents?.tradeLicense);
          let response = await uploadFile(formData);
          values.documents.tradeLicense = response.data.data;
        }
        if (typeof values?.shop_photo_logo !== "string") {
          let formData = new FormData();
          formData.append("file", values?.shop_photo_logo);
          let response = await uploadFile(formData);
          values.shop_photo_logo = response.data.data;
        }
        values.shop_contact_number = values.shop_contact_number.toString();
        const res = await updateVendorKyc({ userId, data: values });
        if (res.status === 200) {
          toast(res?.data?.message, {
            containerId: "default",
            className: "no-icon notification-success",
          });
          formikKyc.resetForm();
          toggle();
        }
      } catch (error: any) {
        toast(_.capitalize(errorMsg(error).toLowerCase()), {
          containerId: "default",
          className: "no-icon notification-danger",
        });
      }
    } else {
      toast("Vendor ID is missing", {
        containerId: "default",
        className: "no-icon notification-danger",
      });
    }
  };

  useEffect(() => {
    if (kycDetails) {
      formikKyc.setValues({
        shop_name: kycDetails?.shop_name ? kycDetails?.shop_name : "",
        business_type: kycDetails?.business_type
          ? kycDetails?.business_type
          : "",
        shop_location: kycDetails?.shop_location
          ? kycDetails?.shop_location
          : "",
        tradeLicenseNumber: kycDetails?.tradeLicenseNumber
          ? kycDetails?.tradeLicenseNumber
          : "",
        documents: {
          tradeLicense: kycDetails?.documents?.tradeLicense
            ? kycDetails?.documents?.tradeLicense
            : "",
        },
        shop_address: kycDetails?.shop_address ? kycDetails?.shop_address : "",
        city: kycDetails?.city ? kycDetails?.city : "",
        post: kycDetails?.post ? kycDetails?.post : "",
        business_hours: kycDetails?.business_hours
          ? kycDetails?.business_hours
          : "",
        shop_contact_number: kycDetails?.shop_contact_number
          ? kycDetails?.shop_contact_number
          : "",
        shop_photo_logo: kycDetails?.shop_photo_logo
          ? kycDetails?.shop_photo_logo
          : "",
      });
    }
  }, [userId, kycDetails]);

  const timeFormat = "HH:mm";
  console.log(formikKyc.values, "VALUES");
  console.log(formikKyc.errors, "ERRORS");
  return (
    <>
      <Modal show={isOpen} onHide={toggle} centered={true} size="xl">
        <Modal.Header>
          <h3 className="my-2">Edit Business Details</h3>
        </Modal.Header>
        <Form onSubmit={formikKyc.handleSubmit}>
          <Modal.Body>
            <Row className="px-1 px-md-3 ">
              <Col lg={6} className="px-4 py-1  ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">Shop Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Shop Name"
                    name="shop_name"
                    value={formikKyc.values.shop_name}
                    onChange={formikKyc.handleChange}
                    isInvalid={
                      !!formikKyc.errors.shop_name &&
                      formikKyc.touched.shop_name
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formikKyc.errors.shop_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={6} className="px-4 py-1  ">
                {/* <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">
                    Business Type
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Business Type"
                    name="business_type"
                    value={formikKyc.values.business_type}
                    onChange={formikKyc.handleChange}
                    isInvalid={
                      !!formikKyc.errors.business_type &&
                      formikKyc.touched.business_type
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formikKyc.errors.business_type}
                  </Form.Control.Feedback>
                </Form.Group> */}
                <Form.Group className="align-items-center">
                  <Form.Label className="col-form-label">
                    Business type
                  </Form.Label>
                  <Form.Control
                    style={{ color: "#000" }}
                    //   size="md"
                    as="select"
                    name="business_type"
                    value={formikKyc.values.business_type}
                    onChange={(e) =>
                      formikKyc.setFieldValue("business_type", e.target.value)
                    }
                    isInvalid={
                      !!formikKyc.errors.business_type &&
                      formikKyc.touched.business_type
                    }
                  >
                    <option disabled selected hidden value="">
                      Select Business Type
                    </option>
                    {BUSSINESS_TYPES.map((item: string, index: number) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formikKyc.errors.business_type}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={6} className="px-2 py-1  ">
                {/* <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">
                    Shop Location
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Shop Location"
                    name="shop_location"
                    value={formikKyc.values.shop_location}
                    onChange={formikKyc.handleChange}
                    isInvalid={
                      !!formikKyc.errors.shop_location &&
                      formikKyc.touched.shop_location
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formikKyc.errors.shop_location}
                  </Form.Control.Feedback>
                </Form.Group> */}
                <Form.Label className="col-form-label">
                  Shop Location
                </Form.Label>
                <Select
                  name="shop_location"
                  options={locations}
                  placeholder="Select Shop Location"
                  value={locations.filter((opt) =>
                    formikKyc.values.shop_location.includes(opt.value)
                  )}
                  onChange={(selected) => {
                    formikKyc.setFieldValue(
                      "shop_location",
                      (selected as any).value
                    );
                  }}
                  onBlur={() =>
                    formikKyc.setFieldTouched("shop_location", true)
                  }
                  classNamePrefix={
                    formikKyc.touched.shop_location &&
                    formikKyc.errors.shop_location
                      ? "is-invalid"
                      : ""
                  }
                />
                {formikKyc.touched.shop_location &&
                  formikKyc.errors.shop_location && (
                    <div
                      className="text-danger mt-1"
                      style={{ fontSize: "11px" }}
                    >
                      {formikKyc.errors.shop_location}
                    </div>
                  )}
              </Col>
              <Col lg={6} className="px-4 py-1  ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">
                    Trade License/ Business Registration Number
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Trade License/ Business Registration Number"
                    name="tradeLicenseNumber"
                    value={formikKyc.values.tradeLicenseNumber}
                    onChange={formikKyc.handleChange}
                    isInvalid={
                      !!formikKyc.errors.tradeLicenseNumber &&
                      formikKyc.touched.tradeLicenseNumber
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formikKyc.errors.tradeLicenseNumber}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={12} className="px-4 py-1  ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">
                    Upload Trade License/ Business Registration
                  </Form.Label>
                  <Form.Control
                    type="file"
                    placeholder="Upload Trade License/ Business Registration"
                    name="documents.tradeLicense"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.currentTarget?.files && e.currentTarget?.files[0]) {
                        formikKyc.setFieldValue(
                          "documents.tradeLicense",
                          e.currentTarget.files[0]
                        );
                      }
                    }}
                    isInvalid={
                      !!(
                        formikKyc.errors.documents?.tradeLicense &&
                        formikKyc.touched.documents?.tradeLicense
                      )
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formikKyc.errors.documents?.tradeLicense}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={4} className="px-4 pb-1  ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">
                    Shop Address
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Shop Address"
                    name="shop_address"
                    value={formikKyc.values.shop_address}
                    onChange={formikKyc.handleChange}
                    isInvalid={
                      !!formikKyc.errors.shop_address &&
                      formikKyc.touched.shop_address
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formikKyc.errors.shop_address}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={4} className="px-4 pb-1  ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter City"
                    name="city"
                    value={formikKyc.values.city}
                    onChange={formikKyc.handleChange}
                    isInvalid={
                      !!formikKyc.errors.city && formikKyc.touched.city
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formikKyc.errors.city}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={4} className="px-4 pb-1  ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">Post</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Post"
                    name="post"
                    value={formikKyc.values.post}
                    onChange={formikKyc.handleChange}
                    isInvalid={
                      !!formikKyc.errors.post && formikKyc.touched.post
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formikKyc.errors.post}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={6} className="px-4 pb-1">
                <Form.Group as={Row} style={{ flexDirection: "column" }}>
                  <Form.Label className="col-form-label">
                    Business Hours
                  </Form.Label>

                  <TimePicker.RangePicker
                    // use12Hours
                    format={timeFormat}
                    value={
                      formikKyc.values.business_hours
                        ? [
                            dayjs(
                              formikKyc.values.business_hours.split(" - ")[0],
                              timeFormat
                            ),
                            dayjs(
                              formikKyc.values.business_hours.split(" - ")[1],
                              timeFormat
                            ),
                          ]
                        : null
                    }
                    onChange={(times) => {
                      if (times && times[0] && times[1]) {
                        const range = `${times[0].format(
                          timeFormat
                        )} - ${times[1].format(timeFormat)}`;
                        formikKyc.setFieldValue("business_hours", range);
                      } else {
                        formikKyc.setFieldValue("business_hours", "");
                      }
                    }}
                    getPopupContainer={
                      (triggerNode) => triggerNode.parentNode as HTMLElement // ✅ TypeScript-safe cast
                    }
                    className={
                      formikKyc.errors.business_hours &&
                      formikKyc.touched.business_hours
                        ? "is-invalid"
                        : " "
                    }
                    style={{ height: "37px" }}
                  />

                  <Form.Control.Feedback type="invalid">
                    {formikKyc.errors.business_hours}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              {/* <Col lg={6} className="px-4 pb-1  ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">
                    Business Hours
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="business_hours"
                    value={formikKyc.values.business_hours}
                    onChange={formikKyc.handleChange}
                    isInvalid={
                      !!formikKyc.errors.business_hours &&
                      formikKyc.touched.business_hours
                    }
                  >
                    <option value="">Select Hour</option>
                    {Array.from({ length: 24 }, (_, i) => i + 1).map((hour) => (
                      <option
                        key={hour}
                        value={`${hour.toString().padStart(2, "0")}:00`}
                      >
                        {hour.toString().padStart(2, "0")}:00
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formikKyc.errors.business_hours}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col> */}

              <Col lg={6} className="px-4 pb-1  ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">
                    Shop Contact Number
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Shop Contact Number"
                    name="shop_contact_number"
                    value={formikKyc.values.shop_contact_number}
                    onChange={formikKyc.handleChange}
                    isInvalid={
                      !!formikKyc.errors.shop_contact_number &&
                      formikKyc.touched.shop_contact_number
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formikKyc.errors.shop_contact_number}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={12} className="px-4 py-1  ">
                <Form.Group as={Row} className="align-items-center">
                  <Form.Label className="col-form-label">
                    Upload Shop Photo or Logo
                  </Form.Label>
                  <Form.Control
                    type="file"
                    placeholder="Upload Shop Photo or Logo"
                    name="shop_photo_logo"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.currentTarget?.files && e.currentTarget?.files[0]) {
                        formikKyc.setFieldValue(
                          "shop_photo_logo",
                          e.currentTarget.files[0]
                        );
                      }
                    }}
                    isInvalid={
                      !!(
                        formikKyc.errors.shop_photo_logo &&
                        formikKyc.touched.shop_photo_logo
                      )
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formikKyc.errors.shop_photo_logo}
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
            formikKyc.setFieldValue("imgUrl", files[0]);
          }
          setIsUploadOpen(!isUploadOpen);
        }}
        objectFit="contain"
        chooseOne={true}
      />
    </>
  );
};

export default EditBussinessDetails;
