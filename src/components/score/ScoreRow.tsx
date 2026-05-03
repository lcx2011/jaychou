interface ScoreRowProps {
  title: string;
  weight: string;
  score: number;
  remark: string;
  placeholder: string;
  color: string;
  onScoreChange: (value: number) => void;
  onRemarkChange: (value: string) => void;
}

const colorMap: Record<string, { bg: string; border: string; focus: string; text: string; accent: string }> = {
  amber:   { bg: 'bg-amber-50/60',   border: 'border-amber-100',   focus: 'focus:ring-amber-400 focus:border-amber-400',   text: 'text-amber-600',   accent: 'border-amber-400' },
  blue:    { bg: 'bg-blue-50/50',    border: 'border-blue-100',    focus: 'focus:ring-blue-400 focus:border-blue-400',     text: 'text-blue-600',    accent: 'border-blue-400' },
  emerald: { bg: 'bg-emerald-50/50', border: 'border-emerald-100', focus: 'focus:ring-emerald-400 focus:border-emerald-400', text: 'text-emerald-600', accent: 'border-emerald-400' },
  purple:  { bg: 'bg-purple-50/40',  border: 'border-purple-100',  focus: 'focus:ring-purple-400 focus:border-purple-400',   text: 'text-purple-600',  accent: 'border-purple-400' },
  rose:    { bg: 'bg-rose-50/40',    border: 'border-rose-100',    focus: 'focus:ring-rose-400 focus:border-rose-400',       text: 'text-rose-600',    accent: 'border-rose-400' },
};

export default function ScoreRow({ title, weight, score, remark, placeholder, color, onScoreChange, onRemarkChange }: ScoreRowProps) {
  const c = colorMap[color] || colorMap.amber;

  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center p-4 rounded-xl border transition hover:shadow-sm gap-3 ${c.bg} ${c.border}`}>
      <div className="flex flex-col justify-center sm:w-28 shrink-0">
        <span className={`font-black text-xl ${c.text}`}>{title}</span>
        <span className="text-sm font-bold text-stone-400">{weight}</span>
      </div>
      <div className="w-full sm:w-24 shrink-0">
        <input
          type="number"
          min={0}
          max={100}
          value={score || ''}
          onChange={e => onScoreChange(Number(e.target.value))}
          className={`w-full text-center border-b-2 border-stone-300 ${c.focus} outline-none bg-transparent font-black text-3xl text-stone-800 py-1 transition`}
          placeholder="0"
        />
      </div>
      <div className="flex-1 w-full">
        <input
          type="text"
          value={remark}
          onChange={e => onRemarkChange(e.target.value)}
          className={`w-full border border-stone-300 p-3 rounded-lg text-base outline-none ring-0 focus:ring-2 ${c.focus} bg-white transition`}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
