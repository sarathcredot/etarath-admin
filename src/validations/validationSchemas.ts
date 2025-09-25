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
    .required("Height is required")
    .typeError("Height must be a number")
    .positive("Height must be a positive number"),
  size: Yup.number()
    .required("Rim Size is required")
    .typeError("Rim Size must be a number")
    .positive("Rim Size must be a positive number"),
  imageUrl: Yup.array()
    .of(Yup.mixed().required("Image is required"))
    .min(4, " 4 images required")
    .max(4, " 4 images required"),
});
// stock validation schema
export const StockValidationSchema = Yup.object().shape({
  stock: Yup.string().required("Quantity is required"),
  price: Yup.string().required("Sale Price is required"),
  requestedBy: Yup.string().required("Select vendor"),
  warrantyPeriod: Yup.string().required("Warranty Period is required"),
});

// brand validation schema
export const BrandValidationSchema = Yup.object().shape({
  name: Yup.string().required("Brand name is required"),
  imageUrl: Yup.mixed().required("Brand logo is required"),
});

// vendor validation schema

export const VendorValidationSchema = Yup.object().shape({
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
  password: Yup.string()
    .required("Contact Number is required")
    .min(6, "At least 6 characters required"),
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
  // password: Yup.string()
  //   .required("Contact Number is required")
  //   .min(6, "At least 6 characters required"),
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
  password: Yup.string()
    .required("Contact Number is required")
    .min(6, "At least 6 characters required"),
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
  // password: Yup.string()
  //   .required("Contact Number is required")
  //   .min(6, "At least 6 characters required"),
  imgUrl: Yup.mixed().required("Profile is required"),
});

// export const VendorValidationSchema = Yup.object().shape({
//   fullName: Yup.string().required("Full Name is required"),
//   email: Yup.string()
//     .required("Email is required")
//     .email("Enter a valid email address"),
//   contactNumber: Yup.string().required("Contact Number is required"),
//   nationality: Yup.string().required("Nationality is required"),
//   eidNo: Yup.string()
// .required("EID Number is required")
// .matches(
//   /^784-(19|20)\d{2}-\d{7}-\d{1}$/,
//   "Enter a valid Emirates ID number (e.g. 784-1995-1234567-1)"
// ),
//   EID: Yup.mixed().required("EID Document is required"),

//   shopName: Yup.string().required("Shop Name is required"),
//   businessType: Yup.string().required("Business Type is required"),
//   shopLocation: Yup.string().required("Shop Location is required"),
//   tradeLicenseNo: Yup.string().required("Trade License Number is required"),
//   tradeLicense: Yup.mixed().required("Trade License Document is required"),
//   shopAddress: Yup.string().required("Shop Address is required"),
//   city: Yup.string().required("City is required"),
//   post: Yup.string().required("Post is required"),
//   businessHours: Yup.string().required("Business Hours is required"),
//   shopContactNumber: Yup.string().required("Shop Contact Number is required"),
//   shopLogo: Yup.mixed().required("Shop Photo or Logo is required"),

//   brands: Yup.array()
//     .of(Yup.string().required("Brand is required"))
//     .min(1, "At least one brand is required"),
//   typesOfTires: Yup.array()
//     .of(Yup.string().required("Type of tire is required"))
//     .min(1, "At least one type of tire is required"),
//   averageMonthlyPurchaseVolume: Yup.string().required(
//     "Average monthly purchase volume is required"
//   ),
//   preferredPaymentMethod: Yup.string().required(
//     "Preferred payment method is required"
//   ),
// });

export const AttributeValidationSchema = Yup.object().shape({
  attribute: Yup.string().required("Attribute is required"),
});
export const OfferValidationSchema = Yup.object().shape({
  imageUrl: Yup.mixed().required("Image is required"),
  priority: Yup.number()
    .integer("must be intiger")
    .required("Priority is required"),
});
export const BlogValidationSchema = Yup.object().shape({
  imageUrl: Yup.mixed().required("Blog Image is required"),
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
  category: Yup.string().required("Category is required"),
  tags: Yup.array().min(1).required("Tags are required"),
  date: Yup.date().required("Date is required"),
});
export const BlogCategoryValidationSchema = Yup.object().shape({
  category: Yup.string().required("Category is required"),
});
export const BlogTagValidationSchema = Yup.object().shape({
  tag: Yup.string().required("Tag is required"),
});
