import { z } from "zod";

// Step 1: About You
export const aboutYouSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  hasMiddleName: z.boolean(),
  middleName: z.string().optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  sex: z.enum(["Male", "Female"]),
  ssn: z.string().regex(/^\d{3}-?\d{2}-?\d{4}$/, "SSN must be in format XXX-XX-XXXX"),
  homeAddress: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  }),
  mailingAddressSame: z.boolean(),
  mailingAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
  }).optional(),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  contactPreference: z.enum(["Phone", "Mail", "Email", "Text"]),
  proofOfIdentity: z.any().optional(),
}).refine(
  (data) => {
    if (!data.hasMiddleName && data.middleName) {
      return false;
    }
    if (data.hasMiddleName && !data.middleName) {
      return false;
    }
    return true;
  },
  {
    message: "Middle name is required if you indicated you have one",
    path: ["middleName"],
  }
).refine(
  (data) => {
    if (!data.mailingAddressSame && !data.mailingAddress) {
      return false;
    }
    return true;
  },
  {
    message: "Mailing address is required if different from home address",
    path: ["mailingAddress"],
  }
);

// Step 2: Household
export const householdMemberSchema = z.object({
  id: z.string(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["Male", "Female", "Another"]),
  ssn: z.string().optional(),
  isUSCitizen: z.boolean(),
  immigrationStatus: z.string().optional(),
  relationship: z.enum(["Spouse", "Child", "Parent", "Sibling", "Friend", "Other"]),
  otherRelationship: z.string().optional(),
  livingArrangement: z.enum(["Full time", "Part time"]),
}).refine(
  (data) => {
    if (!data.isUSCitizen && !data.immigrationStatus) {
      return false;
    }
    return true;
  },
  {
    message: "Immigration status is required for non-citizens",
    path: ["immigrationStatus"],
  }
).refine(
  (data) => {
    if (data.relationship === "Other" && !data.otherRelationship) {
      return false;
    }
    return true;
  },
  {
    message: "Please specify the relationship",
    path: ["otherRelationship"],
  }
);

export const householdSchema = z.object({
  numberOfPeople: z.number().min(0, "Number of people must be 0 or more"),
  members: z.array(householdMemberSchema),
});

// Step 3: Race and Language
export const raceAndLanguageSchema = z.object({
  race: z.array(z.string()).min(1, "Please select at least one race"),
  isHispanicOrLatino: z.boolean(),
  preferredLanguage: z.string().min(1, "Preferred language is required"),
});

// Step 4: Home and Living
export const homeAndLivingSchema = z.object({
  housingType: z.enum(["Rent", "Own", "Live with someone else"]),
  monthlyPayment: z.number().min(0, "Monthly payment must be 0 or more"),
  utilities: z.array(z.string()),
});

// Step 5: Income
export const incomeSourceSchema = z.object({
  id: z.string(),
  personId: z.string().min(1, "Person is required"),
  sourceType: z.enum(["work", "Social Security", "SSI", "Unemployment", "Child support", "Veterans benefits", "Retirement"]),
  employerName: z.string().optional(),
  amount: z.number().min(0, "Amount must be 0 or more"),
  frequency: z.enum(["Every week", "Every two weeks", "Twice a month", "Monthly"]),
  proofOfIncome: z.any().optional(),
}).refine(
  (data) => {
    if (data.sourceType === "work" && !data.employerName) {
      return false;
    }
    return true;
  },
  {
    message: "Employer name is required for work income",
    path: ["employerName"],
  }
);

export const incomeSchema = z.object({
  hasWorkIncome: z.boolean(),
  sources: z.array(incomeSourceSchema),
});

// Step 6: Expenses
export const expenseSchema = z.object({
  type: z.enum(["childCare", "childSupport", "healthCosts", "other"]),
  hasExpense: z.boolean(),
  amount: z.number().optional(),
  frequency: z.enum(["Every week", "Every two weeks", "Twice a month", "Monthly"]).optional(),
  description: z.string().optional(),
}).refine(
  (data) => {
    if (data.hasExpense && (!data.amount || data.amount <= 0)) {
      return false;
    }
    return true;
  },
  {
    message: "Amount is required if you have this expense",
    path: ["amount"],
  }
).refine(
  (data) => {
    if (data.hasExpense && !data.frequency) {
      return false;
    }
    return true;
  },
  {
    message: "Frequency is required if you have this expense",
    path: ["frequency"],
  }
).refine(
  (data) => {
    if (data.type === "other" && data.hasExpense && !data.description) {
      return false;
    }
    return true;
  },
  {
    message: "Description is required for other expenses",
    path: ["description"],
  }
);

export const expensesSchema = z.object({
  childCare: expenseSchema,
  childSupport: expenseSchema,
  healthCosts: expenseSchema,
  other: expenseSchema,
  proofOfRent: z.any().optional(),
  proofOfChildCare: z.any().optional(),
});

// Step 7: Health Coverage
export const healthCoverageSchema = z.object({
  hasHealthInsurance: z.boolean(),
  insuranceType: z.enum(["Medicaid", "Job insurance", "Other"]).optional(),
  otherInsuranceType: z.string().optional(),
  hasPregnantPerson: z.boolean(),
  hasDisabilityOrSpecialNeed: z.boolean(),
}).refine(
  (data) => {
    if (data.hasHealthInsurance && !data.insuranceType) {
      return false;
    }
    return true;
  },
  {
    message: "Insurance type is required if you have health insurance",
    path: ["insuranceType"],
  }
).refine(
  (data) => {
    if (data.insuranceType === "Other" && !data.otherInsuranceType) {
      return false;
    }
    return true;
  },
  {
    message: "Please specify the insurance type",
    path: ["otherInsuranceType"],
  }
);

// Step 8: Work and School
export const workAndSchoolSchema = z.object({
  hasAdultInSchoolOrTraining: z.boolean(),
  hoursPerWeek: z.number().optional(),
  isAnyoneLookingForWork: z.boolean(),
}).refine(
  (data) => {
    if (data.hasAdultInSchoolOrTraining && (!data.hoursPerWeek || data.hoursPerWeek <= 0)) {
      return false;
    }
    return true;
  },
  {
    message: "Hours per week is required if someone is in school or training",
    path: ["hoursPerWeek"],
  }
);

// Step 9: Food and Basic Needs
export const foodAndBasicNeedsSchema = z.object({
  buyAndCookTogether: z.boolean(),
  needFoodHelpRightAway: z.boolean(),
  hasReceivedBenefitsBefore: z.boolean(),
  previousState: z.string().optional(),
  hasBenefitsStoppedOrPaused: z.boolean(),
}).refine(
  (data) => {
    if (data.hasReceivedBenefitsBefore && !data.previousState) {
      return false;
    }
    return true;
  },
  {
    message: "Previous state is required if you received benefits before",
    path: ["previousState"],
  }
);

// Step 10: Final Check & Signature
export const finalCheckAndSignatureSchema = z.object({
  everythingCorrect: z.boolean().refine((val) => val === true, {
    message: "You must confirm everything is correct",
  }),
  signature: z.string().min(1, "Signature is required"),
  signatureDate: z.string().min(1, "Signature date is required"),
});

// Type exports
export type AboutYou = z.infer<typeof aboutYouSchema>;
export type HouseholdMember = z.infer<typeof householdMemberSchema>;
export type Household = z.infer<typeof householdSchema>;
export type RaceAndLanguage = z.infer<typeof raceAndLanguageSchema>;
export type HomeAndLiving = z.infer<typeof homeAndLivingSchema>;
export type IncomeSource = z.infer<typeof incomeSourceSchema>;
export type Income = z.infer<typeof incomeSchema>;
export type Expense = z.infer<typeof expenseSchema>;
export type Expenses = z.infer<typeof expensesSchema>;
export type HealthCoverage = z.infer<typeof healthCoverageSchema>;
export type WorkAndSchool = z.infer<typeof workAndSchoolSchema>;
export type FoodAndBasicNeeds = z.infer<typeof foodAndBasicNeedsSchema>;
export type FinalCheckAndSignature = z.infer<typeof finalCheckAndSignatureSchema>;
