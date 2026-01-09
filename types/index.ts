// Form data types for the entire application

export type ProgramType =
  | "SNAP"
  | "TANF"
  | "TANF_DIVERSIONARY"
  | "TANF_EMERGENCY"
  | "AUXILIARY_GRANTS"
  | "GENERAL_RELIEF"
  | "REFUGEE_CASH_ASSISTANCE";

export interface ProgramSelection {
  programs: ProgramType[];
  tanfNoSnap: boolean;
}

export interface ApplicantInfo {
  name: {
    first: string;
    middle: string;
    last: string;
  };
  streetAddress: string;
  mailingAddressSame: boolean;
  mailingAddress?: {
    street: string;
    city: string;
    zip: string;
  };
  city: string;
  county: string;
  zip: string;
  email: string;
  primaryPhone: string;
  alternatePhone?: string;
  primaryLanguage: string;
  otherLanguage?: string;
  correspondencePreference: "text" | "email" | "mail";
  priorBenefits: boolean;
  priorBenefitsDetails?: string;
  fraudConvictions: boolean;
  disqualifications: boolean;
  paroleProbation: boolean;
  felonyConvictions: boolean;
  felonyTypes?: string[];
}

export interface HouseholdMember {
  id: string;
  name: {
    first: string;
    middle: string;
    last: string;
  };
  relationship: string;
  dateOfBirth: string;
  ssn?: string;
  gender: string;
  citizenship: boolean;
  alienRegistrationNumber?: string;
  residencyDate: string;
  maritalStatus: string;
  educationLevel: string;
  veteran: boolean;
  disabled: boolean;
  pregnant: boolean;
  student: boolean;
  schoolName?: string;
  temporarilyAway: boolean;
  awayDates?: {
    start: string;
    end: string;
    reason: string;
  };
  applyingForBenefits: boolean;
  programs?: ProgramType[];
  race?: string;
  ethnicity?: string;
}

export interface EarnedIncome {
  id: string;
  personId: string;
  employerName: string;
  payRate: number;
  payFrequency: "weekly" | "biweekly" | "monthly";
  hoursPerWeek: number;
  startDate: string;
  nextPayDate: string;
}

export interface UnearnedIncome {
  type: string;
  personId: string;
  amount: number;
  frequency: "weekly" | "biweekly" | "monthly";
}

export interface IncomeInfo {
  hasEarnedIncome: boolean;
  earnedIncome: EarnedIncome[];
  unearnedIncome: UnearnedIncome[];
  jobLossLast60Days: boolean;
  jobLossDetails?: string;
  thirdPartyBillPayment: boolean;
  thirdPartyDetails?: string;
  daycareExpenses: boolean;
  daycareAmount?: number;
  childSupportPaid: boolean;
  childSupportAmount?: number;
}

export interface Asset {
  id: string;
  type: string;
  ownerIds: string[];
  institution: string;
  accountType: string;
  accountNumber: string;
  balance: number;
  institutionAddress: string;
}

export interface ResourcesInfo {
  assets: Asset[];
  lotteryWinnings: boolean;
  lotteryAmount?: number;
  assetTransfers: boolean;
  transferDetails?: string;
}

export interface TanfInfo {
  childParentInfo: Array<{
    childId: string;
    parentId: string;
    immunizationStatus: string;
  }>;
}

export interface TanfDiversionaryInfo {
  emergencyNeed: boolean;
  emergencyDescription?: string;
}

export interface SnapInfo {
  headOfHousehold: string;
  mealPrepSeparation: boolean;
  roomersBoarders: boolean;
  medicalExpenses: Array<{
    personId: string;
    amount: number;
    description: string;
  }>;
  shelterCosts: {
    rent: number;
    propertyTax: number;
    homeInsurance: number;
  };
  heatingMethod: string;
  temporaryHousing: boolean;
}

export interface AuxiliaryGrantsInfo {
  livingSituation: string;
  property: Array<{
    type: string;
    value: number;
    location: string;
  }>;
  vehicles: Array<{
    make: string;
    model: string;
    year: number;
    value: number;
  }>;
  burialArrangements: {
    hasArrangements: boolean;
    value?: number;
  };
  lifeInsurance: {
    hasPolicy: boolean;
    value?: number;
  };
  healthInsurance: {
    hasInsurance: boolean;
    provider?: string;
  };
  medicare: {
    hasMedicare: boolean;
    parts?: string[];
  };
  taxFilers: string[];
  nonFilers: string[];
}

export interface AuthorizedRepresentative {
  hasRepresentative: boolean;
  name?: string;
  address?: string;
  phone?: string;
  permissions?: {
    apply: boolean;
    receiveNotices: boolean;
    useSnapBenefits: boolean;
  };
}

export interface ReviewAcknowledgements {
  truthfulness: boolean;
  changeReporting: boolean;
  penalties: boolean;
  consentToDataSharing: boolean;
  completedBySelf: boolean;
  completedByDetails?: string;
  signature: string;
  date: string;
}

export interface FormData {
  step1_programSelection: ProgramSelection;
  step2_applicantInfo: ApplicantInfo;
  step3_household: HouseholdMember[];
  step4_income: IncomeInfo;
  step5_resources: ResourcesInfo;
  step6_programSpecific: {
    tanf?: TanfInfo;
    tanfDiversionary?: TanfDiversionaryInfo;
    snap?: SnapInfo;
    auxiliaryGrants?: AuxiliaryGrantsInfo;
  };
  step7_authorizedRepresentative: AuthorizedRepresentative;
  step8_review: ReviewAcknowledgements;
}

