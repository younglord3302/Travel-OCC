import { NextResponse } from 'next/server'

// In-memory cart storage for demo purposes (match the one in cart/route.ts)
const demoCarts: Record<string, any[]> = {}

export async function POST() {
  try {
    const demoCartKey = 'ecommerce-demo-cart'
    demoCarts[demoCartKey] = []

    return NextResponse.json({ message: 'Cart cleared successfully' })
  } catch (error) {
    console.error('Error clearing cart:', error)
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 })
  }
}
