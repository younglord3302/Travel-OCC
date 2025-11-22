import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const rating = searchParams.get('rating')

    if (!query || query.length < 2) {
      return NextResponse.json({
        products: [],
        total: 0,
        message: 'Search query must be at least 2 characters long'
      })
    }

    // Build where conditions
    const where: any = {
      status: 'ACTIVE',
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { category: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        }}
      ]
    }

    // Add category filter
    if (category && category !== 'all') {
      where.category = {
        slug: category
      }
    }

    // Add price filters
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseInt(minPrice)
      if (maxPrice) where.price.lte = parseInt(maxPrice)
    }

    // Get products with search conditions
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        images: true,
        reviews: {
          select: {
            rating: true
          }
        },
        _count: {
          select: {
            reviews: true
          }
        }
      },
      orderBy: [
        // Priority: exact name matches, then partial matches
        { name: 'asc' }
      ]
    })

    // Calculate average ratings and format response
    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      productType: product.productType,
      inventoryQuantity: product.inventoryQuantity,
      status: product.status,
      category: product.category,
      images: product.images,
      reviewCount: product._count.reviews,
      averageRating: product._count.reviews > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product._count.reviews
        : 0,
    }))

    // Get categories for filter options
    const allCategories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            products: {
              where: { status: 'ACTIVE' }
            }
          }
        }
      }
    })

    const categoriesWithCount = allCategories.filter(cat => cat._count.products > 0)

    return NextResponse.json({
      products: formattedProducts,
      total: formattedProducts.length,
      categories: categoriesWithCount,
      query: query
    })

  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Search failed. Please try again.' },
      { status: 500 }
    )
  }
}
