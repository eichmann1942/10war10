'use client';

import React, { useState, useEffect } from 'react';

const THEMES: Record<string, { name: string; bg: string; card: string; accent: string; btn: string; badge: string; glow: string; bgImage?: string }> = {
  dugout: {
    name: '⚾ 더그아웃 오렌지',
    bg: 'bg-slate-950',
    glow: 'from-amber-500/20 via-slate-950 to-slate-950',
    card: 'bg-slate-900/80 border-slate-800/80 shadow-amber-900/10 shadow-lg backdrop-blur-xl',
    accent: 'text-amber-500',
    btn: 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  },
  stealth: {
    name: '✈️ 스텔스 챠콜',
    bg: 'bg-zinc-950',
    glow: 'from-cyan-500/20 via-zinc-950 to-zinc-950',
    card: 'bg-zinc-900/80 border-zinc-800/80 shadow-cyan-900/10 shadow-lg backdrop-blur-xl',
    accent: 'text-cyan-400',
    btn: 'bg-cyan-500 hover:bg-cyan-600 text-zinc-950 font-bold shadow-lg shadow-cyan-500/20',
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
  },
  stream: {
    name: '🐟 공지천 티어',
    bg: 'bg-stone-950',
    glow: 'from-emerald-500/30 via-stone-950 to-stone-950',
    bgImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop',
    card: 'bg-stone-900/85 border-stone-800/80 shadow-emerald-900/20 shadow-xl backdrop-blur-xl',
    accent: 'text-emerald-400',
    btn: 'bg-emerald-500 hover:bg-emerald-600 text-stone-950 font-bold shadow-lg shadow-emerald-500/20',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  },
  amber: {
    name: '☕ 앰버 서재',
    bg: 'bg-neutral-950',
    glow: 'from-orange-500/20 via-neutral-950 to-neutral-950',
    card: 'bg-neutral-900/80 border-neutral-800/80 shadow-orange-900/10 shadow-lg backdrop-blur-xl',
    accent: 'text-orange-400',
    btn: 'bg-orange-500 hover:bg-orange-600 text-neutral-950 font-bold shadow-lg shadow-orange-500/20',
    badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20'
  },
  minimal: {
    name: '🖤 딥 미니멀',
    bg: 'bg-black',
    glow: 'from-zinc-700/20 via-black to-black',
    card: 'bg-zinc-900/60 border-zinc-800/80 backdrop-blur-xl',
    accent: 'text-zinc-200',
    btn: 'bg-zinc-200 hover:bg-white text-zinc-950 font-bold shadow-lg shadow-white/10',
    badge: 'bg-zinc-800 text-zinc-300 border-zinc-700'
  }
};

export default function AgitMain() {
  // 아지트 전체 로그인 보안 상태
  const [isAppUnlocked, setIsAppUnlocked] = useState(false);
  const [masterPin, setMasterPin] = useState('1234');
  const [loginInput, setLoginInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // 네비게이션 & 테마
  const [tab, setTab] = useState('dash');
  const [themeKey, setThemeKey] = useState('stream');
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  
  // 비밀 일기장 전용 개별 PIN
  const [isDiaryLocked, setIsDiaryLocked] = useState(true);
  const [diaryPinInput, setDiaryPinInput] = useState('');

  // 데이터 상태
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

  // 입력 폼
  const [newDiary, setNewDiary] = useState({ title: '', content: '', emoji: '😊', weather: '☀️ 맑음' });
  const [newNote, setNewNote] = useState({ title: '', content: '', category: '일반' });
  const [newTodo, setNewTodo] = useState({ content: '', priority: 'normal', dDay: '' });
  const [newBmk, setNewBmk] = useState({ title: '', url: '', icon: '🔗' });

  // 로컬 세션 보존
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

  const curTheme = THEMES[themeKey] || THEMES.stream;

  // 마스터 로그인 처리
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

  // 로그아웃 처리
  const handleLogout = () => {
    setIsAppUnlocked(false);
    sessionStorage.removeItem('agit_authenticated');
  };

  // 비밀번호 변경 처리
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

  return (
    <div className={`min-h-screen ${curTheme.bg} text-slate-100 font-sans selection:bg-amber-500 selection:text-black transition-colors duration-500 relative overflow-hidden`}>
      {/* 배경 사진 연출 */}
      {curTheme.bgImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 pointer-events-none transition-all duration-700 filter brightness-90 contrast-110"
          style={{ backgroundImage: `url('${curTheme.bgImage}')` }}
        />
      )}

      {/* 은은한 앰비언트 라이트 조명 */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b ${curTheme.glow} blur-[120px] pointer-events-none opacity-60 transition-all duration-700`} />
      
      {/* 격자 그리드 연출 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* ==================== 1. 로그인 잠금 화면 ==================== */}
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
        /* ==================== 2. 아지트 대시보드 메인 ==================== */
        <>
          {/* GNB 메인 네비게이션 */}
          <header className="border-b border-slate-800/80 sticky top-0 z-50 backdrop-blur-md bg-slate-950/70">
            <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => setTab('dash')}>
                <span className="text-xl sm:text-2xl">⚡</span>
                <span className="font-black text-base sm:text-lg tracking-tight text-white hidden sm:inline">MY AGIT</span>
              </div>

              <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium">
                {[
                  ['dash', '🏠 대시보드'],
                  ['diary', '📖 일기장'],
                  ['note', '📝 메모장'],
                  ['todo', '🎯 To-Do'],
                  ['archive', '🚀 아카이브'],
                  ['setting', '⚙️ 설정']
                ].map(([k, label]) => (
                  <button
                    key={k}
                    onClick={() => setTab(k)}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${tab === k ? curTheme.btn : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                  >
                    {label}
                  </button>
                ))}
              </nav>

              <button
                onClick={handleLogout}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-red-950 hover:text-red-400 border border-slate-800 text-slate-400 transition"
                title="아지트 잠그기"
              >
                🔒 잠금
              </button>
            </div>
          </header>

          {/* 메인 컨텐츠 영역 */}
          <main className="max-w-5xl mx-auto px-4 py-8 space-y-6 relative z-10">
            
            {/* 1. 대시보드 (Dashboard) */}
            {tab === 'dash' && (
              <div className="space-y-6">
                <div className={`p-8 rounded-2xl border ${curTheme.card} flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-2xl`}>
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${curTheme.badge} mb-2`}>
                      PERSONAL DASHBOARD
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
                      <h3 className="font-bold text-sm text-slate-200">📖 최근 일기</h3>
                      <button onClick={() => setTab('diary')} className="text-xs text-slate-400 hover:text-white">더보기 →</button>
                    </div>
                    {diaries.length > 0 ? (
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>{diaries[0].date}</span>
                          <span>{diaries[0].emoji} {diaries[0].weather}</span>
                        </div>
                        <div className="font-semibold text-sm text-white truncate">{diaries[0].title}</div>
                        <div className="text-xs text-slate-400 line-clamp-2">{diaries[0].content}</div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 py-4 text-center">작성된 일기가 없습니다.</p>
                    )}
                  </div>

                  <div className={`p-5 rounded-2xl border ${curTheme.card} space-y-3`}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-sm text-slate-200">📌 중요 메모</h3>
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
                      <p className="text-xs text-slate-500 py-4 text-center">상단 고정된 메모가 없습니다.</p>
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
                          <span className={t.isDone ? 'line-through text-slate-500' : 'text-slate-200'}>{t.content}</span>
                          {t.dDay && <span className={`font-mono font-bold ${curTheme.accent}`}>{calcDday(t.dDay)}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. 비밀 일기장 (Private Diary) */}
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

            {/* 3. 스마트 메모장 (Notes) */}
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

            {/* 4. To-Do & D-Day */}
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

            {/* 5. 아카이브 (Archive) */}
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

            {/* 6. 설정 (Settings) */}
            {tab === 'setting' && (
              <div className={`p-6 rounded-2xl border ${curTheme.card} space-y-6`}>
                <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-4">⚙️ 테마 및 보안 설정</h2>
                
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-slate-300">프리셋 테마 선택</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {Object.entries(THEMES).map(([k, t]) => (
                      <button
                        key={k}
                        onClick={() => setThemeKey(k)}
                        className={`p-3 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${themeKey === k ? 'border-amber-500 bg-amber-500/10 text-white' : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white'}`}
                      >
                        <span>{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <label className="block text-xs font-bold text-slate-300">🔒 아지트 마스터 PIN 비밀번호 변경</label>
                  <p className="text-[11px] text-slate-400">아지트 전체 로그인 및 비밀 일기장에 적용되는 보안 PIN입니다.</p>
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
