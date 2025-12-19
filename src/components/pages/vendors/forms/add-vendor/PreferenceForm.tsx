import { Col, Form, Row } from "react-bootstrap";
import Select from "react-select";
import { useGetAllBrands } from "src/services/brand.service";

export const paymentMethods = [
  "Debit/Credit Card",
  "Cash on Delivery",
  "Credit Terms",
];
export const creditDays = ["15", "30", "45", "60", "90", "120", "150"];
export default function PreferenceForm({ formik }: any) {
  // QUERIES
  const {
    data: brands,
    isLoading: brandsLoading,
    error: brandsError,
  } = useGetAllBrands();

  console.log("pref formik values", formik.values);

  return (
    <Row className="px-1 px-md-3">
      <Col lg={12} className="px-2 py-1  ">
        <Form.Label className="col-form-label">Preferred Brands</Form.Label>
        <Select
          name="brands"
          options={brands?.result?.map((item: any) => ({
            value: item?._id,
            label: item?.name?.toUpperCase(),
          }))}
          value={brands?.result
            ?.map((item: any) => ({
              value: item?._id,
              label: item?.name?.toUpperCase(),
            }))
            .filter((opt: any) =>
              formik.values.brands
                .map((ab: any) => ab?.brandId)
                .includes(opt.value)
            )}
          isMulti={true}
          placeholder="Preferred Brands"
          // value={["english", "arabic", "german", "spanish", "french"]
          //   .map((loc) => ({ value: loc, label: loc?.toUpperCase() }))
          //   .filter((opt) => formik.values.brands.includes(opt.value))}
          onChange={(selected) => {
            console.log({ selected });
            formik.setFieldValue(
              "brands",
              selected?.map((s: any) => ({ brandId: s.value }))
            );
          }}
          onBlur={() => formik.setFieldTouched("brands", true)}
          classNamePrefix={
            formik.touched.brands && formik.errors.brands ? "is-invalid" : ""
          }
        />
        {formik.touched.brands && formik.errors.brands && (
          <div className="text-danger mt-1" style={{ fontSize: "11px" }}>
            {formik.errors.brands}
          </div>
        )}
      </Col>
      <Col lg={12} className="px-2 py-1  ">
        <Form.Label className="col-form-label">Authorised Brands</Form.Label>
        <Select
          name="authorised_brands"
          options={brands?.result?.map((item: any) => ({
            value: item?._id,
            label: item?.name?.toUpperCase(),
          }))}
          isMulti={true}
          placeholder="Select Authorised Brands"
          value={brands?.result
            ?.map((item: any) => ({
              value: item?._id,
              label: item?.name?.toUpperCase(),
            }))
            .filter((opt: any) =>
              formik.values.authorised_brands
                .map((ab: any) => ab?.brandId)
                .includes(opt.value)
            )}
          onChange={(selected) => {
            console.log({ selected });
            formik.setFieldValue(
              "authorised_brands",
              selected?.map((s: any) => ({ brandId: s.value }))
            );
          }}
          onBlur={() => formik.setFieldTouched("authorised_brands", true)}
          classNamePrefix={
            formik.touched.authorised_brands && formik.errors.authorised_brands
              ? "is-invalid"
              : ""
          }
        />
        {formik.touched.authorised_brands &&
          formik.errors.authorised_brands && (
            <div className="text-danger mt-1" style={{ fontSize: "11px" }}>
              {formik.errors.authorised_brands}
            </div>
          )}
      </Col>
      <Col className="px-2 py-1  ">
        <Form.Label className="col-form-label">
          Preferred Payment Method
        </Form.Label>
        <Select
          name="paymentMethod"
          options={paymentMethods.map((item: string) => ({
            value: item,
            label: item,
          }))}
          isMulti={false}
          placeholder="Preferred Payment Method"
          value={paymentMethods
            .map((item: string) => ({
              value: item,
              label: item,
            }))
            .find((opt) => opt.value === formik.values.paymentMethod)}
          onChange={(selected) => {
            console.log({ selected });

            formik.setFieldValue("creditDays", ""); // reset credit days if payment method changes
            formik.setFieldValue("paymentMethod", selected?.value);
          }}
          onBlur={() => formik.setFieldTouched("paymentMethod", true)}
          classNamePrefix={
            formik.touched.paymentMethod && formik.errors.paymentMethod
              ? "is-invalid"
              : ""
          }
        />
        {formik.touched.paymentMethod && formik.errors.paymentMethod && (
          <div className="text-danger mt-1" style={{ fontSize: "11px" }}>
            {formik.errors.paymentMethod}
          </div>
        )}
      </Col>
      {formik.values.paymentMethod === "Credit Terms" && (
        <Col className="px-2 py-1  ">
          <Form.Label className="col-form-label">
            Credit Period (Days)
          </Form.Label>
          <Select
            name="creditDays"
            options={creditDays.map((item: string) => ({
              value: item,
              label: item,
            }))}
            value={creditDays
              .map((item: string) => ({
                value: item,
                label: item,
              }))
              .find((opt) => opt.value === formik.values.creditDays)}
            isMulti={false}
            placeholder="Select credit period"
            onChange={(selected) => {
              console.log({ selected });
              formik.setFieldValue("creditDays", selected?.value);
            }}
            onBlur={() => formik.setFieldTouched("creditDays", true)}
            classNamePrefix={
              formik.touched.creditDays && formik.errors.creditDays
                ? "is-invalid"
                : ""
            }
          />
          {formik.touched.creditDays && formik.errors.creditDays && (
            <div className="text-danger mt-1" style={{ fontSize: "11px" }}>
              {formik.errors.creditDays}
            </div>
          )}
        </Col>
      )}
    </Row>
  );
}
