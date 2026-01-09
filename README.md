# Virginia Benefits Application Form

A multi-step public benefits application wizard for the Commonwealth of Virginia, built with Next.js, TypeScript, Tailwind CSS, Shadcn UI, React Hook Form, Zod, and Zustand.

## Features

- **Step 2: Expedited Service Screener** - Determines if applicants qualify for 7-day processing with complex eligibility logic
- **Step 4: Household Composition** - Dynamic array management for household members with comprehensive validation

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Shadcn UI** - Accessible component library
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **Zustand** - Global state management

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
benefits-form-v1/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page with step navigation
│   └── globals.css         # Global styles
├── components/
│   ├── forms/
│   │   ├── Step2ExpeditedScreener.tsx    # Expedited service screener
│   │   └── Step4HouseholdComposition.tsx # Household composition form
│   └── ui/                 # Shadcn UI components
├── lib/
│   ├── schemas.ts          # Zod validation schemas
│   └── utils.ts            # Utility functions
└── store/
    └── form-store.ts       # Zustand state management
```

## Step 2: Expedited Service Screener

This step determines if applicants qualify for expedited processing (7-day turnaround) based on:

- Gross monthly income
- Liquid assets
- Rent/mortgage expenses
- Utility expenses
- Utility types
- Migrant worker status

**Eligibility Logic:**
- Qualifies if: (Income < $150 AND Assets <= $100) OR (Income + Assets < Rent + Utilities)

## Step 4: Household Composition

Dynamic form for managing household members with:

- Pre-filled applicant card (cannot be removed)
- Add/remove household members
- Comprehensive validation for each member
- Conditional fields (e.g., Alien Registration Number for non-citizens)
- Status tags (Veteran, Disabled, Pregnant, Student)
- Program selection (SNAP, TANF, Medicaid)

## Form State Management

The application uses Zustand for global state management, allowing data to persist across steps. All form data is validated using Zod schemas and managed with React Hook Form.

## Next Steps

To complete the full 8-step wizard, implement:
- Step 1: Program Selection & Privacy
- Step 3: Applicant Personal Information
- Step 5: Income & Employment
- Step 6: Resources (Assets)
- Step 7: Expenses
- Step 8: Review & Signature

