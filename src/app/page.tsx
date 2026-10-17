'use client';

import React, { useState, useEffect } from 'react';

const DEFAULT_BOOKMARKS = [
  { id: 1, title: 'GitHub 저장소', url: 'https://github.com', icon: '💻' },
  { id: 2, title: 'Vercel 대시보드', url: 'https://vercel.com', icon: '🚀' }
];

const THEMES: Record<string, { 
  name: string; 
  bg: string; 
  card: string; 
  accent: string; 
  btn: string; 
  badge: string; 
  glow: string; 
  bgImage?: string 
}> = {
  dugout: {
    name: '⚾ 한화의 오렌지 더그아웃',
    bg: 'bg-slate-950',
    glow: 'from-orange-500/30 via-slate-950 to-slate-950',
    bgImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2000&auto=format&fit=crop',
    card: 'bg-slate-900/85 border-orange-500/30 shadow-orange-950/20 shadow-xl backdrop-blur-xl',
    accent: 'text-orange-500',
    btn: 'bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold shadow-lg shadow-orange-500/25',
    badge: 'bg-orange-500/10 text-orange-400 border-orange-500/30'
  },
  stream: {
    name: '🐟 공지천',
    bg: 'bg-stone-950',
    glow: 'from-teal-500/30 via-stone-950 to-stone-950',
    bgImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop',
    card: 'bg-stone-900/85 border-teal-500/30 shadow-teal-950/20 shadow-xl backdrop-blur-xl',
    accent: 'text-teal-400',
    btn: 'bg-teal-500 hover:bg-teal-600 text-stone-950 font-bold shadow-lg shadow-teal-500/25',
    badge: 'bg-teal-500/10 text-teal-300 border-teal-500/30'
  },
  mountain: {
    name: '🌲 야산',
    bg: 'bg-zinc-950',
    glow: 'from-emerald-600/30 via-zinc-950 to-zinc-950',
    bgImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2000&auto=format&fit=crop',
    card: 'bg-zinc-900/85 border-emerald-600/30 shadow-emerald-950/20 shadow-xl backdrop-blur-xl',
    accent: 'text-emerald-400',
    btn: 'bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold shadow-lg shadow-emerald-600/25',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
  },
  ru_armory: {
    name: '🎖️ 소련 - T-80U 무기고',
    bg: 'bg-neutral-950',
    glow: 'from-red-600/35 via-neutral-950 to-neutral-950',
    bgImage: 'https://images.unsplash.com/photo-1579912437766-788398e2ef84?q=80&w=2000&auto=format&fit=crop',
    card: 'bg-neutral-900/85 border-red-600/40 shadow-red-950/30 shadow-xl backdrop-blur-xl',
    accent: 'text-red-500',
    btn: 'bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg shadow-red-600/30',
    badge: 'bg-red-500/10 text-red-400 border-red-500/30'
  },
  us_armory: {
    name: '🦅 미국 - M1 에이브람스 & F-35 무기고',
    bg: 'bg-slate-950',
    glow: 'from-cyan-500/35 via-slate-950 to-slate-950',
    bgImage: 'https://images.unsplash.com/photo-1519074069444-1ba4eae1672a?q=80&w=2000&auto=format&fit=crop',
    card: 'bg-slate-900/85 border-cyan-500/40 shadow-cyan-950/30 shadow-xl backdrop-blur-xl',
    accent: 'text-cyan-400',
    btn: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/30',
    badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
  },
  de_armory: {
    name: '🛡️ 독일 - 레오파르트 2 무기고',
    bg: 'bg-zinc-950',
    glow: 'from-amber-500/30 via-zinc-950 to-zinc-950',
    bgImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=2000&auto=format&fit=crop',
    card: 'bg-zinc-900/85 border-amber-500/30 shadow-zinc-950/30 shadow-xl backdrop-blur-xl',
    accent: 'text-yellow-400',
    btn: 'bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold shadow-lg shadow-amber-500/30',
    badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30'
  }
};

export default function AgitMain() {
  const [isAppUnlocked, setIsAppUnlocked] = useState(false);
  const [masterPin, setMasterPin] = useState('1234');
  const [loginInput, setLoginInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [tab, setTab] = useState('dash');
  const [themeKey, setThemeKey] = useState('dugout');
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  
  const [isDiaryLocked, setIsDiaryLocked] = useState(true);
  const [diaryPinInput, setDiaryPinInput] = useState('');

  const [diaries, setDiaries] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [todos, setTodos] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>(DEFAULT_BOOKMARKS);
  const [fishLogs, setFishLogs] = useState<any[]>([]);
  const [fishCategoryFilter, setFishCategoryFilter] = useState('전체');

  const [newDiary, setNewDiary] = useState({ title: '', content: '', emoji: '😊', weather: '☀️ 맑음' });
  const [newNote, setNewNote] = useState({ title: '', content: '', category: '일반' });
  const [newTodo, setNewTodo] = useState({ content: '', priority: 'normal', dDay: '' });
  const [newBmk, setNewBmk] = useState({ title: '', url: '', icon: '🔗' });
  const [newFishLog, setNewFishLog] = useState({
    title: '', species: '', location: '', category: '민물고기/탐어', size: '', memo: '', photoUrl: ''
  });

  useEffect(() => {
    const savedPin = localStorage.getItem('agit_master_pin');
    if (savedPin) setMasterPin(savedPin);
    
    const isAuth = sessionStorage.getItem('agit_authenticated');
    if (isAuth === 'true') setIsAppUnlocked(true);

    const savedTheme = localStorage.getItem('agit_theme_key');
    if (savedTheme) setThemeKey(savedTheme);

    const lDiaries = localStorage.getItem('agit_diaries');
    if (lDiaries) setDiaries(JSON.parse(lDiaries));
    const lNotes = localStorage.getItem('agit_notes');
    if (lNotes) setNotes(JSON.parse(lNotes));
    const lTodos = localStorage.getItem('agit_todos');
    if (lTodos) setTodos(JSON.parse(lTodos));
    
    const lBmk = localStorage.getItem('agit_bookmarks');
    if (lBmk) {
      const parsed = JSON.parse(lBmk);
      setBookmarks(parsed.length > 0 ? parsed : DEFAULT_BOOKMARKS);
    }

    const lFish = localStorage.getItem('agit_fish_logs');
    if (lFish) setFishLogs(JSON.parse(lFish));

    fetch('/api/agit')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          if (res.data.diaries?.length) { setDiaries(res.data.diaries); localStorage.setItem('agit_diaries', JSON.stringify(res.data.diaries)); }
          if (res.data.notes?.length) { setNotes(res.data.notes); localStorage.setItem('agit_notes', JSON.stringify(res.data.notes)); }
          if (res.data.todos?.length) { setTodos(res.data.todos); localStorage.setItem('agit_todos', JSON.stringify(res.data.todos)); }
          if (res.data.bookmarks?.length) { setBookmarks(res.data.bookmarks); localStorage.setItem('agit_bookmarks', JSON.stringify(res.data.bookmarks)); }
          if (res.data.fishLogs?.length) { setFishLogs(res.data.fishLogs); localStorage.setItem('agit_fish_logs', JSON.stringify(res.data.fishLogs)); }
        }
      })
      .catch(() => {});

    const timer = setInterval(() => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('ko-KR', { hour12: false }));
      setDateStr(now.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const curTheme = THEMES[themeKey] || THEMES.dugout;

  const syncData = (type: string, action: string, data: any, updatedList: any[], lsKey: string) => {
    localStorage.setItem(lsKey, JSON.stringify(updatedList));
    fetch('/api/agit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, action, data })
    }).catch(() => {});
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewFishLog(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loginInput === masterPin) {
      setIsAppUnlocked(true);
      sessionStorage.setItem('agit_authenticated', 'true');
      setLoginError(false);
      setLoginInput('');
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsAppUnlocked(false);
    sessionStorage.removeItem('agit_authenticated');
  };

  const handlePinChange = (newPin: string) => {
    setMasterPin(newPin);
    localStorage.setItem('agit_master_pin', newPin);
  };

  const handleThemeChange = (key: string) => {
    setThemeKey(key);
    localStorage.setItem('agit_theme_key', key);
  };

  const calcDday = (targetDate: string) => {
    if (!targetDate) return null;
    const diff = Math.ceil((new Date(targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'D-DAY';
    return diff > 0 ? `D-${diff}` : `D+${Math.abs(diff)}`;
  };

  const filteredFishLogs = fishCategoryFilter === '전체'
    ? fishLogs
    : fishLogs.filter(f => f.category === fishCategoryFilter);

  return (
    <div className={`min-h-screen ${curTheme.bg} text-slate-100 font-sans selection:bg-amber-500 selection:text-black transition-colors duration-500 relative overflow-hidden`}>
      {curTheme.bgImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 pointer-events-none transition-all duration-700 filter brightness-90 contrast-110"
          style={{ backgroundImage: `url('${curTheme.bgImage}')` }}
        />
      )}

      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b ${curTheme.glow} blur-[120px] pointer-events-none opacity-60 transition-all duration-700`} />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {!isAppUnlocked ? (
        <div className="min-h-screen flex items-center justify-center p-4 relative z-20">
          <div className={`max-w-md w-full p-8 rounded-3xl border ${curTheme.card} text-center space-y-6 shadow-2xl backdrop-blur-2xl`}>
            <div>
              <span className="text-4xl inline-block mb-2">⚡</span>
              <h1 className="text-2xl font-black text-white tracking-tight">MY AGIT</h1>
              <p className="text-xs text-slate-400 mt-1">개인 보안 접속 인증이 필요합니다</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className={`text-2xl font-mono font-bold ${curTheme.accent}`}>{timeStr || '00:00:00'}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{dateStr}</div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <input
                  type="password"
                  maxLength={10}
                  value={loginInput}
                  onChange={(e) => {
                    setLoginInput(e.target.value);
                    setLoginError(false);
                  }}
                  placeholder="마스터 PIN 입력 (기본: 1234)"
                  className={`w-full text-center text-lg font-mono tracking-widest px-4 py-3 rounded-xl bg-slate-950 border ${loginError ? 'border-red-500 text-red-400' : 'border-slate-800 text-white'} focus:outline-none focus:border-amber-500 transition`}
                  autoFocus
                />
                {loginError && <p className="text-xs text-red-400 pt-1">비밀번호가 올바르지 않습니다.</p>}
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-xl ${curTheme.btn} text-sm font-bold transition duration-200`}
              >
                아지트 입장 ⚡
              </button>
            </form>
          </div>
        </div>
      ) : (
        <>
          <header className="border-b border-slate-800/80 sticky top-0 z-50 backdrop-blur-md bg-slate-950/70">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => setTab('dash')}>
                <span className="text-xl sm:text-2xl">⚡</span>
                <span className="font-black text-base sm:text-lg tracking-tight text-white hidden md:inline">MY AGIT</span>
              </div>

              <nav className="flex items-center gap-1 sm:gap-1.5 text-xs font-medium overflow-x-auto py-2">
                {[
                  ['dash', '🏠 대시보드'],
                  ['fish', '🐟 생물/낚시'],
                  ['diary', '📖 일기장'],
                  ['note', '📝 메모장'],
                  ['todo', '🎯 To-Do'],
                  ['archive', '🚀 아카이브'],
                  ['setting', '⚙️ 설정']
                ].map(([k, label]) => (
                  <button
                    key={k}
                    onClick={() => setTab(k)}
                    className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${tab === k ? curTheme.btn : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                  >
                    {label}
                  </button>
                ))}
              </nav>

              <button
                onClick={handleLogout}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-red-950 hover:text-red-400 border border-slate-800 text-slate-400 transition whitespace-nowrap"
                title="아지트 잠그기"
              >
                🔒 잠금
              </button>
            </div>
          </header>

          <main className="max-w-6xl mx-auto px-4 py-8 space-y-6 relative z-10">
            {tab === 'dash' && (
              <div className="space-y-6">
                <div className={`p-8 rounded-2xl border ${curTheme.card} flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-2xl`}>
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${curTheme.badge} mb-2`}>
                      PERSONAL AGIT DASHBOARD
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-white">오늘도 나만의 페이스로 ⚡</h1>
                    <p className="text-xs text-slate-400 mt-1">{dateStr}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-4xl font-mono font-black tracking-wider ${curTheme.accent}`}>
                      {timeStr || '00:00:00'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className={`p-5 rounded-2xl border ${curTheme.card} space-y-3`}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-sm text-slate-200">🐟 최근 탐어/생물 기록</h3>
                      <button onClick={() => setTab('fish')} className="text-xs text-slate-400 hover:text-white">더보기 →</button>
                    </div>
                    {fishLogs.length > 0 ? (
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                        {(fishLogs[0].photo_url || fishLogs[0].photoUrl) && (
                          <img src={fishLogs[0].photo_url || fishLogs[0].photoUrl} alt="탐어 사진" className="w-full h-24 object-cover rounded-lg" />
                        )}
                        <div className="flex justify-between text-xs text-slate-400">
                          <span className="font-bold text-amber-400">{fishLogs[0].species} ({fishLogs[0].size})</span>
                          <span>{fishLogs[0].date}</span>
                        </div>
                        <div className="font-semibold text-xs text-white truncate">{fishLogs[0].title}</div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 py-4 text-center">등록된 생물 기록이 없습니다.</p>
                    )}
                  </div>

                  <div className={`p-5 rounded-2xl border ${curTheme.card} space-y-3`}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-sm text-slate-200">📌 중요 고정 메모</h3>
                      <button onClick={() => setTab('note')} className="text-xs text-slate-400 hover:text-white">더보기 →</button>
                    </div>
                    {notes.filter(n => n.is_pinned || n.isPinned).length > 0 ? (
                      notes.filter(n => n.is_pinned || n.isPinned).slice(0, 2).map(n => (
                        <div key={n.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">{n.category}</span>
                          <div className="font-semibold text-sm text-white truncate">{n.title}</div>
                          <div className="text-xs text-slate-400 truncate">{n.content}</div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 py-4 text-center">고정된 메모가 없습니다.</p>
                    )}
                  </div>

                  <div className={`p-5 rounded-2xl border ${curTheme.card} space-y-3`}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-sm text-slate-200">🎯 To-Do & D-Day</h3>
                      <button onClick={() => setTab('todo')} className="text-xs text-slate-400 hover:text-white">더보기 →</button>
                    </div>
                    <div className="space-y-2">
                      {todos.slice(0, 3).map(t => (
                        <div key={t.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                          <span className={(t.is_done || t.isDone) ? 'line-through text-slate-500' : 'text-slate-200'}>{t.content}</span>
                          {(t.d_day_date || t.dDay) && <span className={`font-mono font-bold ${curTheme.accent}`}>{calcDday(t.d_day_date || t.dDay)}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === 'fish' && (
              <div className={`p-6 rounded-2xl border ${curTheme.card} space-y-6`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      🐟 생물 & 낚시 탐어일지
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">민물고기, 낚시, 사육 생물 채집 및 관찰 기록장</p>
                  </div>

                  <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                    {['전체', '민물고기/탐어', '루어/대낚시', '희귀생물/사육', '기타'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setFishCategoryFilter(cat)}
                        className={`px-2.5 py-1 rounded-lg transition ${fishCategoryFilter === cat ? curTheme.btn : 'text-slate-400 hover:text-white'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
                  <h3 className="text-xs font-bold text-slate-300">새 탐어 / 생물 기록 작성</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="기록 제목 (예: 공지천 꺽지 탐어)"
                      value={newFishLog.title}
                      onChange={(e) => setNewFishLog({ ...newFishLog, title: e.target.value })}
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="생물/어종명 (예: 꺽지, 아시안포레스트)"
                      value={newFishLog.species}
                      onChange={(e) => setNewFishLog({ ...newFishLog, species: e.target.value })}
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                    <select
                      value={newFishLog.category}
                      onChange={(e) => setNewFishLog({ ...newFishLog, category: e.target.value })}
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    >
                      <option value="민물고기/탐어">민물고기/탐어</option>
                      <option value="루어/대낚시">루어/대낚시</option>
                      <option value="희귀생물/사육">희귀생물/사육</option>
                      <option value="기타">기타</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="장소 / 포인트 (예: 공지천 상류)"
                      value={newFishLog.location}
                      onChange={(e) => setNewFishLog({ ...newFishLog, location: e.target.value })}
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="크기 / 개체 수 (예: 18cm / 2마리)"
                      value={newFishLog.size}
                      onChange={(e) => setNewFishLog({ ...newFishLog, size: e.target.value })}
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                    
                    <div className="flex items-center gap-2">
                      <label className="flex-1 cursor-pointer px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:border-slate-600 text-center truncate">
                        {newFishLog.photoUrl ? '📸 사진 첨부됨' : '📷 사진 선택 (파일)'}
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <textarea
                    placeholder="채집 환경, 미끼, 포획/사육 메모를 적어보세요..."
                    value={newFishLog.memo}
                    onChange={(e) => setNewFishLog({ ...newFishLog, memo: e.target.value })}
                    className="w-full h-20 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none resize-none"
                  />

                  {newFishLog.photoUrl && (
                    <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-slate-700">
                      <img src={newFishLog.photoUrl} alt="미리보기" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setNewFishLog({ ...newFishLog, photoUrl: '' })}
                        className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-5 h-5 text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      if (!newFishLog.title || !newFishLog.species) return;
                      const item = { id: Date.now(), date: new Date().toISOString().split('T')[0], ...newFishLog };
                      const updated = [item, ...fishLogs];
                      setFishLogs(updated);
                      syncData('fish', 'add', item, updated, 'agit_fish_logs');
                      setNewFishLog({ title: '', species: '', location: '', category: '민물고기/탐어', size: '', memo: '', photoUrl: '' });
                    }}
                    className={`w-full py-2.5 rounded-xl ${curTheme.btn} text-xs font-bold`}
                  >
                    탐어 기록 등록하기
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredFishLogs.map(log => (
                    <div key={log.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3 relative group">
                      {(log.photo_url || log.photoUrl) && (
                        <div className="w-full h-44 rounded-lg overflow-hidden border border-slate-800/80">
                          <img src={log.photo_url || log.photoUrl} alt={log.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        </div>
                      )}
                      
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">{log.category}</span>
                          <h4 className="font-bold text-base text-white mt-1">{log.title}</h4>
                        </div>
                        <button
                          onClick={() => {
                            const updated = fishLogs.filter(x => x.id !== log.id);
                            setFishLogs(updated);
                            syncData('fish', 'delete', { id: log.id }, updated, 'agit_fish_logs');
                          }}
                          className="text-xs text-slate-500 hover:text-red-400"
                        >
                          삭제
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60">
                        <div><span className="text-slate-500">생물/어종:</span> <span className="text-amber-400 font-bold">{log.species}</span></div>
                        <div><span className="text-slate-500">크기/수량:</span> <span className="text-white font-mono">{log.size || '-'}</span></div>
                        <div><span className="text-slate-500">장소:</span> <span className="text-slate-300">{log.location || '-'}</span></div>
                        <div><span className="text-slate-500">날짜:</span> <span className="text-slate-300">{log.date}</span></div>
                      </div>

                      {log.memo && (
                        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{log.memo}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'diary' && (
              <div className={`p-6 rounded-2xl border ${curTheme.card} space-y-6`}>
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    📖 비밀 일기장 {isDiaryLocked ? '🔒' : '🔓'}
                  </h2>
                  {!isDiaryLocked && (
                    <button onClick={() => setIsDiaryLocked(true)} className="text-xs px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300">
                      일기장 잠그기
                    </button>
                  )}
                </div>

                {isDiaryLocked ? (
                  <div className="py-12 flex flex-col items-center justify-center space-y-4">
                    <p className="text-xs text-slate-400">일기장 개별 보안을 위해 마스터 PIN을 입력하세요</p>
                    <input
                      type="password"
                      maxLength={10}
                      value={diaryPinInput}
                      onChange={(e) => {
                        setDiaryPinInput(e.target.value);
                        if (e.target.value === masterPin) {
                          setIsDiaryLocked(false);
                          setDiaryPinInput('');
                        }
                      }}
                      placeholder="PIN 입력"
                      className="text-center text-xl font-mono tracking-widest px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 w-36 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <input
                          type="text"
                          placeholder="제목"
                          value={newDiary.title}
                          onChange={(e) => setNewDiary({ ...newDiary, title: e.target.value })}
                          className="col-span-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                        />
                        <input
                          type="text"
                          placeholder="기분 이모지 (😊)"
                          value={newDiary.emoji}
                          onChange={(e) => setNewDiary({ ...newDiary, emoji: e.target.value })}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                        />
                        <button
                          onClick={() => {
                            if (!newDiary.title) return;
                            const item = { id: Date.now(), date: new Date().toISOString().split('T')[0], ...newDiary };
                            const updated = [item, ...diaries];
                            setDiaries(updated);
                            syncData('diary', 'add', item, updated, 'agit_diaries');
                            setNewDiary({ title: '', content: '', emoji: '😊', weather: '☀️ 맑음' });
                          }}
                          className={`px-3 py-1.5 rounded-lg ${curTheme.btn} text-xs`}
                        >
                          일기 저장
                        </button>
                      </div>
                      <textarea
                        placeholder="오늘 하루의 일기를 적어보세요..."
                        value={newDiary.content}
                        onChange={(e) => setNewDiary({ ...newDiary, content: e.target.value })}
                        className="w-full h-20 p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none resize-none"
                      />
                    </div>

                    <div className="space-y-3">
                      {diaries.map(d => (
                        <div key={d.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                          <div className="flex justify-between items-center text-xs text-slate-400">
                            <span>{d.date} • {d.emoji} {d.weather}</span>
                            <button onClick={() => {
                              const updated = diaries.filter(x => x.id !== d.id);
                              setDiaries(updated);
                              syncData('diary', 'delete', { id: d.id }, updated, 'agit_diaries');
                            }} className="hover:text-red-400">삭제</button>
                          </div>
                          <h4 className="font-bold text-sm text-white">{d.title}</h4>
                          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{d.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === 'note' && (
              <div className={`p-6 rounded-2xl border ${curTheme.card} space-y-6`}>
                <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-4">📝 스마트 메모장</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="메모 제목"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="카테고리 (예: 아이디어, 공부)"
                    value={newNote.category}
                    onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                  <button
                    onClick={() => {
                      if (!newNote.title) return;
                      const item = { id: Date.now(), ...newNote, isPinned: false };
                      const updated = [item, ...notes];
                      setNotes(updated);
                      syncData('note', 'add', item, updated, 'agit_notes');
                      setNewNote({ title: '', content: '', category: '일반' });
                    }}
                    className={`px-4 py-2 rounded-xl ${curTheme.btn} text-xs`}
                  >
                    메모 추가
                  </button>
                </div>
                <textarea
                  placeholder="메모 내용을 입력하세요..."
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  className="w-full h-24 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none resize-none"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {notes.map(n => (
                    <div key={n.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 relative group">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">{n.category}</span>
                        <div className="flex gap-2 text-xs">
                          <button
                            onClick={() => {
                              const isPinned = !(n.is_pinned || n.isPinned);
                              const updated = notes.map(x => x.id === n.id ? { ...x, isPinned, is_pinned: isPinned } : x);
                              setNotes(updated);
                              syncData('note', 'toggle_pin', { id: n.id, isPinned }, updated, 'agit_notes');
                            }}
                            className={(n.is_pinned || n.isPinned) ? 'text-amber-400 font-bold' : 'text-slate-500 hover:text-white'}
                          >
                            {(n.is_pinned || n.isPinned) ? '📌 고정됨' : '📌 고정'}
                          </button>
                          <button onClick={() => {
                            const updated = notes.filter(x => x.id !== n.id);
                            setNotes(updated);
                            syncData('note', 'delete', { id: n.id }, updated, 'agit_notes');
                          }} className="text-slate-500 hover:text-red-400">삭제</button>
                        </div>
                      </div>
                      <h4 className="font-bold text-sm text-white">{n.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{n.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'todo' && (
              <div className={`p-6 rounded-2xl border ${curTheme.card} space-y-6`}>
                <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-4">🎯 To-Do & D-Day 관리</h2>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    placeholder="할 일 내용"
                    value={newTodo.content}
                    onChange={(e) => setNewTodo({ ...newTodo, content: e.target.value })}
                    className="sm:col-span-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                  <input
                    type="date"
                    value={newTodo.dDay}
                    onChange={(e) => setNewTodo({ ...newTodo, dDay: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                  <button
                    onClick={() => {
                      if (!newTodo.content) return;
                      const item = { id: Date.now(), isDone: false, ...newTodo };
                      const updated = [item, ...todos];
                      setTodos(updated);
                      syncData('todo', 'add', item, updated, 'agit_todos');
                      setNewTodo({ content: '', priority: 'normal', dDay: '' });
                    }}
                    className={`px-4 py-2 rounded-xl ${curTheme.btn} text-xs`}
                  >
                    항목 추가
                  </button>
                </div>

                <div className="space-y-2">
                  {todos.map(t => (
                    <div key={t.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={t.is_done || t.isDone}
                          onChange={() => {
                            const isDone = !(t.is_done || t.isDone);
                            const updated = todos.map(x => x.id === t.id ? { ...x, isDone, is_done: isDone } : x);
                            setTodos(updated);
                            syncData('todo', 'toggle', { id: t.id, isDone }, updated, 'agit_todos');
                          }}
                          className="w-4 h-4 rounded bg-slate-800 border-slate-700 accent-amber-500"
                        />
                        <span className={(t.is_done || t.isDone) ? 'line-through text-slate-500' : 'text-slate-200'}>{t.content}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {(t.d_day_date || t.dDay) && <span className={`font-mono font-bold ${curTheme.accent}`}>{calcDday(t.d_day_date || t.dDay)}</span>}
                        <button onClick={() => {
                          const updated = todos.filter(x => x.id !== t.id);
                          setTodos(updated);
                          syncData('todo', 'delete', { id: t.id }, updated, 'agit_todos');
                        }} className="text-slate-500 hover:text-red-400">삭제</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'archive' && (
              <div className={`p-6 rounded-2xl border ${curTheme.card} space-y-6`}>
                <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-4">🚀 개인 북마크 & 아카이브</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="사이트 이름"
                    value={newBmk.title}
                    onChange={(e) => setNewBmk({ ...newBmk, title: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="https://..."
                    value={newBmk.url}
                    onChange={(e) => setNewBmk({ ...newBmk, url: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                  <button
                    onClick={() => {
                      if (!newBmk.title || !newBmk.url) return;
                      const item = { id: Date.now(), ...newBmk };
                      const updated = [item, ...bookmarks];
                      setBookmarks(updated);
                      syncData('bookmark', 'add', item, updated, 'agit_bookmarks');
                      setNewBmk({ title: '', url: '', icon: '🔗' });
                    }}
                    className={`px-4 py-2 rounded-xl ${curTheme.btn} text-xs`}
                  >
                    북마크 등록
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {bookmarks.map(b => (
                    <div
                      key={b.id}
                      className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-600 transition flex items-center justify-between group"
                    >
                      <a href={b.url} target="_blank" rel="noreferrer" className="flex items-center gap-3">
                        <span className="text-xl">{b.icon || '🔗'}</span>
                        <span className="font-semibold text-xs text-white group-hover:underline">{b.title}</span>
                      </a>
                      <button
                        onClick={() => {
                          const updated = bookmarks.filter(x => x.id !== b.id);
                          setBookmarks(updated);
                          syncData('bookmark', 'delete', { id: b.id }, updated, 'agit_bookmarks');
                        }}
                        className="text-xs text-slate-500 hover:text-red-400 ml-2"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'setting' && (
              <div className={`p-6 rounded-2xl border ${curTheme.card} space-y-6`}>
                <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-4">⚙️ 6종 특화 테마 및 보안 설정</h2>
                
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-slate-300">커스텀 특화 테마 선택</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(THEMES).map(([k, t]) => (
                      <button
                        key={k}
                        onClick={() => handleThemeChange(k)}
                        className={`p-4 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-2 ${themeKey === k ? 'border-amber-500 bg-amber-500/10 text-white' : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white'}`}
                      >
                        <span className="text-sm">{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <label className="block text-xs font-bold text-slate-300">🔒 아지트 마스터 PIN 비밀번호 변경</label>
                  <div className="flex gap-3 max-w-xs">
                    <input
                      type="text"
                      maxLength={10}
                      value={masterPin}
                      onChange={(e) => handlePinChange(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white w-full focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </main>
        </>
      )}
    </div>
  );
}
