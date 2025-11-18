import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import Wizard, {
  WizardNavItem,
  WizardTab,
  WizardPager,
  WizardNav,
} from "src/components/features/elements/wizard";

import ProfileForm from "./ProfileForm";
import ContactForm from "./ContactForm";
import Breadcrumb from "src/components/common/breadcrumb";
import { VendorProfileValidationSchema } from "src/validations/validationSchemas";

export default function AddVendorPage() {
  // ------------------------------
  // FORM + VALIDATION
  // ------------------------------
  const profileFormik = useFormik({
    initialValues: {
      business_name: "",
      phoneNumber: "",
      email: "",
      location: "",
      tradeLicenseNumber: "",
      documents: {
        tradeLicense: "" as any,
      },
      business_address: "",
      post: "",
      business_hours: "",
      shop_photo_logo: "" as any,
    },

    validationSchema: VendorProfileValidationSchema,

    onSubmit: (values) => {
      console.log("FINAL SUBMIT:", values);
    },
  });

  const handleWizardFinish = () => {
    profileFormik.submitForm();
  };

  return (
    <>
      <Breadcrumb
        current={"Create Vendor"}
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
            name: "create vendor",
            url: "/vendors/add-vendor",
          },
        ]}
      />
      <div className="p-3">
        {/* <h4>Create Vendor</h4> */}

        <Wizard
          className="form-horizontal"
          showProgress={true}
          progressSize="lg"
          onFinish={handleWizardFinish}
        >
          {/* ------------------------- */}
          {/* WIZARD PROGRESS STEPS     */}
          {/* ------------------------- */}
          <WizardNav className="wizard-steps">
            <WizardNavItem>
              <span>1</span> Profile
            </WizardNavItem>

            <WizardNavItem>
              <span>2</span> Contact
            </WizardNavItem>

            <WizardNavItem>
              <span>3</span> Preferences
            </WizardNavItem>

            <WizardNavItem>
              <span>4</span> Subscription
            </WizardNavItem>
          </WizardNav>

          {/* ------------------------- */}
          {/* STEP 1: PROFILE           */}
          {/* ------------------------- */}
          <WizardTab>
            <ProfileForm formik={profileFormik} />
          </WizardTab>

          {/* ------------------------- */}
          {/* STEP 2: CONTACT           */}
          {/* ------------------------- */}
          <WizardTab>
            <ContactForm formik={profileFormik} />
          </WizardTab>

          {/* ------------------------- */}
          {/* STEP 3: PREFERENCES (TEMP)*/}
          {/* ------------------------- */}
          <WizardTab>
            <div>
              <h5>Preferences</h5>
              <p>Put preferences form here</p>
            </div>
          </WizardTab>

          {/* ------------------------- */}
          {/* STEP 4: SUBSCRIPTION      */}
          {/* ------------------------- */}
          <WizardTab>
            <div>
              <h5>Subscription</h5>
              {/* <input
                type="text"
                className="form-control"
                placeholder="Subscription plan"
                name="subscription_plan"
                value={formik.values.subscription_plan}
                onChange={formik.handleChange}
              />
              {formik.touched.subscription_plan &&
                formik.errors.subscription_plan && (
                  <p className="text-danger text-sm">
                    {formik.errors.subscription_plan}
                  </p>
                )} */}
            </div>
          </WizardTab>

          {/* ------------------------- */}
          {/* BUILT-IN WIZARD BUTTONS   */}
          {/* ------------------------- */}
          <WizardPager  />
        </Wizard>
      </div>
    </>
  );
}
