import React, { useState } from "react";
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
import {
  VendorContactValidationSchema,
  VendorPreferenceValidationSchema,
  VendorProfileValidationSchema,
  VendorSubscriptionValidationSchema,
} from "src/validations/validationSchemas";
import PreferenceForm from "./PreferenceForm";
import { useAddVendor } from "src/services/vendor.service";
import { toast } from "react-toastify";
import { errorMsg } from "src/utils/toast";
import _ from "lodash";
import { useUploadFile } from "src/services/fileUpload.service";
import { useCreateVendorKyc } from "src/services/vendor-kyc.service";
import { useUpdatePreference } from "src/services/preference.service";
import { useNavigate } from "react-router-dom";
import SubscriptionForm from "./SubscriptionForm";
import { usePurchasePlan } from "src/services/subscription-orders";

export default function AddVendorPage() {
  const navigate = useNavigate();

  const [vendorId, setVendorId] = useState<string>("");
  const [stepIndex, setStepIndex] = useState<number>(0);
  console.log({ vendorId });

  // MUTATIONS
  const { mutateAsync: createVendor } = useAddVendor();
  const { mutateAsync: createVendorKyc } = useCreateVendorKyc();
  const { mutateAsync: updatePreference } = useUpdatePreference();
  const { mutateAsync: purchasePlan } = usePurchasePlan();
  const { mutateAsync: uploadFile } = useUploadFile();

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
      vatNumber:"",
      tradeLicenseRegistrationDate: "",
      tradeLicenseExpiryDate: "",
      documents: {
        tradeLicense: "" as any,
        vatDoc:"" as any
      },
      business_address: "",
      post: "",
      business_hours: "",
      vendor_logo: "" as any,
      shop_photo_logo: "" as any,
      description:"" as any,

      vendorId: "",
    },

    validationSchema: VendorProfileValidationSchema,

    onSubmit: async (values) => {
      // in profile submit handler
      console.log(
        "PROFILE SUBMIT (raw):",
        JSON.stringify(profileFormik.values)
      );

      if (values?.vendorId) {
        toast.loading("Adding Contact Details", {
          containerId: "default",
          className: "no-icon notification-warning",
        });
        try {
          if (typeof values?.documents?.tradeLicense !== "string") {
            let formData = new FormData();
            formData.append("file", values?.documents?.tradeLicense);
            let response = await uploadFile(formData);
            values.documents.tradeLicense = response.data.data;
          }

          if (typeof values?.documents?.vatDoc !== "string") {
            let formData = new FormData();
            formData.append("file", values?.documents?.vatDoc);
            let response = await uploadFile(formData);
            values.documents.vatDoc = response.data.data;
          }



          if (typeof values?.vendor_logo !== "string") {
            let formData = new FormData();
            formData.append("file", values?.vendor_logo);
            let response = await uploadFile(formData);
            values.vendor_logo = response.data.data;
          }
          if (typeof values?.shop_photo_logo !== "string") {
            let formData = new FormData();
            formData.append("file", values?.shop_photo_logo);
            let response = await uploadFile(formData);
            values.shop_photo_logo = response.data.data;
          }
          values.phoneNumber = values.phoneNumber.toString();
          const res = await createVendorKyc({
            userId: values.vendorId,
            data: values,
          });
          if (res.status === 200) {
            // toast(res?.data?.message, {
            //   containerId: "default",
            //   className: "no-icon notification-success",
            // });
            setStepIndex(2);
            toast.dismiss();
            preferenceFormik.submitForm();
          }
        } catch (error: any) {
          toast.dismiss();
          toast(_.capitalize(errorMsg(error).toLowerCase()), {
            containerId: "default",
            className: "no-icon notification-danger",
          });
        }
      } else {
        toast("Vendor ID is missing", {
          containerId: "default",
          className: "no-icon notification-danger",
        });
      }
    },
  });
  const contactFormik = useFormik({
    initialValues: {
      userName: "",
      designation: "",
      phoneNumber: "",
      email: "",
      language: [] as string[],
      role: "vendor",
      priority:0
    },

    validationSchema: VendorContactValidationSchema,

    onSubmit: async (values) => {
      console.log("CONTACT SUBMIT:", values);
      toast.loading("Creating Vendor Account", {
        containerId: "default",
        className: "no-icon notification-warning",
      });
      try {
        const res = await createVendor(values);
        console.log("RESPONSE = ", res);
        if (res.status === 200) {
          setVendorId(res?.data?.data?._id);

          await profileFormik.setFieldValue("vendorId", res?.data?.data?._id);
          // toast(res?.data?.message, {
          //   containerId: "default",
          //   className: "no-icon notification-success",
          // });
          setStepIndex(1);
          toast.dismiss();
          await profileFormik.submitForm();
        }
      } catch (error: any) {
        console.log("error = ", error);
        toast.dismiss();
        toast(_.capitalize(errorMsg(error).toLowerCase()), {
          containerId: "default",
          className: "no-icon notification-danger",
        });
      }
    },
  });
  const preferenceFormik = useFormik({
    initialValues: {
      brands: [] as object[],
      authorised_brands: [] as object[],
      // averageMonthlyVolume: "",
      paymentMethod: "",
      creditDays: "",
      // typeOfTyers: [] as string[],
    },

    validationSchema: VendorPreferenceValidationSchema,

    onSubmit: async (values) => {
      console.log("PREFERENCE SUBMIT:", values);
      toast.loading("Adding Vendor Preferences", {
        containerId: "default",
        className: "no-icon notification-warning",
      });
      try {
        const res = await updatePreference({
          id: vendorId,
          data: values,
        });
        if (res.status === 200) {
          toast.dismiss();

          // toast(res?.data?.message, {
          //   containerId: "default",
          //   className: "no-icon notification-success",
          // });

          setStepIndex(3);
          await subscriptionFormik.submitForm();
        }
      } catch (error: any) {
        toast.dismiss();
        toast(_.capitalize(errorMsg(error).toLowerCase()), {
          containerId: "default",
          className: "no-icon notification-danger",
        });
      }
    },
  });
  const subscriptionFormik = useFormik({
    initialValues: {
      planId: "",
      durationType: "",
    },

    validationSchema: VendorSubscriptionValidationSchema,

    onSubmit: async (values) => {
      console.log("SUBSCRIPTION SUBMIT:", values);
      toast.loading("purchasing subscription plan", {
        containerId: "default",
        className: "no-icon notification-warning",
      });
      try {
        const res = await purchasePlan({
          userId: vendorId,
          planId: values.planId,
          durationType: values.durationType,
        });
        if (res.status === 200) {
          toast.dismiss();
          toast("Vendor created successfully!", {
            containerId: "default",
            className: "no-icon notification-success",
          });
          // toast(res?.data?.message, {
          //   containerId: "default",
          //   className: "no-icon notification-success",
          // });

          setStepIndex(0);
          subscriptionFormik.resetForm();
          preferenceFormik.resetForm();
          contactFormik.resetForm();
          profileFormik.resetForm();
          navigate("/vendors");
        }
      } catch (error: any) {
        toast.dismiss();
        toast(_.capitalize(errorMsg(error).toLowerCase()), {
          containerId: "default",
          className: "no-icon notification-danger",
        });
      }
    },
  });

  const handleWizardFinish = () => {
    if (stepIndex === 0) contactFormik.submitForm();
    if (stepIndex === 1) profileFormik.submitForm();
    if (stepIndex === 2) preferenceFormik.submitForm();
    if (stepIndex === 3) subscriptionFormik.submitForm();
  };

  console.log({ stepIndex });

  // const handleStepValidate = async (stepIndex: number) => {
  //   if (stepIndex === 0) {
  //     alert(`validating step ${stepIndex}`);
  //     const errors = await profileFormik.validateForm();
  //     if (Object.keys(errors).length) return false;
  //     await profileFormik.submitForm();
  //   }

  //   if (stepIndex === 1) {
  //     const errors = await contactFormik.validateForm();
  //     if (Object.keys(errors).length) return false;
  //     await contactFormik.submitForm();
  //   }

  //   if (stepIndex === 2) {
  //     const errors = await preferenceFormik.validateForm();
  //     if (Object.keys(errors).length) return false;
  //     await preferenceFormik.submitForm();
  //   }

  //   return true;
  // };

  console.log("contact formik values:", contactFormik.values);

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
          validators={[profileFormik, contactFormik, preferenceFormik,subscriptionFormik]}
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
            <ContactForm formik={contactFormik} />
          </WizardTab>

          {/* ------------------------- */}
          {/* STEP 3: PREFERENCES (TEMP)*/}
          {/* ------------------------- */}
          <WizardTab>
            <PreferenceForm formik={preferenceFormik} />
          </WizardTab>

          {/* ------------------------- */}
          {/* STEP 4: SUBSCRIPTION      */}
          {/* ------------------------- */}
          <WizardTab>
            <SubscriptionForm formik={subscriptionFormik} />
          </WizardTab>

          {/* ------------------------- */}
          {/* BUILT-IN WIZARD BUTTONS   */}
          {/* ------------------------- */}
          <WizardPager />
        </Wizard>
      </div>
    </>
  );
}
