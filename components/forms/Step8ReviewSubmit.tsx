"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewAcknowledgementsSchema, type ReviewAcknowledgements } from "@/lib/schemas";
import { useFormStore } from "@/store/form-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";

interface Step8ReviewSubmitProps {
  onBack: () => void;
}

export default function Step8ReviewSubmit({ onBack }: Step8ReviewSubmitProps) {
  const { formData, updateFormData, resetForm } = useFormStore();

  const {
    control,
    handleSubmit,
    watch,
    register,
    formState: { errors },
  } = useForm<ReviewAcknowledgements>({
    resolver: zodResolver(reviewAcknowledgementsSchema),
    defaultValues: formData.step8_review || {
      truthfulness: false,
      changeReporting: false,
      penalties: false,
      consentToDataSharing: false,
      completedBySelf: true,
      signature: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const completedBySelf = watch("completedBySelf");

  const onSubmit = (data: ReviewAcknowledgements) => {
    updateFormData("step8_review", data);
    // In a real application, you would submit to a backend here
    alert("Application submitted successfully! (This is a demo - no data was sent to a server)");
    // Optionally reset the form
    // resetForm();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Review, Acknowledgements & Submit</h2>
        <p className="text-muted-foreground">
          Please review your information and complete the required acknowledgements.
        </p>
      </div>

      {/* Review Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Review Your Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Selected Programs:</h4>
            <p className="text-sm">
              {formData.step1_programSelection?.programs?.join(", ") || "None selected"}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Applicant:</h4>
            <p className="text-sm">
              {formData.step2_applicantInfo?.name?.first}{" "}
              {formData.step2_applicantInfo?.name?.last}
            </p>
            <p className="text-sm text-muted-foreground">
              {formData.step2_applicantInfo?.streetAddress}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Household Members:</h4>
            <p className="text-sm">
              {formData.step3_household?.length || 0} member(s)
            </p>
          </div>

          <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      <em>
                        Note: This is a summary view. In a production application, you would
                        be able to click &quot;Edit&quot; links to go back and modify any section.
                      </em>
                    </p>
          </div>
        </CardContent>
      </Card>

      {/* Acknowledgements */}
      <Card>
        <CardHeader>
          <CardTitle>Required Acknowledgements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Controller
              name="truthfulness"
              control={control}
              render={({ field }) => (
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="truthfulness"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className={errors.truthfulness ? "border-red-500" : ""}
                  />
                  <Label
                    htmlFor="truthfulness"
                    className="font-normal cursor-pointer flex-1"
                  >
                    I certify that the information provided is true and accurate. *
                  </Label>
                </div>
              )}
            />
            {errors.truthfulness && (
              <p className="text-sm text-red-500">{errors.truthfulness.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Controller
              name="changeReporting"
              control={control}
              render={({ field }) => (
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="changeReporting"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className={errors.changeReporting ? "border-red-500" : ""}
                  />
                  <Label
                    htmlFor="changeReporting"
                    className="font-normal cursor-pointer flex-1"
                  >
                    I understand that I must report changes in my circumstances. *
                  </Label>
                </div>
              )}
            />
            {errors.changeReporting && (
              <p className="text-sm text-red-500">{errors.changeReporting.message}</p>
            )}
            <Accordion type="single">
              <AccordionItem value="change-reporting">
                <AccordionTrigger value="change-reporting">
                  <span className="text-sm text-muted-foreground">
                    Learn more about change reporting requirements
                  </span>
                </AccordionTrigger>
                <AccordionContent value="change-reporting">
                  <div className="text-sm space-y-2 p-4 bg-gray-50 rounded-md">
                    <p>
                      You must report changes in your circumstances within 10 days, including:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Changes in income or employment</li>
                      <li>Changes in household composition</li>
                      <li>Changes in address</li>
                      <li>Changes in resources or assets</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="space-y-2">
            <Controller
              name="penalties"
              control={control}
              render={({ field }) => (
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="penalties"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className={errors.penalties ? "border-red-500" : ""}
                  />
                  <Label
                    htmlFor="penalties"
                    className="font-normal cursor-pointer flex-1"
                  >
                    I understand the penalties for providing false information. *
                  </Label>
                </div>
              )}
            />
            {errors.penalties && (
              <p className="text-sm text-red-500">{errors.penalties.message}</p>
            )}
            <Accordion type="single">
              <AccordionItem value="penalties">
                <AccordionTrigger value="penalties">
                  <span className="text-sm text-muted-foreground">
                    View penalties for fraud
                  </span>
                </AccordionTrigger>
                <AccordionContent value="penalties">
                  <div className="text-sm space-y-2 p-4 bg-gray-50 rounded-md max-h-60 overflow-y-auto">
                    <p className="font-semibold">Penalties for Fraud:</p>
                    <p>
                      Providing false information or withholding information to receive
                      benefits is a crime. Penalties may include:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Criminal prosecution</li>
                      <li>Fines up to $250,000</li>
                      <li>Imprisonment up to 20 years</li>
                      <li>Permanent disqualification from benefits</li>
                      <li>Repayment of all benefits received fraudulently</li>
                    </ul>
                    <p className="mt-4 font-semibold">Domestic Violence Resources:</p>
                    <p>
                      If you are a victim of domestic violence, you may be eligible for
                      special protections. Contact your local social services office for
                      more information.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="space-y-2">
            <Controller
              name="consentToDataSharing"
              control={control}
              render={({ field }) => (
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="consentToDataSharing"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label
                    htmlFor="consentToDataSharing"
                    className="font-normal cursor-pointer flex-1"
                  >
                    I consent to data sharing with other agencies as required by law.
                  </Label>
                </div>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Signature Section */}
      <Card>
        <CardHeader>
          <CardTitle>Signature</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="font-semibold">
              Was this form completed by you?
            </Label>
            <Controller
              name="completedBySelf"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value ? "yes" : "no"}
                  onChange={(val) => field.onChange(val === "yes")}
                  name="completedBySelf"
                >
                  <RadioGroupItem value="yes">Yes</RadioGroupItem>
                  <RadioGroupItem value="no">No</RadioGroupItem>
                </RadioGroup>
              )}
            />
            {!completedBySelf && (
              <div className="mt-2">
                <Label htmlFor="completedByDetails" className="font-semibold">
                  Who completed this form? *
                </Label>
                <Textarea
                  id="completedByDetails"
                  {...register("completedByDetails")}
                  placeholder="Please provide the name and relationship of the person who completed this form"
                  className={errors.completedByDetails ? "border-red-500" : ""}
                />
                {errors.completedByDetails && (
                  <p className="text-sm text-red-500">
                    {errors.completedByDetails.message}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="signature" className="font-semibold">
              Electronic Signature (Type Full Name) *
            </Label>
            <Input
              id="signature"
              {...register("signature")}
              placeholder="Type your full name"
              className={errors.signature ? "border-red-500" : ""}
            />
            {errors.signature && (
              <p className="text-sm text-red-500">{errors.signature.message}</p>
            )}
            <p className="text-sm text-muted-foreground">
              By typing your name, you are providing your electronic signature.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="font-semibold">
              Date *
            </Label>
            <Input
              id="date"
              type="date"
              {...register("date")}
              className={errors.date ? "border-red-500" : ""}
            />
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" size="lg">
          Submit Application
        </Button>
      </div>
    </form>
  );
}

