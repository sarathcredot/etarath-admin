import { TimePicker } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Select from "react-select";
import MediaGalleryModal from "src/components/features/modals/media-gallery-modal";
import { generateFilePath } from "src/services/url.service";
import { Country, State, City } from 'country-state-city';
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";
import ImageCropModal from "src/components/features/modals/ImageCropModal";
import LocationInput from "src/components/common/LocationInput"
import MapPicker from "src/components/common/MapPicker";




export const timeFormat = "hh:mm A";
export default function ProfileForm({ formik, isEdit = false }: any) {
  const tradeLicenseInputRef = useRef<HTMLInputElement | null>(null);
  const vatDocInputRef = useRef<HTMLInputElement | null>(null);
  const shopPhotoInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);


  // image new added

  const [cropOpen, setCropOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const [location, setLocation] = useState({
    lat: 25.2048,
    lng: 55.2708,
  });

  const handleImageSelect = (e: any) => {
    const file: any = e.target.files[0];
    if (!file) return;
    setImageSrc(URL.createObjectURL(file));
    setCropOpen(true);
  };

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

  useEffect(() => {

    location.lat = formik?.values.geoLat || 25.2048
    location.lng = formik?.values.geoLng || 55.2708

  }, [formik])


  const setGeoLocation = (value: any) => {

    formik.setFieldValue(
      "geoLat",
      value?.lat
    )

    formik.setFieldValue(
      "geoLng",
      value?.lng
    )
  }


  console.log("profile formik values", formik.values);

  return (
    <Row className="px-1 px-md-3">

      <Col
        lg={12}
        className="px-2 py-1 "
        style={{ display: "flex", alignItems: "center", gap: 10 }}
      >


        {/* <Row className="px-2 ">
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
        </Row> */}


        <Row className="px-2 ">
          <Col className="px-2 py-1">
            <div>
              Logo
              {/* <div className="user_image_div mt-2" style={{ width: "190px" }}>
                <img
                  src={
                    typeof formik.values.vendor_logo === "string"
                      ? generateFilePath(formik.values.vendor_logo)
                      : URL.createObjectURL(formik.values.vendor_logo)
                  }
                  alt="profile"
                  width="100%"
                  height="100%"
                  style={{ objectFit: "cover" }}
                />

                <div  className="edit_div">
                  <label>
                    <i className="bx bxs-edit fa"></i>
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleImageSelect}
                    />
                  </label>
                </div>
              </div> */}
              <div className="user_image_div mt-2" style={{ width: "190px" }}>
                <img
                  src={
                    typeof formik.values.vendor_logo === "string"
                      ? generateFilePath(formik.values.vendor_logo)
                      : URL.createObjectURL(formik.values.vendor_logo)
                  }
                  alt="profile"
                  width="100%"
                  height="100%"
                  style={{ objectFit: "cover" }}
                />

                {/* Clickable edit overlay */}
                <div className="edit_div">
                  <label htmlFor="vendorLogoInput" style={{ cursor: "pointer", margin: 0 }}>
                    <i className="bx bxs-edit fa"></i>
                  </label>
                </div>

                {/* Hidden input */}
                <input
                  id="vendorLogoInput"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageSelect}
                />
              </div>

            </div>
          </Col>

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


          {/* <Col lg={12} className=" px-2 py-1">
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
          </Col> */}



          {/* <Col lg={12} className="px-2 py-1">
            <Form.Group>
              <Form.Label className="col-form-label">Phone Number</Form.Label>

              <PhoneInput
                defaultCountry="IN"
                international
                countryCallingCodeEditable={false}
                placeholder="Phone Number"
                value={formik.values.phoneNumber}
                onChange={(value) => formik.setFieldValue("phoneNumber", value)}
                onBlur={() => formik.setFieldTouched("phoneNumber", true)}
                disabled={isEdit}
                className={`phone-bootstrap ${formik.touched.phoneNumber && formik.errors.phoneNumber
                    ? "is-invalid"
                    : ""
                  }`}
              />

              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <div className="invalid-feedback d-block">
                  {formik.errors.phoneNumber}
                </div>
              )}
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
                disabled={isEdit}
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
              // disabled={isEdit}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.email}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </Col>





      {/* <Col lg={6} className="px-2 py-1  ">
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
      </Col> */}


      <Col lg={6} className="px-2 py-1">
        <Form.Label className="col-form-label">Shop Location</Form.Label>

        <LocationInput
          placeholder="Enter location"
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
          <Form.Label className="col-form-label">Upload VAT Document</Form.Label>
          <div className="d-flex align-items-center  w-100" style={{ gap: 10 }}>
            <Form.Control
              ref={vatDocInputRef}
              type="file"
              placeholder="Upload VAT document"
              name="documents.vatDoc"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.currentTarget?.files && e.currentTarget?.files[0]) {
                  formik.setFieldValue(
                    "documents.vatDoc",
                    e.currentTarget.files[0]
                  );
                }
              }}
            // isInvalid={
            //   !!(
            //     formik.errors.shop_photo_logo &&
            //     formik.touched.shop_photo_logo
            //   )
            // }
            />

            {formik.values.documents.vatDoc && (
              <Button
                variant="danger"
                size="sm"
                className="h-100 "
                style={{ minHeight: "42px" }}
                onClick={() => {
                  formik.setFieldValue("documents.vatDoc", null);
                  if (vatDocInputRef.current) {
                    vatDocInputRef.current.value = "";
                  }
                }}
              >
                Remove
              </Button>
            )}
          </div>
          {/* <Form.Control.Feedback type="invalid">
            {formik.errors.shop_photo_logo}
          </Form.Control.Feedback> */}
        </Form.Group>
      </Col>
      <Col lg={6} className="px-4 py-1  ">
        <Form.Group as={Row} className="align-items-center">
          <Form.Label className="col-form-label">
            VAT Number
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter VAT Number"
            name="vatNumber"
            value={formik.values.vatNumber}
            onChange={formik.handleChange}
          // isInvalid={
          //   !!formik.errors.vatNumber &&
          //   formik.touched.vatNumber
          // }
          />
          {/* <Form.Control.Feedback type="invalid">
            {formik.errors.vatNumber}
          </Form.Control.Feedback> */}
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

      <Col lg={12} className="px-2 py-1">
        <Form.Group>
          <Form.Label className="col-form-label">Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            placeholder=" Description"
            value={formik.values.description}
            onChange={formik.handleChange}
          // isInvalid={
          //   formik.touched.business_name && !!formik.errors.business_name
          // }
          />
          {/* <Form.Control.Feedback type="invalid">
            {formik.errors.business_name}
          </Form.Control.Feedback> */}
        </Form.Group>
      </Col>


      <Col lg={12} className="px-2 py-1">

        <MapPicker value={location} onChange={(value: any) => { setGeoLocation(value) }} />

      </Col>



      <ImageCropModal
        image={imageSrc}
        isOpen={cropOpen}
        onClose={() => setCropOpen(false)}
        onSave={(file: any) => {
          formik.setFieldValue("vendor_logo", file);
        }}
      />



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
