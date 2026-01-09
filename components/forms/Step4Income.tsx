"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { incomeInfoSchema, type IncomeInfo } from "@/lib/schemas";
import { useFormStore } from "@/store/form-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Trash2, Plus } from "lucide-react";

const UNEARNED_INCOME_TYPES = [
  "Social Security",
  "SSI",
  "Unemployment",
  "Child Support",
  "VA Benefits",
  "Pension",
  "Other",
];

interface Step4IncomeProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step4Income({ onNext, onBack }: Step4IncomeProps) {
  const { formData, updateFormData } = useFormStore();
  const householdMembers = formData.step3_household || [];

  const {
    control,
    handleSubmit,
    watch,
    register,
    formState: { errors },
  } = useForm<IncomeInfo>({
    resolver: zodResolver(incomeInfoSchema),
    defaultValues: formData.step4_income || {
      hasEarnedIncome: false,
      earnedIncome: [],
      unearnedIncome: [],
      jobLossLast60Days: false,
      thirdPartyBillPayment: false,
      daycareExpenses: false,
      childSupportPaid: false,
    },
  });

  const { fields: earnedFields, append: appendEarned, remove: removeEarned } =
    useFieldArray({
      control,
      name: "earnedIncome",
    });

  const { fields: unearnedFields, append: appendUnearned, remove: removeUnearned } =
    useFieldArray({
      control,
      name: "unearnedIncome",
    });

  const hasEarnedIncome = watch("hasEarnedIncome");
  const jobLossLast60Days = watch("jobLossLast60Days");
  const thirdPartyBillPayment = watch("thirdPartyBillPayment");
  const daycareExpenses = watch("daycareExpenses");
  const childSupportPaid = watch("childSupportPaid");

  const onSubmit = (data: IncomeInfo) => {
    updateFormData("step4_income", data);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Income</h2>
        <p className="text-muted-foreground">
          Include money from all jobs, full-time, part-time, or seasonal.
        </p>
      </div>

      {/* Earned Income Section */}
      <Card>
        <CardHeader>
          <CardTitle>Earned Income</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="font-semibold">
              Do you or anyone receive money from working?
            </Label>
            <Controller
              name="hasEarnedIncome"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value ? "yes" : "no"}
                  onChange={(val) => field.onChange(val === "yes")}
                  name="hasEarnedIncome"
                >
                  <RadioGroupItem value="yes">Yes</RadioGroupItem>
                  <RadioGroupItem value="no">No</RadioGroupItem>
                </RadioGroup>
              )}
            />
          </div>

          {hasEarnedIncome && (
            <div className="space-y-4">
              {earnedFields.map((field, index) => (
                <Card key={field.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Job {index + 1}</CardTitle>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEarned(index)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`person-${index}`} className="font-semibold">
                        Person *
                      </Label>
                      <Controller
                        name={`earnedIncome.${index}.personId`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            id={`person-${index}`}
                            {...field}
                            className={
                              errors.earnedIncome?.[index]?.personId
                                ? "border-red-500"
                                : ""
                            }
                          >
                            <option value="">Select person</option>
                            {householdMembers.map((member) => (
                              <option key={member.id} value={member.id}>
                                {member.name.first} {member.name.last}
                              </option>
                            ))}
                          </Select>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`employer-${index}`} className="font-semibold">
                        Employer Name *
                      </Label>
                      <Controller
                        name={`earnedIncome.${index}.employerName`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            id={`employer-${index}`}
                            {...field}
                            className={
                              errors.earnedIncome?.[index]?.employerName
                                ? "border-red-500"
                                : ""
                            }
                          />
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`payRate-${index}`} className="font-semibold">
                          Rate of Pay *
                        </Label>
                        <Controller
                          name={`earnedIncome.${index}.payRate`}
                          control={control}
                          render={({ field }) => (
                            <CurrencyInput
                              id={`payRate-${index}`}
                              value={field.value}
                              onChange={field.onChange}
                              className={
                                errors.earnedIncome?.[index]?.payRate
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`payFreq-${index}`} className="font-semibold">
                          Pay Frequency *
                        </Label>
                        <Controller
                          name={`earnedIncome.${index}.payFrequency`}
                          control={control}
                          render={({ field }) => (
                            <Select
                              id={`payFreq-${index}`}
                              {...field}
                              className={
                                errors.earnedIncome?.[index]?.payFrequency
                                  ? "border-red-500"
                                  : ""
                              }
                            >
                              <option value="">Select</option>
                              <option value="weekly">Weekly</option>
                              <option value="biweekly">Biweekly</option>
                              <option value="monthly">Monthly</option>
                            </Select>
                          )}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`hours-${index}`} className="font-semibold">
                          Hours per Week *
                        </Label>
                        <Controller
                          name={`earnedIncome.${index}.hoursPerWeek`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              id={`hours-${index}`}
                              type="number"
                              min="0"
                              max="168"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                              className={
                                errors.earnedIncome?.[index]?.hoursPerWeek
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`startDate-${index}`} className="font-semibold">
                          Start Date *
                        </Label>
                        <Controller
                          name={`earnedIncome.${index}.startDate`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              id={`startDate-${index}`}
                              type="date"
                              {...field}
                              className={
                                errors.earnedIncome?.[index]?.startDate
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                          )}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`nextPay-${index}`} className="font-semibold">
                        Next Pay Date *
                      </Label>
                      <Controller
                        name={`earnedIncome.${index}.nextPayDate`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            id={`nextPay-${index}`}
                            type="date"
                            {...field}
                            className={
                              errors.earnedIncome?.[index]?.nextPayDate
                                ? "border-red-500"
                                : ""
                              }
                            />
                          )}
                        />
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  appendEarned({
                    id: `earned-${Date.now()}`,
                    personId: "",
                    employerName: "",
                    payRate: 0,
                    payFrequency: "weekly",
                    hoursPerWeek: 0,
                    startDate: "",
                    nextPayDate: "",
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

      {/* Unearned Income Section */}
      <Card>
        <CardHeader>
          <CardTitle>Unearned Income</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {UNEARNED_INCOME_TYPES.map((type) => (
              <div key={type} className="flex items-start space-x-2">
                <Controller
                  name="unearnedIncome"
                  control={control}
                  render={({ field }) => {
                    const isChecked = field.value?.some((u) => u.type === type);
                    return (
                      <>
                        <Checkbox
                          id={`unearned-${type}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            const current = field.value || [];
                            if (checked) {
                              appendUnearned({
                                type,
                                personId: "",
                                amount: 0,
                                frequency: "monthly",
                              });
                            } else {
                              const index = current.findIndex((u) => u.type === type);
                              if (index !== -1) {
                                removeUnearned(index);
                              }
                            }
                          }}
                        />
                        <Label
                          htmlFor={`unearned-${type}`}
                          className="font-normal cursor-pointer flex-1"
                        >
                          {type}
                        </Label>
                      </>
                    );
                  }}
                />
              </div>
            ))}
          </div>

          {unearnedFields.map((field, index) => {
            const incomeType = watch(`unearnedIncome.${index}.type`) || "";
            return (
              <Card key={field.id} className="p-4 bg-gray-50">
                <div className="space-y-4">
                  <h4 className="font-semibold">{incomeType}</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Person *</Label>
                      <Controller
                        name={`unearnedIncome.${index}.personId`}
                        control={control}
                        render={({ field }) => (
                          <Select {...field}>
                            <option value="">Select person</option>
                            {householdMembers.map((member) => (
                              <option key={member.id} value={member.id}>
                                {member.name.first} {member.name.last}
                              </option>
                            ))}
                          </Select>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Monthly Amount *</Label>
                      <Controller
                        name={`unearnedIncome.${index}.amount`}
                        control={control}
                        render={({ field }) => (
                          <CurrencyInput
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Frequency *</Label>
                      <Controller
                        name={`unearnedIncome.${index}.frequency`}
                        control={control}
                        render={({ field }) => (
                          <Select {...field}>
                            <option value="weekly">Weekly</option>
                            <option value="biweekly">Biweekly</option>
                            <option value="monthly">Monthly</option>
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

      {/* Other Income Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Other Income Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Job Loss */}
          <div className="space-y-2">
            <Label className="font-semibold">
              Job loss or reduction in last 60 days?
            </Label>
            <Controller
              name="jobLossLast60Days"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value ? "yes" : "no"}
                  onChange={(val) => field.onChange(val === "yes")}
                  name="jobLossLast60Days"
                >
                  <RadioGroupItem value="yes">Yes</RadioGroupItem>
                  <RadioGroupItem value="no">No</RadioGroupItem>
                </RadioGroup>
              )}
            />
            {jobLossLast60Days && (
              <div className="mt-2">
                <Textarea
                  {...register("jobLossDetails")}
                  placeholder="Please provide details"
                  className={errors.jobLossDetails ? "border-red-500" : ""}
                />
                {errors.jobLossDetails && (
                  <p className="text-sm text-red-500">
                    {errors.jobLossDetails.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Third Party Bill Payment */}
          <div className="space-y-2">
            <Label className="font-semibold">
              Does someone else pay your bills?
            </Label>
            <Controller
              name="thirdPartyBillPayment"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value ? "yes" : "no"}
                  onChange={(val) => field.onChange(val === "yes")}
                  name="thirdPartyBillPayment"
                >
                  <RadioGroupItem value="yes">Yes</RadioGroupItem>
                  <RadioGroupItem value="no">No</RadioGroupItem>
                </RadioGroup>
              )}
            />
            {thirdPartyBillPayment && (
              <div className="mt-2">
                <Textarea
                  {...register("thirdPartyDetails")}
                  placeholder="Please provide details"
                  className={errors.thirdPartyDetails ? "border-red-500" : ""}
                />
                {errors.thirdPartyDetails && (
                  <p className="text-sm text-red-500">
                    {errors.thirdPartyDetails.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Daycare Expenses */}
          <div className="space-y-2">
            <Label className="font-semibold">Daycare expenses?</Label>
            <Controller
              name="daycareExpenses"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value ? "yes" : "no"}
                  onChange={(val) => field.onChange(val === "yes")}
                  name="daycareExpenses"
                >
                  <RadioGroupItem value="yes">Yes</RadioGroupItem>
                  <RadioGroupItem value="no">No</RadioGroupItem>
                </RadioGroup>
              )}
            />
            {daycareExpenses && (
              <div className="mt-2">
                <Label>Monthly Amount *</Label>
                <Controller
                  name="daycareAmount"
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput
                      value={field.value || 0}
                      onChange={field.onChange}
                      className={errors.daycareAmount ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.daycareAmount && (
                  <p className="text-sm text-red-500">
                    {errors.daycareAmount.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Child Support Paid */}
          <div className="space-y-2">
            <Label className="font-semibold">Child support paid?</Label>
            <Controller
              name="childSupportPaid"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value ? "yes" : "no"}
                  onChange={(val) => field.onChange(val === "yes")}
                  name="childSupportPaid"
                >
                  <RadioGroupItem value="yes">Yes</RadioGroupItem>
                  <RadioGroupItem value="no">No</RadioGroupItem>
                </RadioGroup>
              )}
            />
            {childSupportPaid && (
              <div className="mt-2">
                <Label>Monthly Amount *</Label>
                <Controller
                  name="childSupportAmount"
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput
                      value={field.value || 0}
                      onChange={field.onChange}
                      className={errors.childSupportAmount ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.childSupportAmount && (
                  <p className="text-sm text-red-500">
                    {errors.childSupportAmount.message}
                  </p>
                )}
              </div>
            )}
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

