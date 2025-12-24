import _ from 'lodash';
import { DataRow, AggregationMode } from '../types';

// Tìm cột biểu diễn trạng thái churn trong dữ liệu
const findChurnKey = (row: DataRow): string | undefined => {
  return Object.keys(row).find(k =>
    ['churn', 'exited', 'target'].includes(k.toLowerCase())
  );
};

// Xử lý dữ liệu tổng hợp cho các biểu đồ dạng nhóm
export const processAggregatedData = (
  data: DataRow[], 
  groupByColumn: string, 
  valueColumn: string, 
  mode: AggregationMode
) => {
  if (!data.length || !groupByColumn) return { labels: [], data: [] };

  const grouped = _.groupBy(data, row => String(row[groupByColumn]));

  const processed = Object.keys(grouped).map(category => {
    const groupRows = grouped[category];
    let value = 0;

    if (!valueColumn || mode === 'count') {
      value = groupRows.length;
    } else {
      const numbers = groupRows
        .map(r => Number(r[valueColumn]))
        .filter(n => !isNaN(n));

      if (mode === 'sum') value = _.sum(numbers);
      else if (mode === 'avg') value = _.mean(numbers);
    }

    return { label: category, value };
  });

  const sorted = _.orderBy(processed, ['value'], ['desc']).slice(0, 20);

  return {
    labels: sorted.map(i => i.label),
    data: sorted.map(i => i.value)
  };
};

// Chuẩn bị dữ liệu cho biểu đồ scatter
export const processScatterData = (
  data: DataRow[],
  xKey: string,
  yKey: string
) => {
  if (!xKey || !yKey) return [];

  const churnKey = findChurnKey(data[0]);

  return data.slice(0, 2000).map(row => ({
    x: Number(row[xKey]) || 0,
    y: Number(row[yKey]) || 0,
    churn: churnKey ? Number(row[churnKey]) : 0
  }));
};

// Xử lý dữ liệu churn cho biểu đồ stacked bar
export const processStackedChurnData = (
  data: DataRow[],
  groupByColumn: string,
  valueColumn?: string,
  mode: AggregationMode = 'count'
) => {
  const churnKey = findChurnKey(data[0]);
  if (!churnKey || !groupByColumn) return null;

  // Gom dữ liệu theo cột phân nhóm
  const grouped = _.groupBy(data, row => String(row[groupByColumn]));

  // Lấy top 15 nhóm có số lượng lớn nhất
  const labels = _.orderBy(
    Object.keys(grouped),
    key => grouped[key].length,
    'desc'
  ).slice(0, 15);

  const retainedData: number[] = [];
  const churnedData: number[] = [];

  labels.forEach(label => {
    const group = grouped[label];
    const churnGroup = group.filter(r => Number(r[churnKey]) === 1);
    const retainedGroup = group.filter(r => Number(r[churnKey]) === 0);

    // Tính giá trị theo mode đã chọn
    const calculateValue = (rows: DataRow[]) => {
      if (mode === 'count' || !valueColumn) return rows.length;

      const values = rows.map(r => Number(r[valueColumn]) || 0);
      if (mode === 'sum') return _.sum(values);
      if (mode === 'avg') return values.length ? _.mean(values) : 0;
      return 0;
    };

    churnedData.push(calculateValue(churnGroup));
    retainedData.push(calculateValue(retainedGroup));
  });

  // Tạo nhãn hiển thị cho legend
  const labelPrefix =
    mode === 'count' ? 'Số lượng' : mode === 'sum' ? 'Tổng' : 'TB';
  const valueLabel = valueColumn ? `(${valueColumn})` : '';

  return {
    labels,
    datasets: [
      {
        label: `Ở lại - ${labelPrefix} ${valueLabel}`,
        data: retainedData,
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
      },
      {
        label: `Rời bỏ - ${labelPrefix} ${valueLabel}`,
        data: churnedData,
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
      }
    ]
  };
};

// Tạo dữ liệu hồ sơ hành vi cho biểu đồ radar
export const processRadarProfileData = (data: DataRow[]) => {
  const churnKey = findChurnKey(data[0]);
  if (!churnKey) return null;

  const targetMetrics = [
    'SatisfactionScore',
    'HourSpendOnApp',
    'NumberOfDeviceRegistered',
    'OrderCount',
    'Tenure'
  ];

  const availableMetrics = targetMetrics.filter(m =>
    Object.keys(data[0]).includes(m)
  );
  if (availableMetrics.length < 3) return null;

  const retained = data.filter(r => Number(r[churnKey]) === 0);
  const churned = data.filter(r => Number(r[churnKey]) === 1);

  // Tính giá trị trung bình cho từng chỉ số
  const calcMean = (dataset: DataRow[], key: string) =>
    _.meanBy(dataset, r => Number(r[key]) || 0);

  return {
    labels: availableMetrics,
    datasets: [
      {
        label: 'Khách hàng trung thành',
        data: availableMetrics.map(m => calcMean(retained, m)),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
      },
      {
        label: 'Khách hàng rời bỏ',
        data: availableMetrics.map(m => calcMean(churned, m)),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
      }
    ]
  };
};
