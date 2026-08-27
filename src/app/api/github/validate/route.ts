import { NextRequest, NextResponse } from 'next/server'

export async function POST(_req: NextRequest) {
  return NextResponse.json({ message: 'GitHub validate — implemented in T03' }, { status: 501 })
}
