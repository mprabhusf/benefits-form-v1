"use client";

import { useState, useEffect } from "react";
import { useFormStore } from "@/store/form-store";
import Step1AboutYou from "@/components/forms/Step1AboutYou";
import Step2Household from "@/components/forms/Step2Household";
import Step3RaceAndLanguage from "@/components/forms/Step3RaceAndLanguage";
import Step4HomeAndLiving from "@/components/forms/Step4HomeAndLiving";
import Step5Income from "@/components/forms/Step5Income";
import Step6Expenses from "@/components/forms/Step6Expenses";
import Step7HealthCoverage from "@/components/forms/Step7HealthCoverage";
import Step8WorkAndSchool from "@/components/forms/Step8WorkAndSchool";
import Step9FoodAndBasicNeeds from "@/components/forms/Step9FoodAndBasicNeeds";
import Step10FinalCheck from "@/components/forms/Step10FinalCheck";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TOTAL_STEPS = 10;

export default function Home() {
  const { currentStep, setCurrentStep } = useFormStore();
  const [step, setStep] = useState(1);

  useEffect(() => {
    setStep(currentStep);
  }, [currentStep]);

  const handleNext = () => {
    const nextStep = Math.min(step + 1, TOTAL_STEPS);
    setStep(nextStep);
    setCurrentStep(nextStep);
  };

  const handleBack = () => {
    const prevStep = Math.max(step - 1, 1);
    setStep(prevStep);
    setCurrentStep(prevStep);
  };

  const stepTitles = [
    "About You (The Person Applying)",
    "Who Lives With You (Household)",
    "Race and Language",
    "Your Home and Living Situation",
    "Money You Get (Income)",
    "Money You Pay (Expenses)",
    "Health Coverage (Medicaid Requirements)",
    "Work and School (TANF Requirements)",
    "Food and Basic Needs (SNAP Requirements)",
    "Final Check & Signature",
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-5xl px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">
              Public Benefits Application
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Complete all sections to apply for benefits
            </p>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Step {step} of {TOTAL_STEPS}</span>
                <span>{Math.round((step / TOTAL_STEPS) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold">{stepTitles[step - 1]}</h3>
            </div>
          </CardHeader>
          <CardContent>
            {step === 1 && <Step1AboutYou onNext={handleNext} />}
            {step === 2 && (
              <Step2Household onNext={handleNext} onBack={handleBack} />
            )}
            {step === 3 && (
              <Step3RaceAndLanguage onNext={handleNext} onBack={handleBack} />
            )}
            {step === 4 && (
              <Step4HomeAndLiving onNext={handleNext} onBack={handleBack} />
            )}
            {step === 5 && (
              <Step5Income onNext={handleNext} onBack={handleBack} />
            )}
            {step === 6 && (
              <Step6Expenses onNext={handleNext} onBack={handleBack} />
            )}
            {step === 7 && (
              <Step7HealthCoverage onNext={handleNext} onBack={handleBack} />
            )}
            {step === 8 && (
              <Step8WorkAndSchool onNext={handleNext} onBack={handleBack} />
            )}
            {step === 9 && (
              <Step9FoodAndBasicNeeds onNext={handleNext} onBack={handleBack} />
            )}
            {step === 10 && <Step10FinalCheck onBack={handleBack} />}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
