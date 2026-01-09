"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { programSelectionSchema, type ProgramSelection } from "@/lib/schemas";
import { useFormStore } from "@/store/form-store";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const PROGRAMS = [
  { value: "SNAP", label: "SNAP (Food Stamps)" },
  { value: "TANF", label: "TANF" },
  { value: "TANF_DIVERSIONARY", label: "TANF Diversionary Assistance" },
  { value: "TANF_EMERGENCY", label: "TANF Emergency Assistance" },
  { value: "AUXILIARY_GRANTS", label: "Auxiliary Grants (AG)" },
  { value: "GENERAL_RELIEF", label: "General Relief (GR)" },
  { value: "REFUGEE_CASH_ASSISTANCE", label: "Refugee Cash Assistance (RCA)" },
] as const;

interface Step1ProgramSelectionProps {
  onNext: () => void;
}

export default function Step1ProgramSelection({ onNext }: Step1ProgramSelectionProps) {
  const { formData, updateFormData } = useFormStore();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProgramSelection>({
    resolver: zodResolver(programSelectionSchema),
    defaultValues: formData.step1_programSelection || {
      programs: [],
      tanfNoSnap: false,
    },
  });

  const selectedPrograms = watch("programs");
  const tanfNoSnap = watch("tanfNoSnap");

  const onSubmit = (data: ProgramSelection) => {
    updateFormData("step1_programSelection", data);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Program Selection & Orientation</h2>
        <p className="text-muted-foreground">
          Select the programs you want to apply for. Note: An application for TANF will be treated as an application for SNAP unless you indicate otherwise.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Programs</CardTitle>
          <CardDescription>
            Check all programs you wish to apply for
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Controller
            name="programs"
            control={control}
            render={({ field }) => (
              <div className="space-y-3">
                {PROGRAMS.map((program) => (
                  <div key={program.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`program-${program.value}`}
                      checked={field.value?.includes(program.value as any)}
                      onCheckedChange={(checked) => {
                        const current = field.value || [];
                        if (checked) {
                          field.onChange([...current, program.value as any]);
                        } else {
                          field.onChange(
                            current.filter((p) => p !== program.value)
                          );
                        }
                      }}
                    />
                    <Label
                      htmlFor={`program-${program.value}`}
                      className="font-normal cursor-pointer flex-1"
                    >
                      {program.label}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          />
          {errors.programs && (
            <p className="text-sm text-red-500">{errors.programs.message}</p>
          )}

          {selectedPrograms?.includes("TANF" as any) && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center space-x-2">
                <Controller
                  name="tanfNoSnap"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Checkbox
                        id="tanf-no-snap"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <Label
                        htmlFor="tanf-no-snap"
                        className="font-normal cursor-pointer"
                      >
                        TANF – No SNAP (I do not want to apply for SNAP)
                      </Label>
                    </>
                  )}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Accordion type="single" collapsible>
        <AccordionItem value="nondiscrimination">
          <AccordionTrigger value="nondiscrimination">
            View Civil Rights & Non-Discrimination Policy
          </AccordionTrigger>
          <AccordionContent value="nondiscrimination">
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Nondiscrimination Statement</h4>
                <p>
                  In accordance with federal civil rights law and U.S. Department of Agriculture (USDA) civil rights regulations and policies, 
                  the USDA, its Agencies, offices, and employees, and institutions participating in or administering USDA programs are prohibited 
                  from discriminating based on race, color, national origin, sex, disability, age, or reprisal or retaliation for prior civil rights 
                  activity in any program or activity conducted or funded by USDA.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Civil Rights</h4>
                <p>
                  Persons with disabilities who require alternative means of communication for program information (e.g., Braille, large print, 
                  audiotape, American Sign Language, etc.) should contact the Agency (State or local) where they applied for benefits. 
                  Individuals who are deaf, hard of hearing or have speech disabilities may contact USDA through the Federal Relay Service at (800) 877-8339.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end pt-4">
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}

