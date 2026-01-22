"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { healthCoverageSchema, type HealthCoverage } from "@/lib/schemas";
import { useFormStore } from "@/store/form-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Step7HealthCoverageProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step7HealthCoverage({
  onNext,
  onBack,
}: Step7HealthCoverageProps) {
  const { formData, updateFormData } = useFormStore();

  const {
    control,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<HealthCoverage>({
    resolver: zodResolver(healthCoverageSchema),
    defaultValues: formData.step7_healthCoverage || {
      hasHealthInsurance: false,
      hasPregnantPerson: false,
      hasDisabilityOrSpecialNeed: false,
    },
  });

  const hasHealthInsurance = watch("hasHealthInsurance");
  const insuranceType = watch("insuranceType");

  const onSubmit = (data: HealthCoverage) => {
    updateFormData("step7_healthCoverage", data);
    onNext();
  };

  const handleNextClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Use getValues() instead of watch() - it doesn't trigger validation
    const formData = getValues();
    updateFormData("step7_healthCoverage", formData as HealthCoverage);
    onNext();
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleNextClick(e as any); }} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Health Coverage (Medicaid Requirements)</h2>
        <p className="text-muted-foreground">
          Tell us about health insurance and health needs in your household.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Health Insurance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="font-semibold">
              Health Insurance *
            </Label>
            <Controller
              name="hasHealthInsurance"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value ? "yes" : "no"}
                  onChange={(val) => field.onChange(val === "yes")}
                  name="hasHealthInsurance"
                >
                  <RadioGroupItem value="yes">Yes</RadioGroupItem>
                  <RadioGroupItem value="no">No</RadioGroupItem>
                </RadioGroup>
              )}
            />
          </div>

          {hasHealthInsurance && (
            <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-md">
              <div className="space-y-2">
                <Label htmlFor="insuranceType" className="font-semibold">
                  Insurance Type *
                </Label>
                <Controller
                  name="insuranceType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="insuranceType"
                      {...field}
                      className={errors.insuranceType ? "border-red-500" : ""}
                    >
                      <option value="">Select</option>
                      <option value="Medicaid">Medicaid</option>
                      <option value="Job insurance">Job insurance</option>
                      <option value="Other">Other</option>
                    </Select>
                  )}
                />
                {errors.insuranceType && (
                  <p className="text-sm text-red-500">
                    {errors.insuranceType.message}
                  </p>
                )}
              </div>

              {insuranceType === "Other" && (
                <div className="space-y-2">
                  <Label htmlFor="otherInsuranceType" className="font-semibold">
                    Please specify *
                  </Label>
                  <Controller
                    name="otherInsuranceType"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="otherInsuranceType"
                        {...field}
                        className={
                          errors.otherInsuranceType ? "border-red-500" : ""
                        }
                      />
                    )}
                  />
                  {errors.otherInsuranceType && (
                    <p className="text-sm text-red-500">
                      {errors.otherInsuranceType.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Health Needs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="font-semibold">Pregnant *</Label>
            <Controller
              name="hasPregnantPerson"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value ? "yes" : "no"}
                  onChange={(val) => field.onChange(val === "yes")}
                  name="hasPregnantPerson"
                >
                  <RadioGroupItem value="yes">Yes</RadioGroupItem>
                  <RadioGroupItem value="no">No</RadioGroupItem>
                </RadioGroup>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">
              Disability or Special Health Need *
            </Label>
            <Controller
              name="hasDisabilityOrSpecialNeed"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value ? "yes" : "no"}
                  onChange={(val) => field.onChange(val === "yes")}
                  name="hasDisabilityOrSpecialNeed"
                >
                  <RadioGroupItem value="yes">Yes</RadioGroupItem>
                  <RadioGroupItem value="no">No</RadioGroupItem>
                </RadioGroup>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={handleNextClick}>Next</Button>
      </div>
    </form>
  );
}

