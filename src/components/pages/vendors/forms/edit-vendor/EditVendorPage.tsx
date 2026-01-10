import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import Wizard, {
  WizardNavItem,
  WizardTab,
  WizardPager,
  WizardNav,
} from "src/components/features/elements/wizard";

import Breadcrumb from "src/components/common/breadcrumb";
import {
  VendorContactValidationSchema,
  VendorPreferenceValidationSchema,
  VendorProfileValidationSchema,
  VendorSubscriptionValidationSchema,
} from "src/validations/validationSchemas";
import {
  useAddVendor,
  useGetVendorById,
  useUpdateVendor,
} from "src/services/vendor.service";
import { toast } from "react-toastify";
import { errorMsg } from "src/utils/toast";
import _ from "lodash";
import { useUploadFile } from "src/services/fileUpload.service";
import {
  useCreateVendorKyc,
  useUpdateVendorKyc,
} from "src/services/vendor-kyc.service";
import {
  useGetPreferenceByUserId,
  useUpdatePreference,
} from "src/services/preference.service";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useGetSubscriptionOrderById,
  usePurchasePlan,
} from "src/services/subscription-orders";
import ProfileForm from "../add-vendor/ProfileForm";
import ContactForm from "../add-vendor/ContactForm";
import PreferenceForm from "../add-vendor/PreferenceForm";
import SubscriptionForm from "../add-vendor/SubscriptionForm";
import { User } from "src/types/types";
import { useUpdateExpireData } from "src/services/subscription-orders";

export default function EditVendorPage() {
  const [searchParams] = useSearchParams();
  const vendorID = searchParams.get("_id");
  const section: any = searchParams.get("section")
  const navigate = useNavigate();

  // const [vendorId, setVendorId] = useState<string>("");
  const [stepIndex, setStepIndex] = useState<number>(0);
  // console.log({ vendorId });



  useEffect(() => {


    setStepIndex(section)

  }, [section])




  // QUERIES
  const { data: vendor, isLoading: isVendorLoading } = useGetVendorById(
    vendorID ? vendorID : "",
    !!vendorID
  ) as {
    data: User;
    isLoading: boolean;
  };

  const activePlanId = vendor?.active_plan;

  const { data: vendorPreference, isLoading: isPreferenceLoading } =
    useGetPreferenceByUserId(vendorID ? vendorID : "", !!vendorID);

  const { data: vendorActivePlan, isLoading: isActivePlanLoading } =
    useGetSubscriptionOrderById(activePlanId);

  // MUTATIONS
  const { mutateAsync: createVendor } = useAddVendor();
  const { mutateAsync: updateVendor } = useUpdateVendor();
  const { mutateAsync: updateVendorKyc } = useUpdateVendorKyc();
  const { mutateAsync: createVendorKyc } = useCreateVendorKyc();
  const { mutateAsync: updatePreference } = useUpdatePreference();
  const { mutateAsync: purchasePlan } = usePurchasePlan();
  const { mutateAsync: uploadFile } = useUploadFile();
  const { mutateAsync: updateSubscription } = useUpdateExpireData()

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
      vatNumber: "",
      tradeLicenseRegistrationDate: "",
      tradeLicenseExpiryDate: "",
      documents: {
        tradeLicense: "" as any,
        vatDoc: "" as any
      },
      business_address: "",
      post: "",
      business_hours: "",
      vendor_logo: "" as any,
      shop_photo_logo: "" as any,
      description: "" as any,

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
        toast.loading("Updating Profile Details", {
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
          if (typeof values?.vendor_logo !== "string") {
            let formData = new FormData();
            formData.append("file", values?.vendor_logo?.file);
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
          const res = await updateVendorKyc({
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
      priority: 0
    },

    validationSchema: VendorContactValidationSchema,

    onSubmit: async (values) => {
      console.log("CONTACT SUBMIT:", values);
      toast.loading("Updating Vendor Account", {
        containerId: "default",
        className: "no-icon notification-warning",
      });
      try {
        // const res = await createVendor(values);
        const res = await updateVendor({ id: vendor?._id, data: values });
        console.log("RESPONSE = ", res);
        if (res.status === 200) {
          // setVendorId(res?.data?.data?._id);

          await profileFormik.setFieldValue("vendorId", vendor?._id);
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
      toast.loading("Updating Vendor Preferences", {
        containerId: "default",
        className: "no-icon notification-warning",
      });
      try {
        const res = await updatePreference({
          id: vendor?._id,
          data: values,
        });
        if (res.status === 200) {
          toast.dismiss();
          setStepIndex(0);
          // subscriptionFormik.resetForm();
          // preferenceFormik.resetForm();
          // contactFormik.resetForm();
          // profileFormik.resetForm();
          navigate(-1);

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
      plan_end_date: "" as any,
      plan_start_date: "" as any,
      trial_end_date: "" as any

    },

    validationSchema: VendorSubscriptionValidationSchema,

    onSubmit: async (values) => {
      console.log("SUBSCRIPTION SUBMIT:", values);
      toast.loading("Upading subscription plan", {
        containerId: "default",
        className: "no-icon notification-warning",
      });
      try {
        const res = await updateSubscription({
          id: vendorActivePlan?._id,
          data: values
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
    // if (stepIndex === 0) contactFormik.submitForm();
    // if (stepIndex === 1) profileFormik.submitForm();
    // if (stepIndex === 2) preferenceFormik.submitForm();
    // if (stepIndex === 3) subscriptionFormik.submitForm();

    profileFormik.submitForm();
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

  useEffect(() => {
    if (vendor) {
      contactFormik.setValues({
        userName: vendor?.userName || "",
        designation: vendor?.designation || "",
        phoneNumber: vendor?.phoneNumber || "",
        email: vendor?.email || "",
        language: vendor?.language || [],
        role: "vendor",
        priority: vendor?.priority || 0
      });

      if (vendor?.kyc) {
        profileFormik.setValues({
          business_name: vendor?.kyc?.business_name || "",
          phoneNumber: vendor?.kyc?.phoneNumber || "",
          email: vendor?.kyc?.email || "",
          location: vendor?.kyc?.location || "",
          vatNumber: vendor?.kyc?.vatNumber || "",
          tradeLicenseNumber: vendor?.kyc?.tradeLicenseNumber || "",
          tradeLicenseRegistrationDate: vendor?.kyc
            ?.tradeLicenseRegistrationDate
            ? new Date(vendor?.kyc?.tradeLicenseRegistrationDate)
              .toISOString()
              .split("T")[0]
            : "",
          tradeLicenseExpiryDate: vendor?.kyc?.tradeLicenseExpiryDate
            ? new Date(vendor?.kyc?.tradeLicenseExpiryDate)
              .toISOString()
              .split("T")[0]
            : "",
          documents: {
            tradeLicense: vendor?.kyc?.documents?.tradeLicense || "",
            vatDoc: vendor?.kyc?.documents?.vatDoc || "",
          },
          business_address: vendor?.kyc?.business_address || "",
          post: vendor?.kyc?.post || "",
          business_hours: vendor?.kyc?.business_hours || "",
          vendor_logo: vendor?.kyc?.vendor_logo || "",
          shop_photo_logo: vendor?.kyc?.shop_photo_logo || "",
          vendorId: vendor?._id || "",
          description: vendor?.kyc?.description as any,
        });
      }
    }
  }, [vendor, vendorID]);
  useEffect(() => {
    if (vendorPreference) {
      preferenceFormik.setValues({
        brands: vendorPreference?.brands
          ? vendorPreference?.brands?.map((brand: any) => ({
            brandId: brand?.brandId?._id,
          }))
          : [],
        authorised_brands: vendorPreference?.authorised_brands
          ? vendorPreference?.authorised_brands?.map((brand: any) => ({
            brandId: brand?.brandId?._id,
          }))
          : [],
        paymentMethod: vendorPreference?.paymentMethod || "",
        creditDays: vendorPreference?.creditDays || "",
      });
    }
  }, [vendorPreference]);
  useEffect(() => {
    if (vendorActivePlan) {
      subscriptionFormik.setValues({
        planId: vendorActivePlan?.planId || "",
        durationType: vendorActivePlan?.durationType || "",
        plan_end_date: new Date(vendorActivePlan.plan_end_date).toISOString()
          .split("T")[0] || "",
        plan_start_date: new Date(vendorActivePlan?.plan_start_date).toISOString()
          .split("T")[0] || "",
        trial_end_date: vendorActivePlan?.trial_end_date ? new Date(vendorActivePlan?.trial_end_date).toISOString()
          .split("T")[0] : ""
      });
    }
  }, [vendorActivePlan]);

  console.log("contact formik values:", contactFormik.values);

  return (
    <>
      <Breadcrumb
        current={"Edit Vendor"}
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
            name: "edit vendor",
            url: "/vendors/edit-vendor",
          },
        ]}
      />
      <div className="p-3">
        {/* <h4>Edit Vendor</h4> */}

        <Wizard
          className="form-horizontal"
          showProgress
          progressSize="lg"
          validators={[
            profileFormik,
            contactFormik,
            preferenceFormik,
          ]}
          stepIndex={stepIndex}
          onStepChange={setStepIndex}
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
            <ProfileForm isEdit={true} formik={profileFormik} />
          </WizardTab>

          {/* ------------------------- */}
          {/* STEP 2: CONTACT           */}
          {/* ------------------------- */}
          <WizardTab>
            <ContactForm isEdit={true} formik={contactFormik} />
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
            <SubscriptionForm edit={true} formik={subscriptionFormik} />
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
