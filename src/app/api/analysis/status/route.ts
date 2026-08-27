import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest) {
  return NextResponse.json({ message: 'Analysis status — implemented in T06' }, { status: 501 })
}
