import React from "react";
import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { VendorValidationSchema } from "src/validations/validationSchemas";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "src/components/common/breadcrumb";

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

const AddRetailerPage = () => {
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
    },
    validationSchema: VendorValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values: any) => {
      try {
        const obj = {
          fullName: values.fullName,
          contactNumber: values.contactNumber,
          // isVerified: values.isVerified,
        };

        // const resp = await updateOrganiser(obj);

        // toast(resp?.data?.message, {
        //   containerId: "default",
        //   className: "no-icon notification-success",
        // });
        navigate(-1);
      } catch (error) {
        toast("Can't add vendor right now, please try again later!", {
          containerId: "default",
          className: "no-icon notification-success",
        });
      }
    },
  });

  return (
    <>
      <Breadcrumb
        current={"Add Retailer"}
        paths={[
          {
            name: "Dashboard",
            url: "/dashboard",
          },
          {
            name: "retailers",
            url: "/retailers",
          },
          {
            name: "add retailer",
            url: "/retailers/add-retailer",
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
                  type="text"
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
                <Form.Label className="col-form-label">
                  Business Type
                </Form.Label>
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
                    Select Bussiness Type
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
                  {formik.errors.nationality}
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
                  name="nationality"
                  value={formik.values.nationality}
                  onChange={formik.handleChange}
                  isInvalid={
                    !!(formik.errors.nationality && formik.touched.nationality)
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
                  {formik.errors.nationality}
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
                <Form.Label className="col-form-label">Shop Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Trade Shop Address"
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
                <Form.Label className="col-form-label">City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter City"
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
                <Form.Label className="col-form-label">Post</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Post"
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
                <Form.Label className="col-form-label">
                  Business Hours
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Business Hours"
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
                <Form.Label className="col-form-label">
                  Shop Contact Number
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Shop Contact Number"
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
          </Row>
          <hr />
          <h4 className="px-2 m-0 mt-4 text-dark">Preference</h4>
          <Row className="px-3 pb-3 bg-light ">
            
            <Col lg={6} className="px-4 py-1">
              <Form.Group as={Row} className="align-items-center">
                <Form.Label className="col-form-label">
                  Brands
                </Form.Label>
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
                    Select Brands
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
                  {formik.errors.nationality}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col lg={6} className="px-4 py-1">
              <Form.Group as={Row} className="align-items-center">
                <Form.Label className="col-form-label">
                  Types of Tires
                </Form.Label>
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
                    Select Types of Tires
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
                  {formik.errors.nationality}
                </Form.Control.Feedback>
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
                <Form.Label className="col-form-label">
                  Preferred Payment Method
                </Form.Label>
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
                    Select Preferred Payment Method
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
                  {formik.errors.nationality}
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

export default AddRetailerPage;
