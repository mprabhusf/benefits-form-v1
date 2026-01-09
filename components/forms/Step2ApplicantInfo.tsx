"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicantInfoSchema } from "@/lib/schemas";
import type { ApplicantInfo } from "@/lib/schemas";
import { useFormStore } from "@/store/form-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const LANGUAGES = [
  "English",
  "Spanish",
  "Vietnamese",
  "Farsi",
  "Arabic",
  "Chinese",
  "Other",
];

const FELONY_TYPES = [
  "Sexual abuse",
  "Murder",
  "Sexual exploitation",
  "Other",
];

interface Step2ApplicantInfoProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step2ApplicantInfo({ onNext, onBack }: Step2ApplicantInfoProps) {
  const { formData, updateFormData } = useFormStore();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ApplicantInfo>({
    resolver: zodResolver(applicantInfoSchema),
    defaultValues: formData.step2_applicantInfo || {
      name: { first: "", middle: "", last: "" },
      streetAddress: "",
      mailingAddressSame: true,
      city: "",
      county: "",
      zip: "",
      email: "",
      primaryPhone: "",
      primaryLanguage: "",
      correspondencePreference: "email",
      priorBenefits: false,
      fraudConvictions: false,
      disqualifications: false,
      paroleProbation: false,
      felonyConvictions: false,
    },
  });

  const mailingAddressSame = watch("mailingAddressSame");
  const correspondencePreference = watch("correspondencePreference");
  const priorBenefits = watch("priorBenefits");
  const felonyConvictions = watch("felonyConvictions");

  const onSubmit = (data: ApplicantInfo) => {
    updateFormData("step2_applicantInfo", data);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Applicant Information</h2>
        <p className="text-muted-foreground">
          Please provide your contact information and answer the background questions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="font-semibold">
                First Name *
              </Label>
              <Input
                id="firstName"
                {...register("name.first")}
                className={errors.name?.first ? "border-red-500" : ""}
              />
              {errors.name?.first && (
                <p className="text-sm text-red-500">{errors.name.first.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input id="middleName" {...register("name.middle")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="font-semibold">
                Last Name *
              </Label>
              <Input
                id="lastName"
                {...register("name.last")}
                className={errors.name?.last ? "border-red-500" : ""}
              />
              {errors.name?.last && (
                <p className="text-sm text-red-500">{errors.name.last.message}</p>
              )}
            </div>
          </div>

          {/* Street Address */}
          <div className="space-y-2">
            <Label htmlFor="streetAddress" className="font-semibold">
              Street Address *
            </Label>
            <Input
              id="streetAddress"
              {...register("streetAddress")}
              className={errors.streetAddress ? "border-red-500" : ""}
            />
            {errors.streetAddress && (
              <p className="text-sm text-red-500">{errors.streetAddress.message}</p>
            )}
          </div>

          {/* City, County, ZIP */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="font-semibold">
                City *
              </Label>
              <Input
                id="city"
                {...register("city")}
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="county" className="font-semibold">
                County *
              </Label>
              <Input
                id="county"
                {...register("county")}
                className={errors.county ? "border-red-500" : ""}
              />
              {errors.county && (
                <p className="text-sm text-red-500">{errors.county.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip" className="font-semibold">
                ZIP Code *
              </Label>
              <Input
                id="zip"
                {...register("zip")}
                className={errors.zip ? "border-red-500" : ""}
              />
              {errors.zip && (
                <p className="text-sm text-red-500">{errors.zip.message}</p>
              )}
            </div>
          </div>

          {/* Mailing Address */}
          <div className="space-y-2">
            <Controller
              name="mailingAddressSame"
              control={control}
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mailingAddressSame"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label htmlFor="mailingAddressSame" className="font-normal cursor-pointer">
                    Mailing address is the same as street address
                  </Label>
                </div>
              )}
            />
          </div>

          {!mailingAddressSame && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-md">
              <div className="space-y-2">
                <Label htmlFor="mailingStreet" className="font-semibold">
                  Mailing Street Address *
                </Label>
                <Input
                  id="mailingStreet"
                  {...register("mailingAddress.street")}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mailingCity" className="font-semibold">
                    Mailing City *
                  </Label>
                  <Input
                    id="mailingCity"
                    {...register("mailingAddress.city")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mailingZip" className="font-semibold">
                    Mailing ZIP *
                  </Label>
                  <Input
                    id="mailingZip"
                    {...register("mailingAddress.zip")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Contact Methods */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryPhone" className="font-semibold">
                Primary Phone *
              </Label>
              <Input
                id="primaryPhone"
                type="tel"
                {...register("primaryPhone")}
                className={errors.primaryPhone ? "border-red-500" : ""}
              />
              {errors.primaryPhone && (
                <p className="text-sm text-red-500">{errors.primaryPhone.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="alternatePhone">Alternate Phone</Label>
            <Input
              id="alternatePhone"
              type="tel"
              {...register("alternatePhone")}
            />
          </div>

          {/* Primary Language */}
          <div className="space-y-2">
            <Label htmlFor="primaryLanguage" className="font-semibold">
              Primary Language *
            </Label>
            <Controller
              name="primaryLanguage"
              control={control}
              render={({ field }) => (
                <>
                  <Select
                    id="primaryLanguage"
                    {...field}
                    className={errors.primaryLanguage ? "border-red-500" : ""}
                  >
                    <option value="">Select language</option>
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </Select>
                  {field.value === "Other" && (
                    <Input
                      {...register("otherLanguage")}
                      placeholder="Specify other language"
                      className="mt-2"
                    />
                  )}
                </>
              )}
            />
            {errors.primaryLanguage && (
              <p className="text-sm text-red-500">{errors.primaryLanguage.message}</p>
            )}
          </div>

          {/* Correspondence Preference */}
          <div className="space-y-2">
            <Label className="font-semibold">Correspondence Preference *</Label>
            <Controller
              name="correspondencePreference"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onChange={field.onChange}
                  name="correspondencePreference"
                >
                  <RadioGroupItem value="text">Text</RadioGroupItem>
                  <RadioGroupItem value="email">Email</RadioGroupItem>
                  <RadioGroupItem value="mail">Mail</RadioGroupItem>
                </RadioGroup>
              )}
            />
            {correspondencePreference === "text" && (
              <p className="text-sm text-muted-foreground">
                Electronic notifications will be used for all updates if selected.
              </p>
            )}
            {errors.correspondencePreference && (
              <p className="text-sm text-red-500">
                {errors.correspondencePreference.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Background Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Background Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Prior Benefits */}
          <div className="space-y-2">
            <Label className="font-semibold">
              Have you ever applied for benefits before?
            </Label>
            <Controller
              name="priorBenefits"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value ? "yes" : "no"}
                  onChange={(val) => field.onChange(val === "yes")}
                  name="priorBenefits"
                >
                  <RadioGroupItem value="yes">Yes</RadioGroupItem>
                  <RadioGroupItem value="no">No</RadioGroupItem>
                </RadioGroup>
              )}
            />
            {priorBenefits && (
              <div className="mt-2">
                <Label htmlFor="priorBenefitsDetails" className="font-semibold">
                  When and where did you apply?
                </Label>
                <Textarea
                  id="priorBenefitsDetails"
                  {...register("priorBenefitsDetails")}
                  className={errors.priorBenefitsDetails ? "border-red-500" : ""}
                />
                {errors.priorBenefitsDetails && (
                  <p className="text-sm text-red-500">
                    {errors.priorBenefitsDetails.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Fraud Convictions */}
          <div className="space-y-2">
            <Label className="font-semibold">
              Have you ever been convicted of fraud related to benefits?
            </Label>
            <Controller
              name="fraudConvictions"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value ? "yes" : "no"}
                  onChange={(val) => field.onChange(val === "yes")}
                  name="fraudConvictions"
                >
                  <RadioGroupItem value="yes">Yes</RadioGroupItem>
                  <RadioGroupItem value="no">No</RadioGroupItem>
                </RadioGroup>
              )}
            />
          </div>

          {/* Disqualifications */}
          <div className="space-y-2">
            <Label className="font-semibold">
              Have you ever been disqualified from receiving benefits?
            </Label>
            <Controller
              name="disqualifications"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value ? "yes" : "no"}
                  onChange={(val) => field.onChange(val === "yes")}
                  name="disqualifications"
                >
                  <RadioGroupItem value="yes">Yes</RadioGroupItem>
                  <RadioGroupItem value="no">No</RadioGroupItem>
                </RadioGroup>
              )}
            />
          </div>

          {/* Parole/Probation */}
          <div className="space-y-2">
            <Label className="font-semibold">
              Are you fleeing prosecution or violating parole?
            </Label>
            <Controller
              name="paroleProbation"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value ? "yes" : "no"}
                  onChange={(val) => field.onChange(val === "yes")}
                  name="paroleProbation"
                >
                  <RadioGroupItem value="yes">Yes</RadioGroupItem>
                  <RadioGroupItem value="no">No</RadioGroupItem>
                </RadioGroup>
              )}
            />
          </div>

          {/* Felony Convictions */}
          <div className="space-y-2">
            <Label className="font-semibold">
              Have you ever been convicted of a felony?
            </Label>
            <Accordion type="single" collapsible>
              <AccordionItem value="felony-info">
                <AccordionTrigger value="felony-info">
                  <span className="text-sm text-muted-foreground">
                    Include offenses related to sexual abuse, murder, or sexual exploitation
                  </span>
                </AccordionTrigger>
              </AccordionItem>
            </Accordion>
            <Controller
              name="felonyConvictions"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value ? "yes" : "no"}
                  onChange={(val) => field.onChange(val === "yes")}
                  name="felonyConvictions"
                >
                  <RadioGroupItem value="yes">Yes</RadioGroupItem>
                  <RadioGroupItem value="no">No</RadioGroupItem>
                </RadioGroup>
              )}
            />
            {felonyConvictions && (
              <div className="mt-2 space-y-2">
                <Label className="font-semibold">Felony Types</Label>
                <Controller
                  name="felonyTypes"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      {FELONY_TYPES.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`felony-${type}`}
                            checked={field.value?.includes(type)}
                            onCheckedChange={(checked) => {
                              const current = field.value || [];
                              if (checked) {
                                field.onChange([...current, type]);
                              } else {
                                field.onChange(current.filter((t) => t !== type));
                              }
                            }}
                          />
                          <Label
                            htmlFor={`felony-${type}`}
                            className="font-normal cursor-pointer"
                          >
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                />
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

