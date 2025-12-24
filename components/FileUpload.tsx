import React, { useState } from 'react';
import Papa from 'papaparse';
import { DataRow } from '../types';

interface FileUploadProps {
  onDataLoaded: (data: DataRow[], columns: string[]) => void;
}

// Component tải file CSV và parse dữ liệu đầu vào
export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Kiểm tra và xử lý file CSV được tải lên
  const processFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Vui lòng chọn file CSV.');
      return;
    }

    setError(null);
    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as DataRow[];
        const fields = results.meta.fields;

        if (!data.length || !fields) {
          setError('File CSV không hợp lệ hoặc không có dữ liệu.');
          return;
        }

        onDataLoaded(data, fields);
      },
      // Xử lý lỗi khi parse CSV
      error: (err) => {
        setError(err.message);
      }
    });
  };

  // Bắt sự kiện khi người dùng chọn file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="w-full space-y-2">
      <h2 className="text-sm font-semibold text-slate-800">
        1. Tải dataset (CSV)
      </h2>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="block w-full text-xs border border-slate-300 rounded px-2 py-1"
      />

      {fileName && !error && (
        <p className="text-xs text-green-600">
          Đã tải: {fileName}
        </p>
      )}

      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};
