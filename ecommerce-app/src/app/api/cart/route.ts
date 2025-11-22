import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDemoCart, setDemoCart } from '@/lib/demo-cart'

export async function GET() {
  try {
    // For now, return a demo cart using localStorage key (will be replaced with auth)
    const demoCartKey = 'ecommerce-demo-cart'
    const cartItems = getDemoCart(demoCartKey)

    return NextResponse.json({
      id: demoCartKey,
      userId: null,
      items: cartItems,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  } catch (error) {
    console.error('Error fetching demo cart:', error)
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { productId, quantity = 1 } = body

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, price: true, inventoryQuantity: true, status: true, images: true }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (product.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Product not available' }, { status: 400 })
    }

    if (product.inventoryQuantity < quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 })
    }

    // Add or update cart item (simplified for demo)
    const demoCartKey = 'ecommerce-demo-cart'
    const currentItems = getDemoCart(demoCartKey)
    const existingItem = currentItems.find(item => item.productId === productId)

    if (existingItem) {
      existingItem.quantity += quantity
      setDemoCart(demoCartKey, [...currentItems])
    } else {
      const itemId = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      setDemoCart(demoCartKey, [...currentItems, {
        id: itemId,
        productId: product.id,
        quantity,
        product
      }])
    }

    return NextResponse.json({
      message: `Added ${quantity}x ${product.name} to cart`,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity
      }
    })

  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { productId, quantity } = body

    if (!productId || typeof quantity !== 'number' || quantity < 1) {
      return NextResponse.json({ error: 'Valid product ID and quantity required' }, { status: 400 })
    }

    // Verify product exists and has sufficient stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, price: true, inventoryQuantity: true, status: true, images: true }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (product.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Product not available' }, { status: 400 })
    }

    if (product.inventoryQuantity < quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 })
    }

    // Update cart item
    const demoCartKey = 'ecommerce-demo-cart'
    const currentItems = getDemoCart(demoCartKey)
    const existingItemIndex = currentItems.findIndex(item => item.productId === productId)

    if (existingItemIndex !== -1) {
      currentItems[existingItemIndex].quantity = quantity
      setDemoCart(demoCartKey, [...currentItems])
    } else {
      // Item doesn't exist, add it with the new quantity
      const itemId = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      setDemoCart(demoCartKey, [...currentItems, {
        id: itemId,
        productId: product.id,
        quantity,
        product
      }])
    }

    const updatedItem = currentItems.find(item => item.productId === productId) || { id: '', quantity }
    return NextResponse.json({
      message: 'Cart updated successfully',
      item: updatedItem
    })
  } catch (error) {
    console.error('Error updating cart:', error)
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const itemId = url.searchParams.get('itemId')

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 })
    }

    // Remove item from cart
    const demoCartKey = 'ecommerce-demo-cart'
    const currentItems = getDemoCart(demoCartKey)
    const updatedItems = currentItems.filter(item => item.id !== itemId)
    setDemoCart(demoCartKey, updatedItems)

    return NextResponse.json({ message: 'Item removed from cart' })
  } catch (error) {
    console.error('Error removing from cart:', error)
    return NextResponse.json({ error: 'Failed to remove item from cart' }, { status: 500 })
  }
}
