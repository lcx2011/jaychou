import { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { exportJSON, copyForExcel, importJSON } from '../../utils/storage';

export default function DataTab() {
  const { state, dispatch, undo } = useApp();
  const { showToast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await importJSON(file);
      dispatch({ type: 'IMPORT_SONGS', payload: data });
      showToast(`成功导入 ${data.length} 首歌曲`, { label: '撤销', onClick: undo });
    } catch {
      showToast('文件解析失败，请检查格式');
    }
    e.target.value = '';
  };

  const handleExportJSON = () => {
    exportJSON(state.songs);
    showToast('JSON备份已下载');
  };

  const handleCopyExcel = () => {
    copyForExcel(state.songs);
    showToast('已复制到剪贴板，可直接粘贴到Excel');
  };

  const handleClear = () => {
    if (confirm('⚠️ 警告：这将清空你所有的打分数据！\n确定要清空吗？')) {
      dispatch({ type: 'CLEAR_ALL' });
      showToast('已清空所有数据', { label: '撤销', onClick: undo });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <div className="bg-white p-8 lg:p-10 rounded-2xl shadow-sm border border-stone-200 text-center space-y-8">
        <div>
          <h3 className="text-2xl font-bold mb-3 text-stone-700">📥 导出与复制</h3>
          <p className="text-base text-stone-500 mb-6">将已打分的歌曲保存到本地，或直接复制到Excel。</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={handleExportJSON} className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold text-base hover:bg-emerald-600 transition shadow-sm cursor-pointer">
              下载 JSON 备份
            </button>
            <button onClick={handleCopyExcel} className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold text-base hover:bg-blue-600 transition shadow-sm cursor-pointer">
              📋 复制为 Excel 格式
            </button>
          </div>
        </div>
        <div className="h-px bg-stone-200" />
        <div>
          <h3 className="text-2xl font-bold mb-3 text-stone-700">📤 导入数据</h3>
          <p className="text-base text-stone-500 mb-6">上传之前下载的 JSON 备份文件恢复数据。</p>
          <input ref={fileRef} type="file" onChange={handleImport} accept=".json" className="block w-full text-base text-stone-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-base file:font-bold file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200 mx-auto max-w-sm transition cursor-pointer" />
        </div>
      </div>

      <div className="bg-white p-8 lg:p-10 rounded-2xl shadow-sm border border-stone-200 text-center space-y-8">
        <div>
          <h3 className="text-2xl font-bold mb-3 text-stone-700">↩️ 历史记录与撤销</h3>
          <p className="text-base text-stone-500 mb-4">最近的操作记录，可撤销误操作。</p>
          {state.historyStack.length > 0 ? (
            <div className="space-y-3">
              <button onClick={undo} className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-900 rounded-xl font-bold text-base transition shadow-sm cursor-pointer">
                ↩️ 撤销上一步 ({state.historyStack[state.historyStack.length - 1].description})
              </button>
              <div className="text-left mt-4 max-h-48 overflow-y-auto border border-stone-200 rounded-xl">
                {[...state.historyStack].reverse().map(entry => (
                  <div key={entry.id} className="px-4 py-2.5 border-b border-stone-100 last:border-b-0 text-sm text-stone-600 flex justify-between">
                    <span>{entry.description}</span>
                    <span className="text-stone-400">{new Date(entry.timestamp).toLocaleTimeString('zh-CN')}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-stone-400">暂无操作记录</p>
          )}
        </div>
      </div>

      <div className="text-center">
        <button onClick={handleClear} className="px-6 py-3 border-2 border-red-200 text-red-500 rounded-xl font-bold text-base hover:bg-red-50 transition cursor-pointer">
          🗑️ 清空所有本地数据
        </button>
      </div>
    </div>
  );
}
