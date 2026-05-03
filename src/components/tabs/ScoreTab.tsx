import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import AlbumAutocomplete from '../score/AlbumAutocomplete';
import ScoreRow from '../score/ScoreRow';
import TotalDisplay from '../score/TotalDisplay';
import RubricContent from '../layout/RubricContent';

// ... 前面 import 部分保持不变

export default function ScoreTab() {
  const { state, dispatch, saveSong, cancelEdit } = useApp();
  const { showToast } = useToast();
  const { form, isEditing } = state;
  const [showRubric, setShowRubric] = useState(false);

  const setFormField = (field: string, value: string | number) => {
    dispatch({ type: 'SET_FORM_FIELD', payload: { field, value } });
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      showToast('请填写歌曲名！');
      return;
    }
    saveSong();
    showToast(
      isEditing ? `已保存《${form.name}》` : `已录入《${form.name}》`,
      { label: '撤销', onClick: () => dispatch({ type: 'UNDO' }) }
    );
  };

  return (
    /* 
       关键改动 1: 
       - 使用 w-full 占满 100% 宽度
       - 去掉所有的 max-w-xxx 限制
       - px-4 为手机端留一点点边距，xl:px-0 在大屏时彻底占满（视你需求而定）
    */
    <div className={`w-full px-4 lg:px-6 pb-6 ${
      showRubric 
        ? 'grid grid-cols-1 xl:grid-cols-2 gap-6 items-start h-auto xl:h-[calc(100vh-6rem)]' 
        : 'w-full'
    }`}>
      
      {/* 左侧区域：评分表单 */}
      <div className={`
        bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-stone-200 flex flex-col
        ${showRubric ? 'h-full overflow-y-auto' : 'w-full max-w-none'} 
      `}>
        {/* 标题栏 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-stone-700 flex items-center gap-2">
            <span className="text-amber-500">✏️</span> {isEditing ? '编辑歌曲评分' : '录入新歌评分'}
          </h2>
          <button
            onClick={() => setShowRubric(!showRubric)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition cursor-pointer ${
              showRubric
                ? 'bg-amber-100 text-amber-700'
                : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
            }`}
          >
            📖 {showRubric ? '收起评分细则' : '查看评分细则'}
          </button>
        </div>

        {/* 内容区 */}
        <div className="flex-1 space-y-6">
          <AlbumAutocomplete
            name={form.name}
            album={form.album}
            year={form.year}
            onNameChange={v => setFormField('name', v)}
            onAlbumChange={v => setFormField('album', v)}
            onYearChange={v => setFormField('year', v)}
          />

          <div className="space-y-3">
            <ScoreRow title="旋律" weight="30%" score={form.melody} remark={form.melody_remark} placeholder="前奏、副歌记忆点等" onScoreChange={v => setFormField('melody', v)} onRemarkChange={v => setFormField('melody_remark', v)} color="amber" />
            <ScoreRow title="编曲" weight="25%" score={form.arrangement} remark={form.arrangement_remark} placeholder="乐器层次、采样等" onScoreChange={v => setFormField('arrangement', v)} onRemarkChange={v => setFormField('arrangement_remark', v)} color="blue" />
            <ScoreRow title="歌词" weight="20%" score={form.lyrics} remark={form.lyrics_remark} placeholder="咬合度、画面感等" onScoreChange={v => setFormField('lyrics', v)} onRemarkChange={v => setFormField('lyrics_remark', v)} color="emerald" />
            <ScoreRow title="演唱" weight="15%" score={form.vocal} remark={form.vocal_remark} placeholder="情绪代入、技术等" onScoreChange={v => setFormField('vocal', v)} onRemarkChange={v => setFormField('vocal_remark', v)} color="purple" />
            <ScoreRow title="创新" weight="10%" score={form.innovation} remark={form.innovation_remark} placeholder="流派突破、历史地位等" onScoreChange={v => setFormField('innovation', v)} onRemarkChange={v => setFormField('innovation_remark', v)} color="rose" />
          </div>
        </div>

        {/* 底部保存条 */}
        <div className="mt-8 bg-stone-800 p-6 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-md gap-4">
          <TotalDisplay form={form} />
          <div className="flex gap-3">
            {isEditing && (
              <button onClick={cancelEdit} className="px-6 py-3 bg-stone-600 hover:bg-stone-500 text-white rounded-lg font-bold text-lg transition cursor-pointer">
                取消
              </button>
            )}
            <button onClick={handleSave} className="px-8 py-4 bg-amber-400 hover:bg-amber-300 text-stone-900 rounded-lg font-bold text-xl shadow-lg transition hover:scale-105 cursor-pointer">
              💾 {isEditing ? '保存修改' : '录入榜单'}
            </button>
          </div>
        </div>
      </div>

      {/* 右侧区域：评分细则 */}
      {showRubric && (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 h-full overflow-y-auto w-full">
          <div className="p-6 lg:p-8">
            <RubricContent />
          </div>
        </div>
      )}
    </div>
  );
}