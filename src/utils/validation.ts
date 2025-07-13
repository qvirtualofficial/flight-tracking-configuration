import { VARIABLES } from "@/types/event";
import type { ComparisonOperator } from "@/types/event";

const COMPARISON_OPERATORS: ComparisonOperator[] = [
  "greater_than",
  "less_than",
  "equals",
  "not_equals",
  "increased_by",
  "decreased_by",
  "changed",
  "increased",
  "decreased",
];

const ALL_VARIABLES = Object.values(VARIABLES).flatMap((category) =>
  category.map((v) => v.value),
);

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateCondition(condition: string): ValidationResult {
  const errors: string[] = [];

  if (!condition.trim()) {
    errors.push("Condition cannot be empty");
    return { isValid: false, errors };
  }

  // Extract variables from condition (between {})
  const variableMatches = condition.match(/\{([^}]+)\}/g);
  if (!variableMatches || variableMatches.length === 0) {
    errors.push("Condition must contain at least one variable in curly braces");
  } else {
    variableMatches.forEach((match) => {
      const variable = match.slice(1, -1); // Remove curly braces
      if (!ALL_VARIABLES.includes(variable)) {
        errors.push(`Unknown variable: {${variable}}`);
      }
    });
  }

  // Check for valid operators
  const hasValidOperator = COMPARISON_OPERATORS.some((op) =>
    condition.includes(op),
  );
  if (!hasValidOperator) {
    errors.push("Condition must contain a valid comparison operator");
  }

  // Basic structure validation
  const parts = condition.split(/\s+(and|or)\s+/);
  parts.forEach((part, index) => {
    if (index % 2 === 0) {
      // Should be a condition segment
      const segmentParts = part.trim().split(/\s+/);
      if (segmentParts.length < 2) {
        errors.push(`Invalid condition segment: "${part}"`);
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateMessage(message: string): ValidationResult {
  const errors: string[] = [];

  if (!message.trim()) {
    errors.push("Message cannot be empty");
    return { isValid: false, errors };
  }

  // Extract variables from message
  const variableMatches = message.match(/\{([^}]+)\}/g);
  if (variableMatches) {
    variableMatches.forEach((match) => {
      const variable = match.slice(1, -1);
      if (!ALL_VARIABLES.includes(variable)) {
        errors.push(`Unknown variable in message: {${variable}}`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateTimeout(timeout: string): ValidationResult {
  const errors: string[] = [];

  if (timeout) {
    const timeoutNum = parseInt(timeout);
    if (isNaN(timeoutNum) || timeoutNum < 0) {
      errors.push("Timeout must be a positive number");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
