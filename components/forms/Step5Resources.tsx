"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resourcesInfoSchema, type ResourcesInfo } from "@/lib/schemas";
import { useFormStore } from "@/store/form-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Trash2, Plus } from "lucide-react";

const ASSET_TYPES = [
  "Cash",
  "Checking Account",
  "Savings Account",
  "Stocks/Bonds",
  "401k/Retirement",
  "Other",
];

interface Step5ResourcesProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step5Resources({ onNext, onBack }: Step5ResourcesProps) {
  const { formData, updateFormData } = useFormStore();
  const householdMembers = formData.step3_household || [];
  const selectedPrograms = formData.step1_programSelection?.programs || [];

  // Skip this step if only TANF is selected
  const isOnlyTANF = selectedPrograms.length === 1 && selectedPrograms.includes("TANF" as any);

  const {
    control,
    handleSubmit,
    watch,
    register,
    formState: { errors },
  } = useForm<ResourcesInfo>({
    resolver: zodResolver(resourcesInfoSchema),
    defaultValues: formData.step5_resources || {
      assets: [],
      lotteryWinnings: false,
      assetTransfers: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "assets",
  });

  const lotteryWinnings = watch("lotteryWinnings");
  const assetTransfers = watch("assetTransfers");

  const onSubmit = (data: ResourcesInfo) => {
    updateFormData("step5_resources", data);
    onNext();
  };

  if (isOnlyTANF) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            This step is not required for TANF-only applications. Click Next to continue.
          </p>
        </div>
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="button" onClick={onNext}>
            Next
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Resources</h2>
        <p className="text-muted-foreground">
          List all assets and resources you and your household members own.
        </p>
      </div>

      {/* Assets Section */}
      <Card>
        <CardHeader>
          <CardTitle>Assets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Label className="font-semibold">Select asset types you have:</Label>
            <div className="grid grid-cols-2 gap-4">
              {ASSET_TYPES.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Controller
                    name="assets"
                    control={control}
                    render={({ field }) => {
                      const hasAsset = field.value?.some((a) => a.type === type);
                      return (
                        <>
                          <Checkbox
                            id={`asset-${type}`}
                            checked={hasAsset}
                            onCheckedChange={(checked) => {
                              const current = field.value || [];
                              if (checked) {
                                append({
                                  id: `asset-${Date.now()}-${Math.random()}`,
                                  type,
                                  ownerIds: [],
                                  institution: "",
                                  accountType: "",
                                  accountNumber: "",
                                  balance: 0,
                                  institutionAddress: "",
                                });
                              } else {
                                const index = current.findIndex((a) => a.type === type);
                                if (index !== -1) {
                                  remove(index);
                                }
                              }
                            }}
                          />
                          <Label
                            htmlFor={`asset-${type}`}
                            className="font-normal cursor-pointer"
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
          </div>

          {fields.map((field, index) => {
            const assetType = watch(`assets.${index}.type`) || "";
            return (
              <Card key={field.id} className="p-4 bg-gray-50">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{assetType}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-semibold">Owner(s) *</Label>
                    <Controller
                      name={`assets.${index}.ownerIds`}
                      control={control}
                      render={({ field: ownerField }) => (
                        <div className="space-y-2">
                          {householdMembers.map((member) => (
                            <div key={member.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`owner-${index}-${member.id}`}
                                checked={ownerField.value?.includes(member.id)}
                                onCheckedChange={(checked) => {
                                  const current = ownerField.value || [];
                                  if (checked) {
                                    ownerField.onChange([...current, member.id]);
                                  } else {
                                    ownerField.onChange(
                                      current.filter((id) => id !== member.id)
                                    );
                                  }
                                }}
                              />
                              <Label
                                htmlFor={`owner-${index}-${member.id}`}
                                className="font-normal cursor-pointer"
                              >
                                {member.name.first} {member.name.last}
                              </Label>
                            </div>
                          ))}
                        </div>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`institution-${index}`} className="font-semibold">
                      Institution *
                    </Label>
                    <Controller
                      name={`assets.${index}.institution`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          id={`institution-${index}`}
                          {...field}
                          placeholder="Bank name, etc."
                          className={
                            errors.assets?.[index]?.institution
                              ? "border-red-500"
                              : ""
                          }
                        />
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`accountType-${index}`} className="font-semibold">
                        Account Type *
                      </Label>
                      <Controller
                        name={`assets.${index}.accountType`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            id={`accountType-${index}`}
                            {...field}
                            placeholder="Checking, Savings, etc."
                            className={
                              errors.assets?.[index]?.accountType
                                ? "border-red-500"
                                : ""
                            }
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`accountNumber-${index}`}>Account Number</Label>
                      <Controller
                        name={`assets.${index}.accountNumber`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            id={`accountNumber-${index}`}
                            {...field}
                            placeholder="Optional"
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`balance-${index}`} className="font-semibold">
                      Current Balance *
                    </Label>
                    <Controller
                      name={`assets.${index}.balance`}
                      control={control}
                      render={({ field }) => (
                        <CurrencyInput
                          id={`balance-${index}`}
                          value={field.value}
                          onChange={field.onChange}
                          className={
                            errors.assets?.[index]?.balance ? "border-red-500" : ""
                          }
                        />
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`institutionAddress-${index}`} className="font-semibold">
                      Institution Address *
                    </Label>
                    <Controller
                      name={`assets.${index}.institutionAddress`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          id={`institutionAddress-${index}`}
                          {...field}
                          placeholder="Street, City, State, ZIP"
                          className={
                            errors.assets?.[index]?.institutionAddress
                              ? "border-red-500"
                              : ""
                          }
                        />
                      )}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      {/* Additional Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Lottery Winnings */}
          <div className="space-y-2">
            <Label className="font-semibold">
              Lottery or gambling winnings of $4,250 or more?
            </Label>
            <Controller
              name="lotteryWinnings"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value ? "yes" : "no"}
                  onChange={(val) => field.onChange(val === "yes")}
                  name="lotteryWinnings"
                >
                  <RadioGroupItem value="yes">Yes</RadioGroupItem>
                  <RadioGroupItem value="no">No</RadioGroupItem>
                </RadioGroup>
              )}
            />
            {lotteryWinnings && (
              <div className="mt-2">
                <Label htmlFor="lotteryAmount" className="font-semibold">
                  Amount * (must be $4,250 or more)
                </Label>
                <Controller
                  name="lotteryAmount"
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput
                      id="lotteryAmount"
                      value={field.value || 0}
                      onChange={field.onChange}
                      className={errors.lotteryAmount ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.lotteryAmount && (
                  <p className="text-sm text-red-500">
                    {errors.lotteryAmount.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Asset Transfers */}
          <div className="space-y-2">
            <Label className="font-semibold">
              Have you transferred any assets in the last 3 months?
            </Label>
            <Controller
              name="assetTransfers"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value ? "yes" : "no"}
                  onChange={(val) => field.onChange(val === "yes")}
                  name="assetTransfers"
                >
                  <RadioGroupItem value="yes">Yes</RadioGroupItem>
                  <RadioGroupItem value="no">No</RadioGroupItem>
                </RadioGroup>
              )}
            />
            {assetTransfers && (
              <div className="mt-2">
                <Label htmlFor="transferDetails" className="font-semibold">
                  Please provide details *
                </Label>
                <Textarea
                  id="transferDetails"
                  {...register("transferDetails")}
                  placeholder="Describe the asset transfer"
                  className={errors.transferDetails ? "border-red-500" : ""}
                />
                {errors.transferDetails && (
                  <p className="text-sm text-red-500">
                    {errors.transferDetails.message}
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

