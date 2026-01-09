import { z } from "zod";

// Step 1: Program Selection
export const programSelectionSchema = z.object({
  programs: z.array(z.enum([
    "SNAP",
    "TANF",
    "TANF_DIVERSIONARY",
    "TANF_EMERGENCY",
    "AUXILIARY_GRANTS",
    "GENERAL_RELIEF",
    "REFUGEE_CASH_ASSISTANCE",
  ])).min(1, "Please select at least one program"),
  tanfNoSnap: z.boolean().default(false),
});

// Step 2: Applicant Information
export const applicantInfoSchema = z.object({
  name: z.object({
    first: z.string().min(1, "First name is required"),
    middle: z.string().optional(),
    last: z.string().min(1, "Last name is required"),
  }),
  streetAddress: z.string().min(1, "Street address is required"),
  mailingAddressSame: z.boolean().default(true),
  mailingAddress: z.object({
    street: z.string(),
    city: z.string(),
    zip: z.string(),
  }).optional(),
  city: z.string().min(1, "City is required"),
  county: z.string().min(1, "County is required"),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  primaryPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  alternatePhone: z.string().optional(),
  primaryLanguage: z.string().min(1, "Primary language is required"),
  otherLanguage: z.string().optional(),
  correspondencePreference: z.enum(["text", "email", "mail"]),
  priorBenefits: z.boolean(),
  priorBenefitsDetails: z.string().optional(),
  fraudConvictions: z.boolean(),
  disqualifications: z.boolean(),
  paroleProbation: z.boolean(),
  felonyConvictions: z.boolean(),
  felonyTypes: z.array(z.string()).optional(),
}).refine(
  (data) => {
    if (data.correspondencePreference === "text" && !data.primaryPhone) {
      return false;
    }
    if (data.correspondencePreference === "email" && !data.email) {
      return false;
    }
    return true;
  },
  {
    message: "Correspondence preference requires valid contact information",
  }
).refine(
  (data) => {
    if (data.priorBenefits && !data.priorBenefitsDetails) {
      return false;
    }
    return true;
  },
  {
    message: "Please provide details about prior benefits",
    path: ["priorBenefitsDetails"],
  }
);

// Step 3: Household Composition
export const householdMemberSchema = z.object({
  id: z.string(),
  name: z.object({
    first: z.string().min(1, "First name is required"),
    middle: z.string().optional(),
    last: z.string().min(1, "Last name is required"),
  }),
  relationship: z.string().min(1, "Relationship is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  ssn: z.string().optional(),
  gender: z.string().min(1, "Gender is required"),
  citizenship: z.boolean(),
  alienRegistrationNumber: z.string().optional(),
  residencyDate: z.string().min(1, "Residency date is required"),
  maritalStatus: z.string().min(1, "Marital status is required"),
  educationLevel: z.string().min(1, "Education level is required"),
  veteran: z.boolean(),
  disabled: z.boolean(),
  pregnant: z.boolean(),
  student: z.boolean(),
  schoolName: z.string().optional(),
  temporarilyAway: z.boolean(),
  awayDates: z.object({
    start: z.string(),
    end: z.string(),
    reason: z.string(),
  }).optional(),
  applyingForBenefits: z.boolean(),
  programs: z.array(z.string()).optional(),
  race: z.string().optional(),
  ethnicity: z.string().optional(),
}).refine(
  (data) => {
    if (!data.citizenship && !data.alienRegistrationNumber) {
      return false;
    }
    return true;
  },
  {
    message: "Alien registration number is required for non-citizens",
    path: ["alienRegistrationNumber"],
  }
).refine(
  (data) => {
    if (data.student && !data.schoolName) {
      return false;
    }
    return true;
  },
  {
    message: "School name is required for students",
    path: ["schoolName"],
  }
).refine(
  (data) => {
    if (data.temporarilyAway && !data.awayDates) {
      return false;
    }
    return true;
  },
  {
    message: "Away dates and reason are required",
    path: ["awayDates"],
  }
);

export const householdSchema = z.object({
  members: z.array(householdMemberSchema).min(1, "At least one household member is required"),
});

// Step 4: Income
export const earnedIncomeSchema = z.object({
  id: z.string(),
  personId: z.string().min(1, "Person is required"),
  employerName: z.string().min(1, "Employer name is required"),
  payRate: z.number().min(0, "Pay rate must be positive"),
  payFrequency: z.enum(["weekly", "biweekly", "monthly"]),
  hoursPerWeek: z.number().min(0).max(168),
  startDate: z.string().min(1, "Start date is required"),
  nextPayDate: z.string().min(1, "Next pay date is required"),
});

export const unearnedIncomeSchema = z.object({
  type: z.string().min(1, "Income type is required"),
  personId: z.string().min(1, "Person is required"),
  amount: z.number().min(0, "Amount must be positive"),
  frequency: z.enum(["weekly", "biweekly", "monthly"]),
});

export const incomeInfoSchema = z.object({
  hasEarnedIncome: z.boolean(),
  earnedIncome: z.array(earnedIncomeSchema),
  unearnedIncome: z.array(unearnedIncomeSchema),
  jobLossLast60Days: z.boolean(),
  jobLossDetails: z.string().optional(),
  thirdPartyBillPayment: z.boolean(),
  thirdPartyDetails: z.string().optional(),
  daycareExpenses: z.boolean(),
  daycareAmount: z.number().optional(),
  childSupportPaid: z.boolean(),
  childSupportAmount: z.number().optional(),
}).refine(
  (data) => {
    if (data.jobLossLast60Days && !data.jobLossDetails) {
      return false;
    }
    return true;
  },
  {
    message: "Please provide job loss details",
    path: ["jobLossDetails"],
  }
).refine(
  (data) => {
    if (data.thirdPartyBillPayment && !data.thirdPartyDetails) {
      return false;
    }
    return true;
  },
  {
    message: "Please provide third-party payment details",
    path: ["thirdPartyDetails"],
  }
).refine(
  (data) => {
    if (data.daycareExpenses && !data.daycareAmount) {
      return false;
    }
    return true;
  },
  {
    message: "Please provide daycare expense amount",
    path: ["daycareAmount"],
  }
).refine(
  (data) => {
    if (data.childSupportPaid && !data.childSupportAmount) {
      return false;
    }
    return true;
  },
  {
    message: "Please provide child support amount",
    path: ["childSupportAmount"],
  }
);

// Step 5: Resources
export const assetSchema = z.object({
  id: z.string(),
  type: z.string().min(1, "Asset type is required"),
  ownerIds: z.array(z.string()).min(1, "At least one owner is required"),
  institution: z.string().min(1, "Institution is required"),
  accountType: z.string().min(1, "Account type is required"),
  accountNumber: z.string().optional(),
  balance: z.number().min(0, "Balance must be positive"),
  institutionAddress: z.string().min(1, "Institution address is required"),
});

export const resourcesInfoSchema = z.object({
  assets: z.array(assetSchema),
  lotteryWinnings: z.boolean(),
  lotteryAmount: z.number().optional(),
  assetTransfers: z.boolean(),
  transferDetails: z.string().optional(),
}).refine(
  (data) => {
    if (data.lotteryWinnings && (!data.lotteryAmount || data.lotteryAmount < 4250)) {
      return false;
    }
    return true;
  },
  {
    message: "Lottery winnings must be $4,250 or more",
    path: ["lotteryAmount"],
  }
).refine(
  (data) => {
    if (data.assetTransfers && !data.transferDetails) {
      return false;
    }
    return true;
  },
  {
    message: "Please provide asset transfer details",
    path: ["transferDetails"],
  }
);

// Step 6: Program-Specific (simplified schemas - will expand as needed)
export const tanfInfoSchema = z.object({
  childParentInfo: z.array(z.object({
    childId: z.string(),
    parentId: z.string(),
    immunizationStatus: z.string(),
  })),
});

export const snapInfoSchema = z.object({
  headOfHousehold: z.string().min(1, "Head of household is required"),
  mealPrepSeparation: z.boolean(),
  roomersBoarders: z.boolean(),
  medicalExpenses: z.array(z.object({
    personId: z.string(),
    amount: z.number().min(0),
    description: z.string(),
  })),
  shelterCosts: z.object({
    rent: z.number().min(0),
    propertyTax: z.number().min(0),
    homeInsurance: z.number().min(0),
  }),
  heatingMethod: z.string().min(1, "Heating method is required"),
  temporaryHousing: z.boolean(),
});

// Step 7: Authorized Representative
export const authorizedRepresentativeSchema = z.object({
  hasRepresentative: z.boolean(),
  name: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  permissions: z.object({
    apply: z.boolean(),
    receiveNotices: z.boolean(),
    useSnapBenefits: z.boolean(),
  }).optional(),
}).refine(
  (data) => {
    if (data.hasRepresentative) {
      return data.name && data.address && data.phone;
    }
    return true;
  },
  {
    message: "All representative fields are required",
  }
);

// Step 8: Review & Acknowledgements
export const reviewAcknowledgementsSchema = z.object({
  truthfulness: z.boolean().refine((val) => val === true, {
    message: "You must certify truthfulness",
  }),
  changeReporting: z.boolean().refine((val) => val === true, {
    message: "You must acknowledge change reporting requirements",
  }),
  penalties: z.boolean().refine((val) => val === true, {
    message: "You must acknowledge penalties",
  }),
  consentToDataSharing: z.boolean(),
  completedBySelf: z.boolean(),
  completedByDetails: z.string().optional(),
  signature: z.string().min(1, "Signature is required"),
  date: z.string().min(1, "Date is required"),
}).refine(
  (data) => {
    if (!data.completedBySelf && !data.completedByDetails) {
      return false;
    }
    return true;
  },
  {
    message: "Please provide details if form was not completed by you",
    path: ["completedByDetails"],
  }
);

// Type exports
export type ProgramSelection = z.infer<typeof programSelectionSchema>;
export type ApplicantInfo = z.infer<typeof applicantInfoSchema>;
export type HouseholdMember = z.infer<typeof householdMemberSchema>;
export type Household = z.infer<typeof householdSchema>;
export type EarnedIncome = z.infer<typeof earnedIncomeSchema>;
export type UnearnedIncome = z.infer<typeof unearnedIncomeSchema>;
export type IncomeInfo = z.infer<typeof incomeInfoSchema>;
export type Asset = z.infer<typeof assetSchema>;
export type ResourcesInfo = z.infer<typeof resourcesInfoSchema>;
export type TanfInfo = z.infer<typeof tanfInfoSchema>;
export type SnapInfo = z.infer<typeof snapInfoSchema>;
export type AuthorizedRepresentative = z.infer<typeof authorizedRepresentativeSchema>;
export type ReviewAcknowledgements = z.infer<typeof reviewAcknowledgementsSchema>;

