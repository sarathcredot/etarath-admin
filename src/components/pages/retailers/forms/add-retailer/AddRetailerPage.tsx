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
import KycForm from "./KycForm";
import Breadcrumb from "src/components/common/breadcrumb";
import {
  VendorKycValidationSchema,
  VendorPreferenceValidationSchema,
  VendorSubscriptionValidationSchema,
  VendorValidationSchema,
} from "src/validations/validationSchemas";
import PreferenceForm from "./PreferenceForm";
import { toast } from "react-toastify";
import { errorMsg } from "src/utils/toast";
import _ from "lodash";
import { useUploadFile } from "src/services/fileUpload.service";
import { useCreateVendorKyc } from "src/services/vendor-kyc.service";
import { useUpdatePreference } from "src/services/preference.service";
import { useNavigate } from "react-router-dom";
import SubscriptionForm from "./SubscriptionForm";
import { usePurchasePlan } from "src/services/subscription-orders";
import { useAddRetailer } from "src/services/retailer.service";

export default function EditRetailerPage() {
  const navigate = useNavigate();

  const [retailerId, setRetailerId] = useState<string>("");
  const [stepIndex, setStepIndex] = useState<number>(0);
  console.log({ retailerId });

  // MUTATIONS
  const { mutateAsync: createRetailer } = useAddRetailer();
  const { mutateAsync: createVendorKyc } = useCreateVendorKyc();
  const { mutateAsync: updatePreference } = useUpdatePreference();
  const { mutateAsync: purchasePlan } = usePurchasePlan();
  const { mutateAsync: uploadFile } = useUploadFile();

  // ------------------------------
  // FORM + VALIDATION
  // ------------------------------
  const profileFormik = useFormik({
    initialValues: {
      userName: "",
      email: "",
      phoneNumber: "",
      eidNo: "",
      eidExpiryDate: "",
      eidFile: "" as any,
      imgUrl: "" as any,
      role: "retailer",
      priority: 0,

    },

    validationSchema: VendorValidationSchema,

    onSubmit: async (values) => {
      // in profile submit handler
      console.log(
        "PROFILE SUBMIT :",
        JSON.stringify(profileFormik.values)
      );

      toast.loading("Creating Retailer Account", {
        containerId: "default",
        className: "no-icon notification-warning",
      });
      try {
        if (typeof values?.imgUrl !== "string") {
          let formData = new FormData();
          formData.append("file", values?.imgUrl);
          let response = await uploadFile(formData);
          values.imgUrl = response.data.data;
        }
        if (typeof values?.eidFile !== "string") {
          let formData = new FormData();
          formData.append("file", values?.eidFile);
          let response = await uploadFile(formData);
          values.eidFile = response.data.data;
        }

        const res = await createRetailer(values);
        if (res.status === 200) {
          setRetailerId(res?.data?.data?._id);

          await kycFormik.setFieldValue("retailerId", res?.data?.data?._id);
          // toast(res?.data?.message, {
          //   containerId: "default",
          //   className: "no-icon notification-success",
          // });
          setStepIndex(1);
          toast.dismiss();
          await kycFormik.submitForm();
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
  const kycFormik = useFormik({
    initialValues: {
      shop_name: "",
      business_type: "",
      shop_location: "",
      tradeLicenseNumber: "",
      vatNumber: "",
      documents: {
        tradeLicense: "" as any,
        vatDoc: "" as ""
      },
      tradeLicenseRegistrationDate: "",
      tradeLicenseExpiryDate: "",
      shop_address: "",
      // city: "",
      post: "",
      business_hours: "",
      shop_contact_number: "",
      shop_photo_logo: "" as any,
      description: "" as any,
      geoLat: 0 as any,
      geoLng: 0 as any,

      retailerId: "",
    },
    validationSchema: VendorKycValidationSchema,

    onSubmit: async (values) => {
      console.log("KYC SUBMIT:", values);
      if (values?.retailerId) {
        toast.loading("Adding Business Details", {
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

          if (values.geoLat === 25.2048) {
            values.geoLat = null
          }

          if (values.geoLng === 55.2708) {
            values.geoLng = null
          }

          if (typeof values?.shop_photo_logo !== "string") {
            let formData = new FormData();
            formData.append("file", values?.shop_photo_logo);
            let response = await uploadFile(formData);
            values.shop_photo_logo = response.data.data;
          }
          values.shop_contact_number = values.shop_contact_number.toString();
          const res = await createVendorKyc({
            userId: values?.retailerId,
            data: values,
          });
          console.log("RESPONSE = ", res);
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
        toast.dismiss();
        toast("Retailer ID is missing", {
          containerId: "default",
          className: "no-icon notification-danger",
        });
      }
    },
  });
  const preferenceFormik = useFormik({
    initialValues: {
      brands: [] as object[],
      // authorised_brands: [] as object[],
      averageMonthlyVolume: "",
      paymentMethod: "",
      creditDays: "",
      // typeOfTyers: [] as string[],
    },

    validationSchema: VendorPreferenceValidationSchema,

    onSubmit: async (values) => {
      console.log("PREFERENCE SUBMIT:", values);
      toast.loading("Adding Retailer Preferences", {
        containerId: "default",
        className: "no-icon notification-warning",
      });
      try {
        const res = await updatePreference({
          id: retailerId,
          data: values,
        });
        if (res.status === 200) {
          toast.dismiss();

          // toast(res?.data?.message, {
          //   containerId: "default",
          //   className: "no-icon notification-success",
          // });

          setStepIndex(3);
          subscriptionFormik.submitForm();
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
          userId: retailerId,
          planId: values.planId,
          durationType: values.durationType,
        });
        if (res.status === 200) {
          toast.dismiss();
          toast("Retailer created successfully!", {
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
          kycFormik.resetForm();
          profileFormik.resetForm();
          navigate("/retailers");
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
    if (stepIndex === 0) profileFormik.submitForm();
    if (stepIndex === 1) kycFormik.submitForm();
    if (stepIndex === 2) preferenceFormik.submitForm();
    if (stepIndex === 3) subscriptionFormik.submitForm();
  };

  console.log({ stepIndex });

  console.log("kyc formik values:", kycFormik.values);

  return (
    <>
      <Breadcrumb
        current={"Create Retailer"}
        paths={[
          {
            name: "Dashboard",
            url: "/dashboard",
          },
          {
            name: "retailers",
            url: "/retailers",
          },
          {
            name: "create retailer",
            url: "/retailers/add-retailer",
          },
        ]}
      />
      <div className="p-3">
        {/* <h4>Create Retailer</h4> */}

        <Wizard
          className="form-horizontal"
          showProgress={true}
          progressSize="lg"
          validators={[profileFormik, kycFormik, preferenceFormik, subscriptionFormik]}
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
              <span>2</span> Business Details
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
          {/* STEP 2: KYC           */}
          {/* ------------------------- */}
          <WizardTab>
            <KycForm formik={kycFormik} />
          </WizardTab>

          {/* ------------------------- */}
          {/* STEP 3: PREFERENCES */}
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
