"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { aboutYouSchema, type AboutYou } from "@/lib/schemas";
import { useFormStore } from "@/store/form-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileInput } from "@/components/ui/file-input";
import { MultiFileUpload } from "@/components/ui/multi-file-upload";
import { processFilesWithOCR } from "@/lib/ocr";

interface Step1AboutYouProps {
  onNext: () => void;
}

export default function Step1AboutYou({ onNext }: Step1AboutYouProps) {
  const { formData, updateFormData } = useFormStore();

  const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<AboutYou>({
    resolver: zodResolver(aboutYouSchema),
    defaultValues: formData.step1_aboutYou || {
      firstName: "",
      lastName: "",
      hasMiddleName: false,
      dateOfBirth: "",
      sex: "Male",
      ssn: "",
      homeAddress: {
        street: "",
        city: "",
        state: "",
        zip: "",
      },
      mailingAddressSame: true,
      phoneNumber: "",
      email: "",
      contactPreference: "Email",
    },
  });

  const hasMiddleName = watch("hasMiddleName");
  const mailingAddressSame = watch("mailingAddressSame");

  const formatSSN = (value: string): string => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 5)
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5, 9)}`;
  };

  const onSubmit = (data: AboutYou) => {
    updateFormData("step1_aboutYou", data);
    onNext();
  };

  const handleNextClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      // Save form data without validation - use getValues which never throws
      const formData = getValues();
      updateFormData("step1_aboutYou", formData as AboutYou);
    } catch (error) {
      // Ignore errors
    }
    // Always navigate
    if (onNext && typeof onNext === 'function') {
      onNext();
    }
  };

  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);
  const [isProcessingOCR, setIsProcessingOCR] = React.useState(false);

  const handleFilesChange = async (files: File[]) => {
    setUploadedFiles(files);
    
    // Process files with OCR when they are uploaded
    if (files.length > 0) {
      setIsProcessingOCR(true);
      try {
        const ocrResult = await processFilesWithOCR(files);
        
        // Pre-fill form fields with OCR results
        if (ocrResult.firstName) setValue("firstName", ocrResult.firstName);
        if (ocrResult.lastName) setValue("lastName", ocrResult.lastName);
        if (ocrResult.middleName) {
          setValue("hasMiddleName", true);
          setValue("middleName", ocrResult.middleName);
        }
        if (ocrResult.dateOfBirth) setValue("dateOfBirth", ocrResult.dateOfBirth);
        if (ocrResult.ssn) setValue("ssn", ocrResult.ssn);
        if (ocrResult.phoneNumber) setValue("phoneNumber", ocrResult.phoneNumber);
        if (ocrResult.email) setValue("email", ocrResult.email);
        if (ocrResult.address) {
          if (ocrResult.address.street) setValue("homeAddress.street", ocrResult.address.street);
          if (ocrResult.address.city) setValue("homeAddress.city", ocrResult.address.city);
          if (ocrResult.address.state) setValue("homeAddress.state", ocrResult.address.state);
          if (ocrResult.address.zip) setValue("homeAddress.zip", ocrResult.address.zip);
        }
      } catch (error) {
        console.error("OCR processing failed:", error);
      } finally {
        setIsProcessingOCR(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">About You (The Person Applying)</h2>
        <p className="text-muted-foreground">
          Please provide your personal information.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              Adding details made easy! Upload household member IDs and we&apos;ll fill up the info for you
            </p>
            <MultiFileUpload
              onFilesChange={handleFilesChange}
              accept=".pdf,.jpeg,.jpg,.png"
            />
            {isProcessingOCR && (
              <p className="text-xs text-blue-600 italic">
                Processing files with OCR...
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="font-semibold">
                First Name *
              </Label>
              <Input
                id="firstName"
                {...register("firstName")}
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="font-semibold">
                Last Name *
              </Label>
              <Input
                id="lastName"
                {...register("lastName")}
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Controller
              name="hasMiddleName"
              control={control}
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasMiddleName"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label htmlFor="hasMiddleName" className="font-normal cursor-pointer">
                    Middle Name
                  </Label>
                </div>
              )}
            />
            {hasMiddleName && (
              <div className="mt-2">
                <Label htmlFor="middleName" className="font-semibold">
                  Middle Name *
                </Label>
                <Input
                  id="middleName"
                  {...register("middleName")}
                  className={errors.middleName ? "border-red-500" : ""}
                />
                {errors.middleName && (
                  <p className="text-sm text-red-500">{errors.middleName.message}</p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="font-semibold">
              Date of Birth *
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              {...register("dateOfBirth")}
              className={errors.dateOfBirth ? "border-red-500" : ""}
            />
            {errors.dateOfBirth && (
              <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sex" className="font-semibold">
              Gender *
            </Label>
            <Controller
              name="sex"
              control={control}
              render={({ field }) => (
                <Select
                  id="sex"
                  {...field}
                  className={errors.sex ? "border-red-500" : ""}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Select>
              )}
            />
            {errors.sex && (
              <p className="text-sm text-red-500">{errors.sex.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ssn" className="font-semibold">
              Social Security Number *
            </Label>
            <Controller
              name="ssn"
              control={control}
              render={({ field }) => (
                <Input
                  id="ssn"
                  type="text"
                  placeholder="XXX-XX-XXXX"
                  maxLength={11}
                  {...field}
                  onChange={(e) => {
                    const formatted = formatSSN(e.target.value);
                    field.onChange(formatted);
                  }}
                  className={errors.ssn ? "border-red-500" : ""}
                />
              )}
            />
            {errors.ssn && (
              <p className="text-sm text-red-500">{errors.ssn.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="homeStreet" className="font-semibold">
              Home Address *
            </Label>
            <div className="space-y-2">
              <Input
                id="homeStreet"
                placeholder="Street address"
                {...register("homeAddress.street")}
                className={errors.homeAddress?.street ? "border-red-500" : ""}
              />
              <div className="grid grid-cols-3 gap-4">
                <Input
                  placeholder="City"
                  {...register("homeAddress.city")}
                  className={errors.homeAddress?.city ? "border-red-500" : ""}
                />
                <Input
                  placeholder="State"
                  {...register("homeAddress.state")}
                  className={errors.homeAddress?.state ? "border-red-500" : ""}
                />
                <Input
                  placeholder="ZIP"
                  {...register("homeAddress.zip")}
                  className={errors.homeAddress?.zip ? "border-red-500" : ""}
                />
              </div>
            </div>
          </div>

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
                    Same as home address
                  </Label>
                </div>
              )}
            />
            {!mailingAddressSame && (
              <div className="mt-2 space-y-2 p-4 bg-gray-50 rounded-md">
                <Label className="font-semibold">Mailing Address *</Label>
                <Input
                  placeholder="Street address"
                  {...register("mailingAddress.street")}
                />
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    placeholder="City"
                    {...register("mailingAddress.city")}
                  />
                  <Input
                    placeholder="State"
                    {...register("mailingAddress.state")}
                  />
                  <Input
                    placeholder="ZIP"
                    {...register("mailingAddress.zip")}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="font-semibold">
              Phone Number *
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              {...register("phoneNumber")}
              className={errors.phoneNumber ? "border-red-500" : ""}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
            )}
          </div>

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
            <Label htmlFor="contactPreference" className="font-semibold">
              Contact Preference *
            </Label>
            <Controller
              name="contactPreference"
              control={control}
              render={({ field }) => (
                <Select
                  id="contactPreference"
                  {...field}
                  className={errors.contactPreference ? "border-red-500" : ""}
                >
                  <option value="">Select</option>
                  <option value="Phone">Phone</option>
                  <option value="Mail">Mail</option>
                  <option value="Email">Email</option>
                  <option value="Text">Text</option>
                </Select>
              )}
            />
            {errors.contactPreference && (
              <p className="text-sm text-red-500">{errors.contactPreference.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Can you upload proof of identity?</Label>
            <MultiFileUpload
              onFilesChange={(files) => {
                // Store the first file or null
                setValue("proofOfIdentity", files.length > 0 ? files[0] : null);
              }}
              accept=".pdf,.jpeg,.jpg,.png"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button 
          type="button" 
          onClick={(e) => handleNextClick(e)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

