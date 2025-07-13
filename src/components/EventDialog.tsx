import { useEffect, useCallback, useMemo, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
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
import { Plus, GripVertical, Trash2 } from "lucide-react";
import { VARIABLES } from "@/types/event";
import type { TrackingEvent, ComparisonOperator } from "@/types/event";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: TrackingEvent;
  onSave: (event: Omit<TrackingEvent, "id">) => void;
}

interface ConditionPart {
  id: string;
  variable: string;
  operator: ComparisonOperator;
  value: string;
  joiner?: "and" | "or";
}

interface FormData {
  message: string;
  hasInitialValue: boolean;
  initialValue: boolean;
  timeout: string;
  mode: "builder" | "manual";
  manualCondition: string;
  conditions: ConditionPart[];
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

// Sortable condition item
function SortableConditionItem({
  condition,
  index,
  isLast,
  control,
  register,
  remove,
  update,
}: {
  condition: ConditionPart;
  index: number;
  isLast: boolean;
  control: any;
  register: any;
  remove: (index: number) => void;
  update: (index: number, data: any) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: condition.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const selectedOperator = condition.operator;
  const requiresValue = OPERATORS.find(
    (op) => op.value === selectedOperator,
  )?.requiresValue;

  return (
    <div ref={setNodeRef} style={style} className="space-y-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>

        <Controller
          name={`conditions.${index}.variable`}
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
          name={`conditions.${index}.operator`}
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                // Clear value if operator doesn't require it
                const newRequiresValue = OPERATORS.find(
                  (op) => op.value === value,
                )?.requiresValue;
                if (!newRequiresValue) {
                  update(index, { ...condition, operator: value, value: "" });
                }
              }}
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
          )}
        />

        {requiresValue && (
          <Input
            className="w-[150px]"
            placeholder="Value..."
            {...register(`conditions.${index}.value`)}
          />
        )}

        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => remove(index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {!isLast && (
        <div className="flex items-center gap-2 ml-6">
          <Label className="text-sm">Join with:</Label>
          <Controller
            name={`conditions.${index}.joiner`}
            control={control}
            render={({ field }) => (
              <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
                <button
                  type="button"
                  onClick={() => field.onChange("and")}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    field.value === "and"
                      ? "bg-background text-foreground shadow-sm"
                      : "hover:bg-background/10"
                  }`}
                >
                  AND
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange("or")}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    field.value === "or"
                      ? "bg-background text-foreground shadow-sm"
                      : "hover:bg-background/10"
                  }`}
                >
                  OR
                </button>
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
}

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
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      message: "",
      hasInitialValue: false,
      initialValue: false,
      timeout: "",
      mode: "builder",
      manualCondition: "",
      conditions: [
        {
          id: Date.now().toString(),
          variable: "",
          operator: "equals",
          value: "",
          joiner: "and",
        },
      ],
    },
  });

  const { fields, append, remove, move, update } = useFieldArray({
    control,
    name: "conditions",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const mode = watch("mode");
  const conditions = watch("conditions");
  const hasInitialValue = watch("hasInitialValue");

  // Parse condition string to conditions array
  const parseCondition = useCallback(
    (conditionStr: string): ConditionPart[] => {
      const parts: ConditionPart[] = [];
      const regex =
        /\{([^}]+)\}\s+(\w+)(?:\s+('(?:[^'])*'|[^\s]+))?\s*(and|or)?/gi;
      let match;
      let index = 0;

      while ((match = regex.exec(conditionStr)) !== null) {
        const [, variable, operator, value, joiner] = match;
        parts.push({
          id: Date.now().toString() + index++,
          variable,
          operator: operator as ComparisonOperator,
          value: value ? value.replace(/'/g, "") : "",
          joiner: joiner as "and" | "or" | undefined,
        });
      }

      return parts.length > 0
        ? parts
        : [
            {
              id: Date.now().toString(),
              variable: "",
              operator: "equals",
              value: "",
              joiner: "and",
            },
          ];
    },
    [],
  );

  // Build condition string from conditions array
  const buildConditionString = useCallback(
    (conditions: ConditionPart[]): string => {
      return conditions
        .map((condition, index) => {
          let str = `{${condition.variable}} ${condition.operator}`;

          const operator = OPERATORS.find(
            (op) => op.value === condition.operator,
          );
          if (operator?.requiresValue && condition.value) {
            const isStringValue =
              isNaN(Number(condition.value)) || condition.value.includes(" ");
            str += ` ${isStringValue ? `'${condition.value}'` : condition.value}`;
          }

          if (index < conditions.length - 1 && condition.joiner) {
            str += ` ${condition.joiner}`;
          }

          return str;
        })
        .join(" ");
    },
    [],
  );

  // Sync between builder and manual modes
  useEffect(() => {
    if (mode === "manual" && conditions.length > 0) {
      const conditionString = buildConditionString(conditions);
      setValue("manualCondition", conditionString, { shouldValidate: false });
    }
  }, [mode, conditions, buildConditionString, setValue]);

  // Parse manual condition when switching to builder
  useEffect(() => {
    if (mode === "builder" && watch("manualCondition")) {
      const parsed = parseCondition(watch("manualCondition"));
      setValue("conditions", parsed, { shouldValidate: false });
    }
  }, [mode, parseCondition, setValue, watch]);

  // Reset form when dialog opens
  useEffect(() => {
    if (!open) return;

    const timeoutId = setTimeout(() => {
      if (event) {
        const parsedConditions = parseCondition(event.condition);
        reset({
          message: event.message,
          hasInitialValue: event.initialValue !== undefined,
          initialValue: event.initialValue || false,
          timeout: event.timeout?.toString() || "",
          mode: "manual",
          manualCondition: event.condition,
          conditions: parsedConditions,
        });
      } else {
        reset({
          message: "",
          hasInitialValue: false,
          initialValue: false,
          timeout: "",
          mode: "builder",
          manualCondition: "",
          conditions: [
            {
              id: Date.now().toString(),
              variable: "",
              operator: "equals",
              value: "",
              joiner: "and",
            },
          ],
        });
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [open, event, reset, parseCondition]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);
      move(oldIndex, newIndex);
    }
  };

  const onSubmit = (data: FormData) => {
    const condition =
      data.mode === "builder"
        ? buildConditionString(data.conditions)
        : data.manualCondition;

    const eventData: Omit<TrackingEvent, "id"> = {
      condition,
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

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
  };

  // Validation
  const validateCondition = useCallback((value: string) => {
    if (!value.trim()) return "Condition is required";
    if (!value.includes("{") || !value.includes("}")) {
      return "Condition must contain at least one variable in curly braces";
    }
    return true;
  }, []);

  const validateMessage = useCallback((value: string) => {
    if (!value.trim()) return "Message is required";
    return true;
  }, []);

  const validateTimeout = useCallback((value: string) => {
    if (value && (isNaN(Number(value)) || Number(value) < 0)) {
      return "Timeout must be a positive number";
    }
    return true;
  }, []);

  const allVariables = useMemo(() => Object.values(VARIABLES).flat(), []);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-full sm:max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{event ? "Edit Event" : "Add Event"}</DialogTitle>
            <DialogDescription>
              Configure a flight tracking event with conditions and messages
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Condition Mode Toggle */}
            <div className="flex items-center justify-between">
              <Label>Condition</Label>
              <Controller
                name="mode"
                control={control}
                render={({ field }) => (
                  <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
                    <button
                      type="button"
                      onClick={() => field.onChange("builder")}
                      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                        field.value === "builder"
                          ? "bg-background text-foreground shadow-sm"
                          : "hover:bg-background/10"
                      }`}
                    >
                      Builder
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange("manual")}
                      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                        field.value === "manual"
                          ? "bg-background text-foreground shadow-sm"
                          : "hover:bg-background/10"
                      }`}
                    >
                      Manual
                    </button>
                  </div>
                )}
              />
            </div>

            {/* Builder Mode */}
            {mode === "builder" ? (
              <div className="space-y-3">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={fields.map((f) => f.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {fields.map((field, index) => (
                      <SortableConditionItem
                        key={field.id}
                        condition={field}
                        index={index}
                        isLast={index === fields.length - 1}
                        control={control}
                        register={register}
                        remove={remove}
                        update={update}
                      />
                    ))}
                  </SortableContext>
                </DndContext>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      id: Date.now().toString(),
                      variable: "",
                      operator: "equals",
                      value: "",
                      joiner: "and",
                    })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Condition
                </Button>
              </div>
            ) : (
              /* Manual Mode */
              <div className="space-y-2">
                <Input
                  {...register("manualCondition", {
                    validate: validateCondition,
                  })}
                  placeholder="e.g., {altitude} greater_than 10000 and {vs} greater_than 500"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Enter condition manually. Use 'and' or 'or' to combine
                  multiple conditions.
                </p>
                {errors.manualCondition && (
                  <p className="text-sm text-destructive">
                    {errors.manualCondition.message}
                  </p>
                )}
              </div>
            )}

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
                <p className="text-sm text-destructive">
                  {errors.message.message}
                </p>
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
                  <p className="text-sm text-destructive">
                    {errors.timeout.message}
                  </p>
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
