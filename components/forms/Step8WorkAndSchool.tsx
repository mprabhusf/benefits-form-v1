"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workAndSchoolSchema, type WorkAndSchool } from "@/lib/schemas";
import { useFormStore } from "@/store/form-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Step8WorkAndSchoolProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step8WorkAndSchool({
  onNext,
  onBack,
}: Step8WorkAndSchoolProps) {
  const { formData, updateFormData } = useFormStore();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<WorkAndSchool>({
    resolver: zodResolver(workAndSchoolSchema),
    defaultValues: formData.step8_workAndSchool || {
      hasAdultInSchoolOrTraining: false,
      isAnyoneLookingForWork: false,
    },
  });

  const hasAdultInSchoolOrTraining = watch("hasAdultInSchoolOrTraining");

  const onSubmit = (data: WorkAndSchool) => {
    updateFormData("step8_workAndSchool", data);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Work and School (TANF Requirements)</h2>
        <p className="text-muted-foreground">
          Tell us about work and education activities in your household.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>School and Training</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="font-semibold">
              Is any adult in the home in school or job training? *
            </Label>
            <Controller
              name="hasAdultInSchoolOrTraining"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value ? "yes" : "no"}
                  onChange={(val) => field.onChange(val === "yes")}
                  name="hasAdultInSchoolOrTraining"
                >
                  <RadioGroupItem value="yes">Yes</RadioGroupItem>
                  <RadioGroupItem value="no">No</RadioGroupItem>
                </RadioGroup>
              )}
            />
          </div>

          {hasAdultInSchoolOrTraining && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <div className="space-y-2">
                <Label htmlFor="hoursPerWeek" className="font-semibold">
                  How many hours a week? *
                </Label>
                <Controller
                  name="hoursPerWeek"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="hoursPerWeek"
                      type="number"
                      min="0"
                      max="168"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                      className={errors.hoursPerWeek ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.hoursPerWeek && (
                  <p className="text-sm text-red-500">
                    {errors.hoursPerWeek.message}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Work Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="font-semibold">
              Is anyone looking for work right now? *
            </Label>
            <Controller
              name="isAnyoneLookingForWork"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value ? "yes" : "no"}
                  onChange={(val) => field.onChange(val === "yes")}
                  name="isAnyoneLookingForWork"
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
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}

