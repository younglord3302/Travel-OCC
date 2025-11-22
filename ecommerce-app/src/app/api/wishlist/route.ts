import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// For demo purposes, use a fixed user ID. In a real app, get from session
const DEMO_USER_ID = 'demo-user'

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams
    const userId = searchParams.get('userId') || DEMO_USER_ID

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: {
        wishlist: {
          userId: userId
        }
      },
      include: {
        product: {
          include: {
            images: true,
            reviews: {
              select: {
                rating: true
              }
            }
          }
        }
      },
      orderBy: {
        addedAt: 'desc'
      }
    })

    // Calculate average rating for each product
    const itemsWithRating = wishlistItems.map(item => ({
      ...item,
      product: {
        ...item.product,
        averageRating: item.product.reviews.length > 0
          ? item.product.reviews.reduce((sum, review) => sum + review.rating, 0) / item.product.reviews.length
          : 0,
        reviewCount: item.product.reviews.length
      }
    }))

    return NextResponse.json(itemsWithRating)
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, userId = DEMO_USER_ID } = body

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Get or create wishlist
    let wishlist = await prisma.wishlist.findFirst({
      where: { userId }
    })

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: {
          userId,
          name: 'My Wishlist'
        }
      })
    }

    // Check if product is already in wishlist
    const existingItem = await prisma.wishlistItem.findFirst({
      where: {
        wishlistId: wishlist.id,
        productId
      }
    })

    if (existingItem) {
      return NextResponse.json({
        error: 'Product already in wishlist',
        wishlistItem: existingItem
      }, { status: 400 })
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId
      },
      include: {
        product: {
          include: {
            images: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Added to wishlist',
      wishlistItem
    }, { status: 201 })
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams
    const productId = searchParams.get('productId')
    const userId = searchParams.get('userId') || DEMO_USER_ID

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    // Find wishlist
    const wishlist = await prisma.wishlist.findFirst({
      where: { userId }
    })

    if (!wishlist) {
      return NextResponse.json({ error: 'Wishlist not found' }, { status: 404 })
    }

    // Remove from wishlist
    await prisma.wishlistItem.deleteMany({
      where: {
        wishlistId: wishlist.id,
        productId
      }
    })

    return NextResponse.json({ message: 'Removed from wishlist' })
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 })
  }
}
