import React, { useState, useEffect, useRef, useCallback } from 'react';
// 移除PixelClock导入
import { LayoutSettingsModal } from './components/LayoutSettingsModal';
import { motion, AnimatePresence } from "framer-motion";
import { EditModal } from './components/EditModal';
import { debounce } from 'lodash';
import baiduLogo from './assets/baidu-white.png';
import lingxuanLogo from './assets/logo.png';
// Utility function to safely parse a string as JSON, handling malformed strings
function safeJSONParse(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.error("Failed to parse JSON string:", str, e);
    return {}; // Return an empty object on error
  }
}

// Helper to generate a unique ID (if needed for local items before saving)
const generateUniqueId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Default navigation data and their default display order
const getDefaultNavigationData = () => {
  const defaultNavItems = {
    '常用': [
      { id: generateUniqueId(), name: 'Bilibili', url: 'https://www.bilibili.com/', icon: 'https://www.bilibili.com/favicon.ico', category: '常用' },
      { id: generateUniqueId(), name: 'Github', url: 'https://github.com/', icon: 'https://github.com/favicon.ico', category: '常用' },
      { id: generateUniqueId(), name: '百度翻译', url: 'https://fanyi.baidu.com/', icon: 'https://fanyi.baidu.com/favicon.ico', category: '常用' },
      { id: generateUniqueId(), name: '微信公众平台', url: 'https://mp.weixin.qq.com/', icon: 'https://mp.weixin.qq.com/favicon.ico', category: '常用' },
      { id: generateUniqueId(), name: 'CSDN', url: 'https://www.csdn.net/', icon: 'https://www.csdn.net/favicon.ico', category: '常用' },
      { id: generateUniqueId(), name: '同程旅行', url: 'https://www.ly.com/', icon: 'https://pic5.40017.cn/i/ori/PS2lfS0492.jpg', category: '常用' },
    ],
    '购物': [
      { id: generateUniqueId(), name: '淘宝', url: 'https://www.taobao.com/', icon: 'https://www.taobao.com/favicon.ico', category: '购物' },
      { id: generateUniqueId(), name: '京东', url: 'https://www.jd.com/', icon: 'https://www.jd.com/favicon.ico', category: '购物' },
      { id: generateUniqueId(), name: '1688', url: 'https://www.1688.com/', icon: 'https://www.1688.com/favicon.ico', category: '购物' },
      { id: generateUniqueId(), name: '天猫', url: 'https://www.tmall.com/', icon: 'https://www.tmall.com/favicon.ico', category: '购物' },
    ],
    '邮箱': [
      { id: generateUniqueId(), name: '163邮箱', url: 'https://mail.163.com/', icon: 'https://mail.163.com/favicon.ico', category: '邮箱' },
      { id: generateUniqueId(), name: 'QQ邮箱', url: 'https://mail.qq.com/', icon: 'https://mail.qq.com/favicon.ico', category: '邮箱' },
      { id: generateUniqueId(), name: '谷歌邮箱', url: 'https://mail.google.com/', icon: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico', category: '邮箱' },
    ],
    '影视': [
      { id: generateUniqueId(), name: '爱奇艺', url: 'https://www.iqiyi.com/', icon: 'https://www.iqiyi.com/favicon.ico', category: '影视' },
      { id: generateUniqueId(), name: '优酷', url: 'https://www.youku.com/', icon: 'https://www.youku.com/favicon.ico', category: '影视' },
      { id: generateUniqueId(), name: '腾讯视频', url: 'https://v.qq.com/', icon: 'https://v.qq.com/favicon.ico', category: '影视' },
      { id: generateUniqueId(), name: '芒果TV', url: 'https://www.mgtv.com/', icon: 'https://www.mgtv.com/favicon.ico', category: '影视' },
      { id: generateUniqueId(), name: '虎牙直播', url: 'https://www.huya.com/', icon: 'https://www.huya.com/favicon.ico', category: '影视' },
      { id: generateUniqueId(), name: '斗鱼直播', url: 'https://www.douyu.com/', icon: 'https://www.douyu.com/favicon.ico', category: '影视' },
    ],
    'AI': [
      { id: generateUniqueId(), name: '腾讯元宝', url: 'https://yuanbao.tencent.com/chat/', icon: 'https://cdn-bot.hunyuan.tencent.com/logo-v2.png', category: 'AI' },
      { id: generateUniqueId(), name: '豆包', url: 'https://www.doubao.com/chat/', icon: 'https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/doubao/desktop_online_web/logo-icon.png', category: 'AI' },
      { id: generateUniqueId(), name: '通义千问', url: 'https://tongyi.aliyun.com/', icon: 'https://img.alicdn.com/imgextra/i4/O1CN01EfJVFQ1uZPd7W4W6i_!!6000000006051-2-tps-112-112.png', category: 'AI' },
      { id: generateUniqueId(), name: '扣子', url: 'https://space.coze.cn/', icon: 'https://lf-coze-web-cdn.coze.cn/obj/coze-web-cn/coze-space/static/favicon.ico', category: 'AI' },
      { id: generateUniqueId(), name: 'Gemini', url: 'https://gemini.google.com/', icon: 'https://www.gstatic.com/lamda/images/gemini_favicon_f069958c85030456e93de685481c559f160ea06b.png', category: 'AI' },
      { id: generateUniqueId(), name: 'LibLib', url: 'https://www.bing.com', icon: 'https://www.liblib.art/favicon.ico', category: 'AI' },
    ]
  };
  const defaultCategoryOrder = ['常用', '购物', '邮箱', '影视' , 'AI']; // Explicit default order

  return { defaultNavItems, defaultCategoryOrder };
};


// Custom Alert/Confirm Modal Component with Framer Motion
const AlertDialog = ({ message, onConfirm, onCancel, showCancel = false, title = "提示", show }) => {
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
            className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ 
              type: "spring",
              damping: 20,
              stiffness: 300
            }}
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
            <p className="mb-6 text-gray-700">{message}</p>
            <div className="flex justify-end space-x-4">
              {showCancel && (
                <button
                  onClick={onCancel}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors transform hover:scale-105"
                >
                  取消
                </button>
              )}
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors transform hover:scale-105"
                tabIndex={0}
              >
                确定
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Reusable Color/Opacity Settings Modal Component with Framer Motion
const ColorOpacitySettingsModal = ({ title, currentBackgroundColor, currentBackgroundOpacity, onSave, onClose, show }) => {
  const [newColor, setNewColor] = useState(currentBackgroundColor || '#ffffff');
  const [newOpacity, setNewOpacity] = useState(currentBackgroundOpacity);

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
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              onSave(newColor, newOpacity);
            }} className="space-y-4">
              <div className="flex space-x-4">
                {/* Color Picker Section */}
                <div className="flex flex-col items-center flex-1 p-4 bg-gray-100 rounded-lg">
                  <label htmlFor="colorPicker" className="block text-sm font-medium text-gray-700 mb-2">背景颜色</label>
                  <input
                    type="color"
                    id="colorPicker"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="w-16 h-16 rounded-full border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ backgroundColor: newColor }}
                  />
                  <span className="mt-2 text-sm text-gray-600">{newColor}</span>
                </div>

                {/* Opacity Slider Section */}
                <div className="flex flex-col items-center flex-1 p-4 bg-gray-100 rounded-lg">
                  <label htmlFor="opacitySlider" className="block text-sm font-medium text-gray-700 mb-2">透明度</label>
                  <div className="relative w-full h-full flex items-center justify-center py-4">
                    <input
                      type="range"
                      id="opacitySlider"
                      min="0"
                      max="1"
                      step="0.01"
                      value={newOpacity}
                      onChange={(e) => setNewOpacity(parseFloat(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-blue-300
                                 focus:outline-none focus:ring-2 focus:ring-blue-500
                                 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none
                                 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:appearance-none"
                    />
                  </div>
                  <span className="mt-2 text-sm text-gray-600">{(newOpacity * 100).toFixed(0)}%</span>
                </div>
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

// Modal for Overall Page Background Image with Framer Motion
const OverallPageBackgroundSettingsModal = ({ currentBackgroundUrl, onSave, onClose, show }) => {
  const [newBackgroundUrl, setNewBackgroundUrl] = useState("");
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (currentBackgroundUrl) {
      setNewBackgroundUrl(currentBackgroundUrl);
    }
  }, [currentBackgroundUrl]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match('image.*')) {
        alert('请选择图片文件');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过5MB');
        return;
      }
      setLocalFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localFile) {
      // For local development, we'll use the data URL
      // In a real app, you would upload the file to a server
      onSave(previewUrl || '');
    } else {
      onSave(newBackgroundUrl);
    }
  };

  const handleResetDefault = () => {
    setNewBackgroundUrl("https://nav.esite.love/binaming.jpg");
    setLocalFile(null);
    setPreviewUrl(null);
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
            <h2 className="text-2xl font-bold mb-6 text-gray-800">背景图片设置</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">上传本地图片</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {previewUrl && (
                  <div className="mt-2 text-center">
                    <img src={previewUrl} alt="Preview" className="mx-auto w-32 h-24 object-cover rounded-md border border-gray-200" />
                  </div>
                )}
              </div>
              <div className="text-center text-gray-500">或</div>
              <div>
                <label htmlFor="overallBackgroundUrl" className="block text-sm font-medium text-gray-700 mb-1">图片 URL</label>
                <input
                  type="url"
                  id="overallBackgroundUrl"
                  value={newBackgroundUrl}
                  onChange={(e) => {
                    setNewBackgroundUrl(e.target.value);
                    setLocalFile(null);
                    setPreviewUrl(null);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例如: https://example.com/your-background.jpg"
                />
                {newBackgroundUrl && !previewUrl && (
                  <div className="mt-2 text-center">
                    <img src={newBackgroundUrl} alt="Overall background preview" className="mx-auto w-32 h-24 object-cover rounded-md border border-gray-200" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/128x96/cccccc/ffffff?text=无法显示'; }} />
                  </div>
                )}
              </div>
              <div className="flex justify-between pt-4">
                <motion.button
                  type="button"
                  onClick={handleResetDefault}
                  className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  tabIndex={0}
                >
                  恢复默认
                </motion.button>
                <div className="flex space-x-4">
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
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// New Modal for adding a new category with Framer Motion
const NewCategoryInputModal = ({ onSave, onClose, existingCategories, show }) => {
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (categoryName.trim() === '') {
      alert('类别名称不能为空。');
      return;
    }
    if (existingCategories.includes(categoryName.trim())) {
      alert('该类别已存在。');
      return;
    }
    onSave(categoryName.trim());
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
            <h2 className="text-2xl font-bold mb-6 text-gray-800">新增导航栏类目</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="newCategoryName" className="block text-sm font-medium text-gray-700 mb-1">类目名称</label>
                <input
                  type="text"
                  id="newCategoryName"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  tabIndex={0}
                />
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

// New Modal for reordering categories with Framer Motion
const CategoryOrderModal = ({ categories, onSave, onClose, show }) => {
  const [orderedCategories, setOrderedCategories] = useState([...categories]);
  const [draggedCategory, setDraggedCategory] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedCategory(orderedCategories[index]);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const newOrder = [...orderedCategories];
    const [removed] = newOrder.splice(draggedCategory ? orderedCategories.indexOf(draggedCategory) : dragIndex, 1);
    newOrder.splice(dropIndex, 0, removed);
    setOrderedCategories(newOrder);
  };

  const handleDragEnd = () => {
    setDraggedCategory(null);
  };

  const handleSubmit = () => {
    onSave(orderedCategories);
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
            <h2 className="text-2xl font-bold mb-6 text-gray-800">调整类目顺序</h2>
            <div className="space-y-2 mb-6">
              {orderedCategories.map((category, index) => (
                <div
                  key={category}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`p-3 bg-gray-100 rounded-lg flex items-center justify-between shadow-sm cursor-grab
                              ${draggedCategory === category ? 'opacity-50 border-2 border-blue-500' : ''}`}
                >
                  <span className="font-medium text-gray-800">{category}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-4">
              <motion.button
                onClick={onClose}
                className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                tabIndex={0}
              >
                取消
              </motion.button>
              <motion.button
                onClick={handleSubmit}
                className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                tabIndex={0}
              >
                保存顺序
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// New Modal for Snowfall Effect Settings with Framer Motion
const SnowfallSettingsModal = ({ isEnabled, speed, quantity, onSave, onClose, show }) => {
  const [newIsEnabled, setNewIsEnabled] = useState(isEnabled);
  const [newSpeed, setNewSpeed] = useState(speed);
  const [newQuantity, setNewQuantity] = useState(quantity);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(newIsEnabled, newSpeed, newQuantity);
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
            <h2 className="text-2xl font-bold mb-6 text-gray-800">雪花特效设置</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Toggle Switch */}
              <div className="flex items-center justify-between">
                <label htmlFor="snowfallEnable" className="text-lg font-medium text-gray-700">启用雪花特效</label>
                <input
                  type="checkbox"
                  id="snowfallEnable"
                  checked={newIsEnabled}
                  onChange={(e) => setNewIsEnabled(e.target.checked)}
                  className="toggle-switch-lg"
                />
                <span className="slider round"></span>
              </div>

              {/* Speed Control */}
              <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg">
                <label htmlFor="snowfallSpeed" className="block text-sm font-medium text-gray-700 mb-2">速度 ({newSpeed.toFixed(1)})</label>
                <input
                  type="range"
                  id="snowfallSpeed"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={newSpeed}
                  onChange={(e) => setNewSpeed(parseFloat(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-blue-300
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none
                             [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:appearance-none"
                />
              </div>

              {/* Quantity Control */}
              <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg">
                <label htmlFor="snowfallQuantity" className="block text-sm font-medium text-gray-700 mb-2">数量 ({newQuantity})</label>
                <input
                  type="range"
                  id="snowfallQuantity"
                  min="10"
                  max="500"
                  step="10"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-blue-300
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none
                             [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:appearance-none"
                />
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
            <style>{`
              .toggle-switch-lg {
                position: relative;
                display: inline-block;
                width: 60px;
                height: 34px;
              }
              .toggle-switch-lg input {
                opacity: 0;
                width: 0;
                height: 0;
              }
              .toggle-switch-lg .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                -webkit-transition: .4s;
                transition: .4s;
                border-radius: 34px;
              }
              .toggle-switch-lg .slider:before {
                position: absolute;
                content: "";
                height: 26px;
                width: 26px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                -webkit-transition: .4s;
                transition: .4s;
                border-radius: 50%;
              }
              .toggle-switch-lg input:checked + .slider {
                background-color: #2196F3;
              }
              .toggle-switch-lg input:focus + .slider {
                box-shadow: 0 0 1px #2196F3;
              }
              .toggle-switch-lg input:checked + .slider:before {
                -webkit-transform: translateX(26px);
                -ms-transform: translateX(26px);
                transform: translateX(26px);
              }
            `}</style>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


function App() {
  const [categories, setCategories] = useState([]); // This array holds the ordered category names
  const [navItems, setNavItems] = useState({}); // This object maps category names to item arrays
  const [isEditMode, setIsEditMode] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, item: null, isCategoryMenu: false });
  const [showLayoutSettingsModal, setShowLayoutSettingsModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date()); // 直接管理时间状态
  const exportLayout = () => {
    LayoutUtils.exportLayout({
      navItems,
      categories,
      panelColor,
      panelOpacity,
      itemBlockColor,
      itemBlockOpacity,
      backgroundImage,
      isSnowfallEnabled,
      snowfallSpeed,
      snowfallQuantity
    });
  };

  //搜索组件状态
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);


  // Unified alert state management
  const [alert, setAlert] = useState({ visible: false, message: '', onConfirm: () => {}, onCancel: () => {}, showCancel: false, title: "提示" });
  
  const [backgroundImage, setBackgroundImage] = useState("/assets/binaming.jpg");
  const [showOverallBackgroundModal, setShowOverallBackgroundModal] = useState(false);
  const [showContentPanelBackgroundModal, setShowContentPanelBackgroundModal] = useState(false);
  const [showItemBlockBackgroundModal, setShowItemBlockBackgroundModal] = useState(false); 
  const [showNewCategoryInputModal, setShowNewCategoryInputModal] = useState(false); 
  const [showCategoryOrderModal, setShowCategoryOrderModal] = useState(false);
  const [showSnowfallSettingsModal, setShowSnowfallSettingsModal] = useState(false); // New state for snowfall modal
  const categoryRefs = useRef({}); 

  // State for main content panel's background color and opacity
  const [panelColor, setPanelColor] = useState('#ffffff'); // Default white
  const [panelOpacity, setPanelOpacity] = useState(0.7); // Default 70% opacity

  // State for individual item block's background color and opacity
  const [itemBlockColor, setItemBlockColor] = useState('#f0f0f0'); // Default gray-50
  const [itemBlockOpacity, setItemBlockOpacity] = useState(0.7); // Default 70% opacity

  // Snowfall effect states
  const [isSnowfallEnabled, setIsSnowfallEnabled] = useState(true);
  const [snowfallSpeed, setSnowfallSpeed] = useState(1); // Default speed
  const [snowfallQuantity, setSnowfallQuantity] = useState(100); // Default quantity

  const [draggedItem, setDraggedItem] = useState(null); 

  // Snowfall Canvas refs and logic
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const snowflakes = useRef([]);

  const generateSnowflake = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 4 + 1, // radius
      d: Math.random() * 10, // density (not directly used in speed but can influence visual)
      speed: Math.random() * 1 + 0.5, // base speed
      opacity: Math.random() * 0.5 + 0.5,
      wind: Math.random() * 0.5 - 0.25, // -0.25 to 0.25 for left/right drift
    };
  }, []);

   // 预置搜索建议词
   const predefinedSuggestions = ['大全', '百科', '下载', '翻译', '地图', '天气', '快递', '小说', '电影', '音乐'];

   const fetchSearchSuggestions = useCallback(async (query) => {
     if (!query.trim()) {
       // 当搜索框为空时显示预置建议
       setSearchSuggestions(predefinedSuggestions);
       setShowSuggestions(true);
       return;
     }

     // 检查是否匹配预置词
     const matchedPredefined = predefinedSuggestions.filter(s => 
       s.toLowerCase().includes(query.toLowerCase())
     );

     if (matchedPredefined.length > 0) {
       setSearchSuggestions(matchedPredefined);
       setShowSuggestions(true);
       return;
     }

     try {
       const response = await fetch(`https://nav.esite.love/baidu-suggestion?wd=${encodeURIComponent(query)}`);
       const buffer = await response.arrayBuffer();
       const text = new TextDecoder('gbk').decode(buffer);
       
       // 直接提取数组内容
       const arrayMatch = text.match(/s\s*:\s*\[([^\]]*)\]/);
       if (arrayMatch && arrayMatch[1]) {
         const suggestions = arrayMatch[1].split(',')
           .map(item => item.trim()
             .replace(/^["']|["']$/g, '') // 移除引号
             .replace(/\\u([\dA-Fa-f]{4})/g, (_, grp) => 
               String.fromCharCode(parseInt(grp, 16))) // Unicode转义
             .replace(/\\x([\dA-Fa-f]{2})/g, (_, grp) => 
               String.fromCharCode(parseInt(grp, 16))) // Hex转义
             .replace(/锟斤拷/g, '') // 移除常见乱码
           )
           .filter(Boolean);
         
         if (suggestions.length > 0) {
           setSearchSuggestions(suggestions);
           setShowSuggestions(true);
           return;
         }
       }
       
       // 如果提取失败，使用预置词
       setSearchSuggestions(predefinedSuggestions);
       setShowSuggestions(true);
     } catch (error) {
       console.error('获取搜索建议失败:', error);
       setSearchSuggestions(predefinedSuggestions);
       setShowSuggestions(true);
     }
   }, []);

  // 防抖优化
  const debouncedFetchSuggestions = useCallback(
    debounce((query) => fetchSearchSuggestions(query), 300),
    []
  );

  const drawSnowflakes = useCallback((ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear the canvas
    snowflakes.current.forEach(s => {
      ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`; // Snow color with individual opacity
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2, true);
      ctx.fill();
    });
  }, []);

  const updateSnowflakes = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    snowflakes.current = snowflakes.current.map(s => {
      s.y += s.speed * snowfallSpeed; // Apply global speed factor
      s.x += s.wind * snowfallSpeed; // Apply global speed factor to wind as well

      // If snowflake falls below canvas, reset it to the top
      if (s.y > canvas.height) {
        s.y = -s.r; // Reset above the canvas
        s.x = Math.random() * canvas.width;
      }
      // If snowflake drifts off left/right, reset it from the other side
      if (s.x > canvas.width + s.r) {
        s.x = -s.r;
      } else if (s.x < -s.r) {
        s.x = canvas.width + s.r;
      }
      return s;
    });
  }, [snowfallSpeed]);


  const animateSnowfall = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isSnowfallEnabled) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Adjust quantity if it changed
    if (snowflakes.current.length !== snowfallQuantity) {
      snowflakes.current = []; // Clear existing snowflakes
      for (let i = 0; i < snowfallQuantity; i++) {
        snowflakes.current.push(generateSnowflake());
      }
    }

    drawSnowflakes(ctx);
    updateSnowflakes();
    animationFrameId.current = requestAnimationFrame(animateSnowfall);
  }, [isSnowfallEnabled, snowfallQuantity, generateSnowflake, drawSnowflakes, updateSnowflakes]);


  useEffect(() => {
    // Initialize canvas dimensions and start/stop animation
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Initial population or clear if disabled
      if (isSnowfallEnabled && snowflakes.current.length === 0) {
        for (let i = 0; i < snowfallQuantity; i++) {
          snowflakes.current.push(generateSnowflake());
        }
      } else if (!isSnowfallEnabled && animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }

      if (isSnowfallEnabled) {
        animationFrameId.current = requestAnimationFrame(animateSnowfall);
      }

      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Re-draw after resize
        const ctx = canvas.getContext('2d');
        if (ctx) drawSnowflakes(ctx);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(animationFrameId.current);
        window.removeEventListener('resize', handleResize);
        snowflakes.current = []; // Clear snowflakes on unmount
      };
    }
  }, [isSnowfallEnabled, snowfallQuantity, animateSnowfall, generateSnowflake, drawSnowflakes]);


  // 时间更新效果
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load initial data from localStorage or default data
  useEffect(() => {
    const storedNavItems = localStorage.getItem('navItems');
    const storedCategoriesOrder = localStorage.getItem('categoriesOrder');
    const storedBackground = localStorage.getItem('backgroundImage');
    const storedPanelColor = localStorage.getItem('panelColor');
    const storedPanelOpacity = localStorage.getItem('panelOpacity');
    const storedItemBlockColor = localStorage.getItem('itemBlockColor');
    const storedItemBlockOpacity = localStorage.getItem('itemBlockOpacity');
    const storedSnowfallEnabled = localStorage.getItem('isSnowfallEnabled');
    const storedSnowfallSpeed = localStorage.getItem('snowfallSpeed');
    const storedSnowfallQuantity = localStorage.getItem('snowfallQuantity');


    let initialNavItems;
    let initialCategories;

    if (storedNavItems && storedCategoriesOrder) {
      initialNavItems = safeJSONParse(storedNavItems);
      initialCategories = safeJSONParse(storedCategoriesOrder);
    } else {
      const { defaultNavItems, defaultCategoryOrder } = getDefaultNavigationData();
      initialNavItems = defaultNavItems;
      initialCategories = defaultCategoryOrder;

      localStorage.setItem('navItems', JSON.stringify(initialNavItems));
      localStorage.setItem('categoriesOrder', JSON.stringify(initialCategories));
    }

    setNavItems(initialNavItems);
    setCategories(initialCategories);


    if (storedBackground) {
      setBackgroundImage(storedBackground);
    } else {
      localStorage.setItem('backgroundImage', "https://nav.esite.love/binaming.jpg"); // Default background
    }

    if (storedPanelColor) {
        setPanelColor(storedPanelColor);
    }
    if (storedPanelOpacity) {
        setPanelOpacity(parseFloat(storedPanelOpacity));
    }
    if (storedItemBlockColor) {
        setItemBlockColor(storedItemBlockColor);
    }
    if (storedItemBlockOpacity) {
        setItemBlockOpacity(parseFloat(storedItemBlockOpacity));
    }

    // Load snowfall settings
    if (storedSnowfallEnabled !== null) {
      setIsSnowfallEnabled(storedSnowfallEnabled === 'true');
    }
    if (storedSnowfallSpeed) {
      setSnowfallSpeed(parseFloat(storedSnowfallSpeed));
    }
    if (storedSnowfallQuantity) {
      setSnowfallQuantity(parseInt(storedSnowfallQuantity));
    }

  }, [generateSnowflake]);


  // Function to save data to localStorage
  const saveAllToLocalStorage = (currentNavItems, currentCategories) => {
    localStorage.setItem('navItems', JSON.stringify(currentNavItems));
    localStorage.setItem('categoriesOrder', JSON.stringify(currentCategories));
    setNavItems(currentNavItems);
    setCategories(currentCategories);
  };

  const handleRightClick = (e, item = null, isCategory = false) => {
    e.preventDefault();
    e.stopPropagation(); // Prevents multiple context menus from appearing

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    setContextMenu({
      visible: true,
      x: e.clientX + scrollLeft,
      y: e.clientY + scrollTop,
      item, // The actual item clicked
      isCategoryMenu: isCategory // To distinguish between item and category right-click
    });
  };

  const handleContextMenuOption = async (action, targetData) => { // Added targetData parameter
    setContextMenu({ visible: false, x: 0, y: 0, item: null, isCategoryMenu: false }); // Hide menu immediately

    if (action === 'delete-category') {
        setAlert({
            visible: true,
            message: `您确定要删除类别 "${targetData}" 及其所有项吗？`,
            onConfirm: () => {
                const categoryToDelete = targetData;
                const updatedNavItems = { ...navItems };
                delete updatedNavItems[categoryToDelete];
                const updatedCategories = categories.filter(cat => cat !== categoryToDelete);
                saveAllToLocalStorage(updatedNavItems, updatedCategories);
                setAlert({ visible: false, message: '', onConfirm: () => {}, onCancel: () => {} });
            },
            onCancel: () => setAlert({ visible: false, message: '', onConfirm: () => {}, onCancel: () => {} }),
            showCancel: true,
            title: "确认删除类别",
        });
    } else if (action === 'delete') { // Item deletion
        setAlert({
            visible: true,
            message: `您确定要删除 "${targetData.name}" 吗？`,
            onConfirm: () => {
                const itemToDelete = targetData;
                const updatedNavItems = { ...navItems };
                updatedNavItems[itemToDelete.category] = updatedNavItems[itemToDelete.category].filter(
                    (link) => link.id !== itemToDelete.id
                );
                if (updatedNavItems[itemToDelete.category].length === 0) {
                    delete updatedNavItems[itemToDelete.category];
                    const updatedCategories = categories.filter(cat => cat !== itemToDelete.category);
                    saveAllToLocalStorage(updatedNavItems, updatedCategories);
                } else {
                    saveAllToLocalStorage(updatedNavItems, categories);
                }
                setAlert({ visible: false, message: '', onConfirm: () => {}, onCancel: () => {} });
            },
            onCancel: () => setAlert({ visible: false, message: '', onConfirm: () => {}, onCancel: () => {} }),
            showCancel: true,
            title: "确认删除网页块",
        });
    } else if (action === 'add') {
        setShowEditModal(true);
        setCurrentEditItem({
            id: generateUniqueId(),
            name: '',
            url: '',
            icon: '',
            category: targetData, // targetData is the category name here
            isNew: true,
        });
    } else if (action === 'edit') { // This is for editing an item directly from context menu
        setShowEditModal(true);
        setCurrentEditItem({ ...targetData });
    }
     else if (action === 'rename-category') {
        const oldCategoryName = targetData;
        const newCategoryName = prompt(`将类别 "${oldCategoryName}" 重命名为:`);
        if (newCategoryName && newCategoryName.trim() !== '' && newCategoryName !== oldCategoryName) {
            if (categories.includes(newCategoryName.trim())) {
                alert('新类别名称已存在，请选择其他名称。');
                return;
            }
            const updatedNavItems = {};
            const updatedCategories = categories.map(cat => {
                if (cat === oldCategoryName) return newCategoryName.trim();
                return cat;
            });
            updatedCategories.forEach(cat => {
                if (cat === newCategoryName.trim() && navItems[oldCategoryName]) {
                    updatedNavItems[newCategoryName.trim()] = navItems[oldCategoryName].map(link => ({
                        ...link,
                        category: newCategoryName.trim()
                    }));
                } else if (navItems[cat]) {
                    updatedNavItems[cat] = navItems[cat];
                }
            });
            delete updatedNavItems[oldCategoryName];
            saveAllToLocalStorage(updatedNavItems, updatedCategories);
            setAlert({
                visible: true,
                message: `类别 "${oldCategoryName}" 已成功重命名为 "${newCategoryName}"。`,
                onConfirm: () => setAlert({ visible: false, message: '' }),
                showCancel: false
            });
        }
    } else if (action === 'add-category') {
        setShowNewCategoryInputModal(true);
    }
  };


  const handleEditModalSave = (updatedItem) => {
    setShowEditModal(false);
    
    const updatedNavItems = { ...navItems };
    let updatedCategories = [...categories];

    if (!categories.includes(updatedItem.category) && updatedItem.category !== 'new-category') {
        updatedCategories.push(updatedItem.category);
        updatedNavItems[updatedItem.category] = [];
    }

    if (updatedItem.isNew) {
      const { isNew, ...itemToAdd } = updatedItem; 
      updatedNavItems[itemToAdd.category].push(itemToAdd);
    } else {
      const oldCategoryName = currentEditItem.category;
      
      if (oldCategoryName && oldCategoryName !== updatedItem.category) {
        updatedNavItems[oldCategoryName] = updatedNavItems[oldCategoryName].filter(link => link.id !== updatedItem.id);
        if (updatedNavItems[oldCategoryName].length === 0) {
          delete updatedNavItems[oldCategoryName];
          updatedCategories = updatedCategories.filter(cat => cat !== oldCategoryName);
        }

        if (!updatedNavItems[updatedItem.category]) {
          updatedNavItems[updatedItem.category] = [];
          if (!updatedCategories.includes(updatedItem.category)) {
              updatedCategories.push(updatedItem.category);
          }
        }
        updatedNavItems[updatedItem.category].push(updatedItem);

      } else {
        updatedNavItems[updatedItem.category] = updatedNavItems[updatedItem.category].map(
          (link) => (link.id === updatedItem.id ? updatedItem : link)
        );
      }
    }

    saveAllToLocalStorage(updatedNavItems, updatedCategories);
    setAlert({
      visible: true,
      message: `"${updatedItem.name}" 已成功${updatedItem.isNew ? '添加' : '更新'}。`,
      onConfirm: () => setAlert({ visible: false, message: '' }),
      showCancel: false
    });
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setCurrentEditItem(null);
  };

  const handleOverallBackgroundSave = (url) => {
    setShowOverallBackgroundModal(false);
    const saveUrl = url.startsWith('data:') ? url : (url.startsWith('http') ? url : `/assets/${url.split('/').pop()}`);
    localStorage.setItem('backgroundImage', saveUrl);
    setBackgroundImage(saveUrl);
    setAlert({
      visible: true,
      message: '背景图片已更新。',
      onConfirm: () => setAlert({ visible: false, message: '' }),
      showCancel: false
    });
  };

  const handleContentPanelBackgroundSave = (color, opacity) => {
    setShowContentPanelBackgroundModal(false);
    localStorage.setItem('panelColor', color);
    localStorage.setItem('panelOpacity', opacity.toString());
    setPanelColor(color);
    setPanelOpacity(opacity);
    setAlert({
      visible: true,
      message: '面板背景样式已更新。',
      onConfirm: () => setAlert({ visible: false, message: '' }),
      showCancel: false
    });
  };

  const handleItemBlockBackgroundSave = (color, opacity) => {
    setShowItemBlockBackgroundModal(false);
    localStorage.setItem('itemBlockColor', color);
    localStorage.setItem('itemBlockOpacity', opacity.toString());
    setItemBlockColor(color);
    setItemBlockOpacity(opacity);
    setAlert({
      visible: true,
      message: '网页块背景样式已更新。',
      onConfirm: () => setAlert({ visible: false, message: '' }),
      showCancel: false
    });
  };

  const handleCategoryNameEdit = (oldCategoryName, newContent) => {
    const cleanedNewCategoryName = newContent.replace(/\(可编辑类别名\)$/, '').trim();

    if (cleanedNewCategoryName && cleanedNewCategoryName !== oldCategoryName) {
      if (categories.includes(cleanedNewCategoryName)) {
        setAlert({ visible: true, message: '新类别名称已存在，请选择其他名称。', onConfirm: () => setAlert({ visible: false, message: '' }) });
        return;
      }
      
      const updatedNavItems = {};
      const updatedCategories = categories.map(cat => {
        if (cat === oldCategoryName) return cleanedNewCategoryName;
        return cat;
      });

      updatedCategories.forEach(cat => {
          if (cat === cleanedNewCategoryName && navItems[oldCategoryName]) {
              updatedNavItems[cleanedNewCategoryName] = navItems[oldCategoryName].map(link => ({
                  ...link,
                  category: cleanedNewCategoryName
              }));
          } else if (navItems[cat]) {
              updatedNavItems[cat] = navItems[cat];
          }
      });
      delete updatedNavItems[oldCategoryName];

      saveAllToLocalStorage(updatedNavItems, updatedCategories);
      setAlert({
        visible: true,
        message: `类别 "${oldCategoryName}" 已成功重命名为 "${cleanedNewCategoryName}"。`,
        onConfirm: () => setAlert({ visible: false, message: '' }),
        showCancel: false
      });
    }
  };

  const handleAddNewCategory = (newCategoryName) => {
    setShowNewCategoryInputModal(false);
    if (newCategoryName) {
        if (categories.includes(newCategoryName)) {
            setAlert({
                visible: true,
                message: `类别 "${newCategoryName}" 已存在。`,
                onConfirm: () => setAlert({ visible: false, message: '' }),
                showCancel: false
            });
            return;
        }

        const updatedCategories = [...categories, newCategoryName];
        const updatedNavItems = { ...navItems, [newCategoryName]: [] };

        saveAllToLocalStorage(updatedNavItems, updatedCategories);

        setAlert({
            visible: true,
            message: `已新增类别 "${newCategoryName}"。`,
            onConfirm: () => setAlert({ visible: false, message: '' }),
            showCancel: false
        });
    }
  };

  const handleCategoryOrderSave = (newOrder) => {
    setShowCategoryOrderModal(false); // Close the modal
    saveAllToLocalStorage(navItems, newOrder); // Save the new order of categories
    setAlert({
        visible: true,
        message: `类目顺序已更新。`,
        onConfirm: () => setAlert({ visible: false, message: '' }),
        showCancel: false
    });
  };

  const handleSnowfallSettingsSave = (enabled, speed, quantity) => {
    setShowSnowfallSettingsModal(false);
    localStorage.setItem('isSnowfallEnabled', enabled.toString());
    localStorage.setItem('snowfallSpeed', speed.toString());
    localStorage.setItem('snowfallQuantity', quantity.toString());
    setIsSnowfallEnabled(enabled);
    setSnowfallSpeed(speed);
    setSnowfallQuantity(quantity);
    setAlert({
      visible: true,
      message: '雪花特效设置已更新。',
      onConfirm: () => setAlert({ visible: false, message: '' }),
      showCancel: false
    });
  };


  // Drag and Drop Handlers for nav items (within category)
  // moved draggedItem state declaration to top-level of App component as useState(null)
  const handleDragStart = (e, item, category) => {
    setDraggedItem({ id: item.id, category: category });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({ id: item.id, category: item.category }));
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e, targetItem, targetCategory) => {
    e.preventDefault();
    if (draggedItem && draggedItem.category === targetCategory && draggedItem.id !== targetItem.id) {
      e.currentTarget.classList.add('border-blue-500', 'border-2');
    }
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('border-blue-500', 'border-2');
  };

  const handleDrop = (e, targetItem, targetCategory) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500', 'border-2');

    const data = JSON.parse(e.dataTransfer.getData('text/plain'));

    if (!data || data.category !== targetCategory || data.id === targetItem.id) {
      return;
    }

    const updatedNavItems = { ...navItems };
    const categoryItems = [...updatedNavItems[data.category]];

    const draggedItemIndex = categoryItems.findIndex(item => item.id === data.id);
    const targetItemIndex = categoryItems.findIndex(item => item.id === targetItem.id);

    if (draggedItemIndex === -1 || targetItemIndex === -1) {
      return;
    }

    const [removed] = categoryItems.splice(draggedItemIndex, 1);
    categoryItems.splice(targetItemIndex, 0, removed);

    updatedNavItems[data.category] = categoryItems;
    saveAllToLocalStorage(updatedNavItems, categories);
    setDraggedItem(null);
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDraggedItem(null);
    const allItems = document.querySelectorAll('.nav-item-draggable');
    allItems.forEach(item => item.classList.remove('border-blue-500', 'border-2'));
  };

  // Convert hex color and opacity to rgba string
  const getRgbaColor = (hex, opacity) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Click outside to hide context menu
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        setContextMenu({ visible: false, x: 0, y: 0, item: null, isCategoryMenu: false });
      }
    };
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('scroll', handleClickOutside); 
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('scroll', handleClickOutside);
    };
  }, [contextMenu.visible]);

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      {alert.visible && (
        <AlertDialog
          message={alert.message}
          onConfirm={alert.onConfirm}
          onCancel={alert.onCancel}
          title={alert.title}
          showCancel={alert.showCancel} // Ensure showCancel is passed
          show={alert.visible} // Pass show prop for AlertDialog animation
        />
      )}

      {/* Snowfall Canvas - rendered above background image, below content */}
      <canvas ref={canvasRef} className="fixed inset-0 z-[1] pointer-events-none"></canvas>

      {/* Header */}
      <header className="relative w-full p-4 text-white flex justify-between items-center z-10">
        <div className="flex items-center">
            {/* Logo placeholder */}
            
           <img src={lingxuanLogo} alt="Logo" className="h-10 w-10 object-contain" />
            <span className="ml-2 text-xl font-bold">凌轩导航</span>
        </div>
        
        {/* 直接实现的像素风格时间显示 */}
        {!isEditMode && (
          <motion.div 
            className="absolute left-1/2 transform -translate-x-1/2 px-3 py-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="font-mono text-white text-3xl tracking-tighter" style={{ textShadow: '2px 0 0 #000, -2px 0 0 #000, 0 2px 0 #000, 0 -2px 0 #000' }}>
              {currentTime.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
              }).split('').map((char, i) => (
                <span 
                  key={i} 
                  className={`
                    inline-block w-6 h-7 mx-0.5 text-center
                  `}
                >
                  {char}
                </span>
              ))}
            </div>
          </motion.div>
        )}
        <div className="flex items-center space-x-4 overflow-hidden">
          <AnimatePresence>
            {isEditMode && (
              <motion.div 
                className="flex space-x-4"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  staggerChildren: 0.1
                }}
              >
                <motion.button
                  onClick={() => setShowOverallBackgroundModal(true)}
                  className="px-4 py-2 rounded-full font-semibold transition-colors duration-200 ease-in-out bg-purple-500 hover:bg-purple-600 text-white shadow-md transform hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  背景图片设置
                </motion.button>
                <motion.button
                  onClick={() => setShowContentPanelBackgroundModal(true)}
                  className="px-4 py-2 rounded-full font-semibold transition-colors duration-200 ease-in-out bg-green-500 hover:bg-green-600 text-white shadow-md transform hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  面板背景设置
                </motion.button>
                <motion.button
                  onClick={() => setShowItemBlockBackgroundModal(true)}
                  className="px-4 py-2 rounded-full font-semibold transition-colors duration-200 ease-in-out bg-orange-500 hover:bg-orange-600 text-white shadow-md transform hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  网页块背景设置
                </motion.button>
                <motion.button
                  onClick={() => setShowNewCategoryInputModal(true)}
                  className="px-4 py-2 rounded-full font-semibold transition-colors duration-200 ease-in-out bg-blue-400 hover:bg-blue-500 text-white shadow-md transform hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  新增导航栏类目
                </motion.button>
                <motion.button
                  onClick={() => setShowCategoryOrderModal(true)}
                  className="px-4 py-2 rounded-full font-semibold transition-colors duration-200 ease-in-out bg-indigo-500 hover:bg-indigo-600 text-white shadow-md transform hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  调整类目位置
                </motion.button>
                <motion.button
                  onClick={() => setShowSnowfallSettingsModal(true)}
                  className="px-4 py-2 rounded-full font-semibold transition-colors duration-200 ease-in-out bg-cyan-500 hover:bg-cyan-600 text-white shadow-md transform hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  雪花特效设置
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-4 py-2 rounded-full font-semibold transition-colors duration-200 ease-in-out ${
              isEditMode ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
            } text-white shadow-md transform hover:scale-105`}
          >
             {isEditMode ? '退出编辑' : '进入编辑'}
           </button>
           <button
             onClick={() => setShowLayoutSettingsModal(true)}
             className={`px-4 py-2 rounded-full font-semibold transition-colors duration-200 ease-in-out ${
               isEditMode ? 'bg-purple-500 hover:bg-purple-600' : 'bg-green-500 hover:bg-gray-600'
             } text-white shadow-md transform hover:scale-105 ml-2`}
           >
             布局设定
           </button>
           <button
             onClick={() => window.open('https://github.com/Namber1KING/LingXuan-navigation', '_blank')}
             className="ml-2 w-10 h-10 rounded-full bg-white-800 hover:bg-white-700 transition-colors duration-200 flex items-center justify-center shadow-md transform hover:scale-105"
             title="查看GitHub仓库"
           >
             <img src="https://github.com/favicon.ico" alt="GitHub" className="w-6 h-6" />
           </button>
        </div>
      </header>


      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        {/* Search Bar - Independent block, no background */}
        <div className="w-full flex flex-col items-center mb-8">
          {/* Baidu Logo */}
        <img src={baiduLogo} alt="百度 Logo" className="h-20 object-contain mb-4" /> 
          
          {/* Search Input and Button */}
          <div className="relative flex items-center w-full max-w-2xl">
          <input
            type="text"
            placeholder="搜索"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              debouncedFetchSuggestions(e.target.value);
              if (e.target.value.trim() === '') {
                setShowSuggestions(false);
              } else {
                setShowSuggestions(true);
              }
            }}
            onFocus={() => searchQuery.trim() !== '' && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery) {
                window.open(`https://www.baidu.com/s?wd=${encodeURIComponent(searchQuery)}`, '_blank');
                setShowSuggestions(false);
              } else if (e.key === 'ArrowDown' && showSuggestions && searchSuggestions.length > 0) {
                e.preventDefault();
                // 这里可以添加键盘导航逻辑
              }
            }}
            className="flex-grow px-4 py-3 pl-12 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-inner bg-white bg-opacity-90"
          />
  <span className="absolute left-4 text-gray-400">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  </span>
  <button 
    onClick={() => searchQuery && window.open(`https://www.baidu.com/s?wd=${encodeURIComponent(searchQuery)}`, '_blank')}
    className="px-8 py-4 rounded-r-full bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors shadow-md transform hover:scale-105"
  >
    搜索
  </button>
  
  {/* 搜索建议下拉框 - 添加动画和优化样式 */}


{/* 修改后的搜索建议框 */}
<AnimatePresence>
  {showSuggestions && searchSuggestions.length > 0 && (
    <motion.div
      className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg overflow-hidden z-[1000]"
      style={{ border: '1px solid #e5e7eb' }}
      initial={{ opacity: 0, y: -10, scaleY: 0.9 }}
      animate={{ opacity: 1, y: 0, scaleY: 1 }}
      exit={{ opacity: 0, y: -10, scaleY: 0.9 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.3
      }}
    >
      {searchSuggestions.map((suggestion, index) => (
        <motion.div
          key={index}
          className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          onClick={() => {
            setSearchQuery(suggestion);
            window.open(`https://www.baidu.com/s?wd=${encodeURIComponent(suggestion)}`, '_blank');
            setShowSuggestions(false);
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="flex items-center text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {suggestion}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )}
</AnimatePresence>

</div>
</div>

        {/* Navigation Sections - Main content block, full width of max-w */}
        <div 
          className="p-6 rounded-xl shadow-xl w-[90vw] md:w-[70vw] max-w-[1200px] flex flex-col max-h-[calc(100vh-200px)] overflow-y-auto"
          style={{ backgroundColor: getRgbaColor(panelColor, panelOpacity) }} // Apply dynamic color and opacity
        >
          {/* All categories and items displayed sequentially */}
          <section className="w-full">
            {categories.map((category) => (
              <div key={category} ref={el => categoryRefs.current[category] = el} className="mb-8 last:mb-0">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200 group relative"> {/* Flex container for h3 and button */}
                  <h3
                    className="text-xl font-bold text-gray-800 flex-grow" // flex-grow to push button to right
                    contentEditable={isEditMode}
                    onBlur={(e) => {
                      if (isEditMode) {
                        handleCategoryNameEdit(category, e.currentTarget.textContent);
                      }
                    }}
                    onContextMenu={(e) => isEditMode && handleRightClick(e, category, true)}
                    suppressContentEditableWarning={true} // React warning for contentEditable
                  >
                    {category}
                  </h3>
                  {isEditMode && (
                    <button
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleContextMenuOption('delete-category', category); 
                      }}
                      className="ml-2 px-3 py-1 rounded-full bg-red-500 text-white text-sm hover:bg-red-600 transition-colors shadow-md transform hover:scale-105"
                      title="删除类目"
                    >
                      删除
                    </button>
                  )}
                </div>

                {navItems[category] && navItems[category].length > 0 ? (
                  // Grid with fixed 6 columns for larger screens, responsive for smaller
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">

                    {navItems[category].map((item) => (
                      <a
                        key={item.id}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onContextMenu={(e) => isEditMode && handleRightClick(e, item, false)}
                        // Added nav-item-draggable class for drag/drop styling
                        className={`flex flex-col items-center p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ease-in-out group relative overflow-hidden transform hover:scale-105 nav-item-draggable
                            ${isEditMode ? 'cursor-grab' : ''}`}
                        draggable={isEditMode} // Make draggable only in edit mode
                        onDragStart={(e) => isEditMode && handleDragStart(e, item, category)}
                        onDragOver={isEditMode ? handleDragOver : undefined}
                        onDragEnter={(e) => isEditMode && handleDragEnter(e, item, category)}
                        onDragLeave={isEditMode ? handleDragLeave : undefined}
                        onDrop={(e) => isEditMode && handleDrop(e, item, category)}
                        onDragEnd={isEditMode ? handleDragEnd : undefined}
                        tabIndex={0} // Make link focusable for accessibility
                        style={{ backgroundColor: getRgbaColor(itemBlockColor, itemBlockOpacity) }} // Apply dynamic item block color and opacity
                      >
                        <div className="w-14 h-14 mb-2 flex items-center justify-center rounded-full bg-white shadow-inner group-hover:bg-blue-50 transition-colors">
                          {item.icon ? (
                            <img
                              src={item.icon}
                              alt={item.name}
                              className="w-9 h-9 object-contain rounded-full"
                              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/36x36/cccccc/ffffff?text=图标'; }}
                            />
                          ) : (
                            <span className="text-gray-500 text-xs">无图标</span>
                          )}
                        </div>
                        <p className="text-xs font-medium text-gray-800 text-center truncate w-full px-1">
                          {item.name}
                        </p>
                        {isEditMode && (
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <span className="text-white text-xs font-bold">右键编辑</span>
                          </div>
                        )}
                      </a>
                    ))}
                    {isEditMode && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleContextMenuOption('add', category);
                        }}
                        className="flex flex-col items-center p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ease-in-out group relative overflow-hidden transform hover:scale-105"
                        style={{ backgroundColor: getRgbaColor(itemBlockColor, itemBlockOpacity) }}
                        tabIndex={0}
                      >
                        <div className="w-14 h-14 mb-2 flex items-center justify-center rounded-full bg-white shadow-inner group-hover:bg-blue-50 transition-colors">
                          <i className="fa-solid fa-plus text-gray-500 text-xl"></i>
                        </div>
                        <p className="text-xs font-medium text-gray-800 text-center truncate w-full px-1">
                          添加新网页
                        </p>
                      </button>
                    )}

                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    <p>此类别中没有导航项。</p>
                    {isEditMode && (
                      <p className="mt-2">
                        <button
                          onClick={(e) => handleRightClick(e, category, true)}
                          className="text-blue-600 hover:underline"
                          tabIndex={0} // Make button focusable
                        >
                          右键点击类别添加新项
                        </button>
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
            {isEditMode && categories.length === 0 && ( // When there are no categories at all
              <div className="text-center text-gray-500 py-10">
                <p className="text-lg">没有可用的类别。请添加一个。</p>
                <button
                  onClick={() => setShowNewCategoryInputModal(true)} // Open new category input modal
                  className="text-blue-600 hover:underline mt-2"
                  tabIndex={0} // Make button focusable
                >
                  点击这里添加第一个类别
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Custom Context Menu */}
      {contextMenu.visible && (
        <div
          className="absolute bg-white border border-gray-200 rounded-md shadow-lg py-1 z-[1001] transition-opacity duration-200 animate-scaleIn"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          // Ensure context menu is within viewport
          // This is a basic adjustment; a more robust solution might require calculating viewport edges
        >
          {contextMenu.isCategoryMenu ? (
            <>
              <button
                onClick={() => handleContextMenuOption('add', contextMenu.item)} // Pass item to handler
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transform hover:scale-105"
                tabIndex={0} // Make button focusable
              >
                添加新项
              </button>
              {contextMenu.item !== 'AI' && ( // Prevent renaming/deleting 'AI' category for simplicity
                <>
                    <button
                        onClick={() => handleContextMenuOption('rename-category', contextMenu.item)} // Pass item to handler
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transform hover:scale-105"
                        tabIndex={0} // Make button focusable
                    >
                        重命名类别
                    </button>
                    {/* The delete category button is now always rendered next to the category title in edit mode */}
                </>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => handleContextMenuOption('edit', contextMenu.item)} // Pass item to handler
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transform hover:scale-105"
                tabIndex={0} // Make button focusable
              >
                编辑
              </button>
              <button
                onClick={() => handleContextMenuOption('delete', contextMenu.item)} // Pass item to handler
                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 transform hover:scale-105"
                tabIndex={0} // Make button focusable
              >
                删除
              </button>
            </>
          )}
        </div>
      )}

      {/* Edit/Add Modal */}
      {showEditModal && (
        <EditModal
          item={currentEditItem}
          categories={categories}
          onSave={handleEditModalSave}
          onClose={handleEditModalClose}
          show={showEditModal} // Pass show prop for animation
        />
      )}

      {/* Background Settings Modal (for overall page background image) */}
      {showOverallBackgroundModal && (
        <OverallPageBackgroundSettingsModal
          currentBackgroundUrl={backgroundImage}
          onSave={handleOverallBackgroundSave}
          onClose={() => setShowOverallBackgroundModal(false)}
          show={showOverallBackgroundModal} // Pass show prop for animation
        />
      )}

      {/* Content Panel Background Settings Modal (for color and opacity of the main content block) */}
      {showContentPanelBackgroundModal && (
        <ColorOpacitySettingsModal
          title="面板背景设置"
          currentBackgroundColor={panelColor}
          currentBackgroundOpacity={panelOpacity}
          onSave={handleContentPanelBackgroundSave}
          onClose={() => setShowContentPanelBackgroundModal(false)}
          show={showContentPanelBackgroundModal} // Pass show prop for animation
        />
      )}

      {/* Item Block Background Settings Modal (for color and opacity of individual item blocks) */}
      {showItemBlockBackgroundModal && (
        <ColorOpacitySettingsModal
          title="网页块背景设置"
          currentBackgroundColor={itemBlockColor}
          currentBackgroundOpacity={itemBlockOpacity}
          onSave={handleItemBlockBackgroundSave}
          onClose={() => setShowItemBlockBackgroundModal(false)}
          show={showItemBlockBackgroundModal} // Pass show prop for animation
        />
      )}

      {/* New Category Input Modal */}
      {showNewCategoryInputModal && (
        <NewCategoryInputModal
          onSave={handleAddNewCategory} // Pass the handler for new category creation
          onClose={() => setShowNewCategoryInputModal(false)}
          existingCategories={categories} // Pass existing categories to validate duplicates
          show={showNewCategoryInputModal} // Pass show prop for animation
        />
      )}

      {/* Category Order Modal */}
      {showCategoryOrderModal && (
        <CategoryOrderModal
          categories={categories}
          onSave={handleCategoryOrderSave}
          onClose={() => setShowCategoryOrderModal(false)}
          show={showCategoryOrderModal} // Pass show prop for animation
        />
      )}

      {/* Snowfall Settings Modal */}
{showSnowfallSettingsModal && (
  <SnowfallSettingsModal
    isEnabled={isSnowfallEnabled}
    speed={snowfallSpeed}
    quantity={snowfallQuantity}
    onSave={handleSnowfallSettingsSave}
    onClose={() => setShowSnowfallSettingsModal(false)}
    show={showSnowfallSettingsModal} // Pass show prop for internal animation
  />
)}
      {/* Layout Settings Modal */}
      <LayoutSettingsModal
        onExport={exportLayout}
        onImport={(data) => importLayout(data, {
          setNavItems,
          setCategories,
          setPanelColor,
          setPanelOpacity,
          setItemBlockColor,
          setItemBlockOpacity,
          setBackgroundImage,
          setIsSnowfallEnabled,
          setSnowfallSpeed,
          setSnowfallQuantity,
          setAlert
        })}
        onClose={() => setShowLayoutSettingsModal(false)}
        show={showLayoutSettingsModal}
      />
      {showLayoutSettingsModal && (
        <LayoutSettingsModal
          onExport={exportLayout}
          onImport={(data) => importLayout(data, {
            setNavItems,
            setCategories,
            setPanelColor,
            setPanelOpacity,
            setItemBlockColor,
            setItemBlockOpacity,
            setBackgroundImage,
            setIsSnowfallEnabled,
            setSnowfallSpeed,
            setSnowfallQuantity,
            setAlert
          })}
          onClose={() => setShowLayoutSettingsModal(false)}
          show={showLayoutSettingsModal}
        />
      )}
     </div>
   );
 }

import { LayoutUtils } from './lib/layoutUtils';



// Import layout from JSON file
const importLayout = (data: any, setters: {
  setNavItems: (items: any) => void,
  setCategories: (categories: string[]) => void,
  setPanelColor: (color: string) => void,
  setPanelOpacity: (opacity: number) => void,
  setItemBlockColor: (color: string) => void,
  setItemBlockOpacity: (opacity: number) => void,
  setBackgroundImage: (url: string) => void,
  setIsSnowfallEnabled: (enabled: boolean) => void,
  setSnowfallSpeed: (speed: number) => void,
  setSnowfallQuantity: (quantity: number) => void,
  setAlert: (alert: any) => void
}) => {
  try {
    if (!LayoutUtils.validateLayoutData(data)) {
      throw new Error('无效的布局文件');
    }
    
    setters.setNavItems(data.navItems);
    setters.setCategories(data.categories);
    if (data.panelColor) setters.setPanelColor(data.panelColor);
    if (data.panelOpacity) setters.setPanelOpacity(data.panelOpacity);
    if (data.itemBlockColor) setters.setItemBlockColor(data.itemBlockColor);
    if (data.itemBlockOpacity) setters.setItemBlockOpacity(data.itemBlockOpacity);
    if (data.backgroundImage) setters.setBackgroundImage(data.backgroundImage);
    if (data.isSnowfallEnabled !== undefined) setters.setIsSnowfallEnabled(data.isSnowfallEnabled);
    if (data.snowfallSpeed) setters.setSnowfallSpeed(data.snowfallSpeed);
    if (data.snowfallQuantity) setters.setSnowfallQuantity(data.snowfallQuantity);
    
    // Save to localStorage
    localStorage.setItem('navItems', JSON.stringify(data.navItems));
    localStorage.setItem('categoriesOrder', JSON.stringify(data.categories));
    if (data.panelColor) localStorage.setItem('panelColor', data.panelColor);
    if (data.panelOpacity) localStorage.setItem('panelOpacity', data.panelOpacity.toString());
    if (data.itemBlockColor) localStorage.setItem('itemBlockColor', data.itemBlockColor);
    if (data.itemBlockOpacity) localStorage.setItem('itemBlockOpacity', data.itemBlockOpacity.toString());
    if (data.backgroundImage) localStorage.setItem('backgroundImage', data.backgroundImage);
    if (data.isSnowfallEnabled !== undefined) localStorage.setItem('isSnowfallEnabled', data.isSnowfallEnabled.toString());
    if (data.snowfallSpeed) localStorage.setItem('snowfallSpeed', data.snowfallSpeed.toString());
    if (data.snowfallQuantity) localStorage.setItem('snowfallQuantity', data.snowfallQuantity.toString());
    
    setters.setAlert({
      visible: true,
      message: '布局已成功导入！',
      onConfirm: () => setters.setAlert({ visible: false, message: '' }),
      showCancel: false
    });
  } catch (error) {
    setters.setAlert({
      visible: true,
      message: `导入失败: ${error.message}`,
      onConfirm: () => setters.setAlert({ visible: false, message: '' }),
      showCancel: false
    });
  }
};




export default App;
