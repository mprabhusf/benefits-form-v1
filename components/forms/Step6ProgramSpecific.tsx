"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormStore } from "@/store/form-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

interface Step6ProgramSpecificProps {
  onNext: () => void;
  onBack: () => void;
}

export default function Step6ProgramSpecific({
  onNext,
  onBack,
}: Step6ProgramSpecificProps) {
  const { formData, updateFormData } = useFormStore();
  const selectedPrograms = formData.step1_programSelection?.programs || [];
  const householdMembers = formData.step3_household || [];

  const hasTANF = selectedPrograms.includes("TANF" as any);
  const hasTANFDiversionary = selectedPrograms.includes("TANF_DIVERSIONARY" as any);
  const hasTANFEmergency = selectedPrograms.includes("TANF_EMERGENCY" as any);
  const hasSNAP = selectedPrograms.includes("SNAP" as any);
  const hasAG = selectedPrograms.includes("AUXILIARY_GRANTS" as any);

  // TANF Section
  const tanfForm = useForm({
    defaultValues: formData.step6_programSpecific?.tanf || {
      childParentInfo: [],
    },
  });

  const { fields: tanfFields, append: appendTanf, remove: removeTanf } =
    useFieldArray({
      control: tanfForm.control,
      name: "childParentInfo",
    });

  // TANF Diversionary/Emergency
  const tanfDiversionaryForm = useForm({
    defaultValues: formData.step6_programSpecific?.tanfDiversionary || {
      emergencyNeed: false,
    },
  });

  // SNAP Section
  const snapForm = useForm({
    defaultValues: formData.step6_programSpecific?.snap || {
      headOfHousehold: "",
      mealPrepSeparation: false,
      roomersBoarders: false,
      medicalExpenses: [],
      shelterCosts: {
        rent: 0,
        propertyTax: 0,
        homeInsurance: 0,
      },
      heatingMethod: "",
      temporaryHousing: false,
    },
  });

  const { fields: medicalFields, append: appendMedical, remove: removeMedical } =
    useFieldArray({
      control: snapForm.control,
      name: "medicalExpenses",
    });

  // AG Section
  const agForm = useForm({
    defaultValues: formData.step6_programSpecific?.auxiliaryGrants || {
      livingSituation: "",
      property: [],
      vehicles: [],
      burialArrangements: {
        hasArrangements: false,
      },
      lifeInsurance: {
        hasPolicy: false,
      },
      healthInsurance: {
        hasInsurance: false,
      },
      medicare: {
        hasMedicare: false,
      },
      taxFilers: [],
      nonFilers: [],
    },
  });

  const { fields: propertyFields, append: appendProperty, remove: removeProperty } =
    useFieldArray({
      control: agForm.control,
      name: "property",
    });

  const { fields: vehicleFields, append: appendVehicle, remove: removeVehicle } =
    useFieldArray({
      control: agForm.control,
      name: "vehicles",
    });

  const onSubmit = () => {
    const programSpecific: any = {};
    if (hasTANF) {
      programSpecific.tanf = tanfForm.getValues();
    }
    if (hasTANFDiversionary || hasTANFEmergency) {
      programSpecific.tanfDiversionary = tanfDiversionaryForm.getValues();
    }
    if (hasSNAP) {
      programSpecific.snap = snapForm.getValues();
    }
    if (hasAG) {
      programSpecific.auxiliaryGrants = agForm.getValues();
    }
    updateFormData("step6_programSpecific", programSpecific);
    onNext();
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Program-Specific Sections</h2>
        <p className="text-muted-foreground">
          Complete the sections for the programs you selected.
        </p>
      </div>

      {/* TANF Section */}
      {hasTANF && (
        <Card>
          <CardHeader>
            <CardTitle>TANF Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {tanfFields.map((field, index) => (
                <Card key={field.id} className="p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Child-Parent Relationship {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTanf(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Child *</Label>
                      <Controller
                        name={`childParentInfo.${index}.childId`}
                        control={tanfForm.control}
                        render={({ field }) => (
                          <Select {...field}>
                            <option value="">Select child</option>
                            {householdMembers
                              .filter((m) => m.relationship === "Child")
                              .map((member) => (
                                <option key={member.id} value={member.id}>
                                  {member.name.first} {member.name.last}
                                </option>
                              ))}
                          </Select>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Parent *</Label>
                      <Controller
                        name={`childParentInfo.${index}.parentId`}
                        control={tanfForm.control}
                        render={({ field }) => (
                          <Select {...field}>
                            <option value="">Select parent</option>
                            {householdMembers
                              .filter((m) => m.relationship === "Self (Applicant)" || m.relationship === "Spouse")
                              .map((member) => (
                                <option key={member.id} value={member.id}>
                                  {member.name.first} {member.name.last}
                                </option>
                              ))}
                          </Select>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Immunization Status *</Label>
                      <Controller
                        name={`childParentInfo.${index}.immunizationStatus`}
                        control={tanfForm.control}
                        render={({ field }) => (
                          <Select {...field}>
                            <option value="">Select status</option>
                            <option value="up-to-date">Up to date</option>
                            <option value="partial">Partial</option>
                            <option value="not-up-to-date">Not up to date</option>
                            <option value="exempt">Exempt</option>
                          </Select>
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
                  appendTanf({
                    childId: "",
                    parentId: "",
                    immunizationStatus: "",
                  })
                }
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Child-Parent Relationship
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TANF Diversionary/Emergency */}
      {(hasTANFDiversionary || hasTANFEmergency) && (
        <Card>
          <CardHeader>
            <CardTitle>TANF Diversionary / Emergency Assistance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="font-semibold">Do you have an emergency need?</Label>
              <Controller
                name="emergencyNeed"
                control={tanfDiversionaryForm.control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value ? "yes" : "no"}
                    onChange={(val) => field.onChange(val === "yes")}
                    name="emergencyNeed"
                  >
                    <RadioGroupItem value="yes">Yes</RadioGroupItem>
                    <RadioGroupItem value="no">No</RadioGroupItem>
                  </RadioGroup>
                )}
              />
              {tanfDiversionaryForm.watch("emergencyNeed") && (
                <div className="mt-2">
                  <Label htmlFor="emergencyDescription" className="font-semibold">
                    Please describe the emergency *
                  </Label>
                  <Textarea
                    id="emergencyDescription"
                    {...tanfDiversionaryForm.register("emergencyDescription")}
                    placeholder="Describe your emergency need"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* SNAP Section */}
      {hasSNAP && (
        <Card>
          <CardHeader>
            <CardTitle>SNAP Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="headOfHousehold" className="font-semibold">
                Head of Household *
              </Label>
              <Controller
                name="headOfHousehold"
                control={snapForm.control}
                render={({ field }) => (
                  <Select id="headOfHousehold" {...field}>
                    <option value="">Select head of household</option>
                    {householdMembers.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name.first} {member.name.last}
                      </option>
                    ))}
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Controller
                name="mealPrepSeparation"
                control={snapForm.control}
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mealPrepSeparation"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="mealPrepSeparation" className="font-normal cursor-pointer">
                      Meal preparation separation
                    </Label>
                  </div>
                )}
              />
            </div>

            <div className="space-y-2">
              <Controller
                name="roomersBoarders"
                control={snapForm.control}
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="roomersBoarders"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="roomersBoarders" className="font-normal cursor-pointer">
                      Roomers or boarders in household
                    </Label>
                  </div>
                )}
              />
            </div>

            {/* Medical Expenses */}
            <div className="space-y-4">
              <Label className="font-semibold">Medical Expenses</Label>
              {medicalFields.map((field, index) => (
                <Card key={field.id} className="p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Medical Expense {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMedical(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Person *</Label>
                      <Controller
                        name={`medicalExpenses.${index}.personId`}
                        control={snapForm.control}
                        render={({ field }) => (
                          <Select {...field}>
                            <option value="">Select person</option>
                            {householdMembers.map((member) => (
                              <option key={member.id} value={member.id}>
                                {member.name.first} {member.name.last}
                              </option>
                            ))}
                          </Select>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Amount *</Label>
                      <Controller
                        name={`medicalExpenses.${index}.amount`}
                        control={snapForm.control}
                        render={({ field }) => (
                          <CurrencyInput
                            value={field.value || 0}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Description</Label>
                      <Controller
                        name={`medicalExpenses.${index}.description`}
                        control={snapForm.control}
                        render={({ field }) => (
                          <Input {...field} placeholder="Describe the medical expense" />
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
                  appendMedical({
                    personId: "",
                    amount: 0,
                    description: "",
                  })
                }
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Medical Expense
              </Button>
            </div>

            {/* Shelter Costs */}
            <div className="space-y-4">
              <Label className="font-semibold">Shelter Costs</Label>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Rent/Mortgage</Label>
                  <Controller
                    name="shelterCosts.rent"
                    control={snapForm.control}
                    render={({ field }) => (
                      <CurrencyInput
                        value={field.value || 0}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Property Tax</Label>
                  <Controller
                    name="shelterCosts.propertyTax"
                    control={snapForm.control}
                    render={({ field }) => (
                      <CurrencyInput
                        value={field.value || 0}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Home Insurance</Label>
                  <Controller
                    name="shelterCosts.homeInsurance"
                    control={snapForm.control}
                    render={({ field }) => (
                      <CurrencyInput
                        value={field.value || 0}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="heatingMethod" className="font-semibold">
                Heating Method *
              </Label>
              <Controller
                name="heatingMethod"
                control={snapForm.control}
                render={({ field }) => (
                  <Select id="heatingMethod" {...field}>
                    <option value="">Select heating method</option>
                    <option value="gas">Gas</option>
                    <option value="electric">Electric</option>
                    <option value="oil">Oil</option>
                    <option value="wood">Wood</option>
                    <option value="none">None</option>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Controller
                name="temporaryHousing"
                control={snapForm.control}
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="temporaryHousing"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="temporaryHousing" className="font-normal cursor-pointer">
                      Temporary housing
                    </Label>
                  </div>
                )}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Auxiliary Grants Section */}
      {hasAG && (
        <Card>
          <CardHeader>
            <CardTitle>Auxiliary Grants (AG) Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="livingSituation" className="font-semibold">
                Living Situation *
              </Label>
              <Controller
                name="livingSituation"
                control={agForm.control}
                render={({ field }) => (
                  <Select id="livingSituation" {...field}>
                    <option value="">Select living situation</option>
                    <option value="own-home">Own home</option>
                    <option value="rent">Renting</option>
                    <option value="family">Living with family</option>
                    <option value="institution">Institution</option>
                    <option value="other">Other</option>
                  </Select>
                )}
              />
            </div>

            {/* Property */}
            <div className="space-y-4">
              <Label className="font-semibold">Property</Label>
              {propertyFields.map((field, index) => (
                <Card key={field.id} className="p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Property {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeProperty(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Type *</Label>
                      <Controller
                        name={`property.${index}.type`}
                        control={agForm.control}
                        render={({ field }) => (
                          <Input {...field} placeholder="Real estate, land, etc." />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Value *</Label>
                      <Controller
                        name={`property.${index}.value`}
                        control={agForm.control}
                        render={({ field }) => (
                          <CurrencyInput
                            value={field.value || 0}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location *</Label>
                      <Controller
                        name={`property.${index}.location`}
                        control={agForm.control}
                        render={({ field }) => (
                          <Input {...field} placeholder="Address" />
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
                  appendProperty({
                    type: "",
                    value: 0,
                    location: "",
                  })
                }
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </div>

            {/* Vehicles */}
            <div className="space-y-4">
              <Label className="font-semibold">Vehicles</Label>
              {vehicleFields.map((field, index) => (
                <Card key={field.id} className="p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Vehicle {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeVehicle(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Make *</Label>
                      <Controller
                        name={`vehicles.${index}.make`}
                        control={agForm.control}
                        render={({ field }) => <Input {...field} />}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Model *</Label>
                      <Controller
                        name={`vehicles.${index}.model`}
                        control={agForm.control}
                        render={({ field }) => <Input {...field} />}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Year *</Label>
                      <Controller
                        name={`vehicles.${index}.year`}
                        control={agForm.control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="number"
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Value *</Label>
                      <Controller
                        name={`vehicles.${index}.value`}
                        control={agForm.control}
                        render={({ field }) => (
                          <CurrencyInput
                            value={field.value || 0}
                            onChange={field.onChange}
                          />
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
                  appendVehicle({
                    make: "",
                    model: "",
                    year: new Date().getFullYear(),
                    value: 0,
                  })
                }
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
            </div>

            {/* Burial Arrangements */}
            <div className="space-y-2">
              <Label className="font-semibold">Burial Arrangements</Label>
              <Controller
                name="burialArrangements.hasArrangements"
                control={agForm.control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value ? "yes" : "no"}
                    onChange={(val) => field.onChange(val === "yes")}
                    name="burialArrangements"
                  >
                    <RadioGroupItem value="yes">Yes</RadioGroupItem>
                    <RadioGroupItem value="no">No</RadioGroupItem>
                  </RadioGroup>
                )}
              />
              {agForm.watch("burialArrangements.hasArrangements") && (
                <div className="mt-2">
                  <Label>Value</Label>
                  <Controller
                    name="burialArrangements.value"
                    control={agForm.control}
                    render={({ field }) => (
                      <CurrencyInput
                        value={field.value || 0}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              )}
            </div>

            {/* Life Insurance */}
            <div className="space-y-2">
              <Label className="font-semibold">Life Insurance</Label>
              <Controller
                name="lifeInsurance.hasPolicy"
                control={agForm.control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value ? "yes" : "no"}
                    onChange={(val) => field.onChange(val === "yes")}
                    name="lifeInsurance"
                  >
                    <RadioGroupItem value="yes">Yes</RadioGroupItem>
                    <RadioGroupItem value="no">No</RadioGroupItem>
                  </RadioGroup>
                )}
              />
              {agForm.watch("lifeInsurance.hasPolicy") && (
                <div className="mt-2">
                  <Label>Value</Label>
                  <Controller
                    name="lifeInsurance.value"
                    control={agForm.control}
                    render={({ field }) => (
                      <CurrencyInput
                        value={field.value || 0}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              )}
            </div>

            {/* Health Insurance */}
            <div className="space-y-2">
              <Label className="font-semibold">Health Insurance</Label>
              <Controller
                name="healthInsurance.hasInsurance"
                control={agForm.control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value ? "yes" : "no"}
                    onChange={(val) => field.onChange(val === "yes")}
                    name="healthInsurance"
                  >
                    <RadioGroupItem value="yes">Yes</RadioGroupItem>
                    <RadioGroupItem value="no">No</RadioGroupItem>
                  </RadioGroup>
                )}
              />
              {agForm.watch("healthInsurance.hasInsurance") && (
                <div className="mt-2">
                  <Label>Provider</Label>
                  <Controller
                    name="healthInsurance.provider"
                    control={agForm.control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Insurance provider name" />
                    )}
                  />
                </div>
              )}
            </div>

            {/* Medicare */}
            <div className="space-y-2">
              <Label className="font-semibold">Medicare</Label>
              <Controller
                name="medicare.hasMedicare"
                control={agForm.control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value ? "yes" : "no"}
                    onChange={(val) => field.onChange(val === "yes")}
                    name="medicare"
                  >
                    <RadioGroupItem value="yes">Yes</RadioGroupItem>
                    <RadioGroupItem value="no">No</RadioGroupItem>
                  </RadioGroup>
                )}
              />
              {agForm.watch("medicare.hasMedicare") && (
                <div className="mt-2">
                  <Label>Medicare Parts</Label>
                  <Controller
                    name="medicare.parts"
                    control={agForm.control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        {["Part A", "Part B", "Part C", "Part D"].map((part) => (
                          <div key={part} className="flex items-center space-x-2">
                            <Checkbox
                              id={`medicare-${part}`}
                              checked={field.value?.includes(part)}
                              onCheckedChange={(checked) => {
                                const current = field.value || [];
                                if (checked) {
                                  field.onChange([...current, part]);
                                } else {
                                  field.onChange(current.filter((p) => p !== part));
                                }
                              }}
                            />
                            <Label
                              htmlFor={`medicare-${part}`}
                              className="font-normal cursor-pointer"
                            >
                              {part}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  />
                </div>
              )}
            </div>

            {/* Tax Filers */}
            <div className="space-y-4">
              <Label className="font-semibold">Tax Information</Label>
              <div className="space-y-2">
                <Label>Tax Filers</Label>
                <Controller
                  name="taxFilers"
                  control={agForm.control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      {householdMembers.map((member) => (
                        <div key={member.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`taxFiler-${member.id}`}
                            checked={field.value?.includes(member.id)}
                            onCheckedChange={(checked) => {
                              const current = field.value || [];
                              if (checked) {
                                field.onChange([...current, member.id]);
                              } else {
                                field.onChange(current.filter((id) => id !== member.id));
                              }
                            }}
                          />
                          <Label
                            htmlFor={`taxFiler-${member.id}`}
                            className="font-normal cursor-pointer"
                          >
                            {member.name.first} {member.name.last}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>Non-Filers</Label>
                <Controller
                  name="nonFilers"
                  control={agForm.control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      {householdMembers.map((member) => (
                        <div key={member.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`nonFiler-${member.id}`}
                            checked={field.value?.includes(member.id)}
                            onCheckedChange={(checked) => {
                              const current = field.value || [];
                              if (checked) {
                                field.onChange([...current, member.id]);
                              } else {
                                field.onChange(current.filter((id) => id !== member.id));
                              }
                            }}
                          />
                          <Label
                            htmlFor={`nonFiler-${member.id}`}
                            className="font-normal cursor-pointer"
                          >
                            {member.name.first} {member.name.last}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>
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

