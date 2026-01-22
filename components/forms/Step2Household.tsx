"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { householdSchema, type Household } from "@/lib/schemas";
import { useFormStore } from "@/store/form-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { MultiFileUpload } from "@/components/ui/multi-file-upload";
import { processFilesWithOCR } from "@/lib/ocr";
import React from "react";

const RELATIONSHIPS = ["Spouse", "Child", "Parent", "Sibling", "Friend", "Other"];
const GENDERS = ["Male", "Female", "Another"];
const IMMIGRATION_STATUSES = [
  "Legal Permanent Resident",
  "Refugee",
  "Asylee",
  "Other",
];

interface Step2HouseholdProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step2Household({ onNext, onBack }: Step2HouseholdProps) {
  const { formData, updateFormData } = useFormStore();

  const {
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<Household>({
    resolver: zodResolver(householdSchema),
    defaultValues: formData.step2_household || {
      numberOfPeople: 0,
      members: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  // Component for file upload per household member
  const MemberFileUploadComponent = ({ index, setValue }: { index: number; setValue: any }) => {
    const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);
    const [isProcessingOCR, setIsProcessingOCR] = React.useState(false);

    const handleFilesChange = async (files: File[]) => {
      setUploadedFiles(files);
      
      // Process files with OCR when they are uploaded
      if (files.length > 0) {
        setIsProcessingOCR(true);
        try {
          const ocrResult = await processFilesWithOCR(files);
          
          // Pre-fill form fields with OCR results for this household member
          if (ocrResult.firstName) {
            setValue(`members.${index}.firstName`, ocrResult.firstName);
          }
          if (ocrResult.lastName) {
            setValue(`members.${index}.lastName`, ocrResult.lastName);
          }
          if (ocrResult.dateOfBirth) {
            setValue(`members.${index}.dateOfBirth`, ocrResult.dateOfBirth);
          }
          if (ocrResult.ssn) {
            setValue(`members.${index}.ssn`, ocrResult.ssn);
          }
        } catch (error) {
          console.error("OCR processing failed:", error);
        } finally {
          setIsProcessingOCR(false);
        }
      }
    };

    return (
      <>
        <MultiFileUpload
          onFilesChange={handleFilesChange}
          accept=".pdf,.jpeg,.jpg,.png"
        />
        {isProcessingOCR && (
          <p className="text-xs text-blue-600 italic">
            Processing files with OCR...
          </p>
        )}
      </>
    );
  };

  const numberOfPeople = watch("numberOfPeople");

  const formatSSN = (value: string): string => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 5)
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5, 9)}`;
  };

  const onSubmit = (data: Household) => {
    updateFormData("step2_household", data);
    onNext();
  };

  const handleNextClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Use getValues() instead of watch() - it doesn't trigger validation
    const formData = getValues();
    updateFormData("step2_household", formData as Household);
    onNext();
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleNextClick(e as any); }} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Who Lives With You (Household)</h2>
        <p className="text-muted-foreground">
          Tell us about the people who live with you.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Household Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="numberOfPeople" className="font-semibold">
              Number of People *
            </Label>
            <Controller
              name="numberOfPeople"
              control={control}
              render={({ field }) => (
                <Input
                  id="numberOfPeople"
                  type="number"
                  min="0"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  className={errors.numberOfPeople ? "border-red-500" : ""}
                />
              )}
            />
            {errors.numberOfPeople && (
              <p className="text-sm text-red-500">{errors.numberOfPeople.message}</p>
            )}
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <Card key={field.id} className="p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Person {index + 1}</h4>
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
                
                <Card className="mb-4">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <p className="text-sm text-gray-700">
                        Adding details made easy! Upload household member IDs and we&apos;ll fill up the info for you
                      </p>
                      <MemberFileUploadComponent index={index} setValue={setValue} />
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-semibold">First Name *</Label>
                      <Controller
                        name={`members.${index}.firstName`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="First name"
                            className={
                              errors.members?.[index]?.firstName ? "border-red-500" : ""
                            }
                          />
                        )}
                      />
                      {errors.members?.[index]?.firstName && (
                        <p className="text-sm text-red-500">
                          {errors.members[index]?.firstName?.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold">Last Name *</Label>
                      <Controller
                        name={`members.${index}.lastName`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Last name"
                            className={
                              errors.members?.[index]?.lastName ? "border-red-500" : ""
                            }
                          />
                        )}
                      />
                      {errors.members?.[index]?.lastName && (
                        <p className="text-sm text-red-500">
                          {errors.members[index]?.lastName?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-semibold">Date of Birth *</Label>
                    <Controller
                      name={`members.${index}.dateOfBirth`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="date"
                          {...field}
                          className={
                            errors.members?.[index]?.dateOfBirth
                              ? "border-red-500"
                              : ""
                          }
                        />
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-semibold">
                      Gender *
                    </Label>
                    <Controller
                      name={`members.${index}.gender`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className={
                            errors.members?.[index]?.gender ? "border-red-500" : ""
                          }
                        >
                          <option value="">Select</option>
                          {GENDERS.map((gender) => (
                            <option key={gender} value={gender}>
                              {gender}
                            </option>
                          ))}
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Social Security Number (Optional)</Label>
                    <Controller
                      name={`members.${index}.ssn`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder="XXX-XX-XXXX"
                          maxLength={11}
                          {...field}
                          onChange={(e) => {
                            const formatted = formatSSN(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-semibold">U.S. Citizen *</Label>
                    <Controller
                      name={`members.${index}.isUSCitizen`}
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value ? "yes" : "no"}
                          onChange={(val) => field.onChange(val === "yes")}
                          name={`citizenship-${index}`}
                        >
                          <RadioGroupItem value="yes">Yes</RadioGroupItem>
                          <RadioGroupItem value="no">No</RadioGroupItem>
                        </RadioGroup>
                      )}
                    />
                    {watch(`members.${index}.isUSCitizen`) === false && (
                      <div className="mt-2">
                        <Label className="font-semibold">
                          Immigration Status *
                        </Label>
                        <Controller
                          name={`members.${index}.immigrationStatus`}
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              className={
                                errors.members?.[index]?.immigrationStatus
                                  ? "border-red-500"
                                  : ""
                              }
                            >
                              <option value="">Select</option>
                              {IMMIGRATION_STATUSES.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </Select>
                          )}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="font-semibold">
                      Relationship *
                    </Label>
                    <Controller
                      name={`members.${index}.relationship`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className={
                            errors.members?.[index]?.relationship
                              ? "border-red-500"
                              : ""
                          }
                        >
                          <option value="">Select</option>
                          {RELATIONSHIPS.map((rel) => (
                            <option key={rel} value={rel}>
                              {rel}
                            </option>
                          ))}
                        </Select>
                      )}
                    />
                    {watch(`members.${index}.relationship`) === "Other" && (
                      <div className="mt-2">
                        <Label className="font-semibold">Please specify *</Label>
                        <Controller
                          name={`members.${index}.otherRelationship`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              className={
                                errors.members?.[index]?.otherRelationship
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                          )}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="font-semibold">
                      Do they live with you full time or part time? *
                    </Label>
                    <Controller
                      name={`members.${index}.livingArrangement`}
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onChange={field.onChange}
                          name={`living-${index}`}
                        >
                          <RadioGroupItem value="Full time">Full time</RadioGroupItem>
                          <RadioGroupItem value="Part time">Part time</RadioGroupItem>
                        </RadioGroup>
                      )}
                    />
                  </div>
                </div>
              </Card>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  id: `member-${Date.now()}-${Math.random()}`,
                  firstName: "",
                  lastName: "",
                  dateOfBirth: "",
                  gender: "Male",
                  isUSCitizen: true,
                  relationship: "Other",
                  livingArrangement: "Full time",
                })
              }
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Household Member
            </Button>
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

