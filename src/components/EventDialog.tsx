import { useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { VARIABLES } from "@/types/event";
import type { TrackingEvent, ComparisonOperator } from "@/types/event";

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: TrackingEvent;
  onSave: (event: Omit<TrackingEvent, "id">) => void;
}

interface FormData {
  condition: string;
  message: string;
  hasInitialValue: boolean;
  initialValue: boolean;
  timeout: string;
  // Builder fields
  selectedVariable: string;
  selectedOperator: ComparisonOperator;
  comparisonValue: string;
  useBuilder: boolean;
}

const OPERATORS: {
  value: ComparisonOperator;
  label: string;
  requiresValue: boolean;
}[] = [
  { value: "equals", label: "equals", requiresValue: true },
  { value: "not_equals", label: "not equals", requiresValue: true },
  { value: "greater_than", label: "greater than", requiresValue: true },
  { value: "less_than", label: "less than", requiresValue: true },
  { value: "increased_by", label: "increased by", requiresValue: true },
  { value: "decreased_by", label: "decreased by", requiresValue: true },
  { value: "changed", label: "changed", requiresValue: false },
  { value: "increased", label: "increased", requiresValue: false },
  { value: "decreased", label: "decreased", requiresValue: false },
];

function EventDialog({ open, onOpenChange, event, onSave }: EventDialogProps) {
  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    defaultValues: {
      condition: "",
      message: "",
      hasInitialValue: false,
      initialValue: false,
      timeout: "",
      selectedVariable: "",
      selectedOperator: "equals",
      comparisonValue: "",
      useBuilder: true,
    },
  });

  // Watch form values
  const useBuilder = watch("useBuilder");
  const selectedVariable = watch("selectedVariable");
  const selectedOperator = watch("selectedOperator");
  const comparisonValue = watch("comparisonValue");
  const hasInitialValue = watch("hasInitialValue");

  // Reset form when dialog opens with event data
  useEffect(() => {
    if (!open) return;
    
    // Use setTimeout to avoid flashing
    const timeoutId = setTimeout(() => {
      if (event) {
        reset({
          condition: event.condition,
          message: event.message,
          hasInitialValue: event.initialValue !== undefined,
          initialValue: event.initialValue || false,
          timeout: event.timeout?.toString() || "",
          useBuilder: false,
          selectedVariable: "",
          selectedOperator: "equals",
          comparisonValue: "",
        });
      } else {
        reset({
          condition: "",
          message: "",
          hasInitialValue: false,
          initialValue: false,
          timeout: "",
          useBuilder: true,
          selectedVariable: "",
          selectedOperator: "equals",
          comparisonValue: "",
        });
      }
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, [open, event, reset]);

  // Build condition from builder fields
  const buildCondition = useCallback(() => {
    if (!selectedVariable || !selectedOperator) return "";

    const operator = OPERATORS.find((op) => op.value === selectedOperator);
    let condition = `{${selectedVariable}} ${selectedOperator}`;

    if (operator?.requiresValue && comparisonValue) {
      const isStringValue =
        isNaN(Number(comparisonValue)) || comparisonValue.includes(" ");
      condition += ` ${isStringValue ? `'${comparisonValue}'` : comparisonValue}`;
    }

    return condition;
  }, [selectedVariable, selectedOperator, comparisonValue]);

  // Update condition when builder values change
  useEffect(() => {
    if (useBuilder) {
      setValue("condition", buildCondition(), { shouldDirty: true });
    }
  }, [useBuilder, buildCondition, setValue]);

  // Handle form submission
  const onSubmit = (data: FormData) => {
    const eventData: Omit<TrackingEvent, "id"> = {
      condition: data.condition,
      message: data.message,
    };

    if (data.hasInitialValue) {
      eventData.initialValue = data.initialValue;
    }

    if (data.timeout) {
      eventData.timeout = parseInt(data.timeout);
    }

    onSave(eventData);
    onOpenChange(false);
  };

  // Handle dialog close attempt
  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
  };

  // Validation rules
  const validateCondition = (value: string) => {
    if (!value.trim()) return "Condition is required";
    if (!value.includes("{") || !value.includes("}")) {
      return "Condition must contain at least one variable in curly braces";
    }
    return true;
  };

  const validateMessage = (value: string) => {
    if (!value.trim()) return "Message is required";
    return true;
  };

  const validateTimeout = (value: string) => {
    if (value && (isNaN(Number(value)) || Number(value) < 0)) {
      return "Timeout must be a positive number";
    }
    return true;
  };

  const allVariables = Object.values(VARIABLES).flat();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{event ? "Edit Event" : "Add Event"}</DialogTitle>
            <DialogDescription>
              Configure a flight tracking event with conditions and messages
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Condition */}
            <div className="space-y-2">
              <Label>Condition</Label>
              {useBuilder ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Controller
                      name="selectedVariable"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select variable..." />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(VARIABLES).map(([category, vars]) => (
                              <div key={category}>
                                <div className="px-2 py-1 text-sm font-semibold text-muted-foreground capitalize">
                                  {category}
                                </div>
                                {vars.map((v) => (
                                  <SelectItem key={v.value} value={v.value}>
                                    {v.label}
                                  </SelectItem>
                                ))}
                              </div>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />

                    <Controller
                      name="selectedOperator"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-[150px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {OPERATORS.map((op) => (
                              <SelectItem key={op.value} value={op.value}>
                                {op.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />

                    {OPERATORS.find((op) => op.value === selectedOperator)
                      ?.requiresValue && (
                      <Input
                        className="w-[150px]"
                        placeholder="Value..."
                        {...register("comparisonValue")}
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      {...register("condition", { validate: validateCondition })}
                      placeholder="e.g., {altitude} greater_than 10000"
                      className="font-mono"
                      readOnly
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setValue("useBuilder", false)}
                    >
                      Manual
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    {...register("condition", { validate: validateCondition })}
                    placeholder="e.g., {altitude} greater_than 10000"
                    className="font-mono"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setValue("useBuilder", true)}
                  >
                    Builder
                  </Button>
                </div>
              )}
              {errors.condition && (
                <p className="text-sm text-destructive mt-1">
                  {errors.condition.message}
                </p>
              )}
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                {...register("message", { validate: validateMessage })}
                placeholder="e.g., Climbing through {altitude} feet at {vs} fpm"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Use {"{"}variable{"}"} to insert values. Available:{" "}
                {allVariables
                  .slice(0, 5)
                  .map((v) => v.value)
                  .join(", ")}
                ...
              </p>
              {errors.message && (
                <p className="text-sm text-destructive">{errors.message.message}</p>
              )}
            </div>

            {/* Optional fields */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Controller
                  name="hasInitialValue"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="hasInitialValue"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="hasInitialValue">Set initial value</Label>
              </div>

              {hasInitialValue && (
                <div className="flex items-center space-x-2 ml-6">
                  <Controller
                    name="initialValue"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="initialValue"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor="initialValue">Initial value is true</Label>
                </div>
              )}

              <div className="space-y-2">
                <Label>Timeout (milliseconds)</Label>
                <Input
                  type="number"
                  {...register("timeout", { validate: validateTimeout })}
                  placeholder="e.g., 5000"
                />
                <p className="text-xs text-muted-foreground">
                  Prevents rapid repeated logging by waiting for condition to
                  remain true
                </p>
                {errors.timeout && (
                  <p className="text-sm text-destructive">{errors.timeout.message}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            {isDirty && (
              <p className="text-sm text-muted-foreground mr-auto">
                You have unsaved changes
              </p>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { EventDialog };