"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { householdSchema } from "@/lib/schemas";
import type { HouseholdMember } from "@/lib/schemas";
import { useFormStore } from "@/store/form-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Trash2, Plus } from "lucide-react";
import { useMemo } from "react";

const RELATIONSHIPS = [
  "Self (Applicant)",
  "Spouse",
  "Child",
  "Parent",
  "Sibling",
  "Other Relative",
  "Unrelated",
];

const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to answer"];

const MARITAL_STATUSES = [
  "Single",
  "Married",
  "Divorced",
  "Widowed",
  "Separated",
];

const EDUCATION_LEVELS = [
  "Less than high school",
  "High school/GED",
  "Some college",
  "Associate degree",
  "Bachelor's degree",
  "Graduate degree",
];

const PROGRAMS = ["SNAP", "TANF", "Medicaid"];

interface Step3HouseholdCompositionProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step3HouseholdComposition({
  onNext,
  onBack,
}: Step3HouseholdCompositionProps) {
  const { formData, updateFormData } = useFormStore();
  const applicantInfo = formData.step2_applicantInfo;

  // Initialize with applicant if no members exist
  const initialMembers = useMemo(() => {
    if (formData.step3_household && formData.step3_household.length > 0) {
      return formData.step3_household;
    }
    // Pre-fill applicant from Step 2
    if (applicantInfo) {
      return [
        {
          id: `member-${Date.now()}`,
          name: applicantInfo.name,
          relationship: "Self (Applicant)",
          dateOfBirth: "",
          gender: "",
          citizenship: true,
          residencyDate: "",
          maritalStatus: "",
          educationLevel: "",
          veteran: false,
          disabled: false,
          pregnant: false,
          student: false,
          temporarilyAway: false,
          applyingForBenefits: true,
          programs: [],
        } as HouseholdMember,
      ];
    }
    return [
      {
        id: `member-${Date.now()}`,
        name: { first: "", middle: "", last: "" },
        relationship: "Self (Applicant)",
        dateOfBirth: "",
        gender: "",
        citizenship: true,
        residencyDate: "",
        maritalStatus: "",
        educationLevel: "",
        veteran: false,
        disabled: false,
        pregnant: false,
        student: false,
        temporarilyAway: false,
        applyingForBenefits: true,
        programs: [],
      } as HouseholdMember,
    ];
  }, [formData.step3_household, applicantInfo]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ members: HouseholdMember[] }>({
    resolver: zodResolver(householdSchema),
    defaultValues: {
      members: initialMembers,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  const formatSSN = (value: string): string => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 5)
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5, 9)}`;
  };

  const addNewMember = () => {
    append({
      id: `member-${Date.now()}-${Math.random()}`,
      name: { first: "", middle: "", last: "" },
      relationship: "",
      dateOfBirth: "",
      gender: "",
      citizenship: true,
      residencyDate: "",
      maritalStatus: "",
      educationLevel: "",
      veteran: false,
      disabled: false,
      pregnant: false,
      student: false,
      temporarilyAway: false,
      applyingForBenefits: false,
      programs: [],
    } as HouseholdMember);
  };

  const onSubmit = (data: { members: HouseholdMember[] }) => {
    updateFormData("step3_household", data.members);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Household Composition</h2>
        <p className="text-muted-foreground">
          List everyone who lives in your home, even if you are not applying for them.
        </p>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => {
          const member = field as any;
          const isApplicant = member.relationship === "Self (Applicant)";

          return (
            <Card key={field.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {isApplicant ? "Applicant" : `Household Member ${index + 1}`}
                    </CardTitle>
                    {isApplicant && (
                      <CardDescription>
                        This is you, the primary applicant
                      </CardDescription>
                    )}
                  </div>
                  {!isApplicant && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Name */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`name-first-${index}`} className="font-semibold">
                      First Name *
                    </Label>
                    <Controller
                      name={`members.${index}.name.first`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          id={`name-first-${index}`}
                          {...field}
                          className={
                            errors.members?.[index]?.name?.first
                              ? "border-red-500"
                              : ""
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`name-middle-${index}`}>Middle Name</Label>
                    <Controller
                      name={`members.${index}.name.middle`}
                      control={control}
                      render={({ field }) => (
                        <Input id={`name-middle-${index}`} {...field} />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`name-last-${index}`} className="font-semibold">
                      Last Name *
                    </Label>
                    <Controller
                      name={`members.${index}.name.last`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          id={`name-last-${index}`}
                          {...field}
                          className={
                            errors.members?.[index]?.name?.last
                              ? "border-red-500"
                              : ""
                          }
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Relationship */}
                <div className="space-y-2">
                  <Label htmlFor={`relationship-${index}`} className="font-semibold">
                    Relationship to Applicant *
                  </Label>
                  <Controller
                    name={`members.${index}.relationship`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        id={`relationship-${index}`}
                        {...field}
                        disabled={isApplicant}
                        className={
                          errors.members?.[index]?.relationship
                            ? "border-red-500"
                            : ""
                        }
                      >
                        <option value="">Select relationship</option>
                        {RELATIONSHIPS.map((rel) => (
                          <option key={rel} value={rel}>
                            {rel}
                          </option>
                        ))}
                      </Select>
                    )}
                  />
                </div>

                {/* DOB */}
                <div className="space-y-2">
                  <Label htmlFor={`dob-${index}`} className="font-semibold">
                    Date of Birth *
                  </Label>
                  <Controller
                    name={`members.${index}.dateOfBirth`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        id={`dob-${index}`}
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

                {/* SSN - Conditional on applying for benefits */}
                <div className="space-y-2">
                  <Controller
                    name={`members.${index}.applyingForBenefits`}
                    control={control}
                    render={({ field: applyField }) => (
                      <>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`applying-${index}`}
                            checked={applyField.value}
                            onCheckedChange={applyField.onChange}
                          />
                          <Label
                            htmlFor={`applying-${index}`}
                            className="font-normal cursor-pointer"
                          >
                            Is this person applying for benefits?
                          </Label>
                        </div>
                        {applyField.value && (
                          <div className="mt-2">
                            <Label htmlFor={`ssn-${index}`}>SSN (Optional)</Label>
                            <Controller
                              name={`members.${index}.ssn`}
                              control={control}
                              render={({ field: ssnField }) => (
                                <Input
                                  id={`ssn-${index}`}
                                  type="text"
                                  placeholder="XXX-XX-XXXX"
                                  maxLength={11}
                                  {...ssnField}
                                  onChange={(e) => {
                                    const formatted = formatSSN(e.target.value);
                                    ssnField.onChange(formatted);
                                  }}
                                />
                              )}
                            />
                          </div>
                        )}
                      </>
                    )}
                  />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label htmlFor={`gender-${index}`} className="font-semibold">
                    Gender *
                  </Label>
                  <Controller
                    name={`members.${index}.gender`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        id={`gender-${index}`}
                        {...field}
                        className={
                          errors.members?.[index]?.gender ? "border-red-500" : ""
                        }
                      >
                        <option value="">Select gender</option>
                        {GENDERS.map((gender) => (
                          <option key={gender} value={gender}>
                            {gender}
                          </option>
                        ))}
                      </Select>
                    )}
                  />
                </div>

                {/* Citizenship */}
                <div className="space-y-2">
                  <Label className="font-semibold">US Citizen *</Label>
                  <Controller
                    name={`members.${index}.citizenship`}
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
                </div>

                {/* Alien Registration Number - Conditional */}
                <Controller
                  name={`members.${index}.citizenship`}
                  control={control}
                  render={({ field: citizenshipField }) => {
                    if (citizenshipField.value === false) {
                      return (
                        <div className="space-y-2">
                          <Label htmlFor={`alien-${index}`} className="font-semibold">
                            Alien Registration Number *
                          </Label>
                          <Controller
                            name={`members.${index}.alienRegistrationNumber`}
                            control={control}
                            render={({ field }) => (
                              <Input
                                id={`alien-${index}`}
                                {...field}
                                placeholder="A-123456789"
                                className={
                                  errors.members?.[index]?.alienRegistrationNumber
                                    ? "border-red-500"
                                    : ""
                                }
                              />
                            )}
                          />
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* Residency Date */}
                <div className="space-y-2">
                  <Label htmlFor={`residency-${index}`} className="font-semibold">
                    Residency Date *
                  </Label>
                  <Controller
                    name={`members.${index}.residencyDate`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        id={`residency-${index}`}
                        type="date"
                        {...field}
                        className={
                          errors.members?.[index]?.residencyDate
                            ? "border-red-500"
                            : ""
                        }
                      />
                    )}
                  />
                </div>

                {/* Marital Status */}
                <div className="space-y-2">
                  <Label htmlFor={`marital-${index}`} className="font-semibold">
                    Marital Status *
                  </Label>
                  <Controller
                    name={`members.${index}.maritalStatus`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        id={`marital-${index}`}
                        {...field}
                        className={
                          errors.members?.[index]?.maritalStatus
                            ? "border-red-500"
                            : ""
                        }
                      >
                        <option value="">Select marital status</option>
                        {MARITAL_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </Select>
                    )}
                  />
                </div>

                {/* Education Level */}
                <div className="space-y-2">
                  <Label htmlFor={`education-${index}`} className="font-semibold">
                    Education Level *
                  </Label>
                  <Controller
                    name={`members.${index}.educationLevel`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        id={`education-${index}`}
                        {...field}
                        className={
                          errors.members?.[index]?.educationLevel
                            ? "border-red-500"
                            : ""
                        }
                      >
                        <option value="">Select education level</option>
                        {EDUCATION_LEVELS.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </Select>
                    )}
                  />
                </div>

                {/* Status Tags */}
                <div className="space-y-2">
                  <Label className="font-semibold">Status</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Controller
                      name={`members.${index}.veteran`}
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`veteran-${index}`}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <Label
                            htmlFor={`veteran-${index}`}
                            className="font-normal cursor-pointer"
                          >
                            Veteran
                          </Label>
                        </div>
                      )}
                    />
                    <Controller
                      name={`members.${index}.disabled`}
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`disabled-${index}`}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <Label
                            htmlFor={`disabled-${index}`}
                            className="font-normal cursor-pointer"
                          >
                            Disabled
                          </Label>
                        </div>
                      )}
                    />
                    <Controller
                      name={`members.${index}.pregnant`}
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`pregnant-${index}`}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <Label
                            htmlFor={`pregnant-${index}`}
                            className="font-normal cursor-pointer"
                          >
                            Pregnant
                          </Label>
                        </div>
                      )}
                    />
                    <Controller
                      name={`members.${index}.student`}
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`student-${index}`}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <Label
                            htmlFor={`student-${index}`}
                            className="font-normal cursor-pointer"
                          >
                            Student
                          </Label>
                        </div>
                      )}
                    />
                  </div>
                </div>

                {/* Student - School Name Conditional */}
                <Controller
                  name={`members.${index}.student`}
                  control={control}
                  render={({ field: studentField }) => {
                    if (studentField.value) {
                      return (
                        <div className="space-y-2">
                          <Label htmlFor={`school-${index}`} className="font-semibold">
                            School Name *
                          </Label>
                          <Controller
                            name={`members.${index}.schoolName`}
                            control={control}
                            render={({ field }) => (
                              <Input
                                id={`school-${index}`}
                                {...field}
                                className={
                                  errors.members?.[index]?.schoolName
                                    ? "border-red-500"
                                    : ""
                                }
                              />
                            )}
                          />
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* Temporarily Away */}
                <div className="space-y-2">
                  <Controller
                    name={`members.${index}.temporarilyAway`}
                    control={control}
                    render={({ field: awayField }) => (
                      <>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`away-${index}`}
                            checked={awayField.value}
                            onCheckedChange={awayField.onChange}
                          />
                          <Label
                            htmlFor={`away-${index}`}
                            className="font-normal cursor-pointer"
                          >
                            Temporarily away from home
                          </Label>
                        </div>
                        {awayField.value && (
                          <div className="mt-2 space-y-2 p-4 bg-gray-50 rounded-md">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`away-start-${index}`}>
                                  Start Date *
                                </Label>
                                <Controller
                                  name={`members.${index}.awayDates.start`}
                                  control={control}
                                  render={({ field }) => (
                                    <Input
                                      id={`away-start-${index}`}
                                      type="date"
                                      {...field}
                                    />
                                  )}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`away-end-${index}`}>
                                  End Date *
                                </Label>
                                <Controller
                                  name={`members.${index}.awayDates.end`}
                                  control={control}
                                  render={({ field }) => (
                                    <Input
                                      id={`away-end-${index}`}
                                      type="date"
                                      {...field}
                                    />
                                  )}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`away-reason-${index}`}>
                                Reason *
                              </Label>
                              <Controller
                                name={`members.${index}.awayDates.reason`}
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    id={`away-reason-${index}`}
                                    {...field}
                                  />
                                )}
                              />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  />
                </div>

                {/* Program Selection per Person */}
                <Controller
                  name={`members.${index}.applyingForBenefits`}
                  control={control}
                  render={({ field: applyField }) => {
                    if (applyField.value) {
                      return (
                        <div className="space-y-2">
                          <Label className="font-semibold">
                            Is this person applying for:
                          </Label>
                          <Controller
                            name={`members.${index}.programs`}
                            control={control}
                            render={({ field: programsField }) => (
                              <div className="grid grid-cols-3 gap-4">
                                {PROGRAMS.map((program) => (
                                  <div
                                    key={program}
                                    className="flex items-center space-x-2"
                                  >
                                    <Checkbox
                                      id={`${program}-${index}`}
                                      checked={programsField.value?.includes(program)}
                                      onCheckedChange={(checked) => {
                                        const current = programsField.value || [];
                                        if (checked) {
                                          programsField.onChange([
                                            ...current,
                                            program,
                                          ]);
                                        } else {
                                          programsField.onChange(
                                            current.filter((p) => p !== program)
                                          );
                                        }
                                      }}
                                    />
                                    <Label
                                      htmlFor={`${program}-${index}`}
                                      className="font-normal cursor-pointer"
                                    >
                                      {program}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            )}
                          />
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* Race/Ethnicity - Collapsed */}
                <Accordion type="single" collapsible>
                  <AccordionItem value={`race-${index}`}>
                    <AccordionTrigger value={`race-${index}`}>
                      Race/Ethnicity (Optional)
                    </AccordionTrigger>
                    <AccordionContent value={`race-${index}`}>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`race-${index}`}>Race</Label>
                          <Controller
                            name={`members.${index}.race`}
                            control={control}
                            render={({ field }) => (
                              <Input id={`race-${index}`} {...field} />
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`ethnicity-${index}`}>Ethnicity</Label>
                          <Controller
                            name={`members.${index}.ethnicity`}
                            control={control}
                            render={({ field }) => (
                              <Input id={`ethnicity-${index}`} {...field} />
                            )}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          );
        })}

        {/* Add Member Button */}
        <Button
          type="button"
          variant="outline"
          onClick={addNewMember}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Household Member
        </Button>
      </div>

      {errors.members && (
        <p className="text-sm text-red-500">{errors.members.message}</p>
      )}

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}

