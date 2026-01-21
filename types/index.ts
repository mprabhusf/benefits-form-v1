// Form data types for the entire application - Updated Structure

// Step 1: About You (The Person Applying)
export interface AboutYou {
  firstName: string;
  lastName: string;
  hasMiddleName: boolean;
  middleName?: string;
  dateOfBirth: string;
  sex: "Male" | "Female";
  ssn: string;
  homeAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  mailingAddressSame: boolean;
  mailingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  phoneNumber: string;
  email?: string;
  contactPreference: "Phone" | "Mail" | "Email" | "Text";
  proofOfIdentity?: File | null;
}

// Step 2: Who Lives With You (Household)
export interface HouseholdMember {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Another";
  ssn?: string;
  isUSCitizen: boolean;
  immigrationStatus?: string;
  relationship: "Spouse" | "Child" | "Parent" | "Sibling" | "Friend" | "Other";
  otherRelationship?: string;
  livingArrangement: "Full time" | "Part time";
}

export interface Household {
  numberOfPeople: number;
  members: HouseholdMember[];
}

// Step 3: Race and Language
export interface RaceAndLanguage {
  race: string[]; // Multi-select
  isHispanicOrLatino: boolean;
  preferredLanguage: string;
}

// Step 4: Your Home and Living Situation
export interface HomeAndLiving {
  housingType: "Rent" | "Own" | "Live with someone else";
  monthlyPayment: number;
  utilities: string[]; // Multi-select: Electricity, Gas, Water, Phone
}

// Step 5: Money You Get (Income)
export interface IncomeSource {
  id: string;
  personId: string;
  sourceType: "work" | "Social Security" | "SSI" | "Unemployment" | "Child support" | "Veterans benefits" | "Retirement";
  employerName?: string;
  amount: number;
  frequency: "Every week" | "Every two weeks" | "Twice a month" | "Monthly";
  proofOfIncome?: File | null;
}

export interface Income {
  hasWorkIncome: boolean;
  sources: IncomeSource[];
}

// Step 6: Money You Pay (Expenses)
export interface Expense {
  type: "childCare" | "childSupport" | "healthCosts" | "other";
  hasExpense: boolean;
  amount?: number;
  frequency?: "Every week" | "Every two weeks" | "Twice a month" | "Monthly";
  description?: string;
}

export interface Expenses {
  childCare: Expense;
  childSupport: Expense;
  healthCosts: Expense;
  other: Expense;
  proofOfRent?: File | null;
  proofOfChildCare?: File | null;
}

// Step 7: Health Coverage (Medicaid Requirements)
export interface HealthCoverage {
  hasHealthInsurance: boolean;
  insuranceType?: "Medicaid" | "Job insurance" | "Other";
  otherInsuranceType?: string;
  hasPregnantPerson: boolean;
  hasDisabilityOrSpecialNeed: boolean;
}

// Step 8: Work and School (TANF Requirements)
export interface WorkAndSchool {
  hasAdultInSchoolOrTraining: boolean;
  hoursPerWeek?: number;
  isAnyoneLookingForWork: boolean;
}

// Step 9: Food and Basic Needs (SNAP Requirements)
export interface FoodAndBasicNeeds {
  buyAndCookTogether: boolean;
  needFoodHelpRightAway: boolean;
  hasReceivedBenefitsBefore: boolean;
  previousState?: string;
  hasBenefitsStoppedOrPaused: boolean;
}

// Step 10: Final Check & Signature
export interface FinalCheckAndSignature {
  everythingCorrect: boolean;
  signature: string;
  signatureDate: string;
}

// Complete Form Data
export interface FormData {
  step1_aboutYou: AboutYou;
  step2_household: Household;
  step3_raceAndLanguage: RaceAndLanguage;
  step4_homeAndLiving: HomeAndLiving;
  step5_income: Income;
  step6_expenses: Expenses;
  step7_healthCoverage: HealthCoverage;
  step8_workAndSchool: WorkAndSchool;
  step9_foodAndBasicNeeds: FoodAndBasicNeeds;
  step10_finalCheck: FinalCheckAndSignature;
}
