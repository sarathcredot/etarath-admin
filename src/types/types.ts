export type User = {
  _id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  designation: string;
  language: [string];
  role: string;
  imgUrl: string;
  password: string;
  isVerified: string;
  isSuspend: boolean;
  salesAgentOwner: string;
  active_plan: string;
  location: string;
  eidNo: string;
  eidFile: string;
  vendorTag: string;
  createdAt: string;
  updatedAt: string;
  kyc?: {
    _id: string;
    createdBy: string;
    shop_name: string;
    business_name: string;
    email: string;
    business_type: string;
    shop_location: string;
    location: string;
    tradeLicenseNumber: string;
    tradeLicenseRegistrationDate: string;
    tradeLicenseExpiryDate: string;
    documents: {
      tradeLicense: string;
    };
    shop_address: string;
    business_address: string;
    city: string;
    post: string;
    business_hours: string;
    shop_contact_number: string;
    phoneNumber: string;
    shop_photo_logo: string;
    vendor_logo: string;
    kycStatus: string;
  };
};

export interface SubscriptionPlan {
  _id: string;
  plan: string; // e.g. "standard" | "executive" | "corporate"
  role: "vendor" | "retailer" | string;
  price_monthly: number;
  yearly_off: number; // percentage off for yearly plans
  trial_period: number; // trial period in days
  features: string[]; // feature list
  description: string;
  isSuspend: boolean;
  createdAt: string;
  updatedAt: string;
}
