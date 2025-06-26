import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const EditModal = ({ item, categories, onSave, onClose, show }) => {
  const [name, setName] = useState(item?.name || '');
  const [url, setUrl] = useState(item?.url || '');
  const [icon, setIcon] = useState(item?.icon || '');
  const [category, setCategory] = useState(item?.category || (categories.length > 0 ? categories[0] : '常用'));
  const [newCategoryNameInput, setNewCategoryNameInput] = useState('');

  const handleCategoryChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === 'new-category') {
        setCategory('new-category');
        setNewCategoryNameInput('');
    } else {
        setCategory(selectedValue);
    }
  };

  const handleNewCategoryNameChange = (e) => {
    setNewCategoryNameInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let finalCategory = category;
    if (category === 'new-category') {
      if (newCategoryNameInput.trim() === '') {
        alert('请输入新类别名称。');
        return;
      }
      finalCategory = newCategoryNameInput.trim();
    }

    onSave({
      ...item,
      name,
      url,
      icon,
      category: finalCategory,
    });
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
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{item?.isNew ? '添加新链接' : '编辑链接'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">名称</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  tabIndex={0}
                />
              </div>
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  tabIndex={0}
                />
              </div>
              <div>
                <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">图标 URL</label>
                <input
                  type="url"
                  id="icon"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例如: https://example.com/icon.png"
                  tabIndex={0}
                />
                {icon && (
                  <div className="mt-2 text-center">
                    <img src={icon} alt="Icon preview" className="mx-auto w-10 h-10 object-contain rounded-full" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40x40/cccccc/ffffff?text=图标'; }} />
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                <select
                  id="category"
                  value={category}
                  onChange={handleCategoryChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  tabIndex={0}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="new-category">新建类别...</option>
                </select>
                {category === 'new-category' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      type="text"
                      placeholder="请输入新类别名称"
                      value={newCategoryNameInput}
                      onChange={handleNewCategoryNameChange}
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      tabIndex={0}
                    />
                  </motion.div>
                )}
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  tabIndex={0}
                >
                  取消
                </motion.button>
                <motion.button
                  type="submit"
                  className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  tabIndex={0}
                >
                  保存
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};