export const PLANS = {
  EXECUTIVE: "executive_plan",
  CORPORATE: "corporate_plan",
} as const;
export type PLANS_TYPE = typeof PLANS[keyof typeof PLANS];
export type PLANS_KEY_TYPE = keyof typeof PLANS;
