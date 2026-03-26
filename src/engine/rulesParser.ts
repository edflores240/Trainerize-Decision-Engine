/**
 * @file rulesParser.ts
 * @description Parses the logic-matrix.json rules into a sorted, engine-ready format.
 *
 * KEY DESIGN:
 * - Rules are sorted by `priority` (descending). The FIRST matching rule wins.
 * - Wildcard "*" in a condition means "match ANY value".
 * - Arrays in conditions mean "match ANY value in this list".
 * - This parser is the ONLY place that needs updating if the JSON schema changes.
 *
 * To update logic without touching engine code: edit logic-matrix.json only.
 */

import type { LogicMatrix, Rule, SurveyInput } from './types';

/** A parsed rule with a compiled match function for fast evaluation */
export interface ParsedRule {
  id: string;
  priority: number;
  description: string;
  match: (input: SurveyInput) => boolean;
  results: Rule['results'];
}

/**
 * Checks whether a single condition field matches the input value.
 * Handles three condition formats:
 *   - "*"         → wildcard, always matches
 *   - string[]    → matches if input value is in the array
 *   - string      → exact match
 */
function fieldMatches<T extends string>(
  conditionValue: T | T[] | '*',
  inputValue: T
): boolean {
  if (conditionValue === '*') return true;
  if (Array.isArray(conditionValue)) return conditionValue.includes(inputValue);
  return conditionValue === inputValue;
}

/**
 * Parses a LogicMatrix object into an array of ParsedRules sorted by priority (desc).
 *
 * @param matrix - The raw logic-matrix.json object
 * @returns Sorted array of ParsedRule objects ready to be evaluated by triageEngine
 *
 * @example
 * import matrixJson from './logic-matrix.json';
 * const rules = parseRules(matrixJson);
 */
export function parseRules(matrix: LogicMatrix): ParsedRule[] {
  const parsed: ParsedRule[] = matrix.rules.map((rule) => ({
    id: rule.id,
    priority: rule.priority,
    description: rule.description,
    results: rule.results,
    match: (input: SurveyInput): boolean => {
      return (
        fieldMatches(rule.conditions.risk, input.risk) &&
        fieldMatches(rule.conditions.modifier, input.modifier) &&
        fieldMatches(rule.conditions.setting, input.setting) &&
        fieldMatches(rule.conditions.goal, input.goal)
      );
    },
  }));

  // Sort descending by priority — highest priority rules are evaluated first
  return parsed.sort((a, b) => b.priority - a.priority);
}
