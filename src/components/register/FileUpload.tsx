import React, { useRef } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  preview: string | null;
  accept?: string;
  error?: string;
  uploadText: string;
  requirementsText?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onFileRemove,
  preview,
  accept = "image/*",
  error,
  uploadText,
  requirementsText
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('الرجاء اختيار ملف صورة فقط');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الملف يجب أن يكون أقل من 5MB');
        return;
      }
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 ${
        error ? 'border-red-500 bg-red-50' : 'border-blue-400 bg-blue-50 hover:bg-blue-100'
      }`}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
        />
        <button
          type="button"
          onClick={handleClick}
          className="cursor-pointer flex flex-col items-center w-full"
        >
          <FiUpload className="text-3xl mb-3 text-blue-500" />
          <span className="text-blue-600 font-medium">{uploadText}</span>
          {requirementsText && (
            <span className="text-sm text-gray-500 mt-1">{requirementsText}</span>
          )}
        </button>
      </div>

      {preview && (
        <div className="relative inline-block mt-4 group animate-scale-in">
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-xl border-2 border-blue-500 transition-all duration-300 group-hover:scale-110 shadow-lg"
          />
          <button
            type="button"
            onClick={onFileRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 shadow-lg"
          >
            <FiX size={16} />
          </button>
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1 animate-pulse">{error}</p>}
    </div>
  );
};

export default FileUpload;