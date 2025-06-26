export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Tailwind CSS 基础组件模板</h1>
        
        <div className="grid gap-6">
          {/* 文字排版示例 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">文字排版</h2>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">标题1 (text-4xl font-bold)</h1>
              <h2 className="text-3xl font-semibold">标题2 (text-3xl font-semibold)</h2>
              <h3 className="text-2xl font-medium">标题3 (text-2xl font-medium)</h3>
              <p className="text-base leading-relaxed">正文文本 (text-base leading-relaxed)</p>
              <p className="text-sm text-gray-500">小号灰色文本 (text-sm text-gray-500)</p>
            </div>
          </div>

          {/* 色彩系统示例 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">色彩系统</h2>
            <div className="grid grid-cols-3 gap-4">
              {['blue', 'green', 'red', 'yellow', 'purple', 'pink'].map((color) => (
                <div key={color} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full bg-${color}-500 mr-2`}></div>
                  <span className="text-sm capitalize">{color}-500</span>
                </div>
              ))}
            </div>
          </div>

          {/* 响应式设计示例 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">响应式设计</h2>
            <div className="space-y-4">
              <p className="text-base md:text-lg lg:text-xl">
                这个文本在不同屏幕尺寸下会改变大小：
                <br />
                - 移动端: text-base (16px)
                <br />
                - 平板: md:text-lg (18px)
                <br />
                - 桌面: lg:text-xl (20px)
              </p>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 bg-blue-100 p-4 rounded">移动端单列 (flex-col)</div>
                <div className="flex-1 bg-green-100 p-4 rounded">平板/桌面多列 (md:flex-row)</div>
              </div>
            </div>
          </div>

          {/* 间距系统示例 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">间距系统</h2>
            <div className="space-y-4">
              {['m-1', 'm-2', 'm-4', 'm-8', 'm-16'].map((spacing) => (
                <div key={spacing} className={`${spacing} bg-gray-100 p-2`}>
                  {spacing} (margin: {spacing.replace('m-', '') * 0.25}rem)
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}