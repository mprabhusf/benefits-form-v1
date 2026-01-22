"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { foodAndBasicNeedsSchema, type FoodAndBasicNeeds } from "@/lib/schemas";
import { useFormStore } from "@/store/form-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Step9FoodAndBasicNeedsProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step9FoodAndBasicNeeds({
  onNext,
  onBack,
}: Step9FoodAndBasicNeedsProps) {
  const { formData, updateFormData } = useFormStore();

  const {
    control,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<FoodAndBasicNeeds>({
    resolver: zodResolver(foodAndBasicNeedsSchema),
    defaultValues: formData.step9_foodAndBasicNeeds || {
      buyAndCookTogether: true,
      needFoodHelpRightAway: false,
      hasReceivedBenefitsBefore: false,
      hasBenefitsStoppedOrPaused: false,
    },
  });

  const hasReceivedBenefitsBefore = watch("hasReceivedBenefitsBefore");

  const onSubmit = (data: FoodAndBasicNeeds) => {
    updateFormData("step9_foodAndBasicNeeds", data);
    onNext();
  };

  const handleNextClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Use getValues() instead of watch() - it doesn't trigger validation
    const formData = getValues();
    updateFormData("step9_foodAndBasicNeeds", formData as FoodAndBasicNeeds);
    onNext();
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleNextClick(e as any); }} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Food and Basic Needs (SNAP Requirements)</h2>
        <p className="text-muted-foreground">
          Tell us about your food situation and previous benefits.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Food Preparation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="font-semibold">
              Buy and Cook Food Together *
            </Label>
            <Controller
              name="buyAndCookTogether"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value ? "yes" : "no"}
                  onChange={(val) => field.onChange(val === "yes")}
                  name="buyAndCookTogether"
                >
                  <RadioGroupItem value="yes">Yes</RadioGroupItem>
                  <RadioGroupItem value="no">No</RadioGroupItem>
                </RadioGroup>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">
              Need Food Help Right Away *
            </Label>
            <Controller
              name="needFoodHelpRightAway"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value ? "yes" : "no"}
                  onChange={(val) => field.onChange(val === "yes")}
                  name="needFoodHelpRightAway"
                >
                  <RadioGroupItem value="yes">Yes</RadioGroupItem>
                  <RadioGroupItem value="no">No</RadioGroupItem>
                </RadioGroup>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Previous Benefits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="font-semibold">
              Have you or anyone in your home gotten SNAP, TANF, or Medicaid before? *
            </Label>
            <Controller
              name="hasReceivedBenefitsBefore"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value ? "yes" : "no"}
                  onChange={(val) => field.onChange(val === "yes")}
                  name="hasReceivedBenefitsBefore"
                >
                  <RadioGroupItem value="yes">Yes</RadioGroupItem>
                  <RadioGroupItem value="no">No</RadioGroupItem>
                </RadioGroup>
              )}
            />
          </div>

          {hasReceivedBenefitsBefore && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <div className="space-y-2">
                <Label htmlFor="previousState" className="font-semibold">
                  Previous State *
                </Label>
                <Controller
                  name="previousState"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="previousState"
                      {...field}
                      placeholder="State name"
                      className={errors.previousState ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.previousState && (
                  <p className="text-sm text-red-500">
                    {errors.previousState.message}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label className="font-semibold">
              Has anyone ever had a benefit stopped or paused? *
            </Label>
            <Controller
              name="hasBenefitsStoppedOrPaused"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value ? "yes" : "no"}
                  onChange={(val) => field.onChange(val === "yes")}
                  name="hasBenefitsStoppedOrPaused"
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

