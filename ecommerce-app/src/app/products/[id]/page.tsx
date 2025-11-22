'use client'

import { useState, useEffect, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingBag, Minus, Plus, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Product {
  id: string
  name: string
  description: string
  price: number
  compareAtPrice?: number
  inventoryQuantity: number
  productType: string
  sku?: string
  status: string
  category: {
    id: string
    name: string
    slug: string
  }
  images: { url: string; alt?: string }[]
  averageRating: number
  reviewCount: number
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  // Unwrap the params Promise using React.use()
  const { id } = use(params)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      // First try to get from our database API
      const response = await fetch('/api/products')
      if (response.ok) {
        const allProducts = await response.json()
        const foundProduct = allProducts.find((p: Product) => p.id === id)

        if (foundProduct) {
          setProduct(foundProduct)
          return
        }
      }

      // If not found, return not found error
      throw new Error('Product not found')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= (product?.inventoryQuantity || 1)) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return

    // Check stock
    if (quantity > product.inventoryQuantity) {
      alert('Not enough stock available')
      return
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The product you\'re looking for doesn\'t exist.'}</p>
          <Link href="/products">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const discountPercentage = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
        <span className="mx-2 text-gray-400">›</span>
        <Link href="/products" className="text-gray-600 hover:text-gray-900">Products</Link>
        <span className="mx-2 text-gray-400">›</span>
        <Link href={`/categories/${product.category.slug}`} className="text-gray-600 hover:text-gray-900">
          {product.category.name}
        </Link>
        <span className="mx-2 text-gray-400">›</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={product.images[selectedImage]?.url || '/placeholder.jpg'}
              alt={product.images[selectedImage]?.alt || product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-16 h-16 relative rounded border-2 overflow-hidden ${
                    selectedImage === index ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || product.name}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

            {/* Rating */}
            {product.reviewCount > 0 && (
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 ml-2">
                  {product.averageRating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl font-bold text-gray-900">
                ₹{product.price.toLocaleString()}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ₹{product.compareAtPrice.toLocaleString()}
                  </span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                    {discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Product Type */}
            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {product.productType}
              </span>
              {product.sku && (
                <span className="ml-2 text-sm text-gray-600">
                  SKU: {product.sku}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Stock Status:</span>
                <span className={`font-semibold ${
                  product.inventoryQuantity > 10
                    ? 'text-green-600'
                    : product.inventoryQuantity > 0
                    ? 'text-orange-600'
                    : 'text-red-600'
                }`}>
                  {product.inventoryQuantity > 10
                    ? 'In Stock'
                    : product.inventoryQuantity > 0
                    ? `Only ${product.inventoryQuantity} left`
                    : 'Out of Stock'
                  }
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            {product.inventoryQuantity > 0 && (
              <div className="mb-6">
                <label className="block font-medium text-gray-900 mb-2">
                  Quantity:
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-semibold text-xl w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.inventoryQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={product.inventoryQuantity === 0}
                size="lg"
                className="flex-1"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                {product.inventoryQuantity === 0 ? 'Out of Stock' : 'Add to Cart - ₹' + (product.price * quantity).toLocaleString()}
              </Button>
              <Button variant="outline" size="lg">
                ❤️ Wishlist
              </Button>
            </div>
          </div>

          {/* Category Link */}
          <div className="border-t pt-6">
            <Link
              href={`/categories/${product.category.slug}`}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              ← Back to {product.category.name}
            </Link>
          </div>
        </div>
      </div>

      {/* Related Products or Reviews Section could go here */}
      <div className="mt-16 border-t pt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
        <div className="text-center">
          <Link href="/products">
            <Button>
              <ShoppingBag className="w-4 h-4 mr-2" />
              Browse More Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
