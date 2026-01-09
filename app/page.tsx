"use client";

import { useState, useEffect } from "react";
import { useFormStore } from "@/store/form-store";
import Step1ProgramSelection from "@/components/forms/Step1ProgramSelection";
import Step2ApplicantInfo from "@/components/forms/Step2ApplicantInfo";
import Step3HouseholdComposition from "@/components/forms/Step3HouseholdComposition";
import Step4Income from "@/components/forms/Step4Income";
import Step5Resources from "@/components/forms/Step5Resources";
import Step6ProgramSpecific from "@/components/forms/Step6ProgramSpecific";
import Step7AuthorizedRepresentative from "@/components/forms/Step7AuthorizedRepresentative";
import Step8ReviewSubmit from "@/components/forms/Step8ReviewSubmit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const TOTAL_STEPS = 8;

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
    "Program Selection & Orientation",
    "Applicant Information",
    "Household Composition",
    "Income",
    "Resources",
    "Program-Specific Sections",
    "Authorized Representative",
    "Review, Acknowledgements & Submit",
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-5xl px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">
              Virginia Department of Social Services
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Application for Benefits
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
            {step === 1 && <Step1ProgramSelection onNext={handleNext} />}
            {step === 2 && (
              <Step2ApplicantInfo onNext={handleNext} onBack={handleBack} />
            )}
            {step === 3 && (
              <Step3HouseholdComposition onNext={handleNext} onBack={handleBack} />
            )}
            {step === 4 && (
              <Step4Income onNext={handleNext} onBack={handleBack} />
            )}
            {step === 5 && (
              <Step5Resources onNext={handleNext} onBack={handleBack} />
            )}
            {step === 6 && (
              <Step6ProgramSpecific onNext={handleNext} onBack={handleBack} />
            )}
            {step === 7 && (
              <Step7AuthorizedRepresentative onNext={handleNext} onBack={handleBack} />
            )}
            {step === 8 && <Step8ReviewSubmit onBack={handleBack} />}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

