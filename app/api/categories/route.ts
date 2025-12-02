import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/backend/utils/prisma'

export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ categories })
  } catch (error: any) {
    console.error('Get categories error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
