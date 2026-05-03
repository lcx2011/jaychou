import { useState, useRef, useEffect } from 'react';
import { ALL_SONGS, SONG_TO_ALBUM, ALL_ALBUMS, ALBUM_PRESETS } from '../../constants/albums';

interface AlbumAutocompleteProps {
  name: string;
  album: string;
  year: number;
  onNameChange: (value: string) => void;
  onAlbumChange: (value: string) => void;
  onYearChange: (value: number) => void;
}

export default function AlbumAutocomplete({ name, album, year, onNameChange, onAlbumChange, onYearChange }: AlbumAutocompleteProps) {
  const [showSongSuggestions, setShowSongSuggestions] = useState(false);
  const [showAlbumSuggestions, setShowAlbumSuggestions] = useState(false);
  const songRef = useRef<HTMLDivElement>(null);
  const albumRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (songRef.current && !songRef.current.contains(e.target as Node)) setShowSongSuggestions(false);
      if (albumRef.current && !albumRef.current.contains(e.target as Node)) setShowAlbumSuggestions(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const songSuggestions = name ? ALL_SONGS.filter(s => s.toLowerCase().includes(name.toLowerCase())).slice(0, 8) : [];
  const albumSuggestions = ALL_ALBUMS.filter(a => a.toLowerCase().includes(album.toLowerCase())).slice(0, 5);

  function selectSong(songName: string) {
    onNameChange(songName);
    const info = SONG_TO_ALBUM[songName];
    if (info) {
      onAlbumChange(info.album);
      onYearChange(info.year);
    }
    setShowSongSuggestions(false);
  }

  function selectAlbum(albumName: string) {
    onAlbumChange(albumName);
    const preset = ALBUM_PRESETS.find(p => p.album === albumName);
    if (preset) onYearChange(preset.year);
    setShowAlbumSuggestions(false);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
      <div ref={songRef} className="relative">
        <label className="block text-sm font-bold text-stone-600 mb-1.5">歌曲名 <span className="text-red-400">*</span></label>
        <input
          value={name}
          onChange={e => { onNameChange(e.target.value); setShowSongSuggestions(true); }}
          onFocus={() => setShowSongSuggestions(true)}
          type="text"
          className="w-full border border-stone-300 p-3 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none text-base transition bg-stone-50"
          placeholder="如: 夜曲"
        />
        {showSongSuggestions && songSuggestions.length > 0 && (
          <div className="absolute z-20 w-full bg-white border border-stone-200 rounded-xl shadow-lg mt-1 max-h-48 overflow-y-auto">
            {songSuggestions.map(s => (
              <button
                key={s}
                type="button"
                className="w-full text-left px-4 py-2.5 hover:bg-amber-50 text-base border-b border-stone-100 last:border-b-0 flex justify-between items-center cursor-pointer"
                onClick={() => selectSong(s)}
              >
                <span className="font-bold text-stone-700">{s}</span>
                <span className="text-sm text-stone-400">{SONG_TO_ALBUM[s]?.album}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div ref={albumRef} className="relative">
        <label className="block text-sm font-bold text-stone-600 mb-1.5">所属专辑</label>
        <input
          value={album}
          onChange={e => { onAlbumChange(e.target.value); setShowAlbumSuggestions(true); }}
          onFocus={() => setShowAlbumSuggestions(true)}
          type="text"
          className="w-full border border-stone-300 p-3 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none text-base transition bg-stone-50"
          placeholder="如: 十一月的萧邦"
        />
        {showAlbumSuggestions && albumSuggestions.length > 0 && (
          <div className="absolute z-20 w-full bg-white border border-stone-200 rounded-xl shadow-lg mt-1 max-h-48 overflow-y-auto">
            {albumSuggestions.map(a => {
              const preset = ALBUM_PRESETS.find(p => p.album === a);
              return (
                <button
                  key={a}
                  type="button"
                  className="w-full text-left px-4 py-2.5 hover:bg-amber-50 text-base border-b border-stone-100 last:border-b-0 flex justify-between items-center cursor-pointer"
                  onClick={() => selectAlbum(a)}
                >
                  <span className="font-bold text-stone-700">{a}</span>
                  <span className="text-sm text-stone-400">{preset?.year}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-bold text-stone-600 mb-1.5">发行年份</label>
        <input
          value={year || ''}
          onChange={e => onYearChange(Number(e.target.value))}
          type="number"
          className="w-full border border-stone-300 p-3 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none text-base transition bg-stone-50"
          placeholder="如: 2005"
        />
      </div>
    </div>
  );
}
