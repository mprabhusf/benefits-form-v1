"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expensesSchema, type Expenses } from "@/lib/schemas";
import { useFormStore } from "@/store/form-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyInput } from "@/components/ui/currency-input";
import { FileInput } from "@/components/ui/file-input";
import { Textarea } from "@/components/ui/textarea";

const FREQUENCIES = [
  "Every week",
  "Every two weeks",
  "Twice a month",
  "Monthly",
];

interface Step6ExpensesProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step6Expenses({ onNext, onBack }: Step6ExpensesProps) {
  const { formData, updateFormData } = useFormStore();

  const {
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<Expenses>({
    resolver: zodResolver(expensesSchema),
    defaultValues: formData.step6_expenses || {
      childCare: {
        type: "childCare",
        hasExpense: false,
      },
      childSupport: {
        type: "childSupport",
        hasExpense: false,
      },
      healthCosts: {
        type: "healthCosts",
        hasExpense: false,
      },
      other: {
        type: "other",
        hasExpense: false,
      },
    },
  });

  const onSubmit = (data: Expenses) => {
    updateFormData("step6_expenses", data);
    onNext();
  };

  const handleNextClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Use getValues() instead of watch() - it doesn't trigger validation
    const formData = getValues();
    updateFormData("step6_expenses", formData as Expenses);
    onNext();
  };

  const renderExpenseField = (
    name: keyof Expenses,
    label: string,
    description?: string
  ) => {
    const expense = watch(name);
    const isOther = name === "other";

    return (
      <div className="space-y-4 p-4 border rounded-md">
        <div className="space-y-2">
          <Label className="font-semibold">{label}</Label>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          <Controller
            name={`${name}.hasExpense`}
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value ? "yes" : "no"}
                onChange={(val) => field.onChange(val === "yes")}
                name={`${name}-expense`}
              >
                <RadioGroupItem value="yes">Yes</RadioGroupItem>
                <RadioGroupItem value="no">No</RadioGroupItem>
              </RadioGroup>
            )}
          />
        </div>

        {expense?.hasExpense && (
          <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-md">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-semibold">Amount *</Label>
                <Controller
                  name={`${name}.amount`}
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput
                      value={field.value || 0}
                      onChange={field.onChange}
                      className={
                        (errors[name] as any)?.amount ? "border-red-500" : ""
                      }
                    />
                  )}
                />
                {(errors[name] as any)?.amount && (
                  <p className="text-sm text-red-500">
                    {(errors[name] as any)?.amount?.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Frequency *</Label>
                <Controller
                  name={`${name}.frequency`}
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={
                        (errors[name] as any)?.frequency ? "border-red-500" : ""
                      }
                    >
                      <option value="">Select</option>
                      {FREQUENCIES.map((freq) => (
                        <option key={freq} value={freq}>
                          {freq}
                        </option>
                      ))}
                    </Select>
                  )}
                />
                {(errors[name] as any)?.frequency && (
                  <p className="text-sm text-red-500">
                    {(errors[name] as any)?.frequency?.message}
                  </p>
                )}
              </div>
            </div>
            {isOther && (
              <div className="space-y-2">
                <Label className="font-semibold">Description *</Label>
                <Controller
                  name={`${name}.description`}
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder="Describe the expense"
                      className={
                        (errors[name] as any)?.description ? "border-red-500" : ""
                      }
                    />
                  )}
                />
                {(errors[name] as any)?.description && (
                  <p className="text-sm text-red-500">
                    {(errors[name] as any)?.description?.message}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleNextClick(e as any); }} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Money You Pay (Expenses)</h2>
        <p className="text-muted-foreground">
          Tell us about your regular expenses.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderExpenseField(
            "childCare",
            "Do you pay for child care?",
            "If yes: Amount & Frequency"
          )}

          {renderExpenseField(
            "childSupport",
            "Do you pay child support?",
            "If yes: Amount & Frequency"
          )}

          {renderExpenseField(
            "healthCosts",
            "Do you pay health costs because you are older or have a disability?",
            "If yes: Amount & Frequency"
          )}

          {renderExpenseField(
            "other",
            "Do you have any other regular expenses you want to tell us about?",
            "If yes: Amount, Frequency & Description"
          )}

          <div className="space-y-4 pt-4 border-t">
            <FileInput
              label="Can you upload proof of rent or bills?"
              accept="image/*,.pdf"
              onFileChange={(file) => setValue("proofOfRent", file)}
            />
            <FileInput
              label="Can you upload proof of child care costs?"
              accept="image/*,.pdf"
              onFileChange={(file) => setValue("proofOfChildCare", file)}
            />
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

