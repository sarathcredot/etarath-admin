import { EditorState } from "draft-js";
import * as Yup from "yup";

export const LoginValidationSchema = Yup.object().shape({
  emailOrPhoneNumber: Yup.string().required("Email is required"),
  // .email("Enter a valid email address")
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

// product validation schema
export const ProductValidationSchema = Yup.object().shape({
  productName: Yup.string()
    .required("Product name is required")
    .max(100, "Product name cannot exceed 100 characters"),
  brand: Yup.string().required("Brand is required"),
  category: Yup.string().required("Category is required"),
  origin: Yup.string().required("Origin is required"),
  yearOfManufacturer: Yup.string().required("Year is required"),
  width: Yup.number()
    .required("Width is required")
    .typeError("Width must be a number")
    .positive("Width must be a positive number"),
  height: Yup.number()
    .typeError("Height must be a number")
    .positive("Height must be a positive number")
    .optional(),
  size: Yup.string().required("Rim Size is required"),
  imageUrl: Yup.array()
    .of(Yup.mixed().required("Image is required"))
    .min(4, "4 images required")
    .max(4, "4 images required"),
  mrp: Yup.string().required("MRP is required"),
  description: Yup.string().required("Description is required"),
  features: Yup.array()
    .of(Yup.string().required("Features is required"))
    .min(1, "Atleast add 1 feature"),
});
// stock validation schema
export const StockValidationSchema = Yup.object().shape({
  // stock: Yup.string().required("Quantity is required"),
  price_normal_customer: Yup.string().required("Sale Price is required"),
  requestedBy: Yup.string().required("Select vendor"),
  warrantyPeriod: Yup.string().required("Warranty Period is required"),
  warranty_type: Yup.string().required("Type is required"),
});
export const StockEditValidationSchema = Yup.object().shape({
  // stock: Yup.string().required("Quantity is required"),
  price_normal_customer: Yup.string().required("Sale Price is required"),
  warrantyPeriod: Yup.string().required("Warranty Period is required"),
  warranty_type: Yup.string().required("Type is required"),
});

// brand validation schema
export const BrandValidationSchema = Yup.object().shape({
  name: Yup.string().required("Brand name is required"),
  imageUrl: Yup.mixed().required("Primary logo is required"),
  // imageUrl2: Yup.mixed().required("Alternate logo is required"),
  priority: Yup.string().required("Brand priority is required"),
});

// vendor validation schema

export const VendorValidationSchema = Yup.object().shape({
  userName: Yup.string().required("Full Name is required"),
  email: Yup.string()
    .required("Email is required")
    .email("Enter a valid email address"),
  phoneNumber: Yup.string().required("Phone Number is required"),
  // .min(8, "Only 10 digits required")
  // .max(10, "Only 10 digits allowed"),
  eidNo: Yup.string()
    .required("EID Number is required")
    .matches(
      /^784-(19|20)\d{2}-\d{7}-\d{1}$/,
      "Enter a valid Emirates ID number (e.g. 784-1995-1234567-1)"
    ),
  eidFile: Yup.mixed().required("EID Document is required"),
  imgUrl: Yup.mixed().required("Profile is required"),
});

export const EditVendorValidationSchema = Yup.object().shape({
  userName: Yup.string().required("Full Name is required"),
  email: Yup.string()
    .required("Email is required")
    .email("Enter a valid email address"),
  phoneNumber: Yup.string()
    .required("Contact Number is required")
    .min(10, "Only 10 digits required")
    .max(10, "Only 10 digits allowed"),
  eidNo: Yup.string()
    .required("EID Number is required")
    .matches(
      /^784-(19|20)\d{2}-\d{7}-\d{1}$/,
      "Enter a valid Emirates ID number (e.g. 784-1995-1234567-1)"
    ),
  eidFile: Yup.mixed().required("EID Document is required"),
  imgUrl: Yup.mixed().required("Profile is required"),
});

// retailer validation schema

export const RetailerValidationSchema = Yup.object().shape({
  userName: Yup.string().required("Full Name is required"),
  email: Yup.string()
    .required("Email is required")
    .email("Enter a valid email address"),
  phoneNumber: Yup.string()
    .required("Contact Number is required")
    .min(10, "Only 10 digits required")
    .max(10, "Only 10 digits allowed"),
  eidNo: Yup.string()
    .required("EID Number is required")
    .matches(
      /^784-(19|20)\d{2}-\d{7}-\d{1}$/,
      "Enter a valid Emirates ID number (e.g. 784-1995-1234567-1)"
    ),
  eidFile: Yup.mixed().required("EID Document is required"),
  imgUrl: Yup.mixed().required("Profile is required"),
});

export const EditRetailerValidationSchema = Yup.object().shape({
  userName: Yup.string().required("Full Name is required"),
  email: Yup.string()
    .required("Email is required")
    .email("Enter a valid email address"),
  phoneNumber: Yup.string()
    .required("Contact Number is required")
    .min(10, "Only 10 digits required")
    .max(10, "Only 10 digits allowed"),
  eidNo: Yup.string()
    .required("EID Number is required")
    .matches(
      /^784-(19|20)\d{2}-\d{7}-\d{1}$/,
      "Enter a valid Emirates ID number (e.g. 784-1995-1234567-1)"
    ),
  eidFile: Yup.mixed().required("EID Document is required"),
  imgUrl: Yup.mixed().required("Profile is required"),
});

export const AttributeValidationSchema = Yup.object().shape({
  attribute: Yup.string().required("Attribute is required"),
});
export const OfferValidationSchema = Yup.object().shape({
  imageUrl: Yup.mixed().required("Image is required"),
  priority: Yup.number()
    .integer("must be intiger")
    .required("Priority is required"),
});
const getEditorText = (editorState: EditorState) => {
  const contentState = editorState.getCurrentContent();
  return contentState.getPlainText().trim();
};
export const BlogValidationSchema = Yup.object().shape({
  imgUrl: Yup.mixed().required("Blog Image is required"),
  title: Yup.string().required("Title is required"),
  category: Yup.string().required("Category is required"),
  tags: Yup.array().min(1).required("Tags are required"),
  date: Yup.string().required("Date is required"),
  content: Yup.mixed().test("is-empty", "Content is required", (value) => {
    // value is EditorState
    if (!value) return false;
    const text = getEditorText(value as EditorState);
    return text.length > 0;
  }),
});
export const BlogCategoryValidationSchema = Yup.object().shape({
  category: Yup.string().required("Category is required"),
});
export const BlogTagValidationSchema = Yup.object().shape({
  tag: Yup.string().required("Tag is required"),
});

// VENDOR KYC VALIDATION SCHEMA

export const VendorKycValidationSchema = Yup.object().shape({
  shop_name: Yup.string().required("Shop Name is required"),
  business_type: Yup.string().required("Business Type is required"),
  shop_location: Yup.string().required("Shop Location is required"),
  tradeLicenseNumber: Yup.string().required(
    "Enter Trade License Number "
  ),
  tradeLicenseRegistrationDate: Yup.string().required(
    "Enter Trade License Registration Date "
  ),
  tradeLicenseExpiryDate: Yup.string().required(
    "Enter Trade License Expiry Date "
  ),
  documents: Yup.object().shape({
    tradeLicense: Yup.mixed().required(
      "Upload Trade License"
    ),
  }),
  shop_address: Yup.string().required("Shop Address is required"),
  // city: Yup.string().required("City is required"),
  post: Yup.string().required("Post is required"),
  business_hours: Yup.string().required("Business Hours is required"),
  shop_contact_number: Yup.string().required("Shop Contact Number is required"),
  shop_photo_logo: Yup.mixed().required("Upload Shop Photo "),
});
export const VendorEditKycValidationSchema = Yup.object().shape({
  shop_name: Yup.string().required("Shop Name is required"),
  business_type: Yup.string().required("Business Type is required"),
  shop_location: Yup.string().required("Shop Location is required"),
  tradeLicenseNumber: Yup.string().required(
    "Enter Trade License/ Business Registration Number "
  ),
  shop_address: Yup.string().required("Shop Address is required"),
  city: Yup.string().required("City is required"),
  post: Yup.string().required("Post is required"),
  business_hours: Yup.string().required("Business Hours is required"),
  shop_contact_number: Yup.string().required("Shop Contact Number is required"),
});

export const PlanEditValidationSchema = Yup.object().shape({
  plan: Yup.string().trim().required("Plan name is required"),

  price_monthly: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be greater than zero")
    .required("Price is required"),

  yearly_off: Yup.number()
    .typeError("Discount must be a number")
    .min(0, "Discount can't be negative")
    .max(100, "Discount can't exceed 100%")
    .required("Yearly discount is required"),

  trial_period: Yup.number()
    .typeError("Trial period must be a number")
    .min(0, "Trial period can't be negative")
    .required("Trial period is required"),

  features: Yup.array()
    .of(Yup.string().trim().required("Feature can't be empty"))
    .min(1, "At least one feature is required"),

  description: Yup.string().trim().required("Description is required"),
});

export const VendorProfileValidationSchema = Yup.object({
  business_name: Yup.string().required("Required"),
  phoneNumber: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  location: Yup.string().required("Required"),
  tradeLicenseNumber: Yup.string().required("Required"),
  tradeLicenseRegistrationDate: Yup.string().required("Required"),
  tradeLicenseExpiryDate: Yup.string().required("Required"),
  documents: Yup.object().shape({
    tradeLicense: Yup.mixed().required(
      "Upload Trade License/ Business Registration"
    ),
  }),
  business_address: Yup.string().required("Required"),
  post: Yup.string().required("Required"),
  business_hours: Yup.string().required("Required"),
  vendor_logo: Yup.mixed().required("Upload Logo"),
  shop_photo_logo: Yup.mixed().required("Upload Shop Photo"),
  // subscription_plan: Yup.string().required("Required"),
});
export const VendorContactValidationSchema = Yup.object({
  userName: Yup.string().required("Required"),
  designation: Yup.string().required("Required"),
  phoneNumber: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  // language: Yup.array().min(1, "Select at least one language").required("Required"),
});
export const VendorPreferenceValidationSchema = Yup.object({
  brands: Yup.array().min(1, "Select at least one brand").required("Required"),
  // authorised_brands: Yup.array()
  //   .min(1, "Select at least one authorised brand")
  //   .required("Required"),
  // averageMonthlyVolume: Yup.string().required("Required"),
  paymentMethod: Yup.string().required("Required"),
  // typeOfTyers: Yup.mixed().required("Select tyre types"),
});
export const VendorSubscriptionValidationSchema = Yup.object({
  planId: Yup.string().required("Required"),
  durationType: Yup.string().required("Required"),
});
