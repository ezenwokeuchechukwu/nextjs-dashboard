import { NextResponse } from 'next/server';
import { Client } from 'pg';
import { Pool } from 'pg';


export async function GET() {
  try {
    const client = new Client({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    await client.connect();
    const res = await client.query('SELECT * FROM customers');
    await client.end();

    return NextResponse.json(res.rows);
  } catch (err) {
    console.error('Database Error:', err);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}
