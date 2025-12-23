import React from 'react';
import { BarChart } from 'lucide-react';

interface EmbedViewerProps {
  src?: string;
  title: string;
  type: 'iframe' | 'placeholder';
}

export const EmbedViewer: React.FC<EmbedViewerProps> = ({ src, title, type }) => {
  return (
    // Container chính: Chiều rộng 100%, chiều cao 85vh (cao gần hết màn hình), bo góc, đổ bóng nhẹ
    <div className="w-900 h-[150vh] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {type === 'iframe' && src ? (
          <iframe
            src={src}
            title={title}
            className="w-full h-full border-0"
            scrolling="yes"
            // Các quyền sandbox để Flourish hoạt động mượt mà
            sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
          />
        ) : (
          // Phần hiển thị khi chưa có dữ liệu (Placeholder)
          <div className="w-900 h-60 flex flex-col items-center justify-center text-slate-400 bg-slate-50">
            <BarChart className="w-16 h-16 mb-4 opacity-20" />
            <h3 className="text-xl font-bold uppercase mb-2 text-slate-500">{title}</h3>
            <p className="text-sm">Dữ liệu biểu đồ đang được cập nhật...</p>
          </div>
        )}
    </div>
  );
};