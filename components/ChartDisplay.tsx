import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Bar, Doughnut, Scatter, Radar } from 'react-chartjs-2';
import { ChartConfiguration, DataRow, CHART_COLORS } from '../types';
import { 
  processAggregatedData, 
  processScatterData, 
  processStackedChurnData,
  processRadarProfileData 
} from '../utils/dataProcessing';
import { Info, AlertTriangle } from 'lucide-react';

// Đăng ký các thành phần biểu đồ cần dùng cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartDisplayProps {
  data: DataRow[];
  config: ChartConfiguration | null;
}

// Component hiển thị biểu đồ dựa trên dữ liệu và cấu hình đã chọn
export const ChartDisplay: React.FC<ChartDisplayProps> = ({ data, config }) => {

  // Xử lý dữ liệu đầu vào thành định dạng phù hợp với từng loại biểu đồ
  const chartInfo = useMemo(() => {
    if (!data || !config || data.length === 0) return null;

    // Xử lý dữ liệu cho biểu đồ Scatter
    if (config.type === 'scatter') {
      const points = processScatterData(data, config.xAxisKey, config.yAxisKey);
      return {
        type: 'scatter',
        data: {
          datasets: [{
            label: 'Dữ liệu khách hàng',
            data: points,
            backgroundColor: points.map(p =>
              p.churn === 1
                ? 'rgba(255, 99, 132, 1)'
                : 'rgba(54, 162, 235, 1)'
            ),
            pointRadius: 4,
          }]
        }
      };
    }

    // Xử lý dữ liệu cho biểu đồ Stacked Bar theo trạng thái Churn
    if (config.type === 'stackedBar') {
      const stackedData = processStackedChurnData(data, config.xAxisKey);
      if (!stackedData) {
        return { error: "Không thể xử lý dữ liệu Churn. Hãy kiểm tra cột 'Churn'." };
      }
      return { type: 'stackedBar', data: stackedData };
    }

    // Xử lý dữ liệu cho biểu đồ Radar so sánh hồ sơ trung bình
    if (config.type === 'radar') {
      const radarData = processRadarProfileData(data);
      if (!radarData) {
        return { error: "Không thể xử lý dữ liệu Radar. Cần cột 'Churn' và các chỉ số số học." };
      }
      return { type: 'radar', data: radarData };
    }

    // Xử lý dữ liệu tổng hợp cho các biểu đồ Bar, Line, Doughnut
    const aggregated = processAggregatedData(
      data,
      config.xAxisKey,
      config.yAxisKey,
      config.aggregation
    );

    return {
      type: 'standard',
      data: {
        labels: aggregated.labels,
        datasets: [{
          label:
            config.aggregation === 'count'
              ? 'Số lượng'
              : `${config.aggregation.toUpperCase()} của ${config.yAxisKey}`,
          data: aggregated.data,
          backgroundColor:
            config.type === 'doughnut' ? CHART_COLORS : CHART_COLORS[0],
          borderColor: 'white',
          borderWidth: 1,
        }],
      }
    };
  }, [data, config]);

  // Hiển thị màn hình chờ khi chưa cấu hình biểu đồ
  if (!config) {
    return (
      <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
        <div className="bg-slate-100 p-4 rounded-full mb-4">
          <Info className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-medium text-slate-700">
          Sẵn sàng trực quan hóa
        </h3>
        <p className="text-slate-500 max-w-sm mt-2">
          Tải dữ liệu và cấu hình biểu đồ để xem kết quả phân tích.
        </p>
      </div>
    );
  }

  // Hiển thị thông báo lỗi khi dữ liệu không hợp lệ
  if (chartInfo?.error) {
    return (
      <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-red-50 rounded-2xl border border-red-200 p-8 text-center text-red-600">
        <AlertTriangle className="w-8 h-8 mb-2" />
        <p>{chartInfo.error}</p>
      </div>
    );
  }

  if (!chartInfo?.data) return null;

  // Cấu hình chung cho các biểu đồ
  const commonOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      title: {
        display: true,
        text:
          config.type === 'scatter'
            ? 'Phân tích tương quan'
            : 'Phân tích tổng hợp',
        font: { size: 16 },
      },
    },
  };

  return (
    <div className="h-full bg-white rounded-2xl border border-slate-200 shadow-lg flex flex-col overflow-hidden">
      
      {/* Header hiển thị thông tin tổng quan của biểu đồ */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">
            Kết quả phân tích
          </h3>
          <p className="text-sm text-slate-500">
            Tổng số dòng dữ liệu:{' '}
            <span className="font-mono font-medium text-slate-700">
              {data.length}
            </span>
          </p>
        </div>

        <div className="flex gap-2 text-sm">
          <span className="px-3 py-1 bg-white border border-slate-200 rounded-full font-semibold text-slate-600">
            {config.xAxisKey || 'Tự động'}
          </span>

          {config.type !== 'radar' && (
            <>
              <span className="text-slate-400 self-center">vs</span>
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-full font-semibold text-slate-600">
                {config.yAxisKey || 'Tần suất'}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Khu vực hiển thị biểu đồ */}
      <div className="flex-1 w-full min-h-[450px] p-6 relative">
        {config.type === 'bar' && (
          <Bar options={commonOptions} data={chartInfo.data} />
        )}

        {config.type === 'horizontalBar' && (
          <Bar
            options={{ ...commonOptions, indexAxis: 'y' }}
            data={chartInfo.data}
          />
        )}

        {config.type === 'stackedBar' && (
          <Bar
            options={{
              ...commonOptions,
              scales: { x: { stacked: true }, y: { stacked: true } },
              plugins: {
                ...commonOptions.plugins,
                title: {
                  display: true,
                  text: `Tỷ lệ Churn theo ${config.xAxisKey}`,
                },
              },
            }}
            data={chartInfo.data}
          />
        )}

        {config.type === 'doughnut' && (
          <div className="max-w-lg mx-auto h-full">
            <Doughnut options={commonOptions} data={chartInfo.data} />
          </div>
        )}

        {config.type === 'scatter' && (
          <Scatter
            options={{
              ...commonOptions,
              plugins: {
                ...commonOptions.plugins,
                title: {
                  display: true,
                  text: `Tương quan: ${config.xAxisKey} vs ${config.yAxisKey}`,
                },
              },
            }}
            data={chartInfo.data}
          />
        )}

        {config.type === 'radar' && (
          <div className="max-w-lg mx-auto h-full">
            <Radar
              options={{
                ...commonOptions,
                scales: { r: { beginAtZero: true } },
              }}
              data={chartInfo.data}
            />
          </div>
        )}
      </div>
    </div>
  );
};
