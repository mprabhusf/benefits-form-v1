"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { incomeSchema, type Income } from "@/lib/schemas";
import { useFormStore } from "@/store/form-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyInput } from "@/components/ui/currency-input";
import { FileInput } from "@/components/ui/file-input";
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
    ...householdMembers.map((m) => ({ id: m.id, name: m.name })),
  ];

  const {
    control,
    handleSubmit,
    watch,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            <Label className="font-semibold">Does anyone work for pay? *</Label>
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
                          <Label className="font-semibold">Where do they work? *</Label>
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
                            How much do they make before taxes? *
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
                            How often do they get paid? *
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
                          <FileInput
                            label="Can you upload proof of income (like a pay stub)?"
                            accept="image/*,.pdf"
                            onFileChange={(file) =>
                              setValue(`sources.${actualIndex}.proofOfIncome`, file)
                            }
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
              Does anyone get money from other sources? (Select all that apply)
            </Label>
            <div className="space-y-2">
              {INCOME_SOURCES.map((source) => {
                const existing = fields.find(
                  (f) => (f as any).sourceType === source.toLowerCase().replace(" ", "")
                );
                return (
                  <div key={source} className="flex items-center space-x-2">
                    <Controller
                      name="sources"
                      control={control}
                      render={({ field }) => {
                        const hasSource = field.value?.some(
                          (s) => s.sourceType === source.toLowerCase().replace(" ", "")
                        );
                        return (
                          <>
                            <Checkbox
                              id={`income-${source}`}
                              checked={hasSource}
                              onCheckedChange={(checked) => {
                                const current = field.value || [];
                                if (checked) {
                                  append({
                                    id: `income-${Date.now()}-${Math.random()}`,
                                    personId: "",
                                    sourceType: source.toLowerCase().replace(" ", "") as any,
                                    amount: 0,
                                    frequency: "Monthly",
                                  });
                                } else {
                                  const index = current.findIndex(
                                    (s) =>
                                      s.sourceType ===
                                      source.toLowerCase().replace(" ", "")
                                  );
                                  if (index !== -1) {
                                    remove(index);
                                  }
                                }
                              }}
                            />
                            <Label
                              htmlFor={`income-${source}`}
                              className="font-normal cursor-pointer"
                            >
                              {source}
                            </Label>
                          </>
                        );
                      }}
                    />
                  </div>
                );
              })}
            </div>
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
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}

