import React from 'react';
import { ExternalLink } from 'lucide-react';

// Danh sách thành viên nhóm
const members = [
  {
    name: "Phạm Huỳnh Tấn Khang",
    email: "22520624@gm.uit.edu.vn",
  },
  {
    name: "Huỳnh Ngọc Trang",
    email: "22521510@gm.uit.edu.vn",
  },
  {
    name: "Nguyễn Huỳnh Xuân Nghi",
    email: "23521004@gm.uit.edu.vn",
  },
  {
    name: "Nguyễn Thị Ngọc Phước",
    email: "23521235@gm.uit.edu.vn",
  },
];

export const ProjectInfo: React.FC = () => {
  return (
    <div className="w-full h-full overflow-y-auto bg-white px-10 py-8 text-slate-800">

      {/* Phần tiêu đề đồ án */}
      <header className="mb-10 border-b border-slate-200 pb-6 flex flex-col lg:flex-row gap-8 justify-between items-start">
        
        {/* Cột trái: logo và thông tin đề tài */}
        <div className="flex flex-col gap-5">
          
          {/* Logo và tên đề tài */}
          <div className="flex items-center gap-5">
            
            {/* Logo trường */}
            <div className="w-24 h-24 flex-shrink-0 rounded-lg p-1 flex items-center justify-center">
              <img
                src="https://i.pinimg.com/736x/32/b4/d8/32b4d8d0351dd8a6c4346291c92dfb85.jpg"
                alt="Logo UIT"
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Tên đề tài */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold uppercase text-blue-900 leading-tight">
                Phân tích & Dự đoán tỉ lệ Rời bỏ của Khách hàng
              </h1>
              <p className="text-slate-500 font-medium mt-1 text-base">
                Demo trực quan hóa dữ liệu
              </p>
            </div>
          </div>

          {/* Thông tin môn học */}
          <div className="text-base space-y-1.5 text-slate-700 max-w-3xl">
            <p>
              <strong className="font-semibold text-blue-800">Trường:</strong>
              {" "}Đại học Công nghệ Thông Tin - ĐHQG TPHCM
            </p>
            <p>
              <strong className="font-semibold text-blue-800">Khoa:</strong>
              {" "}Khoa học và Kỹ Thuật Thông tin
            </p>
            <p>
              <strong className="font-semibold text-blue-800">Môn học:</strong>
              {" "}Phân tích và Trực quan dữ liệu (IE313.Q11)
            </p>
          </div>

        </div>
      </header>

      {/* Nội dung chính */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Cột trái */}
        <div className="space-y-10">

          {/* Thông tin giảng viên */}
          <div className="space-y-1.5 text-slate-700 max-w-3xl font-semibold text-blue-800">
            <p className="flex items-center gap-2 font-semibold text-blue-900 mb-4">
              Giảng viên hướng dẫn
            </p>
            <p className="text-base font-medium text-slate-800">
              ThS. Phạm Nguyễn Phúc Toàn
            </p>
            <p className="text-slate-500 text-sm">
              toanpnp@uit.edu.vn
            </p>
          </div>

          {/* Danh sách thành viên */}
          <section>
            <h2 className="flex items-center gap-2 font-semibold text-blue-900 mb-4">
              Thành viên nhóm
            </h2>
            <ul className="space-y-3 text-sm">
              {members.map((m) => (
                <li key={m.email} className="border-b pb-3 last:border-0">
                  <p className="font-medium">{m.name}</p>
                  {/* Email thành viên */}
                  <p className="text-xs text-slate-500 italic">
                    {m.email}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* Nguồn dữ liệu */}
          <section>
            <h2 className="flex items-center gap-2 font-semibold text-blue-900 mb-4">
              Nguồn dữ liệu
            </h2>

            <a
              href="https://www.kaggle.com/datasets/ankitverma2010/ecommerce-customer-churn-analysis-and-prediction"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-sm hover:text-blue-700"
            >
              <ExternalLink className="w-4 h-4" />
              Ecommerce Customer Churn Analysis and Prediction (Kaggle)
            </a>

            <a
              href="https://drive.google.com/drive/folders/1i-zzRxvK-1owNeOid11qEo3-IFR4emZm?usp=drive_link"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-sm hover:text-blue-700"
            >
              <ExternalLink className="w-4 h-4" />
              Dataset đã xử lý (Google Drive)
            </a>
          </section>

        </div>

        {/* Cột phải */}
        <div className="space-y-6">
          <section>
            <h2 className="flex items-center gap-2 font-semibold text-blue-900 mb-4">
              Tổng quan đồ án
            </h2>

            <div className="text-sm leading-7 text-justify space-y-4">
              <p>
                Đồ án tập trung vào việc <strong>phân tích và trực quan hóa hành vi
                rời bỏ của khách hàng</strong> trong thương mại điện tử.
              </p>

              <p>
                Hệ thống hỗ trợ khám phá sự khác biệt giữa khách hàng rời bỏ và trung thành.
              </p>

              <ul className="list-disc pl-5">
                <li>Phân tích mẫu hình churn</li>
                <li>So sánh hành vi khách hàng</li>
                <li>Tạo biểu đồ tương tác từ CSV</li>
              </ul>

              <p>
                Biểu đồ được xây dựng bằng Flourish để kể chuyện dữ liệu hiệu quả hơn.
              </p>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
};
