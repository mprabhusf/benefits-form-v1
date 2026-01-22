"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { incomeSchema, type Income } from "@/lib/schemas";
import { useFormStore } from "@/store/form-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyInput } from "@/components/ui/currency-input";
import { MultiFileUpload } from "@/components/ui/multi-file-upload";
import { Trash2, Plus } from "lucide-react";

const INCOME_SOURCES = [
  "Social Security",
  "SSI",
  "Unemployment",
  "Child support",
  "Veterans benefits",
  "Retirement",
];
const FREQUENCIES = [
  "Every week",
  "Every two weeks",
  "Twice a month",
  "Monthly",
];

interface Step5IncomeProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step5Income({ onNext, onBack }: Step5IncomeProps) {
  const { formData, updateFormData } = useFormStore();
  const householdMembers = formData.step2_household?.members || [];
  const aboutYou = formData.step1_aboutYou;

  // Create list of all people (applicant + household)
  const allPeople = [
    {
      id: "applicant",
      name: aboutYou
        ? `${aboutYou.firstName} ${aboutYou.lastName}`
        : "You (Applicant)",
    },
    ...householdMembers.map((m) => ({ id: m.id, name: `${m.firstName} ${m.lastName}` })),
  ];

  const {
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<Income>({
    resolver: zodResolver(incomeSchema),
    defaultValues: formData.step5_income || {
      hasWorkIncome: false,
      sources: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sources",
  });

  const hasWorkIncome = watch("hasWorkIncome");

  const onSubmit = (data: Income) => {
    updateFormData("step5_income", data);
    onNext();
  };

  const handleNextClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Use getValues() instead of watch() - it doesn't trigger validation
    const formData = getValues();
    updateFormData("step5_income", formData as Income);
    onNext();
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleNextClick(e as any); }} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Money You Get (Income)</h2>
        <p className="text-muted-foreground">
          Tell us about all sources of income for you and your household.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Work Income</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="font-semibold">Work for Pay *</Label>
            <Controller
              name="hasWorkIncome"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value ? "yes" : "no"}
                  onChange={(val) => field.onChange(val === "yes")}
                  name="hasWorkIncome"
                >
                  <RadioGroupItem value="yes">Yes</RadioGroupItem>
                  <RadioGroupItem value="no">No</RadioGroupItem>
                </RadioGroup>
              )}
            />
          </div>

          {hasWorkIncome && (
            <div className="space-y-4">
              {fields
                .filter((f) => (f as any).sourceType === "work")
                .map((field, index) => {
                  const actualIndex = fields.findIndex((f) => f.id === field.id);
                  return (
                    <Card key={field.id} className="p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold">Job {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(actualIndex)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="font-semibold">Who works? *</Label>
                          <Controller
                            name={`sources.${actualIndex}.personId`}
                            control={control}
                            render={({ field }) => (
                              <Select {...field}>
                                <option value="">Select person</option>
                                {allPeople.map((person) => (
                                  <option key={person.id} value={person.id}>
                                    {person.name}
                                  </option>
                                ))}
                              </Select>
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="font-semibold">Employer Name *</Label>
                          <Controller
                            name={`sources.${actualIndex}.employerName`}
                            control={control}
                            render={({ field }) => (
                              <Input {...field} placeholder="Employer name" />
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="font-semibold">
                            Amount Before Taxes *
                          </Label>
                          <Controller
                            name={`sources.${actualIndex}.amount`}
                            control={control}
                            render={({ field }) => (
                              <CurrencyInput
                                value={field.value || 0}
                                onChange={field.onChange}
                              />
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="font-semibold">
                            Pay Frequency *
                          </Label>
                          <Controller
                            name={`sources.${actualIndex}.frequency`}
                            control={control}
                            render={({ field }) => (
                              <Select {...field}>
                                <option value="">Select</option>
                                {FREQUENCIES.map((freq) => (
                                  <option key={freq} value={freq}>
                                    {freq}
                                  </option>
                                ))}
                              </Select>
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="font-semibold">Can you upload proof of income (like a pay stub)?</Label>
                          <MultiFileUpload
                            onFilesChange={(files) => {
                              setValue(`sources.${actualIndex}.proofOfIncome`, files.length > 0 ? files[0] : null);
                            }}
                            accept=".pdf,.jpeg,.jpg,.png"
                          />
                        </div>
                      </div>
                    </Card>
                  );
                })}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({
                    id: `income-${Date.now()}`,
                    personId: "",
                    sourceType: "work",
                    employerName: "",
                    amount: 0,
                    frequency: "Monthly",
                  })
                }
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Job
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Other Income Sources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="font-semibold">
              Other Income Sources (Select all that apply)
            </Label>
            <Controller
              name="sources"
              control={control}
              render={({ field }) => {
                // Get currently selected source types from the field array (only non-work sources)
                const currentSources = (field.value || []).filter(
                  (s: any) => s.sourceType !== "work"
                );
                const selectedSources = INCOME_SOURCES.filter((source) => {
                  const sourceType = source.toLowerCase().replace(" ", "");
                  return currentSources.some(
                    (s: any) => s.sourceType === sourceType
                  );
                });

                return (
                  <MultiSelect
                    id="income-sources"
                    options={INCOME_SOURCES}
                    value={selectedSources}
                    onChange={(selected) => {
                      // Only consider non-work sources
                      const current = (field.value || []).filter(
                        (s: any) => s.sourceType !== "work"
                      );
                      const currentSourceTypes = current.map(
                        (s: any) => s.sourceType
                      );
                      const selectedSourceTypes = selected.map((s) =>
                        s.toLowerCase().replace(" ", "")
                      );

                      // Remove sources that are no longer selected (only non-work sources)
                      const toRemove: number[] = [];
                      fields.forEach((fieldItem, index) => {
                        const fieldSourceType = (fieldItem as any).sourceType;
                        // Only remove non-work sources that are not in the selected list
                        if (
                          fieldSourceType !== "work" &&
                          !selectedSourceTypes.includes(fieldSourceType)
                        ) {
                          toRemove.push(index);
                        }
                      });
                      // Remove in reverse order to maintain correct indices
                      toRemove.reverse().forEach((index) => remove(index));

                      // Add new sources
                      selectedSourceTypes.forEach((sourceType) => {
                        if (!currentSourceTypes.includes(sourceType)) {
                          append({
                            id: `income-${Date.now()}-${Math.random()}`,
                            personId: "",
                            sourceType: sourceType as any,
                            amount: 0,
                            frequency: "Monthly",
                          });
                        }
                      });
                    }}
                    placeholder="Select income sources (select all that apply)"
                  />
                );
              }}
            />
          </div>

          {fields
            .filter((f) => (f as any).sourceType !== "work")
            .map((field, index) => {
              const actualIndex = fields.findIndex((f) => f.id === field.id);
              const sourceType = watch(`sources.${actualIndex}.sourceType`);
              return (
                <Card key={field.id} className="p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">{sourceType}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(actualIndex)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="font-semibold">Who receives this? *</Label>
                      <Controller
                        name={`sources.${actualIndex}.personId`}
                        control={control}
                        render={({ field }) => (
                          <Select {...field}>
                            <option value="">Select person</option>
                            {allPeople.map((person) => (
                              <option key={person.id} value={person.id}>
                                {person.name}
                              </option>
                            ))}
                          </Select>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold">
                        How much do they get, and how often? *
                      </Label>
                      <div className="grid grid-cols-2 gap-4">
                        <Controller
                          name={`sources.${actualIndex}.amount`}
                          control={control}
                          render={({ field }) => (
                            <CurrencyInput
                              value={field.value || 0}
                              onChange={field.onChange}
                            />
                          )}
                        />
                        <Controller
                          name={`sources.${actualIndex}.frequency`}
                          control={control}
                          render={({ field }) => (
                            <Select {...field}>
                              <option value="">Select</option>
                              {FREQUENCIES.map((freq) => (
                                <option key={freq} value={freq}>
                                  {freq}
                                </option>
                              ))}
                            </Select>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
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

