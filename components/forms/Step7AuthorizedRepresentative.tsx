"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authorizedRepresentativeSchema, type AuthorizedRepresentative } from "@/lib/schemas";
import { useFormStore } from "@/store/form-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Step7AuthorizedRepresentativeProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step7AuthorizedRepresentative({
  onNext,
  onBack,
}: Step7AuthorizedRepresentativeProps) {
  const { formData, updateFormData } = useFormStore();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AuthorizedRepresentative>({
    resolver: zodResolver(authorizedRepresentativeSchema),
    defaultValues: formData.step7_authorizedRepresentative || {
      hasRepresentative: false,
      permissions: {
        apply: false,
        receiveNotices: false,
        useSnapBenefits: false,
      },
    },
  });

  const hasRepresentative = watch("hasRepresentative");

  const onSubmit = (data: AuthorizedRepresentative) => {
    updateFormData("step7_authorizedRepresentative", data);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Authorized Representative</h2>
        <p className="text-muted-foreground">
          If you want to authorize someone else to act on your behalf, provide their information below.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Representative Information</CardTitle>
          <CardDescription>
            This section is optional. Only complete if you want to authorize someone else.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="font-semibold">
              Do you want to add an authorized representative?
            </Label>
            <Controller
              name="hasRepresentative"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value ? "yes" : "no"}
                  onChange={(val) => field.onChange(val === "yes")}
                  name="hasRepresentative"
                >
                  <RadioGroupItem value="yes">Yes</RadioGroupItem>
                  <RadioGroupItem value="no">No</RadioGroupItem>
                </RadioGroup>
              )}
            />
          </div>

          {hasRepresentative && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-md">
              <div className="space-y-2">
                <Label htmlFor="representativeName" className="font-semibold">
                  Representative Name *
                </Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="representativeName"
                      {...field}
                      placeholder="Full name"
                      className={errors.name ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="representativeAddress" className="font-semibold">
                  Representative Address *
                </Label>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="representativeAddress"
                      {...field}
                      placeholder="Street, City, State, ZIP"
                      className={errors.address ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.address && (
                  <p className="text-sm text-red-500">{errors.address.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="representativePhone" className="font-semibold">
                  Representative Phone *
                </Label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="representativePhone"
                      type="tel"
                      {...field}
                      placeholder="Phone number"
                      className={errors.phone ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">Permissions</Label>
                <p className="text-sm text-muted-foreground">
                  Select what the representative is authorized to do:
                </p>
                <div className="space-y-3">
                  <Controller
                    name="permissions.apply"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="permission-apply"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Label
                          htmlFor="permission-apply"
                          className="font-normal cursor-pointer"
                        >
                          Apply for benefits on my behalf
                        </Label>
                      </div>
                    )}
                  />
                  <Controller
                    name="permissions.receiveNotices"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="permission-notices"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Label
                          htmlFor="permission-notices"
                          className="font-normal cursor-pointer"
                        >
                          Receive notices on my behalf
                        </Label>
                      </div>
                    )}
                  />
                  <Controller
                    name="permissions.useSnapBenefits"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="permission-snap"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Label
                          htmlFor="permission-snap"
                          className="font-normal cursor-pointer"
                        >
                          Use SNAP benefits on my behalf
                        </Label>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
          )}
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

