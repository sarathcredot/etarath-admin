import { TimePicker } from "antd";
import dayjs from "dayjs";
import { Button, Col, Form, Row } from "react-bootstrap";
import Select from "react-select";
import { timeFormat } from "src/components/pages/vendors/forms/add-vendor/ProfileForm";
import { BUSSINESS_TYPES } from "src/components/pages/vendors/popups/AddBussinessDetails";
import { Country, State, City } from 'country-state-city';
import { useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function KycForm({ formik }: any) {

  const [locations, setLocations] = useState<{ label: string; value: string }[]>([]);
  const uaeCountry: any = Country.getAllCountries().find(c => c.isoCode === "AE"); // UAE country code
  const allCities: { label: string; value: string }[] = [];
  const res = State.getStatesOfCountry(uaeCountry.isoCode)
  const vatDocInputRef = useRef<HTMLInputElement | null>(null);

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


      {/* <Col lg={6} className="px-4 pb-1  ">
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
      </Col> */}


      <Col lg={6} className="px-2 py-1">
        <Form.Group>
          <Form.Label className="col-form-label">
            Phone Number
          </Form.Label>

          <PhoneInput
            international
            defaultCountry="IN"
            countryCallingCodeEditable={true}   // ✅ manual +91 allowed
            placeholder="Phone Number"
            value={formik.values.shop_contact_number}
            onChange={(value) =>
              formik.setFieldValue("shop_contact_number", value)
            }
            onBlur={() =>
              formik.setFieldTouched("shop_contact_number", true)
            }
            // disabled={isEdit}
            className={`phone-bootstrap ${formik.touched.shop_contact_number &&
              formik.errors.shop_contact_number
              ? "is-invalid"
              : ""
              }`}
          />

          {formik.touched.shop_contact_number &&
            formik.errors.shop_contact_number && (
              <div className="invalid-feedback d-block">
                {formik.errors.shop_contact_number}
              </div>
            )}
        </Form.Group>
      </Col>





      <Col lg={4} className="px-4 py-1  ">
        <Form.Group as={Row} className="align-items-center">
          <Form.Label className="col-form-label">
            Trade License Number
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Trade License Number"
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
      <Col lg={4} className="px-4 py-1  ">
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
      <Col lg={4} className="px-4 py-1  ">
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






      <Col lg={12} className="px-4 py-1  ">
        <Form.Group as={Row} className="align-items-center">
          <Form.Label className="col-form-label">
            Upload Trade License
          </Form.Label>
          <Form.Control
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
          <Form.Control.Feedback type="invalid">
            {formik.errors.documents?.tradeLicense}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col lg={12} className="px-4 pb-1  ">
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

      <Col lg={6} className="px-4 pb-1  ">
        <Form.Group as={Row} className="align-items-center">
          <Form.Label className="col-form-label">P.O. Box</Form.Label>
          <Form.Control
            type="text"
            placeholder="P.O. Box"
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

      <Col lg={12} className="px-4 py-1  ">
        <Form.Group as={Row} className="align-items-center">
          <Form.Label className="col-form-label">Upload Shop Photo</Form.Label>
          <Form.Control
            type="file"
            placeholder="Upload Shop Photo "
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
