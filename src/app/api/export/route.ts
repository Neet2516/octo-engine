import { NextRequest, NextResponse } from 'next/server'

export async function POST(_req: NextRequest) {
  return NextResponse.json({ message: 'Export — implemented in T10' }, { status: 501 })
}
