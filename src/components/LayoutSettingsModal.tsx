import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutUtils } from '../lib/layoutUtils';

interface LayoutSettingsModalProps {
  onExport: () => void;
  onImport: (data: any) => void;
  onClose: () => void;
  show: boolean;
}

export const LayoutSettingsModal: React.FC<LayoutSettingsModalProps> = ({ 
  onExport, 
  onImport, 
  onClose, 
  show 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (LayoutUtils.validateLayoutData(data)) {
            onImport(data);
          } else {
            alert('导入失败：文件格式不正确');
          }
        } catch (error) {
          alert('导入失败：文件格式不正确');
        }
      };
      reader.readAsText(file);
    }
    if (e.target) e.target.value = '';
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ 
              type: "spring",
              damping: 20,
              stiffness: 300
            }}
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800">布局设置</h2>
            <div className="space-y-4">
              <button
                onClick={onExport}
                className="w-full px-6 py-3 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors transform hover:scale-105"
              >
                导出当前布局
              </button>
              <button
                onClick={handleImportClick}
                className="w-full px-6 py-3 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors transform hover:scale-105"
              >
                导入布局文件
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
            </div>
            <div className="flex justify-end pt-6">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                关闭
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};