



import React, { useEffect, useState } from "react";
import { useFormik } from "formik";

import Wizard, {
    WizardNavItem,
    WizardTab,
    WizardPager,
    WizardNav,
} from "src/components/features/elements/wizard";

import ProfileForm from "./ProfileForm";
import KycForm from "./KycForm";
import PreferenceForm from "./PreferenceForm";
import SubscriptionForm from "./SubscriptionForm";

import Breadcrumb from "src/components/common/breadcrumb";
import {
    VendorKycValidationSchema,
    VendorPreferenceValidationSchema,
    VendorSubscriptionValidationSchema,
    VendorValidationSchema,
} from "src/validations/validationSchemas";

import { toast } from "react-toastify";
import { errorMsg } from "src/utils/toast";
import _ from "lodash";

import { useUploadFile } from "src/services/fileUpload.service";
import { useUpdateVendorKyc } from "src/services/vendor-kyc.service";
import { useUpdatePreference } from "src/services/preference.service";
import {
    useUpdateRetailer,
    useGetRetailerById,
    useGetRetailerPriorityByIdById,
} from "src/services/retailer.service";

import { useNavigate, useSearchParams } from "react-router-dom";
import {
    useGetSubscriptionOrderById,
    usePurchasePlan,
    useUpdateExpireData,
} from "src/services/subscription-orders";

export default function AddRetailerPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const retailerIdobj = searchParams.get("_id");
    const sectionParam = searchParams.get("section");

    // ✅ Only 3 tabs right now (Profile, Business, Preferences)
    // If you enable Subscription tab later, change this to 3.
    const MAX_STEP = 3;

    const getSafeSection = (raw: string | null) => {
        const n = Number(raw);
        if (!Number.isFinite(n)) return 0;
        return Math.max(0, Math.min(n, MAX_STEP));
    };

    // ✅ Initialize from URL immediately to prevent flicker/jump-back
    const [stepIndex, setStepIndex] = useState<number>(() =>
        getSafeSection(sectionParam)
    );

    // ✅ Update when URL param changes
    useEffect(() => {
        setStepIndex(getSafeSection(sectionParam));
    }, [sectionParam]);

    // QUERIES
    const { data: retailer, isLoading: retailerLoding } = useGetRetailerById(
        retailerIdobj,
        !!retailerIdobj
    );

    const { data: retailerPriority, isLoading: retailerPriorityLoding } =
        useGetRetailerPriorityByIdById(retailerIdobj, !!retailerIdobj);

    const activePlanId = retailer?.active_plan;

    const { data: retailerActivePlan, isLoading: isActivePlanLoading } =
        useGetSubscriptionOrderById(activePlanId);

    // MUTATIONS
    const { mutateAsync: updateRetailer } = useUpdateRetailer();
    const { mutateAsync: updateRetailerKyc } = useUpdateVendorKyc();
    const { mutateAsync: updatePreference } = useUpdatePreference();
    const { mutateAsync: updateSubscription } = useUpdateExpireData();
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
            role: "",
            priority: 0,

        },

        validationSchema: VendorValidationSchema,

        onSubmit: async (values) => {
            toast.loading("Updating profile details", {
                containerId: "default",
                className: "no-icon notification-warning",
            });

            try {
                if (typeof values?.imgUrl !== "string") {
                    const formData = new FormData();
                    formData.append("file", values?.imgUrl);
                    const response = await uploadFile(formData);
                    values.imgUrl = response.data.data;
                }

                if (typeof values?.eidFile !== "string") {
                    const formData = new FormData();
                    formData.append("file", values?.eidFile);
                    const response = await uploadFile(formData);
                    values.eidFile = response.data.data;
                }

                const res = await updateRetailer({ id: retailer?._id, data: values });

                if (res.status === 200) {
                    await kycFormik.setFieldValue("retailerId", retailer?._id);
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
            documents: {
                tradeLicense: "" as any,
                vatDoc: "" as any,
            },
            tradeLicenseRegistrationDate: "",
            tradeLicenseExpiryDate: "",
            shop_address: "",
            post: "",
            business_hours: "",
            shop_contact_number: "",
            shop_photo_logo: "" as any,
            description: "" as any,
            retailerId: "",
        },

        validationSchema: VendorKycValidationSchema,

        onSubmit: async (values) => {
            if (!values?.retailerId) {
                toast.dismiss();
                toast("Retailer ID is missing", {
                    containerId: "default",
                    className: "no-icon notification-danger",
                });
                return;
            }

            toast.loading("Updating Business Details", {
                containerId: "default",
                className: "no-icon notification-warning",
            });

            try {
                if (typeof values?.documents?.tradeLicense !== "string") {
                    const formData = new FormData();
                    formData.append("file", values?.documents?.tradeLicense);
                    const response = await uploadFile(formData);
                    values.documents.tradeLicense = response.data.data;
                }

                if (typeof values?.shop_photo_logo !== "string") {
                    const formData = new FormData();
                    formData.append("file", values?.shop_photo_logo);
                    const response = await uploadFile(formData);
                    values.shop_photo_logo = response.data.data;
                }

                values.shop_contact_number = values.shop_contact_number.toString();

                const res = await updateRetailerKyc({
                    userId: values?.retailerId,
                    data: values,
                });

                if (res.status === 200) {
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
        },
    });

    const preferenceFormik = useFormik({
        initialValues: {
            brands: [] as object[],
            averageMonthlyVolume: "",
            paymentMethod: "",
            creditDays: "",
        },

        validationSchema: VendorPreferenceValidationSchema,

        onSubmit: async (values) => {
            toast.loading("Update Preferences Details", {
                containerId: "default",
                className: "no-icon notification-warning",
            });

            try {
                const res = await updatePreference({
                    // ✅ important: allow direct open to section=2
                    id: retailer?._id,
                    data: values,
                });

                if (res.status === 200) {
                    toast.dismiss();
                    // toast("Updation completed successfully!", {
                    //     containerId: "default",
                    //     className: "no-icon notification-success",
                    // });

                    // setStepIndex(0);
                    // subscriptionFormik.resetForm();
                    // preferenceFormik.resetForm();
                    // kycFormik.resetForm();
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
            toast.loading("purchasing subscription plan", {
                containerId: "default",
                className: "no-icon notification-warning",
            });

            try {
                const res = await updateSubscription({
                    id: retailerActivePlan?._id,
                    data: values
                });

                if (res.status === 200) {
                    toast.dismiss();
                    toast("Updation completed successfully!", {
                        containerId: "default",
                        className: "no-icon notification-success",
                    });

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

    // ------------------------------
    // PREFILL DATA
    // ------------------------------
    useEffect(() => {
        if (!retailer) return;

        profileFormik.setValues({
            userName: retailer?.userName || "",
            email: retailer?.email || "",
            phoneNumber: retailer?.phoneNumber || "",
            eidNo: retailer?.eidNo || "",
            eidExpiryDate: retailer?.eidExpiryDate
                ? new Date(retailer?.eidExpiryDate).toISOString().split("T")[0]
                : "",
            eidFile: retailer?.eidFile || ("" as any),
            imgUrl: retailer?.imgUrl || ("" as any),
            role: "retailer",
            priority: retailer?.priority || 0,

        });

        kycFormik.setValues({
            shop_name: retailer?.kyc?.shop_name || "",
            business_type: retailer?.kyc?.business_type || "",
            shop_location: retailer?.kyc?.shop_location || "",
            tradeLicenseNumber: retailer?.kyc?.tradeLicenseNumber || "",
            documents: {
                tradeLicense: retailer?.kyc?.documents?.tradeLicense || "",
                vatDoc: retailer?.kyc?.documents?.vatDoc || "",
            },
            tradeLicenseRegistrationDate: retailer?.kyc?.tradeLicenseRegistrationDate
                ? new Date(retailer?.kyc?.tradeLicenseRegistrationDate)
                    .toISOString()
                    .split("T")[0]
                : "",
            tradeLicenseExpiryDate: retailer?.kyc?.tradeLicenseExpiryDate
                ? new Date(retailer?.kyc?.tradeLicenseExpiryDate)
                    .toISOString()
                    .split("T")[0]
                : "",
            shop_address: retailer?.kyc?.shop_address || "",
            post: retailer?.kyc?.post || "",
            business_hours: retailer?.kyc?.business_hours || "",
            shop_contact_number: retailer?.kyc?.shop_contact_number || "",
            shop_photo_logo: retailer?.kyc?.shop_photo_logo || "",
            description: retailer?.kyc?.description || "",
            retailerId: retailer?._id || "",
        });
    }, [retailer, retailerIdobj]);

    useEffect(() => {
        if (!retailerPriority) return;

        preferenceFormik.setValues({
            brands: retailerPriority?.brands
                ? retailerPriority?.brands?.map((brand: any) => ({
                    brandId: brand?.brandId?._id,
                }))
                : [],
            averageMonthlyVolume: retailerPriority?.averageMonthlyVolume || "",
            creditDays: retailerPriority?.creditDays || "",
            paymentMethod: retailerPriority?.paymentMethod || "",
        });
    }, [retailerPriority, retailerIdobj]);

    useEffect(() => {
        if (!retailerActivePlan) return;

        subscriptionFormik.setValues({
            durationType: retailerActivePlan?.durationType || "",
            planId: retailerActivePlan?.planId || "",
            plan_end_date: new Date(retailerActivePlan.plan_end_date).toISOString()
                .split("T")[0] || "",
            plan_start_date: new Date(retailerActivePlan?.plan_start_date).toISOString()
                .split("T")[0] || "",
            trial_end_date: retailerActivePlan?.trial_end_date ? new Date(retailerActivePlan?.trial_end_date).toISOString()
                .split("T")[0] : ""
        });
    }, [retailerActivePlan, retailerIdobj]);

    const handleWizardFinish = () => {
        // if (stepIndex === 0) profileFormik.submitForm();
        // if (stepIndex === 1) kycFormik.submitForm();
        // if (stepIndex === 2) preferenceFormik.submitForm();
        // if (stepIndex === 3) subscriptionFormik.submitForm();

        profileFormik.submitForm();
    };

    return (
        <>
            <Breadcrumb
                current={"Edit Retailer"}
                paths={[
                    { name: "Dashboard", url: "/dashboard" },
                    { name: "retailers", url: "/retailers" },
                    { name: "create retailer", url: "/retailers/add-retailer" },
                ]}
            />

            <div className="p-3">
                <Wizard
                    className="form-horizontal"
                    showProgress={true}
                    progressSize="lg"
                    validators={[profileFormik, kycFormik, preferenceFormik, subscriptionFormik]}
                    onFinish={handleWizardFinish}
                    stepIndex={stepIndex}
                    onStepChange={setStepIndex}
                >
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

                    <WizardTab>
                        <ProfileForm isEdit={true} formik={profileFormik} />
                    </WizardTab>

                    <WizardTab>
                        <KycForm isEdit={true} formik={kycFormik} />
                    </WizardTab>

                    <WizardTab>
                        <PreferenceForm formik={preferenceFormik} />
                    </WizardTab>

                    <WizardTab>
                        <SubscriptionForm edit={true} formik={subscriptionFormik} />
                    </WizardTab>

                    <WizardPager />
                </Wizard>
            </div>
        </>
    );
}
