export interface DataRow {
  [key: string]: string | number | boolean | null;
}

export type ChartType = 'bar' | 'horizontalBar' | 'line' | 'scatter' | 'doughnut' | 'stackedBar' | 'radar';
export type AggregationMode = 'count' | 'avg' | 'sum';

export interface ChartConfiguration {
  type: ChartType;
  xAxisKey: string;
  yAxisKey: string;
  aggregation: AggregationMode;
}

export const CHART_TYPES: { value: ChartType; label: string }[] = [
  { value: 'bar', label: 'Vertical Bar (Comparison)' },
  { value: 'horizontalBar', label: 'Horizontal Bar (Long Labels)' },
  { value: 'doughnut', label: 'Doughnut (Proportions)' },
  { value: 'scatter', label: 'Scatter Plot (Correlation)' },
  { value: 'stackedBar', label: 'Stacked Bar (Churn Analysis)' },
  { value: 'radar', label: 'Radar Chart (Profile)' },
];

export const AGGREGATION_TYPES: { value: AggregationMode; label: string }[] = [
  { value: 'count', label: 'Count of Rows (Frequency)' },
  { value: 'sum', label: 'Sum of Values' },
  { value: 'avg', label: 'Average of Values' },
];

export const CHART_COLORS = [
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#f97316', // Orange
];