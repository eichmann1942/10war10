import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

function getSql() {
  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!dbUrl) return null;
  return neon(dbUrl);
}

export async function GET() {
  try {
    const sql = getSql();
    if (!sql) {
      return NextResponse.json({ success: false, reason: 'No DB URL' }, { status: 200 });
    }
    
    await sql`
      CREATE TABLE IF NOT EXISTS agit_fish_logs (
        id SERIAL PRIMARY KEY,
        date VARCHAR(20) NOT NULL,
        title VARCHAR(200) NOT NULL,
        species VARCHAR(100) NOT NULL,
        location VARCHAR(100),
        category VARCHAR(50) DEFAULT '민물고기/탐어',
        size VARCHAR(50),
        memo TEXT,
        photo_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    const diaries = await sql`SELECT * FROM agit_diaries ORDER BY id DESC;`;
    const notes = await sql`SELECT * FROM agit_notes ORDER BY is_pinned DESC, id DESC;`;
    const todos = await sql`SELECT * FROM agit_todos ORDER BY id DESC;`;
    const bookmarks = await sql`SELECT * FROM agit_bookmarks ORDER BY id DESC;`;
    const fishLogs = await sql`SELECT * FROM agit_fish_logs ORDER BY id DESC;`;

    return NextResponse.json({
      success: true,
      data: { diaries, notes, todos, bookmarks, fishLogs }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const sql = getSql();
    if (!sql) return NextResponse.json({ success: false, reason: 'No DB URL' }, { status: 200 });

    const body = await req.json();
    const { type, action, data } = body;

    if (type === 'fish') {
      if (action === 'add') {
        const res = await sql`
          INSERT INTO agit_fish_logs (date, title, species, location, category, size, memo, photo_url)
          VALUES (${data.date}, ${data.title}, ${data.species}, ${data.location || ''}, ${data.category || '민물고기/탐어'}, ${data.size || ''}, ${data.memo || ''}, ${data.photoUrl || ''})
          RETURNING *;
        `;
        return NextResponse.json({ success: true, item: res[0] });
      } else if (action === 'delete') {
        await sql`DELETE FROM agit_fish_logs WHERE id = ${data.id};`;
        return NextResponse.json({ success: true });
      }
    } else if (type === 'diary') {
      if (action === 'add') {
        const res = await sql`
          INSERT INTO agit_diaries (date, title, content, emoji, weather)
          VALUES (${data.date}, ${data.title}, ${data.content}, ${data.emoji || '😊'}, ${data.weather || '☀️ 맑음'})
          RETURNING *;
        `;
        return NextResponse.json({ success: true, item: res[0] });
      } else if (action === 'delete') {
        await sql`DELETE FROM agit_diaries WHERE id = ${data.id};`;
        return NextResponse.json({ success: true });
      }
    } else if (type === 'note') {
      if (action === 'add') {
        const res = await sql`
          INSERT INTO agit_notes (title, content, category, is_pinned)
          VALUES (${data.title}, ${data.content}, ${data.category || '일반'}, ${data.isPinned || false})
          RETURNING *;
        `;
        return NextResponse.json({ success: true, item: res[0] });
      } else if (action === 'delete') {
        await sql`DELETE FROM agit_notes WHERE id = ${data.id};`;
        return NextResponse.json({ success: true });
      } else if (action === 'toggle_pin') {
        await sql`UPDATE agit_notes SET is_pinned = ${data.isPinned} WHERE id = ${data.id};`;
        return NextResponse.json({ success: true });
      }
    } else if (type === 'todo') {
      if (action === 'add') {
        const res = await sql`
          INSERT INTO agit_todos (content, is_done, priority, d_day_date)
          VALUES (${data.content}, ${data.isDone || false}, ${data.priority || 'normal'}, ${data.dDay || ''})
          RETURNING *;
        `;
        return NextResponse.json({ success: true, item: res[0] });
      } else if (action === 'delete') {
        await sql`DELETE FROM agit_todos WHERE id = ${data.id};`;
        return NextResponse.json({ success: true });
      } else if (action === 'toggle') {
        await sql`UPDATE agit_todos SET is_done = ${data.isDone} WHERE id = ${data.id};`;
        return NextResponse.json({ success: true });
      }
    } else if (type === 'bookmark') {
      if (action === 'add') {
        const res = await sql`
          INSERT INTO agit_bookmarks (title, url, icon)
          VALUES (${data.title}, ${data.url}, ${data.icon || '🔗'})
          RETURNING *;
        `;
        return NextResponse.json({ success: true, item: res[0] });
      } else if (action === 'delete') {
        await sql`DELETE FROM agit_bookmarks WHERE id = ${data.id};`;
        return NextResponse.json({ success: true });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
