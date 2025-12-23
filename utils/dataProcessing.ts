import _ from 'lodash';
import { DataRow, AggregationMode } from '../types';

// Standard aggregation for Bar/Line/Doughnut
export const processAggregatedData = (
  data: DataRow[], 
  groupByColumn: string, 
  valueColumn: string, 
  mode: AggregationMode
) => {
  if (!data.length) return { labels: [], data: [] };

  // 1. Group by X-Axis
  const grouped = _.groupBy(data, groupByColumn);

  // 2. Aggregate
  const processed = Object.keys(grouped).map(category => {
    const groupRows = grouped[category];
    let value = 0;

    if (mode === 'count' || !valueColumn) {
      value = groupRows.length;
    } else if (mode === 'avg') {
      value = _.meanBy(groupRows, (r) => Number(r[valueColumn]) || 0);
    } else if (mode === 'sum') {
       value = _.sumBy(groupRows, (r) => Number(r[valueColumn]) || 0);
    }

    return { label: category, value };
  });

  // 3. Limit to top 20 to prevent crashes
  const sorted = _.orderBy(processed, ['value'], ['desc']).slice(0, 20);

  return {
    labels: sorted.map(i => i.label),
    data: sorted.map(i => i.value)
  };
};

// Scatter Plot logic with Churn coloring
export const processScatterData = (
  data: DataRow[], 
  xKey: string, 
  yKey: string
) => {
  // Identify Churn column (case-insensitive)
  const churnKey = Object.keys(data[0] || {}).find(k => k.toLowerCase() === 'churn');

  // Map to Chart.js format
  const points = data.map(row => ({
    x: Number(row[xKey]),
    y: Number(row[yKey]),
    // Store churn value in the point object for coloring logic in ChartDisplay
    churn: churnKey ? Number(row[churnKey]) : 0
  }));

  // Limit points for performance (Scatter implies raw data, but 5000+ can lag)
  return points.slice(0, 2000); 
};

// Stacked Bar: Group by Category, then Split by Churn
export const processStackedChurnData = (
  data: DataRow[],
  groupByColumn: string
) => {
  const churnKey = Object.keys(data[0] || {}).find(k => k.toLowerCase() === 'churn');
  if (!churnKey) return null;

  // Group by Category (e.g., MaritalStatus)
  const grouped = _.groupBy(data, groupByColumn);
  const labels = Object.keys(grouped).slice(0, 15); // Top 15 categories

  const retainedData: number[] = [];
  const churnedData: number[] = [];

  labels.forEach(label => {
    const group = grouped[label];
    // Count Churn=0
    retainedData.push(group.filter(r => Number(r[churnKey]) === 0).length);
    // Count Churn=1
    churnedData.push(group.filter(r => Number(r[churnKey]) === 1).length);
  });

  return {
    labels,
    datasets: [
      {
        label: 'Retained (Churn=0)',
        data: retainedData,
        backgroundColor: 'rgba(54, 162, 235, 0.8)', // Blue
      },
      {
        label: 'Churned (Churn=1)',
        data: churnedData,
        backgroundColor: 'rgba(255, 99, 132, 0.8)', // Red
      }
    ]
  };
};

// Radar Chart: Customer Profile Comparison
export const processRadarProfileData = (data: DataRow[]) => {
  const churnKey = Object.keys(data[0] || {}).find(k => k.toLowerCase() === 'churn');
  if (!churnKey) return null;

  // Fixed metrics of interest
  const metrics = [
    'SatisfactionScore', 
    'HourSpendOnApp', 
    'NumberOfDeviceRegistered', 
    'NumberOfAddress', 
    'Complain'
  ];

  // Validate metrics exist in dataset
  const availableMetrics = metrics.filter(m => Object.keys(data[0]).includes(m));

  // Split Data
  const retained = data.filter(r => Number(r[churnKey]) === 0);
  const churned = data.filter(r => Number(r[churnKey]) === 1);

  // Calculate Means
  const retainedMeans = availableMetrics.map(m => _.meanBy(retained, r => Number(r[m]) || 0));
  const churnedMeans = availableMetrics.map(m => _.meanBy(churned, r => Number(r[m]) || 0));

  return {
    labels: availableMetrics,
    datasets: [
      {
        label: 'Retained Customers',
        data: retainedMeans,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
      },
      {
        label: 'Churned Customers',
        data: churnedMeans,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
      }
    ]
  };
};