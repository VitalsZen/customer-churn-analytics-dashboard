import React, { useState, useEffect, useMemo } from 'react';
import { ChartConfiguration, ChartType, AggregationMode, CHART_TYPES, AGGREGATION_TYPES, DataRow } from '../types';
import { Settings2, ArrowRight, Calculator } from 'lucide-react';

interface ChartConfigProps {
  columns: string[];
  sampleData: DataRow[];
  onConfigSubmit: (config: ChartConfiguration) => void;
  disabled: boolean;
}

// Component cấu hình biểu đồ dựa trên dữ liệu người dùng chọn
export const ChartConfig: React.FC<ChartConfigProps> = ({ columns, sampleData, onConfigSubmit, disabled }) => {
  const [chartType, setChartType] = useState<ChartType>('stackedBar');
  const [xAxisKey, setXAxisKey] = useState<string>('');
  const [yAxisKey, setYAxisKey] = useState<string>('');
  const [aggregation, setAggregation] = useState<AggregationMode>('count');

  // Xác định kiểu dữ liệu của từng cột từ dữ liệu mẫu
  const colTypes = useMemo(() => {
    if (!sampleData || sampleData.length === 0) return { numeric: [], categorical: [] };
    const row = sampleData[0];
    const numeric: string[] = [];
    const categorical: string[] = [];
    columns.forEach(col => {
      if (col === 'CustomerID') return;
      const val = row[col];
      if (typeof val === 'number') numeric.push(col);
      else categorical.push(col);
    });
    return { numeric, categorical };
  }, [columns, sampleData]);

  // Tự động gán trục mặc định theo loại biểu đồ
  useEffect(() => {
    if (disabled) return;
    switch (chartType) {
      case 'scatter':
        setXAxisKey(colTypes.numeric[0] || columns[0]);
        setYAxisKey(colTypes.numeric[1] || columns[1]);
        break;
      case 'radar':
        setXAxisKey('');
        setYAxisKey('');
        break;
      default:
        setXAxisKey(colTypes.categorical[0] || columns[0]);
        setYAxisKey('');
        setAggregation('count');
        break;
    }
  }, [chartType, disabled, columns, colTypes]);

  // Gửi cấu hình biểu đồ hiện tại lên component cha
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfigSubmit({ type: chartType, xAxisKey, yAxisKey, aggregation });
  };

  // Render danh sách cột cho select, phân nhóm theo kiểu dữ liệu
  const renderColumnOptions = () => (
    <>
      <optgroup label="Text">
        {colTypes.categorical.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </optgroup>
      <optgroup label="Numeric">
        {colTypes.numeric.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </optgroup>
    </>
  );

  // Hiển thị tùy chọn phép tính khi người dùng chọn cột giá trị
  const renderAggregationOptions = () => (
    yAxisKey && (
      <div className="p-2 bg-slate-50 rounded border border-slate-200 animate-in fade-in">
        <div className="flex items-center gap-1 mb-2">
          <Calculator className="w-3 h-3 text-slate-500" />
          <span className="text-[10px] font-bold text-slate-600 uppercase">Phép tính</span>
        </div>
        <div className="flex gap-4">
          {AGGREGATION_TYPES.filter(a => a.value !== 'count').map(agg => (
            <label key={agg.value} className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="agg"
                value={agg.value}
                checked={aggregation === agg.value}
                onChange={() => setAggregation(agg.value as AggregationMode)}
                className="w-3 h-3 text-blue-600"
              />
              <span className="text-xs text-slate-700">{agg.label}</span>
            </label>
          ))}
        </div>
      </div>
    )
  );

  // Chặn thao tác khi chưa tải dữ liệu CSV
  if (disabled) return <div className="text-center text-xs text-slate-500">Vui lòng tải file CSV</div>;

  // Render các input cấu hình tương ứng với từng loại biểu đồ
  const renderInputs = () => {
    switch (chartType) {
      case 'scatter':
        return (
          <div className="grid grid-cols-2 gap-3 animate-in fade-in">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Trục X</label>
              <select value={xAxisKey} onChange={e => setXAxisKey(e.target.value)} className="w-full text-xs p-2 border rounded">
                {renderColumnOptions()}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Trục Y</label>
              <select value={yAxisKey} onChange={e => setYAxisKey(e.target.value)} className="w-full text-xs p-2 border rounded">
                {renderColumnOptions()}
              </select>
            </div>
            <p className="col-span-2 text-[10px] text-slate-500 italic">
              * Scatter hiển thị dữ liệu thô để xem phân bố.
            </p>
          </div>
        );

      case 'radar':
        return (
          <div className="p-3 bg-blue-50 text-blue-800 rounded text-xs border border-blue-100">
            <strong>Tự động:</strong> So sánh trung bình các chỉ số giữa nhóm Rời bỏ và Ở lại.
          </div>
        );

      case 'stackedBar':
        return (
          <div className="space-y-3 animate-in fade-in">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Nhóm theo (Category)</label>
              <select value={xAxisKey} onChange={e => setXAxisKey(e.target.value)} className="w-full text-xs p-2 border rounded">
                {renderColumnOptions()}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Giá trị phân tích (Tùy chọn)</label>
              <select value={yAxisKey} onChange={e => setYAxisKey(e.target.value)} className="w-full text-xs p-2 border rounded">
                <option value="">(Mặc định: Đếm số lượng khách hàng)</option>
                {renderColumnOptions()}
              </select>
            </div>

            {renderAggregationOptions()}

            <div className="p-2 bg-slate-50 text-slate-600 rounded text-[11px] border border-slate-200">
              Biểu đồ sẽ phân tách dữ liệu thành 2 phần: <b>Rời bỏ</b> và <b>Ở lại</b>.
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-3 animate-in fade-in">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Trục X / Nhóm</label>
              <select value={xAxisKey} onChange={e => setXAxisKey(e.target.value)} className="w-full text-xs p-2 border rounded">
                {renderColumnOptions()}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Trục Y / Giá trị</label>
              <select value={yAxisKey} onChange={e => setYAxisKey(e.target.value)} className="w-full text-xs p-2 border rounded">
                <option value="">(Chỉ đếm số dòng - Count)</option>
                {renderColumnOptions()}
              </select>
            </div>
            {renderAggregationOptions()}
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-sm font-bold text-slate-800 uppercase">2. Cấu hình Biểu đồ</h2>
        <Settings2 className="w-4 h-4 text-slate-400" />
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {CHART_TYPES.map(type => (
            <button
              key={type.value}
              type="button"
              onClick={() => setChartType(type.value)}
              className={`px-2 py-2 text-xs rounded border transition-all text-left flex items-center gap-2 truncate ${
                chartType === type.value
                  ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium ring-1 ring-blue-500'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <hr className="border-slate-100" />

        {renderInputs()}

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white py-2.5 rounded font-bold uppercase text-xs shadow-sm mt-2"
        >
          Vẽ biểu đồ <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </form>
  );
};
