import { NextRequest, NextResponse } from 'next/server'

export async function POST(_req: NextRequest) {
  return NextResponse.json({ message: 'Analysis start — implemented in T06' }, { status: 501 })
}
