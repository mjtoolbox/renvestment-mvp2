import { NextResponse } from 'next/server';
import DB from '../../../lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, role } = body;
    if (!name || !email || !role) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    // normalize email for uniqueness check
    const normalizedEmail = String(email).trim().toLowerCase();

    // check for existing email
    try {
      const existing = await DB.getContactByEmail(normalizedEmail);
      if (existing) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
      }
    } catch (dbErr) {
      console.error('DB check error', dbErr);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    const row = await DB.insertContact(name, normalizedEmail, role);
    return NextResponse.json({ success: true, id: row.id, created_at: row.created_at }, { status: 201 });
  } catch (err: any) {
    console.error('API /api/contact error', err?.message || err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
