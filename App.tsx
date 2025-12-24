import { Menu, X, Upload } from 'lucide-react';
import React, { useState, useCallback, useMemo } from 'react';
import { FileUpload } from './components/FileUpload';
import { ChartConfig } from './components/ChartConfig';
import { ChartDisplay } from './components/ChartDisplay';
import { EmbedViewer } from './components/EmbedViewer';
import { ProjectInfo } from './components/ProjectInfo';
import { ChartConfiguration } from './types';
import './App.css';

// Các view chính của ứng dụng
type ViewType =
  | 'info'
  | 'dashboard'
  | 'story'
  | 'graph1'
  | 'graph2'
  | 'graph3';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<ViewType>('info');

  const [data, setData] = useState<any[]>([]);
  const [config, setConfig] = useState<ChartConfiguration | null>(null);

  // Danh sách menu sidebar
  const menuItems = [
    { id: 'info', label: 'Thông tin đồ án', type: 'system' },
    { id: 'dashboard', label: 'Dashboard phân tích', type: 'system' },
    { id: 'story', label: 'Story', type: 'advanced' },
    { id: 'graph1', label: 'Biểu đồ 1', type: 'advanced' },
    { id: 'graph2', label: 'Biểu đồ 2', type: 'advanced' },
    { id: 'graph3', label: 'Biểu đồ 3', type: 'advanced' },
  ];

  // Nhận dữ liệu CSV và reset cấu hình biểu đồ
  const handleFileUpload = useCallback((parsedData: any[]) => {
    setData(parsedData);
    setConfig(null);
    alert(`Đã tải lên thành công ${parsedData.length} dòng dữ liệu!`);
  }, []);

  // Lấy danh sách cột từ dataset
  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  // Render menu item để tái sử dụng
  const renderMenuItem = (item: { id: string; label: string }) => (
    <li key={item.id}>
      <button
        onClick={() => setActiveView(item.id as ViewType)}
        className={`w-full px-5 py-3 text-sm font-medium text-left transition-all duration-200
          ${
            activeView === item.id
              ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 rounded-r-md'
              : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent hover:text-blue-600'
          }`}
      >
        {item.label}
      </button>
    </li>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      {/* Sidebar điều hướng */}
      <div
        className={`${isSidebarOpen ? 'w-[280px]' : 'w-0'} 
        bg-white border-r border-slate-200 flex-shrink-0 transition-all duration-300 flex flex-col`}
      >
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-center font-bold text-xl text-blue-800 uppercase tracking-tight leading-tight">
            Phân tích & Dự đoán tỉ lệ Rời bỏ <br />của Khách hàng 
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto py-6">
          {/* Nhóm menu hệ thống */}
          <div className="px-6 mb-3 font-bold text-blue-900 uppercase">
            Danh mục hệ thống
          </div>
          <ul className="space-y-1 mb-8 pr-2">
            {menuItems
              .filter(i => i.type === 'system')
              .map(renderMenuItem)}
          </ul>

          {/* Nhóm menu trực quan Flourish */}
          <div className="px-6 mb-4 font-bold text-blue-900 uppercase">
            Trực quan (FLOURISH)
          </div>
          <ul className="space-y-1 pr-2">
            {menuItems
              .filter(i => i.type === 'advanced')
              .map(renderMenuItem)}
          </ul>
        </nav>
      </div>

      {/* Khu vực nội dung chính */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-14 bg-white border-b flex px-4 items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded hover:bg-slate-100 text-slate-600"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span className="font-medium text-slate-700">
              {menuItems.find(i => i.id === activeView)?.label}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <div className="w-full max-w-[1400px] mx-auto">
            {activeView === 'info' && <ProjectInfo />}

            {activeView === 'dashboard' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                  <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-slate-800">
                    <Upload size={20} className="text-blue-600" />
                    Tải lên dữ liệu
                  </h2>
                  <FileUpload onDataLoaded={handleFileUpload} />
                </div>

                {data.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[800px]">
                    <div className="lg:col-span-1 overflow-y-auto bg-white rounded-xl border shadow-sm p-4">
                      <ChartConfig
                        columns={columns}
                        sampleData={data}
                        disabled={data.length === 0}
                        onConfigSubmit={setConfig}
                      />
                    </div>

                    <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm p-4">
                      <ChartDisplay data={data} config={config} />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white rounded-xl border border-dashed">
                    <p className="text-slate-400">
                      Vui lòng tải lên file CSV để bắt đầu phân tích
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Nhúng story Flourish */}
            {activeView === 'story' && (
              <EmbedViewer
                type="iframe"
                title="Story"
                src="https://flo.uri.sh/story/3520181/embed"
              />
            )}

            {/* Nhúng biểu đồ Flourish */}
            {activeView === 'graph1' && (
              <EmbedViewer
                type="iframe"
                title="Biểu đồ 1"
                src="https://flo.uri.sh/visualisation/26926310/embed"
              />
            )}

            {activeView === 'graph2' && (
              <EmbedViewer
                type="iframe"
                title="Biểu đồ 2"
                src="https://flo.uri.sh/visualisation/26926694/embed"
              />
            )}

            {activeView === 'graph3' && (
              <EmbedViewer
                type="iframe"
                title="Biểu đồ 3"
                src="https://flo.uri.sh/visualisation/26926171/embed"
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
