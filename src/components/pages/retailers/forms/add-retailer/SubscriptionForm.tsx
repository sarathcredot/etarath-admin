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


export default function SubscriptionForm({ formik, edit = false }: any) {
  // QUERIES
  const {
    data: brands,
    isLoading: brandsLoading,
    error: brandsError,
  } = useGetAllBrands();

  // QUERIES
  const { data: plans, isLoading } = useGetAllPlansByRole("retailer") as {
    data: SubscriptionPlan[];
    isLoading: boolean;
  };

  console.log("plan", { planId: formik.values.planId, durationType: formik.values.durationType });

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
          isDisabled={edit}
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
          isDisabled={edit}
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

      {
        edit &&
        <>
          <Col lg={12} className="px-4 py-1  ">
            <Form.Group as={Row} className="align-items-center">
              <Form.Label className="col-form-label">Plan start date</Form.Label>
              <Form.Control
                type="date"
                placeholder="plan start date"
                name="plan_start_date"
                value={formik.values.plan_start_date}
                onChange={formik.handleChange}
              // isInvalid={
              //   !!formik.errors.endDate && !!formik.touched.endDate
              // }
              />
              {/* <Form.Control.Feedback type="invalid">
                  {formik.errors.endDate}
                </Form.Control.Feedback> */}
            </Form.Group>
          </Col>

          <Col lg={12} className="px-4 py-1  ">
            <Form.Group as={Row} className="align-items-center">
              <Form.Label className="col-form-label"> Plan expiry date</Form.Label>
              <Form.Control
                type="date"
                placeholder="plan end datejkl"
                name="plan_end_date"
                value={formik.values.plan_end_date}
                onChange={formik.handleChange}
              // isInvalid={
              //   !!formik.errors.endDate && !!formik.touched.endDate
              // }
              />
              {/* <Form.Control.Feedback type="invalid">
                  {formik.errors.endDate}
                </Form.Control.Feedback> */}
            </Form.Group>
          </Col>

          {
            formik.values.trial_end_date && <Col lg={12} className="px-4 py-1  ">
              <Form.Group as={Row} className="align-items-center">
                <Form.Label className="col-form-label"> Trial end date</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="plan end datejkl"
                  name="trial_end_date"
                  value={formik.values.trial_end_date}
                  onChange={formik.handleChange}
                // isInvalid={
                //   !!formik.errors.endDate && !!formik.touched.endDate
                // }
                />
                {/* <Form.Control.Feedback type="invalid">
                  {formik.errors.endDate}
                </Form.Control.Feedback> */}
              </Form.Group>
            </Col>
          }



        </>
      }



    </Row>
  );
}
