import React from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { VendorValidationSchema } from "src/validations/validationSchemas";

import { useNavigate } from "react-router-dom";
import Breadcrumb from "src/components/common/breadcrumb";
import { Brand } from "../../brands/BrandsList";
import Select from "react-select";

const nationalities = [
  "AFG", // Afghanistan
  "ALB", // Albania
  "DZA", // Algeria
  "USA", // United States
  "ARG", // Argentina
  "ARM", // Armenia
  "AUS", // Australia
  "AUT", // Austria
  "BGD", // Bangladesh
  "BEL", // Belgium
  "BRA", // Brazil
  "GBR", // United Kingdom
  "BGR", // Bulgaria
  "CAN", // Canada
  "CHL", // Chile
  "CHN", // China
  "COL", // Colombia
  "HRV", // Croatia
  "CZE", // Czech Republic
  "DNK", // Denmark
  "NLD", // Netherlands
  "EGY", // Egypt
  "ARE", // United Arab Emirates
  "EST", // Estonia
  "FIN", // Finland
  "FRA", // France
  "GEO", // Georgia
  "DEU", // Germany
  "GRC", // Greece
  "HUN", // Hungary
  "ISL", // Iceland
  "IND", // India
  "IDN", // Indonesia
  "IRN", // Iran
  "IRQ", // Iraq
  "IRL", // Ireland
  "ISR", // Israel
  "ITA", // Italy
  "JPN", // Japan
  "JOR", // Jordan
  "KEN", // Kenya
  "KWT", // Kuwait
  "LVA", // Latvia
  "LBN", // Lebanon
  "LTU", // Lithuania
  "MYS", // Malaysia
  "MEX", // Mexico
  "MAR", // Morocco
  "NPL", // Nepal
  "NZL", // New Zealand
  "NGA", // Nigeria
  "NOR", // Norway
  "PAK", // Pakistan
  "PER", // Peru
  "PHL", // Philippines
  "POL", // Poland
  "PRT", // Portugal
  "QAT", // Qatar
  "ROU", // Romania
  "RUS", // Russia
  "SAU", // Saudi Arabia
  "SRB", // Serbia
  "SGP", // Singapore
  "SVK", // Slovakia
  "SVN", // Slovenia
  "ZAF", // South Africa
  "KOR", // South Korea
  "ESP", // Spain
  "LKA", // Sri Lanka
  "SWE", // Sweden
  "CHE", // Switzerland
  "SYR", // Syria
  "THA", // Thailand
  "TUR", // Turkey
  "UGA", // Uganda
  "UKR", // Ukraine
  "URY", // Uruguay
  "UZB", // Uzbekistan
  "VEN", // Venezuela
  "VNM", // Vietnam
  "YEM", // Yemen
  "ZMB", // Zambia
  "ZWE", // Zimbabwe
];

const businessTypes = [
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
  "AFG", // Afghanistan
  "ALB", // Albania
  "DZA", // Algeria
  "USA", // United States
  "ARG", // Argentina
  "ARM", // Armenia
  "AUS", // Australia
  "AUT", // Austria
  "BGD", // Bangladesh
  "BEL", // Belgium
  "BRA", // Brazil
  "GBR", // United Kingdom
  "BGR", // Bulgaria
  "CAN", // Canada
  "CHL", // Chile
  "CHN", // China
  "COL", // Colombia
  "HRV", // Croatia
  "CZE", // Czech Republic
  "DNK", // Denmark
  "NLD", // Netherlands
  "EGY", // Egypt
  "ARE", // United Arab Emirates
  "EST", // Estonia
  "FIN", // Finland
  "FRA", // France
  "GEO", // Georgia
  "DEU", // Germany
  "GRC", // Greece
  "HUN", // Hungary
  "ISL", // Iceland
  "IND", // India
  "IDN", // Indonesia
  "IRN", // Iran
  "IRQ", // Iraq
  "IRL", // Ireland
  "ISR", // Israel
  "ITA", // Italy
  "JPN", // Japan
  "JOR", // Jordan
  "KEN", // Kenya
  "KWT", // Kuwait
  "LVA", // Latvia
  "LBN", // Lebanon
  "LTU", // Lithuania
  "MYS", // Malaysia
  "MEX", // Mexico
  "MAR", // Morocco
  "NPL", // Nepal
  "NZL", // New Zealand
  "NGA", // Nigeria
  "NOR", // Norway
  "PAK", // Pakistan
  "PER", // Peru
  "PHL", // Philippines
  "POL", // Poland
  "PRT", // Portugal
  "QAT", // Qatar
  "ROU", // Romania
  "RUS", // Russia
  "SAU", // Saudi Arabia
  "SRB", // Serbia
  "SGP", // Singapore
  "SVK", // Slovakia
  "SVN", // Slovenia
  "ZAF", // South Africa
  "KOR", // South Korea
  "ESP", // Spain
  "LKA", // Sri Lanka
  "SWE", // Sweden
  "CHE", // Switzerland
  "SYR", // Syria
  "THA", // Thailand
  "TUR", // Turkey
  "UGA", // Uganda
  "UKR", // Ukraine
  "URY", // Uruguay
  "UZB", // Uzbekistan
  "VEN", // Venezuela
  "VNM", // Vietnam
  "YEM", // Yemen
  "ZMB", // Zambia
  "ZWE", // Zimbabwe
];


const AddVendorPage = () => {
  //DATA

  //MUTATION
  // const { mutateAsync: updateOrganiser } = useUpdateOrganiser();

  const navigate = useNavigate();

  //FORM
  const formik = useFormik({
    initialValues: {
      fullName: "",
      contactNumber: "",
      email: "",
      nationality: "",
      EidNo: "",
      EID: "" as any,

      shopName: "",
      businessType: "",
      shopLocation: "",
      tradeLicenseNo: "",
      tradeLicense: "" as any,
      shopAddress: "",
      city: "",
      post: "",
      businessHours: "",
      shopContactNumber: "",
      shopLogo: "" as any,

      brands: [] as string[],
      typesOfTires: [] as string[],
      averageMonthlyPurchaseVolume: "",
      preferredPaymentMethod: "",
    },
    validationSchema: VendorValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values: any) => {
      try {
        const obj = {
          fullName: values.fullName,
          contactNumber: values.contactNumber,
          email: values.email,
        };

        // const resp = await updateOrganiser(obj);

        // toast(resp?.data?.message, {
        //   containerId: "default",
        //   className: "no-icon notification-success",
        // });
        navigate(-1);
        toast("vendor creation!", {
          containerId: "default",
          className: "no-icon notification-success",
        });
      } catch (error) {
        toast("Can't add vendor right now, please try again later!", {
          containerId: "default",
          className: "no-icon notification-danger",
        });
      }
    },
  });

  console.log("formik errors", formik.errors);

  return (
    <>
      <Breadcrumb
        current={"Add Vendor"}
        paths={[
          {
            name: "Dashboard",
            url: "/dashboard",
          },
          {
            name: "vendors",
            url: "/vendors",
          },
          {
            name: "add vendor",
            url: "/vendors/add-vendor",
          },
        ]}
      />
      <div>
        <Form onSubmit={formik.handleSubmit}>
          <h4 className="m-0 px-2 text-dark">Profile</h4>
          <Row className="px-3 pb-3  ">
            <Col lg={6} className="px-4 py-1">
              <Form.Group as={Row} className="align-items-center">
                <Form.Label className="col-form-label">Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter full name"
                  autoFocus
                  name="fullName"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  isInvalid={
                    !!(formik.errors.fullName && formik.touched.fullName)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.fullName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col lg={6} className="px-4 py-1">
              <Form.Group as={Row} className="align-items-center">
                <Form.Label className="col-form-label">
                  Contact Number
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter contact number"
                  name="contactNumber"
                  value={formik.values.contactNumber}
                  onChange={formik.handleChange}
                  isInvalid={
                    !!(
                      formik.errors.contactNumber &&
                      formik.touched.contactNumber
                    )
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.contactNumber}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col lg={6} className="px-4 py-1">
              <Form.Group as={Row} className="align-items-center">
                <Form.Label className="col-form-label">Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  isInvalid={!!(formik.errors.email && formik.touched.email)}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col lg={6} className="px-4 py-1">
              <Form.Group as={Row} className="align-items-center">
                <Form.Label className="col-form-label">Nationality</Form.Label>
                <Form.Control
                  //   size="md"
                  as="select"
                  name="nationality"
                  value={formik.values.nationality}
                  onChange={formik.handleChange}
                  isInvalid={
                    !!(formik.errors.nationality && formik.touched.nationality)
                  }
                >
                  <option disabled selected hidden value="">
                    Select Nationality
                  </option>
                  {nationalities?.map((item) => {
                    return (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    );
                  })}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.nationality}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col lg={6} className="px-4 py-1">
              <Form.Group as={Row} className="align-items-center">
                <Form.Label className="col-form-label">EID No</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter EID No"
                  name="EidNo"
                  value={formik.values.EidNo}
                  onChange={formik.handleChange}
                  isInvalid={!!(formik.errors.EidNo && formik.touched.EidNo)}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.EidNo}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col lg={6} className="px-4 py-1">
              <Form.Group as={Row} className="align-items-center">
                <Form.Label className="col-form-label">Upload EID </Form.Label>
                <Form.Control
                  type="file"
                  placeholder="Upload EID Document"
                  name="EID"
                  value={formik.values.EID}
                  onChange={formik.handleChange}
                  isInvalid={!!(formik.errors.EID && formik.touched.EID)}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.EID}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <hr />
          <h4 className="px-2 m-0 mt-4 text-dark">Business Details</h4>
          <Row className="px-3 pb-3 bg-light ">
            <Col lg={6} className="px-4 py-1">
              <Form.Group as={Row} className="align-items-center">
                <Form.Label className="col-form-label">Shop Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Shop Name"
                  name="shopName"
                  value={formik.values.shopName}
                  onChange={formik.handleChange}
                  isInvalid={
                    !!(formik.errors.shopName && formik.touched.shopName)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.shopName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col lg={6} className="px-4 py-1">
              <Form.Group as={Row} className="align-items-center">
                <Form.Label className="col-form-label">
                  Business Type
                </Form.Label>
                <Form.Control
                  //   size="md"
                  as="select"
                  name="businessType"
                  value={formik.values.businessType}
                  onChange={formik.handleChange}
                  isInvalid={
                    !!(
                      formik.errors.businessType && formik.touched.businessType
                    )
                  }
                >
                  <option disabled selected hidden value="">
                    Select Business Type
                  </option>
                  {businessTypes?.map((item) => {
                    return (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    );
                  })}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.businessType}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col lg={6} className="px-4 py-1">
              <Form.Group as={Row} className="align-items-center">
                <Form.Label className="col-form-label">
                  Shop Location
                </Form.Label>
                <Form.Control
                  //   size="md"
                  as="select"
                  name="shopLocation"
                  value={formik.values.shopLocation}
                  onChange={formik.handleChange}
                  isInvalid={
                    !!(
                      formik.errors.shopLocation && formik.touched.shopLocation
                    )
                  }
                >
                  <option disabled selected hidden value="">
                    Select Shop Location
                  </option>
                  {locations?.map((item) => {
                    return (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    );
                  })}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.shopLocation}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col lg={6} className="px-4 py-1">
              <Form.Group as={Row} className="align-items-center">
                <Form.Label className="col-form-label">
                  Trade License/ Business Registration Number
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Trade License/ Business Registration Number"
                  name="tradeLicenseNo"
                  value={formik.values.tradeLicenseNo}
                  onChange={formik.handleChange}
                  isInvalid={
                    !!(
                      formik.errors.tradeLicenseNo &&
                      formik.touched.tradeLicenseNo
                    )
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.tradeLicenseNo}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col lg={6} className="px-4 py-1">
              <Form.Group as={Row} className="align-items-center">
                <Form.Label className="col-form-label">
                  Upload Trade License/ Business Registration{" "}
                </Form.Label>
                <Form.Control
                  type="file"
                  placeholder="Upload Trade License/ Business Registration"
                  name="tradeLicense"
                  value={formik.values.tradeLicense}
                  onChange={formik.handleChange}
                  isInvalid={
                    !!(
                      formik.errors.tradeLicense && formik.touched.tradeLicense
                    )
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.tradeLicense}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col lg={6} className="px-4 py-1">
              <Form.Group as={Row} className="align-items-center">
                <Form.Label className="col-form-label">Shop Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Trade Shop Address"
                  name="shopAddress"
                  value={formik.values.shopAddress}
                  onChange={formik.handleChange}
                  isInvalid={
                    !!(formik.errors.shopAddress && formik.touched.shopAddress)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.shopAddress}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col lg={6} className="px-4 py-1">
              <Form.Group as={Row} className="align-items-center">
                <Form.Label className="col-form-label">City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter City"
                  name="city"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  isInvalid={!!(formik.errors.city && formik.touched.city)}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.city}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col lg={6} className="px-4 py-1">
              <Form.Group as={Row} className="align-items-center">
                <Form.Label className="col-form-label">Post</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Post"
                  name="post"
                  value={formik.values.post}
                  onChange={formik.handleChange}
                  isInvalid={!!(formik.errors.post && formik.touched.post)}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.post}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col lg={6} className="px-4 py-1">
              <Form.Group as={Row} className="align-items-center">
                <Form.Label className="col-form-label">
                  Business Hours
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Business Hours"
                  name="businessHours"
                  value={formik.values.businessHours}
                  onChange={formik.handleChange}
                  isInvalid={
                    !!(
                      formik.errors.businessHours &&
                      formik.touched.businessHours
                    )
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.businessHours}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col lg={6} className="px-4 py-1">
              <Form.Group as={Row} className="align-items-center">
                <Form.Label className="col-form-label">
                  Shop Contact Number
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Shop Contact Number"
                  name="shopContactNumber"
                  value={formik.values.shopContactNumber}
                  onChange={formik.handleChange}
                  isInvalid={
                    !!(
                      formik.errors.shopContactNumber &&
                      formik.touched.shopContactNumber
                    )
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.shopContactNumber}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col lg={6} className="px-4 py-1">
              <Form.Group as={Row} className="align-items-center">
                <Form.Label className="col-form-label">
                  Upload Shop Photo or Logo{" "}
                </Form.Label>
                <Form.Control
                  type="file"
                  placeholder="Upload Shop Photo or Logo"
                  name="shopLogo"
                  value={formik.values.shopLogo}
                  onChange={formik.handleChange}
                  isInvalid={
                    !!(formik.errors.shopLogo && formik.touched.shopLogo)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.shopLogo}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <hr />
          <h4 className="px-2 m-0 mt-4 text-dark">Preference</h4>
          <Row className="px-3 pb-3 bg-light ">
            {/* <Col lg={6} className="px-3 py-1">
              <Form.Group
                as={Row}
                className="w-100  mx-0 bg-green-500 align-items-center"
              >
                <Form.Label className="col-form-label">Brands</Form.Label>
                <Select
                  className="w-100"
                  isMulti
                  name="brands"
                  placeholder="Select Brands"
                  options={brands.map((b) => ({
                    value: b.name,
                    label: b.name,
                  }))}
                  value={brands
                    .filter((b) => formik.values.brands.includes(b.name))
                    .map((b) => ({ value: b.name, label: b.name }))}
                  onChange={(selected) =>
                    formik.setFieldValue(
                      "brands",
                      selected.map((s) => s.value)
                    )
                  }
                  required
                />
                {formik.errors.brands && formik.touched.brands && (
                  <div className="text-danger">{formik.errors.brands}</div>
                )}
              </Form.Group>
            </Col> */}
            <Col lg={6} className="px-3 py-1">
              <Form.Group
                as={Row}
                className="w-100  mx-0 bg-green-500 align-items-center"
              >
                <Form.Label className="col-form-label">
                  Types of Tires
                </Form.Label>
                <Select
                  className="w-100"
                  isMulti
                  name="typesOfTires"
                  placeholder="Select types of tires"
                  options={businessTypes.map((b) => ({
                    value: b,
                    label: b,
                  }))}
                  value={businessTypes
                    .filter((b) => formik.values.typesOfTires.includes(b))
                    .map((b) => ({ value: b, label: b }))}
                  onChange={(selected) =>
                    formik.setFieldValue(
                      "typesOfTires",
                      selected.map((s) => s.value)
                    )
                  }
                />
                {formik.errors.typesOfTires && formik.touched.typesOfTires && (
                  <div className="text-danger">
                    {formik.errors.typesOfTires}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col lg={6} className="px-4 py-1">
              <Form.Group as={Row} className="align-items-center">
                <Form.Label className="col-form-label">
                  Average Monthly Purchase Volume
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Average Monthly Purchase Volume (Optional)"
                  name="averageMonthlyPurchaseVolume"
                  value={formik.values.averageMonthlyPurchaseVolume}
                  onChange={formik.handleChange}
                  isInvalid={
                    !!(
                      formik.errors.averageMonthlyPurchaseVolume &&
                      formik.touched.averageMonthlyPurchaseVolume
                    )
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.averageMonthlyPurchaseVolume}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col lg={6} className="px-4 py-1">
              <Form.Group as={Row} className="align-items-center">
                <Form.Label className="col-form-label">
                  Preferred Payment Method
                </Form.Label>
                <Form.Control
                  //   size="md"
                  as="select"
                  name="preferredPaymentMethod"
                  value={formik.values.preferredPaymentMethod}
                  onChange={formik.handleChange}
                  isInvalid={
                    !!(
                      formik.errors.preferredPaymentMethod &&
                      formik.touched.preferredPaymentMethod
                    )
                  }
                >
                  <option disabled selected hidden value="">
                    Select Preferred Payment Method
                  </option>
                  {["CARD"]?.map((item) => {
                    return (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    );
                  })}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.preferredPaymentMethod}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Modal.Footer className="mt-5">
            <Row>
              <Col md={12} className="text-right">
                <Button
                  variant="default"
                  onClick={() => navigate(-1)}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button
                  variant="dark"
                  type="submit"
                  style={{ background: "#000" }}
                >
                  Confirm
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Form>
      </div>
    </>
  );
};

export default AddVendorPage;
