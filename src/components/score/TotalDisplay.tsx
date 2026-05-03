import { calculateTotal, calculateTier } from '../../utils/scoring';
import type { SongFormData } from '../../types';

export default function TotalDisplay({ form }: { form: SongFormData }) {
  const total = calculateTotal({
    melody: form.melody || 0,
    arrangement: form.arrangement || 0,
    lyrics: form.lyrics || 0,
    vocal: form.vocal || 0,
    innovation: form.innovation || 0,
  });
  const tier = calculateTier(total);

  return (
    <div>
      <div className="text-sm text-stone-400 mb-1">公式加权总分</div>
      <div className="text-4xl sm:text-5xl font-black text-amber-400 tracking-tight">
        {total.toFixed(2)}
        <span className="text-xl sm:text-2xl text-stone-900 ml-3 bg-amber-400 px-4 py-1 rounded-md align-text-bottom whitespace-nowrap">
          {tier} 档
        </span>
      </div>
    </div>
  );
}
