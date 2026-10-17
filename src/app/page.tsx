'use client';

import React, { useState, useEffect } from 'react';

// 6가지 프리미엄 특화 테마
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
    name: '🎖️ 러시아의 무기고',
    bg: 'bg-neutral-950',
    glow: 'from-red-600/30 via-neutral-950 to-neutral-950',
    bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop',
    card: 'bg-neutral-900/85 border-red-700/30 shadow-red-950/20 shadow-xl backdrop-blur-xl',
    accent: 'text-red-500',
    btn: 'bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg shadow-red-600/25',
    badge: 'bg-red-500/10 text-red-400 border-red-500/30'
  },
  us_armory: {
    name: '🦅 미국의 무기고',
    bg: 'bg-stone-950',
    glow: 'from-amber-600/30 via-stone-950 to-stone-950',
    bgImage: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=2000&auto=format&fit=crop',
    card: 'bg-stone-900/85 border-amber-600/30 shadow-stone-950/30 shadow-xl backdrop-blur-xl',
    accent: 'text-amber-400',
    btn: 'bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-600/25',
    badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30'
  },
  de_armory: {
    name: '🛡️ 독일의 무기고',
    bg: 'bg-zinc-950',
    glow: 'from-yellow-500/25 via-zinc-950 to-zinc-950',
    bgImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2000&auto=format&fit=crop',
    card: 'bg-zinc-900/85 border-zinc-700/50 shadow-zinc-950/30 shadow-xl backdrop-blur-xl',
    accent: 'text-yellow-500',
    btn: 'bg-zinc-200 hover:bg-white text-zinc-950 font-bold shadow-lg shadow-white/20',
    badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
  }
};

export default function AgitMain() {
  // 아지트 마스터 보안
  const [isAppUnlocked, setIsAppUnlocked] = useState(false);
  const [masterPin, setMasterPin] = useState('1234');
  const [loginInput, setLoginInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // 네비게이션 & 테마
  const [tab, setTab] = useState('dash');
  const [themeKey, setThemeKey] = useState('dugout');
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  
  // 비밀 일기장
  const [isDiaryLocked, setIsDiaryLocked] = useState(true);
  const [diaryPinInput, setDiaryPinInput] = useState('');

  // 기존 데이터 상태
  const [diaries, setDiaries] = useState([
    { id: 1, date: '2026-10-10', title: '나만의 웹 아지트 개편', content: '깔끔하고 정돈된 스타일로 개편 완료!', emoji: '⚡', weather: '☀️ 맑음' }
  ]);
  const [notes, setNotes] = useState([
    { id: 1, title: '프로젝트 아이디어', content: 'Raspberry Pi와 ESP32 센서 모듈 연동 테스트', category: '개발', isPinned: true }
  ]);
  const [todos, setTodos] = useState([
    { id: 1, content: '아지트 테마 설정 완료하기', isDone: true, priority: 'high', dDay: '2026-10-15' }
  ]);
  const [bookmarks, setBookmarks] = useState([
    { id: 1, title: 'GitHub 저장소', url: 'https://github.com', icon: '💻' },
    { id: 2, title: 'Vercel 대시보드', url: 'https://vercel.com', icon: '🚀' }
  ]);

  // 🐟 신규: 낚시 & 생물 탐어일지 데이터
  const [fishLogs, setFishLogs] = useState([
    {
      id: 1,
      date: '2026-10-12',
      title: '공지천 꺽지 채집 및 탐어',
      species: '꺽지',
      location: '공지천 상류',
      category: '민물고기/탐어',
      size: '18cm',
      memo: '여울지대 돌틈에서 유인하여 족대로 채집 성공.',
      photoUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 2,
      date: '2026-09-28',
      title: '아시안 포레스트 전갈 피딩 및 기록',
      species: '아시안 포레스트 전갈',
      location: '사육장',
      category: '희귀생물/사육',
      size: '12cm',
      memo: '탈피 후 건장하게 활동 중. 습도 75% 유지.',
      photoUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800&auto=format&fit=crop'
    }
  ]);
  const [fishCategoryFilter, setFishCategoryFilter] = useState('전체');

  // 입력 폼
  const [newDiary, setNewDiary] = useState({ title: '', content: '', emoji: '😊', weather: '☀️ 맑음' });
  const [newNote, setNewNote] = useState({ title: '', content: '', category: '일반' });
  const [newTodo, setNewTodo] = useState({ content: '', priority: 'normal', dDay: '' });
  const [newBmk, setNewBmk] = useState({ title: '', url: '', icon: '🔗' });
  const [newFishLog, setNewFishLog] = useState({
    title: '',
    species: '',
    location: '',
    category: '민물고기/탐어',
    size: '',
    memo: '',
    photoUrl: ''
  });

  // 사진 업로드 미리보기 및 base64 변환
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

  useEffect(() => {
    const savedPin = localStorage.getItem('agit_master_pin');
    if (savedPin) setMasterPin(savedPin);
    
    const isAuth = sessionStorage.getItem('agit_authenticated');
    if (isAuth === 'true') setIsAppUnlocked(true);

    const timer = setInterval(() => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('ko-KR', { hour12: false }));
      setDateStr(now.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const curTheme = THEMES[themeKey] || THEMES.dugout;

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
      {/* 배경 사진 연출 */}
      {curTheme.bgImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 pointer-events-none transition-all duration-700 filter brightness-90 contrast-110"
          style={{ backgroundImage: `url('${curTheme.bgImage}')` }}
        />
      )}

      {/* 은은한 앰비언트 조명 */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b ${curTheme.glow} blur-[120px] pointer-events-none opacity-60 transition-all duration-700`} />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* ==================== 1. 마스터 로그인 ==================== */}
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
        /* ==================== 2. 대시보드 메인 ==================== */
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
            
            {/* 1. 대시보드 */}
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
                  {/* 생물/낚시 최근 기록 */}
                  <div className={`p-5 rounded-2xl border ${curTheme.card} space-y-3`}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-sm text-slate-200">🐟 최근 탐어/생물 기록</h3>
                      <button onClick={() => setTab('fish')} className="text-xs text-slate-400 hover:text-white">더보기 →</button>
                    </div>
                    {fishLogs.length > 0 ? (
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                        {fishLogs[0].photoUrl && (
                          <img src={fishLogs[0].photoUrl} alt="탐어 사진" className="w-full h-24 object-cover rounded-lg" />
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

                  {/* 중요 메모 */}
                  <div className={`p-5 rounded-2xl border ${curTheme.card} space-y-3`}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-sm text-slate-200">📌 중요 고정 메모</h3>
                      <button onClick={() => setTab('note')} className="text-xs text-slate-400 hover:text-white">더보기 →</button>
                    </div>
                    {notes.filter(n => n.isPinned).length > 0 ? (
                      notes.filter(n => n.isPinned).slice(0, 2).map(n => (
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

                  {/* To-Do */}
                  <div className={`p-5 rounded-2xl border ${curTheme.card} space-y-3`}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-sm text-slate-200">🎯 To-Do & D-Day</h3>
                      <button onClick={() => setTab('todo')} className="text-xs text-slate-400 hover:text-white">더보기 →</button>
                    </div>
                    <div className="space-y-2">
                      {todos.slice(0, 3).map(t => (
                        <div key={t.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                          <span className={t.isDone ? 'line-through text-slate-500' : 'text-slate-200'}>{t.content}</span>
                          {t.dDay && <span className={`font-mono font-bold ${curTheme.accent}`}>{calcDday(t.dDay)}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. 🐟 생물 & 낚시 탐어일지 (신규) */}
            {tab === 'fish' && (
              <div className={`p-6 rounded-2xl border ${curTheme.card} space-y-6`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      🐟 생물 & 낚시 탐어일지
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">민물고기, 낚시, 사육 생물 채집 및 관찰 기록장</p>
                  </div>

                  {/* 카테고리 필터 버튼 */}
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

                {/* 기록 등록 폼 */}
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
                    
                    {/* 사진 업로드 버튼 */}
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
                      setFishLogs([
                        { id: Date.now(), date: new Date().toISOString().split('T')[0], ...newFishLog },
                        ...fishLogs
                      ]);
                      setNewFishLog({
                        title: '',
                        species: '',
                        location: '',
                        category: '민물고기/탐어',
                        size: '',
                        memo: '',
                        photoUrl: ''
                      });
                    }}
                    className={`w-full py-2.5 rounded-xl ${curTheme.btn} text-xs font-bold`}
                  >
                    탐어 기록 등록하기
                  </button>
                </div>

                {/* 기록 카드 리스트 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredFishLogs.map(log => (
                    <div key={log.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3 relative group">
                      {log.photoUrl && (
                        <div className="w-full h-44 rounded-lg overflow-hidden border border-slate-800/80">
                          <img src={log.photoUrl} alt={log.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        </div>
                      )}
                      
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">{log.category}</span>
                          <h4 className="font-bold text-base text-white mt-1">{log.title}</h4>
                        </div>
                        <button
                          onClick={() => setFishLogs(fishLogs.filter(x => x.id !== log.id))}
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

            {/* 3. 비밀 일기장 */}
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
                            setDiaries([{ id: Date.now(), date: new Date().toISOString().split('T')[0], ...newDiary }, ...diaries]);
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
                            <button onClick={() => setDiaries(diaries.filter(x => x.id !== d.id))} className="hover:text-red-400">삭제</button>
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

            {/* 4. 메모장 */}
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
                      setNotes([{ id: Date.now(), ...newNote, isPinned: false }, ...notes]);
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
                            onClick={() => setNotes(notes.map(x => x.id === n.id ? { ...x, isPinned: !x.isPinned } : x))}
                            className={n.isPinned ? 'text-amber-400 font-bold' : 'text-slate-500 hover:text-white'}
                          >
                            {n.isPinned ? '📌 고정됨' : '📌 고정'}
                          </button>
                          <button onClick={() => setNotes(notes.filter(x => x.id !== n.id))} className="text-slate-500 hover:text-red-400">삭제</button>
                        </div>
                      </div>
                      <h4 className="font-bold text-sm text-white">{n.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{n.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. To-Do */}
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
                      setTodos([{ id: Date.now(), isDone: false, ...newTodo }, ...todos]);
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
                          checked={t.isDone}
                          onChange={() => setTodos(todos.map(x => x.id === t.id ? { ...x, isDone: !x.isDone } : x))}
                          className="w-4 h-4 rounded bg-slate-800 border-slate-700 accent-amber-500"
                        />
                        <span className={t.isDone ? 'line-through text-slate-500' : 'text-slate-200'}>{t.content}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {t.dDay && <span className={`font-mono font-bold ${curTheme.accent}`}>{calcDday(t.dDay)}</span>}
                        <button onClick={() => setTodos(todos.filter(x => x.id !== t.id))} className="text-slate-500 hover:text-red-400">삭제</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. 아카이브 */}
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
                      setBookmarks([{ id: Date.now(), ...newBmk }, ...bookmarks]);
                      setNewBmk({ title: '', url: '', icon: '🔗' });
                    }}
                    className={`px-4 py-2 rounded-xl ${curTheme.btn} text-xs`}
                  >
                    북마크 등록
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {bookmarks.map(b => (
                    <a
                      key={b.id}
                      href={b.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-600 transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{b.icon}</span>
                        <span className="font-semibold text-xs text-white group-hover:underline">{b.title}</span>
                      </div>
                      <span className="text-slate-500 text-xs">↗</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* 7. 설정 */}
            {tab === 'setting' && (
              <div className={`p-6 rounded-2xl border ${curTheme.card} space-y-6`}>
                <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-4">⚙️ 6종 특화 테마 및 보안 설정</h2>
                
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-slate-300">커스텀 특화 테마 선택</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(THEMES).map(([k, t]) => (
                      <button
                        key={k}
                        onClick={() => setThemeKey(k)}
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
