import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ message: `Report ${params.id} — implemented in T06` }, { status: 501 })
}
