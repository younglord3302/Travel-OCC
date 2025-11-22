'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Product {
  id: string
  name: string
  description: string
  price: number
  compareAtPrice?: number
  status: string
  images: { url: string; alt?: string }[]
  averageRating: number
  reviewCount: number
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

interface CategoryData {
  category: Category
  products: Product[]
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const [data, setData] = useState<CategoryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [slug, setSlug] = useState<string>('')

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params
      setSlug(resolvedParams.slug)
    }
    resolveParams()
  }, [])

  useEffect(() => {
    if (slug) {
      fetchCategoryData()
    }
  }, [slug])

  const fetchCategoryData = async () => {
    try {
      const response = await fetch(`/api/categories/${slug}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Category not found')
        }
        throw new Error('Failed to fetch category')
      }
      const categoryData = await response.json()
      setData(categoryData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading category...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <Link href="/categories">
            <Button variant="outline">← Back to Categories</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Category not found</h2>
          <Link href="/categories">
            <Button variant="outline">← Back to Categories</Button>
          </Link>
        </div>
      </div>
    )
  }

  const { category, products } = data

  const handleAddToCart = async (productId: string) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity: 1
        })
      })

      if (response.ok) {
        const data = await response.json()
        alert(data.message)
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to add to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Error adding to cart')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="mb-8">
        <nav className="mb-4">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <span className="mx-2 text-gray-400">›</span>
          <Link href="/categories" className="text-gray-600 hover:text-gray-900">
            Categories
          </Link>
          <span className="mx-2 text-gray-400">›</span>
          <span className="text-gray-900">{category.name}</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-gray-600 text-lg">{category.description}</p>
        )}
        <p className="text-gray-500 mt-1">{products.length} products</p>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No products available</h2>
          <p className="text-gray-600 mb-8">
            There are no products in this category at the moment.
          </p>
          <Link href="/products">
            <Button>View All Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: Product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="block group"
            >
              <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
              {/* Product Image */}
              <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gray-100">
                {product.images.length > 0 ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.images[0].alt || product.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>

                {product.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}

                {/* Rating */}
                {product.reviewCount > 0 && (
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.averageRating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      ({product.reviewCount})
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="mb-3">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      ₹{product.compareAtPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleAddToCart(product.id)
                  }}
                  className="w-full"
                  size="sm"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
            </Link>
          ))}
        </div>
      )}

      {/* Back to Categories */}
      <div className="mt-12 text-center">
        <Link href="/categories">
          <Button variant="outline">
            ← Back to All Categories
          </Button>
        </Link>
      </div>
    </div>
  )
}
