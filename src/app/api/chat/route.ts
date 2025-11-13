import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { message } = await req.json()
  // dummy AI reply
  return NextResponse.json({ reply: `You said: ${message}` })
}
