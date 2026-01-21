"use client";

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">About You (The Person Applying)</h2>
        <p className="text-muted-foreground">
          Please provide your personal information.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="font-semibold">
                What is your first name? *
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
                What is your last name? *
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
                    Do you have a middle name?
                  </Label>
                </div>
              )}
            />
            {hasMiddleName && (
              <div className="mt-2">
                <Label htmlFor="middleName" className="font-semibold">
                  What is your middle name? *
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
              What is your date of birth? *
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
              What is your sex? *
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
              What is your Social Security number? *
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
              What is your home address? *
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
                <Label className="font-semibold">What is your mailing address? *</Label>
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
              What is the best phone number to reach you? *
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
            <Label htmlFor="email">What is your email?</Label>
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
              What is the best way to contact you? *
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
            <FileInput
              label="Can you upload proof of identity?"
              accept="image/*,.pdf"
              onFileChange={(file) => setValue("proofOfIdentity", file)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}

