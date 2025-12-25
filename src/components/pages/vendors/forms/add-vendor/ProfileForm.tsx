import { TimePicker } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Select from "react-select";
import MediaGalleryModal from "src/components/features/modals/media-gallery-modal";
import { generateFilePath } from "src/services/url.service";
import {Country, State, City} from 'country-state-city';

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
export const timeFormat = "hh:mm A";
export default function ProfileForm({ formik, isEdit = false }: any) {
  const tradeLicenseInputRef = useRef<HTMLInputElement | null>(null);
  const shopPhotoInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  const [locations, setLocations] = useState<{ label: string; value: string }[]>([]);
  const uaeCountry: any = Country.getAllCountries().find(c => c.isoCode === "AE"); // UAE country code
  const allCities: { label: string; value: string }[] = [];
  const res = State.getStatesOfCountry(uaeCountry.isoCode)
  useEffect(() => {
    res?.map((state) => {
      City.getCitiesOfState(uaeCountry.isoCode, state.isoCode).forEach((city) => {
        // allCities.push({
        //   label: `${city.name}, ${state.name}`, // optional: add state
        //   value: city.name,
        // });
        allCities.push({ label: city.name, value: city.name })
      });
    })
    console.log("loc", allCities)
    setLocations(allCities)
  }, [])

  console.log("profile formik values", formik.values);

  return (
    <Row className="px-1 px-md-3">
      <Col
        lg={12}
        className="px-2 py-1 "
        style={{ display: "flex", alignItems: "center", gap: 10 }}
      >
        <Row className="px-2 ">
          {formik.values.vendor_logo ? (
            <Col className="px-2 py-1 ">
              <div>
                Logo
                <div className="user_image_div mt-2" style={{ width: "190px" }}>
                  <img
                    // src={generateFilePath(img)}
                    src={
                      typeof formik.values.vendor_logo === "string"
                        ? generateFilePath(formik.values.vendor_logo)
                        : formik.values.vendor_logo.copy_link
                        ? formik.values.vendor_logo.copy_link
                        : URL.createObjectURL(formik.values.vendor_logo?.file)
                    }
                    alt="profile"
                    width={"100%"}
                    height={"100%"}
                    style={{ objectFit: "cover" }}
                    // crossOrigin="anonymous"
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
              {formik.touched.vendor_logo && formik.errors.vendor_logo && (
                <div className="text-danger small mt-1 px-2">
                  {formik.errors.vendor_logo}
                </div>
              )}
            </Col>
          )}
        </Row>
        <Row className="mx-0 w-100">
          <Col lg={12} className="px-2 py-1">
            <Form.Group>
              <Form.Label className="col-form-label">Business Name</Form.Label>
              <Form.Control
                type="text"
                name="business_name"
                placeholder=" Business Name"
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
                disabled={isEdit}
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
                disabled={isEdit}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.email}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </Col>

      <Col lg={6} className="px-2 py-1  ">
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
            Trade License Number
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Trade License Number"
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
            Upload Trade License
          </Form.Label>

          <div className="d-flex align-items-center  w-100" style={{ gap: 10 }}>
            <Form.Control
              ref={tradeLicenseInputRef}
              type="file"
              placeholder="Upload Trade License"
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
            {formik.values.documents?.tradeLicense && (
              <Button
                variant="danger"
                size="sm"
                className="h-100 "
                style={{ minHeight: "42px" }}
                onClick={() => {
                  formik.setFieldValue("documents.tradeLicense", null);
                  if (tradeLicenseInputRef.current) {
                    tradeLicenseInputRef.current.value = "";
                  }
                }}
              >
                Remove
              </Button>
            )}
          </div>
          <Form.Control.Feedback type="invalid">
            {formik.errors.documents?.tradeLicense}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col lg={6} className="px-4 py-1  ">
        <Form.Group as={Row} className="align-items-center">
          <Form.Label className="col-form-label">
            Trade License Registration Date
          </Form.Label>
          <Form.Control
            type="date"
            placeholder="Trade License Registration Date"
            name="tradeLicenseRegistrationDate"
            value={formik.values.tradeLicenseRegistrationDate}
            onChange={formik.handleChange}
            isInvalid={
              !!formik.errors.tradeLicenseRegistrationDate &&
              formik.touched.tradeLicenseRegistrationDate
            }
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.tradeLicenseRegistrationDate}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col lg={6} className="px-4 py-1  ">
        <Form.Group as={Row} className="align-items-center">
          <Form.Label className="col-form-label">
            Trade License Expiry Date
          </Form.Label>
          <Form.Control
            type="date"
            placeholder="Trade License Expiry Date"
            name="tradeLicenseExpiryDate"
            value={formik.values.tradeLicenseExpiryDate}
            onChange={formik.handleChange}
            isInvalid={
              !!formik.errors.tradeLicenseExpiryDate &&
              formik.touched.tradeLicenseExpiryDate
            }
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.tradeLicenseExpiryDate}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col lg={12} className="px-2 py-1">
        <Form.Group>
          <Form.Label className="col-form-label">Business Address</Form.Label>
          <Form.Control
            type="text"
            name="business_address"
            placeholder=" Business Address"
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
          <Form.Label className="col-form-label">P.O. Box</Form.Label>
          <Form.Control
            type="text"
            name="post"
            placeholder="P.O. Box number"
            value={formik.values.post}
            onChange={formik.handleChange}
            isInvalid={formik.touched.post && !!formik.errors.post}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.post}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col lg={6} className="px-4 pt-1">
        <Form.Group as={Row} style={{ flexDirection: "column" }}>
          <Form.Label className="col-form-label">Business Hours</Form.Label>

          <TimePicker.RangePicker
            use12Hours
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
          <Form.Label className="col-form-label">Upload Shop Photo</Form.Label>
          <div className="d-flex align-items-center  w-100" style={{ gap: 10 }}>
            <Form.Control
              ref={shopPhotoInputRef}
              type="file"
              placeholder="Upload Shop Photo"
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
                  formik.errors.shop_photo_logo &&
                  formik.touched.shop_photo_logo
                )
              }
            />

            {formik.values.shop_photo_logo && (
              <Button
                variant="danger"
                size="sm"
                className="h-100 "
                style={{ minHeight: "42px" }}
                onClick={() => {
                  formik.setFieldValue("shop_photo_logo", null);
                  if (shopPhotoInputRef.current) {
                    shopPhotoInputRef.current.value = "";
                  }
                }}
              >
                Remove
              </Button>
            )}
          </div>
          <Form.Control.Feedback type="invalid">
            {formik.errors.shop_photo_logo}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <MediaGalleryModal
        isOpen={isUploadOpen}
        onClose={(files: any) => {
          if (files.length > 0) {
            formik.setFieldValue("vendor_logo", files[0]);
          }
          setIsUploadOpen(!isUploadOpen);
        }}
        objectFit="contain"
        chooseOne={true}
      />
    </Row>
  );
}
