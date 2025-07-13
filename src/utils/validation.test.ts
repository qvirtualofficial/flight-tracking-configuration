import { describe, it, expect } from 'vitest';
import { validateCondition, validateMessage, validateTimeout } from './validation';

describe('validateCondition', () => {
  it('validates valid conditions', () => {
    const result = validateCondition('{altitude} greater_than 10000');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('validates conditions with logical operators', () => {
    const result = validateCondition('{altitude} greater_than 10000 and {ias} less_than 250');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('validates string comparisons', () => {
    const result = validateCondition("{phase} equals 'CRUISE'");
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects empty conditions', () => {
    const result = validateCondition('');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Condition cannot be empty');
  });

  it('rejects conditions without variables', () => {
    const result = validateCondition('altitude greater_than 10000');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Condition must contain at least one variable in curly braces');
  });

  it('rejects unknown variables', () => {
    const result = validateCondition('{unknownVar} equals 5');
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('Unknown variable: {unknownVar}');
  });

  it('rejects conditions without operators', () => {
    const result = validateCondition('{altitude} 10000');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Condition must contain a valid comparison operator');
  });
});

describe('validateMessage', () => {
  it('validates valid messages', () => {
    const result = validateMessage('Climbing through {altitude} feet');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('validates messages without variables', () => {
    const result = validateMessage('Engine started');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects empty messages', () => {
    const result = validateMessage('');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Message cannot be empty');
  });

  it('rejects messages with unknown variables', () => {
    const result = validateMessage('Altitude is {unknownVar}');
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('Unknown variable in message: {unknownVar}');
  });
});

describe('validateTimeout', () => {
  it('validates valid timeouts', () => {
    const result = validateTimeout('5000');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('validates empty timeout', () => {
    const result = validateTimeout('');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects negative timeouts', () => {
    const result = validateTimeout('-100');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Timeout must be a positive number');
  });

  it('rejects non-numeric timeouts', () => {
    const result = validateTimeout('abc');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Timeout must be a positive number');
  });
});