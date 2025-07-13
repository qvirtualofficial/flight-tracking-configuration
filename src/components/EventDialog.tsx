import { useState, useEffect, useCallback } from "react";
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
import {
  validateCondition,
  validateMessage,
  validateTimeout,
} from "@/utils/validation";

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: TrackingEvent;
  onSave: (event: Omit<TrackingEvent, "id">) => void;
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
  const [condition, setCondition] = useState("");
  const [message, setMessage] = useState("");
  const [initialValue, setInitialValue] = useState(false);
  const [hasInitialValue, setHasInitialValue] = useState(false);
  const [timeout, setTimeout] = useState("");

  // Condition builder state
  const [selectedVariable, setSelectedVariable] = useState("");
  const [selectedOperator, setSelectedOperator] =
    useState<ComparisonOperator>("equals");
  const [comparisonValue, setComparisonValue] = useState("");
  const [useBuilder, setUseBuilder] = useState(true);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (event) {
      setCondition(event.condition);
      setMessage(event.message);
      setInitialValue(event.initialValue || false);
      setHasInitialValue(event.initialValue !== undefined);
      setTimeout(event.timeout?.toString() || "");
      setUseBuilder(false);
    } else {
      setCondition("");
      setMessage("");
      setInitialValue(false);
      setHasInitialValue(false);
      setTimeout("");
      setUseBuilder(true);
    }
    setErrors({});
  }, [event, open]);

  const buildCondition = useCallback(() => {
    if (!selectedVariable || !selectedOperator) return "";

    const operator = OPERATORS.find((op) => op.value === selectedOperator);
    let condition = `{${selectedVariable}} ${selectedOperator}`;

    if (operator?.requiresValue && comparisonValue) {
      // Check if value should be quoted (string comparison)
      const isStringValue =
        isNaN(Number(comparisonValue)) || comparisonValue.includes(" ");
      condition += ` ${isStringValue ? `'${comparisonValue}'` : comparisonValue}`;
    }

    return condition;
  }, [selectedVariable, selectedOperator, comparisonValue]);

  useEffect(() => {
    if (useBuilder) {
      setCondition(buildCondition());
    }
  }, [selectedVariable, selectedOperator, comparisonValue, useBuilder, buildCondition]);

  const handleSave = () => {
    // Validate all fields
    const newErrors: Record<string, string[]> = {};

    const conditionValidation = validateCondition(condition);
    if (!conditionValidation.isValid) {
      newErrors.condition = conditionValidation.errors;
    }

    const messageValidation = validateMessage(message);
    if (!messageValidation.isValid) {
      newErrors.message = messageValidation.errors;
    }

    const timeoutValidation = validateTimeout(timeout);
    if (!timeoutValidation.isValid) {
      newErrors.timeout = timeoutValidation.errors;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const eventData: Omit<TrackingEvent, "id"> = {
      condition,
      message,
    };

    if (hasInitialValue) {
      eventData.initialValue = initialValue;
    }

    if (timeout) {
      eventData.timeout = parseInt(timeout);
    }

    onSave(eventData);
    onOpenChange(false);
  };

  const allVariables = Object.values(VARIABLES).flat();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Add Event"}</DialogTitle>
          <DialogDescription>
            Configure a flight tracking event with conditions and messages
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Condition */}
          <div className="space-y-2">
            <Label>Condition</Label>
            {useBuilder ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Select
                    value={selectedVariable}
                    onValueChange={setSelectedVariable}
                  >
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

                  <Select
                    value={selectedOperator}
                    onValueChange={(v) =>
                      setSelectedOperator(v as ComparisonOperator)
                    }
                  >
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

                  {OPERATORS.find((op) => op.value === selectedOperator)
                    ?.requiresValue && (
                    <Input
                      className="w-[150px]"
                      placeholder="Value..."
                      value={comparisonValue}
                      onChange={(e) => setComparisonValue(e.target.value)}
                    />
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    placeholder="e.g., {altitude} greater_than 10000"
                    className="font-mono"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setUseBuilder(!useBuilder)}
                  >
                    {useBuilder ? "Manual" : "Builder"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  placeholder="e.g., {altitude} greater_than 10000"
                  className="font-mono"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setUseBuilder(!useBuilder)}
                >
                  Builder
                </Button>
              </div>
            )}
            {errors.condition && (
              <p className="text-sm text-destructive mt-1">
                {errors.condition[0]}
              </p>
            )}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
              <p className="text-sm text-destructive">{errors.message[0]}</p>
            )}
          </div>

          {/* Optional fields */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasInitialValue"
                checked={hasInitialValue}
                onCheckedChange={(checked) =>
                  setHasInitialValue(checked as boolean)
                }
              />
              <Label htmlFor="hasInitialValue">Set initial value</Label>
            </div>

            {hasInitialValue && (
              <div className="flex items-center space-x-2 ml-6">
                <Checkbox
                  id="initialValue"
                  checked={initialValue}
                  onCheckedChange={(checked) =>
                    setInitialValue(checked as boolean)
                  }
                />
                <Label htmlFor="initialValue">Initial value is true</Label>
              </div>
            )}

            <div className="space-y-2">
              <Label>Timeout (milliseconds)</Label>
              <Input
                type="number"
                value={timeout}
                onChange={(e) => setTimeout(e.target.value)}
                placeholder="e.g., 5000"
              />
              <p className="text-xs text-muted-foreground">
                Prevents rapid repeated logging by waiting for condition to
                remain true
              </p>
              {errors.timeout && (
                <p className="text-sm text-destructive">{errors.timeout[0]}</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!condition || !message}>
            Save Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { EventDialog };
