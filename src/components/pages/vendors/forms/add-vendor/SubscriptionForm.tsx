import { Col, Form, Row } from "react-bootstrap";
import Select from "react-select";
import { useGetAllBrands } from "src/services/brand.service";
import { useGetAllPlansByRole } from "src/services/subscription.service";
import { SubscriptionPlan } from "src/types/types";

export const durationTypes = [
  {
    value: "monthly",
    label: "Monthly",
  },
  {
    value: "yearly",
    label: "Yearly",
  },
];
export default function SubscriptionForm({ formik }: any) {
  // QUERIES
  const {
    data: brands,
    isLoading: brandsLoading,
    error: brandsError,
  } = useGetAllBrands();

  // QUERIES
  const { data: plans, isLoading } = useGetAllPlansByRole("vendor") as {
    data: SubscriptionPlan[];
    isLoading: boolean;
  };

  console.log({
    planId: formik.values.planId,
    durationType: formik.values.durationType,
  });

  return (
    <Row className="px-1 px-md-3">
      <Col lg={12} className="px-2 py-1  ">
        <Form.Label className="col-form-label">Subscription Plan</Form.Label>
        <Select
          name="planId"
          options={plans?.map((item: any) => ({
            value: item?._id,
            label: item?.plan?.toUpperCase(),
          }))}
          value={plans
            ?.map((item: any) => ({
              value: item?._id,
              label: item?.plan?.toUpperCase(),
            }))
            .find((opt) => opt.value === formik.values.planId)}
          // isMulti={false}
          placeholder="Select Subscription Plan"
          onChange={(selected: any) => {
            console.log({ selected });
            formik.setFieldValue("planId", selected?.value);
          }}
          onBlur={() => formik.setFieldTouched("planId", true)}
          classNamePrefix={
            formik.touched.planId && formik.errors.planId ? "is-invalid" : ""
          }
        />
        {formik.touched.planId && formik.errors.planId && (
          <div className="text-danger mt-1" style={{ fontSize: "11px" }}>
            {formik.errors.planId}
          </div>
        )}
      </Col>
      <Col lg={12} className="px-2 py-1  ">
        <Form.Label className="col-form-label">
          Select subscription duration
        </Form.Label>
        <Select
          name="durationType"
          options={durationTypes}
          value={durationTypes.find(
            (opt) => opt.value === formik.values.durationType
          )}
          isMulti={false}
          placeholder="Select subscription duration"
          // value={["english", "arabic", "german", "spanish", "french"]
          //   .map((loc) => ({ value: loc, label: loc?.toUpperCase() }))
          //   .filter((opt) => formik.values.brands.includes(opt.value))}
          onChange={(selected) => {
            console.log({ selected });
            formik.setFieldValue("durationType", selected?.value);
          }}
          onBlur={() => formik.setFieldTouched("durationType", true)}
          classNamePrefix={
            formik.touched.durationType && formik.errors.durationType
              ? "is-invalid"
              : ""
          }
        />
        {formik.touched.durationType && formik.errors.durationType && (
          <div className="text-danger mt-1" style={{ fontSize: "11px" }}>
            {formik.errors.durationType}
          </div>
        )}
      </Col>
    </Row>
  );
}
