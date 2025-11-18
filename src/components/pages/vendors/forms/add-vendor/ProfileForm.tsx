import { TimePicker } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Select from "react-select";
import MediaGalleryModal from "src/components/features/modals/media-gallery-modal";
import { generateFilePath } from "src/services/url.service";

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
export default function ProfileForm({ formik }: any) {
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  return (
    <Row className="px-1 px-md-3">
      <Col lg={12} className="px-2 py-1 " style={{display: 'flex', alignItems: 'center',gap:10}}>
        <Row className="px-2 ">
          {formik.values.imgUrl ? (
            <Col className="px-2 py-1 ">
              <div>
                Logo
                <div className="user_image_div mt-2" style={{ width: "190px" }}>
                  <img
                    // src={generateFilePath(img)}
                    src={
                      typeof formik.values.imgUrl === "string"
                        ? generateFilePath(formik.values.imgUrl)
                        : formik.values.imgUrl.copy_link
                        ? formik.values.imgUrl.copy_link
                        : URL.createObjectURL(formik.values.imgUrl?.file)
                    }
                    alt="profile"
                    width={"100%"}
                    height={"100%"}
                    style={{ objectFit: "cover" }}
                    crossOrigin="anonymous"
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
            <Col className="px-2 py-1 ">
              <div>
                Logo
                <div
                  className="user_image_div mt-2"
                  style={{ width: "190px" }}
                  onClick={() => setIsUploadOpen(true)}
                >
                  <Button variant="dark" className="my-5">
                    Upload Logo
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
        </Row>
        <Row className="mx-0 w-100">
          <Col lg={12} className="px-2 py-1">
            <Form.Group>
              <Form.Label className="col-form-label">Bussiness Name</Form.Label>
              <Form.Control
                type="text"
                name="business_name"
                placeholder=" Bussiness Name"
                value={formik.values.business_name}
                onChange={formik.handleChange}
                isInvalid={
                  formik.touched.business_name && !!formik.errors.business_name
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.business_name}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col lg={12} className=" px-2 py-1">
            <Form.Group>
              <Form.Label className="col-form-label">Phone Number</Form.Label>
              <Form.Control
                type="number"
                name="phoneNumber"
                placeholder=" Phone Number"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                isInvalid={
                  formik.touched.phoneNumber && !!formik.errors.phoneNumber
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.phoneNumber}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col lg={12} className=" px-2 py-1">
            <Form.Group>
              <Form.Label className="col-form-label">Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                isInvalid={formik.touched.email && !!formik.errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.email}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </Col>

      <Col lg={6} className="px-2 py-1  ">
        {/* <Form.Group as={Row} className="align-items-center">
          <Form.Label className="col-form-label">
            Shop Location
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Shop Location"
            name="location"
            value={formik.values.location}
            onChange={formik.handleChange}
            isInvalid={
              !!formik.errors.location &&
              formik.touched.location
            }
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.location}
          </Form.Control.Feedback>
        </Form.Group> */}
        <Form.Label className="col-form-label">Shop Location</Form.Label>
        <Select
          name="location"
          options={locations}
          placeholder="Select Shop Location"
          value={locations.filter((opt) =>
            formik.values.location.includes(opt.value)
          )}
          onChange={(selected) => {
            formik.setFieldValue("location", (selected as any).value);
          }}
          onBlur={() => formik.setFieldTouched("location", true)}
          classNamePrefix={
            formik.touched.location && formik.errors.location
              ? "is-invalid"
              : ""
          }
        />
        {formik.touched.location && formik.errors.location && (
          <div className="text-danger mt-1" style={{ fontSize: "11px" }}>
            {formik.errors.location}
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
      <Col lg={6} className="px-4 py-1  ">
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
                formik.errors.documents?.tradeLicense &&
                formik.touched.documents?.tradeLicense
              )
            }
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.documents?.tradeLicense}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col lg={6} className="px-2 py-1">
        <Form.Group>
          <Form.Label className="col-form-label">Bussiness Address</Form.Label>
          <Form.Control
            type="text"
            name="business_address"
            placeholder=" Bussiness Address"
            value={formik.values.business_address}
            onChange={formik.handleChange}
            isInvalid={
              formik.touched.business_address &&
              !!formik.errors.business_address
            }
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.business_address}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col lg={6} className="px-2 py-1">
        <Form.Group>
          <Form.Label className="col-form-label">Post</Form.Label>
          <Form.Control
            type="text"
            name="post"
            placeholder=" Post"
            value={formik.values.post}
            onChange={formik.handleChange}
            isInvalid={formik.touched.post && !!formik.errors.post}
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
    </Row>
  );
}
