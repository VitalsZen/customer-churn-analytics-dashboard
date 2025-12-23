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

// Register Chart.js components
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

export const ChartDisplay: React.FC<ChartDisplayProps> = ({ data, config }) => {
  
  // -----------------------------------------------------------------------
  // MAIN PROCESSING LOGIC
  // -----------------------------------------------------------------------
  const chartInfo = useMemo(() => {
    if (!data || !config || data.length === 0) return null;

    // CASE 1: SCATTER (Correlation)
    if (config.type === 'scatter') {
      const points = processScatterData(data, config.xAxisKey, config.yAxisKey);
      
      return {
        type: 'scatter',
        data: {
          datasets: [{
            label: 'Customer Data',
            data: points,
            backgroundColor: points.map(p => p.churn === 1 ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)'), // Red for Churn, Blue for Retained
            pointRadius: 4,
          }]
        }
      };
    }

    // CASE 2: STACKED BAR (Churn Analysis)
    if (config.type === 'stackedBar') {
      const stackedData = processStackedChurnData(data, config.xAxisKey);
      if (!stackedData) return { error: "Could not process Churn data. Ensure 'Churn' column exists." };
      return { type: 'stackedBar', data: stackedData };
    }

    // CASE 3: RADAR (Profile)
    if (config.type === 'radar') {
      const radarData = processRadarProfileData(data);
      if (!radarData) return { error: "Could not process Radar data. Ensure 'Churn' and metric columns exist." };
      return { type: 'radar', data: radarData };
    }

    // CASE 4: STANDARD AGGREGATION (Bar, HorizontalBar, Doughnut, Line)
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
        datasets: [
          {
            label: config.aggregation === 'count' ? 'Count' : `${config.aggregation.toUpperCase()} of ${config.yAxisKey}`,
            data: aggregated.data,
            backgroundColor: config.type === 'doughnut' ? CHART_COLORS : CHART_COLORS[0],
            borderColor: 'white',
            borderWidth: 1,
          },
        ],
      }
    };
  }, [data, config]);


  // -----------------------------------------------------------------------
  // RENDER HELPERS
  // -----------------------------------------------------------------------

  if (!config) {
    return (
      <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
        <div className="bg-slate-100 p-4 rounded-full mb-4">
          <Info className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-medium text-slate-700">Ready to Visualize</h3>
        <p className="text-slate-500 max-w-sm mt-2">
          Upload data and configure settings to generate insights.
        </p>
      </div>
    );
  }

  if (chartInfo?.error) {
    return (
       <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-red-50 rounded-2xl border border-red-200 p-8 text-center text-red-600">
         <AlertTriangle className="w-8 h-8 mb-2" />
         <p>{chartInfo.error}</p>
       </div>
    );
  }

  if (!chartInfo?.data) return null;

  // Chart specific options
  const commonOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      title: { 
        display: true, 
        text: config.type === 'scatter' ? 'Correlation Analysis' : 'Aggregated Analysis',
        font: { size: 16 }
      },
    },
  };

  return (
    <div className="h-full bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 flex flex-col overflow-hidden">
      
      {/* Header Info */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Analysis View</h3>
          <p className="text-sm text-slate-500">
            Total Records: <span className="font-mono font-medium text-slate-700">{data.length}</span>
          </p>
        </div>
        <div className="flex gap-2 text-sm">
           <span className="px-3 py-1 bg-white border border-slate-200 rounded-full font-semibold text-slate-600 shadow-sm">
             {config.xAxisKey || 'Auto'}
           </span>
           {config.type !== 'radar' && (
             <>
               <span className="text-slate-400 self-center">vs</span>
               <span className="px-3 py-1 bg-white border border-slate-200 rounded-full font-semibold text-slate-600 shadow-sm">
                 {config.yAxisKey || 'Frequency'}
               </span>
             </>
           )}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 w-full min-h-[450px] p-6 relative">
        
        {config.type === 'bar' && (
          <Bar options={commonOptions} data={chartInfo.data} />
        )}
        
        {config.type === 'horizontalBar' && (
          <Bar 
            options={{...commonOptions, indexAxis: 'y'}} 
            data={chartInfo.data} 
          />
        )}

        {config.type === 'stackedBar' && (
           <Bar 
             options={{
               ...commonOptions,
               scales: { x: { stacked: true }, y: { stacked: true } },
               plugins: { ...commonOptions.plugins, title: { display: true, text: `Churn Rate by ${config.xAxisKey}` }}
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
              plugins: { ...commonOptions.plugins, title: { display: true, text: `Correlation: ${config.xAxisKey} vs ${config.yAxisKey}` }}
            }} 
            data={chartInfo.data} 
          />
        )}

        {config.type === 'radar' && (
           <div className="max-w-lg mx-auto h-full">
             <Radar 
                options={{
                  ...commonOptions,
                  scales: { r: { beginAtZero: true } }
                }} 
                data={chartInfo.data} 
             />
           </div>
        )}
      </div>
    </div>
  );
};