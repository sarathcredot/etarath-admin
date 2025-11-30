import { TimePicker } from "antd";
import dayjs from "dayjs";
import { Col, Form, Row } from "react-bootstrap";
import Select from "react-select";
import { BUSSINESS_TYPES } from "src/components/pages/vendors/popups/AddBussinessDetails";

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
const timeFormat = "HH:mm";
export default function KycForm({ formik }: any) {
  return (
    <Row className="px-1 px-md-3">
      <Col lg={6} className="px-4 py-1">
        <Form.Group as={Row} className="align-items-center">
          <Form.Label className="col-form-label">Shop Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Shop Name"
            name="shop_name"
            value={formik.values.shop_name}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.shop_name && formik.touched.shop_name}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.shop_name}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col lg={6} className="px-2 py-1">
        <Form.Group className="align-items-center">
          <Form.Label className="col-form-label">Business type</Form.Label>
          <Form.Control
            style={{ color: "#000" }}
            //   size="md"
            as="select"
            name="business_type"
            value={formik.values.business_type}
            onChange={(e) =>
              formik.setFieldValue("business_type", e.target.value)
            }
            isInvalid={
              !!formik.errors.business_type && formik.touched.business_type
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
            {formik.errors.business_type}
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
                placeholder="Shop Location"
                name="shop_location"
                value={formik.values.shop_location}
                onChange={formik.handleChange}
                isInvalid={
                  !!formik.errors.shop_location &&
                  formik.touched.shop_location
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.shop_location}
              </Form.Control.Feedback>
            </Form.Group> */}
        <Form.Label className="col-form-label">Shop Location</Form.Label>
        <Select
          name="shop_location"
          options={locations}
          placeholder="Select Shop Location"
          value={locations.filter((opt) =>
            formik.values.shop_location.includes(opt.value)
          )}
          onChange={(selected) => {
            formik.setFieldValue("shop_location", (selected as any).value);
          }}
          onBlur={() => formik.setFieldTouched("shop_location", true)}
          classNamePrefix={
            formik.touched.shop_location && formik.errors.shop_location
              ? "is-invalid"
              : ""
          }
        />
        {formik.touched.shop_location && formik.errors.shop_location && (
          <div className="text-danger mt-1" style={{ fontSize: "11px" }}>
            {formik.errors.shop_location}
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
            placeholder="Trade License/ Business Registration Number"
            name="tradeLicenseNumber"
            value={formik.values.tradeLicenseNumber}
            onChange={formik.handleChange}
            isInvalid={
              !!formik.errors.tradeLicenseNumber &&
              formik.touched.tradeLicenseNumber
            }
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.tradeLicenseNumber}
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
                formik.setFieldValue(
                  "documents.tradeLicense",
                  e.currentTarget.files[0]
                );
              }
            }}
            isInvalid={
              !!(
                formik.errors.documents?.tradeLicense ||
                formik.touched.documents?.tradeLicense
              )
            }
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.documents?.tradeLicense}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col lg={4} className="px-4 pb-1  ">
        <Form.Group as={Row} className="align-items-center">
          <Form.Label className="col-form-label">Shop Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Shop Address"
            name="shop_address"
            value={formik.values.shop_address}
            onChange={formik.handleChange}
            isInvalid={
              !!formik.errors.shop_address && formik.touched.shop_address
            }
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.shop_address}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col lg={4} className="px-4 pb-1  ">
        <Form.Group as={Row} className="align-items-center">
          <Form.Label className="col-form-label">City</Form.Label>
          <Form.Control
            type="text"
            placeholder="City"
            name="city"
            value={formik.values.city}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.city && formik.touched.city}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.city}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col lg={4} className="px-4 pb-1  ">
        <Form.Group as={Row} className="align-items-center">
          <Form.Label className="col-form-label">Post</Form.Label>
          <Form.Control
            type="text"
            placeholder="Post"
            name="post"
            value={formik.values.post}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.post && formik.touched.post}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.post}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col lg={6} className="px-4 pb-1">
        <Form.Group as={Row} style={{ flexDirection: "column" }}>
          <Form.Label className="col-form-label">Business Hours</Form.Label>

          <TimePicker.RangePicker
            // use12Hours
            format={timeFormat}
            value={
              formik.values.business_hours
                ? [
                    dayjs(
                      formik.values.business_hours.split(" - ")[0],
                      timeFormat
                    ),
                    dayjs(
                      formik.values.business_hours.split(" - ")[1],
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
                formik.setFieldValue("business_hours", range);
                console.log({ range });
              } else {
                formik.setFieldValue("business_hours", "");
              }
            }}
            getPopupContainer={
              (triggerNode) => triggerNode.parentNode as HTMLElement // ✅ TypeScript-safe cast
            }
            className={
              formik.errors.business_hours && formik.touched.business_hours
                ? "is-invalid"
                : " "
            }
            style={{ height: "37px" }}
          />

          <Form.Control.Feedback type="invalid">
            {formik.errors.business_hours}
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
                          value={formik.values.business_hours}
                          onChange={formik.handleChange}
                          isInvalid={
                            !!formik.errors.business_hours &&
                            formik.touched.business_hours
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
                          {formik.errors.business_hours}
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
            placeholder="Shop Contact Number"
            name="shop_contact_number"
            value={formik.values.shop_contact_number}
            onChange={formik.handleChange}
            isInvalid={
              !!formik.errors.shop_contact_number &&
              formik.touched.shop_contact_number
            }
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.shop_contact_number}
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
                formik.setFieldValue(
                  "shop_photo_logo",
                  e.currentTarget.files[0]
                );
              }
            }}
            isInvalid={
              !!(
                formik.errors.shop_photo_logo && formik.touched.shop_photo_logo
              )
            }
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.shop_photo_logo}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
    </Row>
  );
}
