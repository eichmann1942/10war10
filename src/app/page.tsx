'use client';

import React, { useState, useEffect } from 'react';

// 5가지 취향 맞춤 프리셋 테마
const THEMES = {
  dugout: {
    name: '⚾ 더그아웃 오렌지',
    bg: 'bg-slate-950',
    card: 'bg-slate-900/70 border-slate-800',
    accent: 'text-amber-500',
    btn: 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  },
  stealth: {
    name: '✈️ 스텔스 챠콜',
    bg: 'bg-zinc-950',
    card: 'bg-zinc-900/70 border-zinc-800',
    accent: 'text-cyan-400',
    btn: 'bg-cyan-500 hover:bg-cyan-600 text-zinc-950 font-bold',
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
  },
  stream: {
    name: '🐟 공지천 티어',
    bg: 'bg-stone-950',
    card: 'bg-stone-900/70 border-stone-800',
    accent: 'text-emerald-400',
    btn: 'bg-emerald-500 hover:bg-emerald-600 text-stone-950 font-bold',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  },
  amber: {
    name: '☕ 앰버 서재',
    bg: 'bg-neutral-950',
    card: 'bg-neutral-900/70 border-neutral-800',
    accent: 'text-orange-400',
    btn: 'bg-orange-500 hover:bg-orange-600 text-neutral-950 font-bold',
    badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20'
  },
  minimal: {
    name: '🖤 딥 미니멀',
    bg: 'bg-black',
    card: 'bg-zinc-900/50 border-zinc-800',
    accent: 'text-zinc-200',
    btn: 'bg-zinc-200 hover:bg-white text-zinc-950 font-bold',
    badge: 'bg-zinc-800 text-zinc-300 border-zinc-700'
  }
};

export default function AgitMain() {
  const [tab, setTab] = useState('dash');
  const [themeKey, setThemeKey] = useState('dugout');
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  
  // PIN 일기장 관련
  const [isLocked, setIsLocked] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [pinCode, setPinCode] = useState('1234');

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

  // 시계 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('ko-KR', { hour12: false }));
      setDateStr(now.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const curTheme = THEMES[themeKey] || THEMES.dugout;

  // D-Day 계산
  const calcDday = (targetDate: string) => {
    if (!targetDate) return null;
    const diff = Math.ceil((new Date(targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'D-DAY';
    return diff > 0 ? `D-${diff}` : `D+${Math.abs(diff)}`;
  };

  return (
    <div className={`min-h-screen ${curTheme.bg} text-slate-100 font-sans selection:bg-amber-500 selection:text-black transition-colors duration-300`}>
      {/* GNB 메인 네비게이션 */}
      <header className="border-b border-slate-800/80 sticky top-0 z-50 backdrop-blur-md bg-slate-950/60">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setTab('dash')}>
            <span className="text-2xl">⚡</span>
            <span className="font-black text-lg tracking-tight text-white">MY AGIT</span>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium">
            {[
              ['dash', '🏠 대시보드'],
              ['diary', '📖 비밀 일기장'],
              ['note', '📝 메모장'],
              ['todo', '🎯 To-Do/D-Day'],
              ['archive', '🚀 아카이브'],
              ['setting', '⚙️ 설정']
            ].map(([k, label]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`px-3 py-1.5 rounded-lg transition-all ${tab === k ? curTheme.btn : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* 메인 컨텐츠 영역 */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        
        {/* 1. 대시보드 (Dashboard) */}
        {tab === 'dash' && (
          <div className="space-y-6">
            {/* 상단 시계 & 인사 카드 */}
            <div className={`p-8 rounded-2xl border ${curTheme.card} backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl`}>
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

            {/* 메인 요약 3열 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* 최근 일기 요약 */}
              <div className={`p-5 rounded-2xl border ${curTheme.card} space-y-3`}>
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-slate-200">📖 최근 일기</h3>
                  <button onClick={() => setTab('diary')} className="text-xs text-slate-400 hover:text-white">더보기 →</button>
                </div>
                {diaries.length > 0 ? (
                  <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
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

              {/* 고정 메모 */}
              <div className={`p-5 rounded-2xl border ${curTheme.card} space-y-3`}>
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-slate-200">📌 중요 메모</h3>
                  <button onClick={() => setTab('note')} className="text-xs text-slate-400 hover:text-white">더보기 →</button>
                </div>
                {notes.filter(n => n.isPinned).length > 0 ? (
                  notes.filter(n => n.isPinned).slice(0, 2).map(n => (
                    <div key={n.id} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">{n.category}</span>
                      <div className="font-semibold text-sm text-white truncate">{n.title}</div>
                      <div className="text-xs text-slate-400 truncate">{n.content}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 py-4 text-center">상단 고정된 메모가 없습니다.</p>
                )}
              </div>

              {/* 오늘의 할 일 */}
              <div className={`p-5 rounded-2xl border ${curTheme.card} space-y-3`}>
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-slate-200">🎯 To-Do & D-Day</h3>
                  <button onClick={() => setTab('todo')} className="text-xs text-slate-400 hover:text-white">더보기 →</button>
                </div>
                <div className="space-y-2">
                  {todos.slice(0, 3).map(t => (
                    <div key={t.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 text-xs">
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
                📖 비밀 일기장 {isLocked ? '🔒' : '🔓'}
              </h2>
              {!isLocked && (
                <button onClick={() => setIsLocked(true)} className="text-xs px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300">
                  잠그기
                </button>
              )}
            </div>

            {isLocked ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-4">
                <p className="text-xs text-slate-400">보안을 위해 PIN 번호 4자리를 입력하세요 (기본: 1234)</p>
                <input
                  type="password"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    if (e.target.value === pinCode) {
                      setIsLocked(false);
                      setPinInput('');
                    }
                  }}
                  placeholder="PIN 입력"
                  className="text-center text-xl font-mono tracking-widest px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 w-36 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            ) : (
              <div className="space-y-6">
                {/* 일기 작성 폼 */}
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
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

                {/* 일기 목록 */}
                <div className="space-y-3">
                  {diaries.map(d => (
                    <div key={d.id} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
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
                <div key={n.id} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2 relative group">
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
                <div key={t.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs">
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
                  className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-600 transition flex items-center justify-between group"
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
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-4">⚙️ 테마 및 커스텀 설정</h2>
            
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
              <label className="block text-xs font-bold text-slate-300">일기장 PIN 비밀번호 변경</label>
              <div className="flex gap-3 max-w-xs">
                <input
                  type="text"
                  maxLength={4}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white w-full"
                />
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
