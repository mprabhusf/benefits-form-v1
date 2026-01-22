"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { raceAndLanguageSchema, type RaceAndLanguage } from "@/lib/schemas";
import { useFormStore } from "@/store/form-store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RACES = [
  "American Indian or Alaska Native",
  "Asian",
  "Black or African American",
  "Native Hawaiian or Other Pacific Islander",
  "White",
  "Other",
];

const LANGUAGES = [
  "English",
  "Spanish",
  "Vietnamese",
  "Chinese",
  "Arabic",
  "French",
  "Other",
];

interface Step3RaceAndLanguageProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step3RaceAndLanguage({
  onNext,
  onBack,
}: Step3RaceAndLanguageProps) {
  const { formData, updateFormData } = useFormStore();

  const {
    control,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<RaceAndLanguage>({
    resolver: zodResolver(raceAndLanguageSchema),
    defaultValues: formData.step3_raceAndLanguage || {
      race: [],
      isHispanicOrLatino: false,
      preferredLanguage: "",
    },
  });

  const onSubmit = (data: RaceAndLanguage) => {
    updateFormData("step3_raceAndLanguage", data);
    onNext();
  };

  const handleNextClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Use getValues() instead of watch() - it doesn't trigger validation
    const formData = getValues();
    updateFormData("step3_raceAndLanguage", formData as RaceAndLanguage);
    onNext();
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleNextClick(e as any); }} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Race and Language</h2>
        <p className="text-muted-foreground">
          Please provide your race and language preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Race and Ethnicity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="font-semibold">
              Race * (Select all that apply)
            </Label>
            <Controller
              name="race"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  id="race"
                  options={RACES}
                  value={field.value || []}
                  onChange={(value) => field.onChange(value)}
                  placeholder="Select races (select all that apply)"
                />
              )}
            />
            {errors.race && (
              <p className="text-sm text-red-500">{errors.race.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Hispanic or Latino *</Label>
            <Controller
              name="isHispanicOrLatino"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value ? "yes" : "no"}
                  onChange={(val) => field.onChange(val === "yes")}
                  name="isHispanicOrLatino"
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
          <CardTitle>Language Preference</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="preferredLanguage" className="font-semibold">
              Preferred Language *
            </Label>
            <Controller
              name="preferredLanguage"
              control={control}
              render={({ field }) => (
                <Select
                  id="preferredLanguage"
                  {...field}
                  className={errors.preferredLanguage ? "border-red-500" : ""}
                >
                  <option value="">Select language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </Select>
              )}
            />
            {errors.preferredLanguage && (
              <p className="text-sm text-red-500">
                {errors.preferredLanguage.message}
              </p>
            )}
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

