"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { homeAndLivingSchema, type HomeAndLiving } from "@/lib/schemas";
import { useFormStore } from "@/store/form-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyInput } from "@/components/ui/currency-input";

const UTILITIES = ["Electricity", "Gas", "Water", "Phone"];

interface Step4HomeAndLivingProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step4HomeAndLiving({
  onNext,
  onBack,
}: Step4HomeAndLivingProps) {
  const { formData, updateFormData } = useFormStore();

  const {
    control,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<HomeAndLiving>({
    resolver: zodResolver(homeAndLivingSchema),
    defaultValues: formData.step4_homeAndLiving || {
      housingType: "Rent",
      monthlyPayment: 0,
      utilities: [],
    },
  });

  const onSubmit = (data: HomeAndLiving) => {
    updateFormData("step4_homeAndLiving", data);
    onNext();
  };

  const handleNextClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Use getValues() instead of watch() - it doesn't trigger validation
    const formData = getValues();
    updateFormData("step4_homeAndLiving", formData as HomeAndLiving);
    onNext();
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleNextClick(e as any); }} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Your Home and Living Situation</h2>
        <p className="text-muted-foreground">
          Tell us about your housing situation.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Housing Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="housingType" className="font-semibold">
              Housing Type *
            </Label>
            <Controller
              name="housingType"
              control={control}
              render={({ field }) => (
                <Select
                  id="housingType"
                  {...field}
                  className={errors.housingType ? "border-red-500" : ""}
                >
                  <option value="">Select</option>
                  <option value="Rent">Rent</option>
                  <option value="Own">Own</option>
                  <option value="Live with someone else">
                    Live with someone else
                  </option>
                </Select>
              )}
            />
            {errors.housingType && (
              <p className="text-sm text-red-500">{errors.housingType.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyPayment" className="font-semibold">
              Monthly Payment *
            </Label>
            <Controller
              name="monthlyPayment"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  id="monthlyPayment"
                  value={field.value}
                  onChange={field.onChange}
                  className={errors.monthlyPayment ? "border-red-500" : ""}
                />
              )}
            />
            {errors.monthlyPayment && (
              <p className="text-sm text-red-500">{errors.monthlyPayment.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">
              Utilities * (Select all that apply)
            </Label>
            <Controller
              name="utilities"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  id="utilities"
                  options={UTILITIES}
                  value={field.value || []}
                  onChange={(value) => field.onChange(value)}
                  placeholder="Select utilities (select all that apply)"
                />
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

