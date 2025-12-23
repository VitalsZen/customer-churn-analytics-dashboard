import React, { useState, useEffect, useMemo } from 'react';
import { ChartConfiguration, ChartType, AggregationMode, CHART_TYPES, AGGREGATION_TYPES, DataRow } from '../types';
import { Settings2, ArrowRight, BarChartHorizontal, Calculator, PieChart, ScatterChart, BarChart2, Activity } from 'lucide-react';

interface ChartConfigProps {
  columns: string[];
  sampleData: DataRow[];
  onConfigSubmit: (config: ChartConfiguration) => void;
  disabled: boolean;
}

export const ChartConfig: React.FC<ChartConfigProps> = ({ columns, sampleData, onConfigSubmit, disabled }) => {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [xAxisKey, setXAxisKey] = useState<string>('');
  const [yAxisKey, setYAxisKey] = useState<string>('');
  const [aggregation, setAggregation] = useState<AggregationMode>('count');

  // Analyze column types
  const columnInfo = useMemo(() => {
    if (!sampleData || sampleData.length === 0) return { numeric: [], categorical: [] };
    const firstRow = sampleData[0];
    
    const numeric: string[] = [];
    const categorical: string[] = [];

    columns.forEach(col => {
      const val = firstRow[col];
      // Basic heuristic: check if value is a number
      if (typeof val === 'number') numeric.push(col);
      else categorical.push(col);
    });

    return { numeric, categorical };
  }, [columns, sampleData]);

  // Set defaults
  useEffect(() => {
    if (columns.length > 0 && !xAxisKey) {
      setXAxisKey(columns[0]);
      setYAxisKey(columnInfo.numeric[0] || columns[0]);
    }
  }, [columns, columnInfo, xAxisKey]);

  // Auto-set aggregation
  useEffect(() => {
    if (['scatter', 'stackedBar', 'radar'].includes(chartType)) return;

    if (columnInfo.numeric.includes(yAxisKey)) {
      setAggregation('avg');
    } else {
      setAggregation('count');
    }
  }, [yAxisKey, columnInfo.numeric, chartType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfigSubmit({
      type: chartType,
      xAxisKey,
      yAxisKey,
      aggregation,
    });
  };

  const isScatter = chartType === 'scatter';
  const isRadar = chartType === 'radar';
  const isStacked = chartType === 'stackedBar';
  const showYAxis = !isRadar && !isStacked;
  const showAggregation = !isScatter && !isRadar && !isStacked;

  if (disabled) {
    return (
      <div className="opacity-50 pointer-events-none grayscale p-4 border border-slate-200 rounded-xl bg-gray-50 text-center">
        <p className="text-slate-500 text-xs">Vui lòng tải dữ liệu để cấu hình</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-sm font-bold text-slate-800 uppercase">2. Cấu hình Trực quan</h2>
        <Settings2 className="w-4 h-4 text-slate-400" />
      </div>

      <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        
        {/* Chart Type Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase">Loại biểu đồ</label>
          <div className="grid grid-cols-2 gap-2">
            {CHART_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setChartType(type.value)}
                className={`
                  px-2 py-2 text-xs rounded border transition-all text-left flex items-center gap-2
                  ${chartType === type.value 
                    ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium ring-1 ring-blue-500' 
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}
                `}
              >
                {type.value === 'horizontalBar' && <BarChartHorizontal className="w-3 h-3 flex-shrink-0" />}
                {type.value === 'bar' && <BarChart2 className="w-3 h-3 flex-shrink-0" />}
                {type.value === 'doughnut' && <PieChart className="w-3 h-3 flex-shrink-0" />}
                {type.value === 'scatter' && <ScatterChart className="w-3 h-3 flex-shrink-0" />}
                {type.value === 'radar' && <Activity className="w-3 h-3 flex-shrink-0" />}
                {/* Simplified labels for space */}
                <span className="truncate">{type.label.split('(')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {!isRadar && (
          <div className="flex flex-col gap-3">
            {/* X-Axis / Group By */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                {isScatter ? 'Trục X (Số)' : 'Nhóm theo (Category)'}
              </label>
              <select
                value={xAxisKey}
                onChange={(e) => setXAxisKey(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
              >
                {columns.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            {/* Y-Axis (Conditional) */}
            {showYAxis && (
              <div className="space-y-1 animate-in fade-in slide-in-from-top-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  {isScatter ? 'Trục Y (Số)' : 'Giá trị phân tích'}
                </label>
                <select
                  value={yAxisKey}
                  onChange={(e) => setYAxisKey(e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
                >
                  {!isScatter && <option value="">(Chỉ đếm số lượng)</option>}
                  {columns.map((col) => (
                    <option key={col} value={col}>
                      {col} {columnInfo.numeric.includes(col) ? '(123)' : '(ABC)'}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {isRadar && (
          <div className="p-3 bg-blue-50 rounded text-xs text-blue-700 border border-blue-200">
             <p><strong>Tự động:</strong> Biểu đồ Radar sẽ so sánh các chỉ số trung bình giữa nhóm khách hàng Rời bỏ (Churn) và Ở lại.</p>
          </div>
        )}

        {/* Aggregation Mode */}
        {showAggregation && (
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <div className="flex items-center gap-1 mb-2 text-slate-700">
              <Calculator className="w-3 h-3" />
              <span className="text-xs font-bold">Phép toán</span>
            </div>
            
            <div className="flex flex-col gap-1">
              {AGGREGATION_TYPES.map(agg => (
                <label key={agg.value} className={`flex items-center gap-2 cursor-pointer ${agg.value !== 'count' && !columnInfo.numeric.includes(yAxisKey) ? 'opacity-50' : ''}`}>
                  <input 
                    type="radio" 
                    name="agg" 
                    value={agg.value}
                    checked={aggregation === agg.value} 
                    onChange={() => setAggregation(agg.value as AggregationMode)}
                    disabled={agg.value !== 'count' && !columnInfo.numeric.includes(yAxisKey)}
                    className="text-blue-600 focus:ring-blue-500 h-3 w-3"
                  />
                  <span className="text-xs text-slate-600">
                    {agg.value === 'count' ? 'Đếm dòng (Count)' : agg.value === 'sum' ? 'Tổng giá trị (Sum)' : 'Trung bình (Avg)'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded font-bold uppercase text-xs transition-all shadow-md active:scale-[0.98]"
        >
          Vẽ biểu đồ
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </form>
  );
};