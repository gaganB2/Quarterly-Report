// src/config/formConstants.js

/**
 * Reusable options for Quarter selection dropdowns.
 */
export const QUARTER_OPTIONS = [
  { value: "Q1", label: "Q1 (July – September)" },
  { value: "Q2", label: "Q2 (October – December)" },
  { value: "Q3", label: "Q3 (January – March)" },
  { value: "Q4", label: "Q4 (April – June)" },
];

/**
 * Reusable options for Academic Year selection dropdowns.
 * Spans from 2000-2001 to 2099-2100.
 */
export const YEAR_OPTIONS = Array.from({ length: 100 }, (_, i) => {
  const start = 2000 + i;
  return { value: start, label: `${start} – ${start + 1}` };
});