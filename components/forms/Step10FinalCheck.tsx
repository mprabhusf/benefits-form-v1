"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  finalCheckAndSignatureSchema,
  type FinalCheckAndSignature,
} from "@/lib/schemas";
import { useFormStore } from "@/store/form-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Step10FinalCheckProps {
  onBack: () => void;
}

export default function Step10FinalCheck({ onBack }: Step10FinalCheckProps) {
  const { formData, updateFormData, resetForm } = useFormStore();

  const {
    control,
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm<FinalCheckAndSignature>({
    resolver: zodResolver(finalCheckAndSignatureSchema),
    defaultValues: formData.step10_finalCheck || {
      everythingCorrect: false,
      signature: "",
      signatureDate: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = (data: FinalCheckAndSignature) => {
    updateFormData("step10_finalCheck", data);
    // In a real application, you would submit to a backend here
    alert(
      "Application submitted successfully! (This is a demo - no data was sent to a server)"
    );
    // Optionally reset the form
    // resetForm();
  };

  const handleSubmitClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Use getValues() instead of watch() - it doesn't trigger validation
    const formData = getValues();
    updateFormData("step10_finalCheck", formData as FinalCheckAndSignature);
    alert(
      "Application submitted successfully! (This is a demo - no data was sent to a server)"
    );
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmitClick(e as any); }} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Final Check & Signature</h2>
        <p className="text-muted-foreground">
          Please review your information and provide your signature.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Final Check</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Controller
              name="everythingCorrect"
              control={control}
              render={({ field }) => (
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="everythingCorrect"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className={errors.everythingCorrect ? "border-red-500" : ""}
                  />
                  <Label
                    htmlFor="everythingCorrect"
                    className="font-normal cursor-pointer flex-1"
                  >
                    Is everything correct to the best of your knowledge? *
                  </Label>
                </div>
              )}
            />
            {errors.everythingCorrect && (
              <p className="text-sm text-red-500">
                {errors.everythingCorrect.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Signature</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signature" className="font-semibold">
              Type your name to sign. *
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
            <Label htmlFor="signatureDate" className="font-semibold">
              Signature Date *
            </Label>
            <Input
              id="signatureDate"
              type="date"
              {...register("signatureDate")}
              className={errors.signatureDate ? "border-red-500" : ""}
            />
            {errors.signatureDate && (
              <p className="text-sm text-red-500">
                {errors.signatureDate.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={handleSubmitClick} size="lg">
          Submit Application
        </Button>
      </div>
    </form>
  );
}

