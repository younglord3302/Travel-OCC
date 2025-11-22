import { NextRequest } from 'next/server'
import { GET, POST, PUT, DELETE } from '@/app/api/cart/route'

// Mock NextResponse before importing anything that uses it
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, options = {}) => ({
      json: jest.fn().mockResolvedValue(data),
      status: options.status || 200,
      ok: (options.status || 200) < 300
    }))
  },
  NextRequest: jest.fn()
}))

// Mock dependencies
jest.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findUnique: jest.fn(),
    },
  },
}))

jest.mock('@/lib/demo-cart', () => ({
  getDemoCart: jest.fn(),
  setDemoCart: jest.fn(),
  clearDemoCart: jest.fn(),
}))

import { prisma } from '@/lib/prisma'
import { getDemoCart, setDemoCart, clearDemoCart } from '@/lib/demo-cart'

const mockPrismaProduct = prisma.product as jest.Mocked<typeof prisma.product>
const mockGetDemoCart = getDemoCart as jest.Mock
const mockSetDemoCart = setDemoCart as jest.Mock
const mockClearDemoCart = clearDemoCart as jest.Mock

describe('/api/cart', () => {
  let mockRequest: Partial<NextRequest>

  beforeEach(() => {
    jest.clearAllMocks()
    mockSetDemoCart.mockImplementation(() => {})
    mockGetDemoCart.mockReturnValue([])
    mockClearDemoCart.mockImplementation(() => {})
  })

  describe('GET /api/cart', () => {
    it('returns demo cart items', async () => {
      const mockCartItems = [
        { id: '1', productId: 'prod-1', quantity: 2, product: { name: 'Test Product' } }
      ]
      mockGetDemoCart.mockReturnValue(mockCartItems)

      const response = await GET(mockRequest as NextRequest)
      const result = await response.json()

      expect(response.status).toBe(200)
      expect(result).toEqual({
        id: 'ecommerce-demo-cart',
        userId: null,
        items: mockCartItems,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })

    it('handles demo cart fetch errors', async () => {
      mockGetDemoCart.mockImplementation(() => {
        throw new Error('Demo cart error')
      })

      const response = await GET(mockRequest as NextRequest)
      const result = await response.json()

      expect(response.status).toBe(500)
      expect(result.error).toBe('Failed to fetch cart')
    })
  })

  describe('POST /api/cart', () => {
    beforeEach(() => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({
          productId: 'prod-1',
          quantity: 2
        })
      }
    })

    it('adds item to cart successfully', async () => {
      const mockProduct = {
        id: 'prod-1',
        name: 'Test Product',
        price: 100,
        inventoryQuantity: 10,
        status: 'ACTIVE',
        images: [],
      }

      mockPrismaProduct.findUnique.mockResolvedValue(mockProduct)
      mockGetDemoCart.mockReturnValue([])

      const response = await POST(mockRequest as NextRequest)
      const result = await response.json()

      expect(response.status).toBe(200)
      expect(result.message).toBe('Added 2x Test Product to cart')
      expect(mockSetDemoCart).toHaveBeenCalled()
    })

    it('returns error for non-existent product', async () => {
      mockPrismaProduct.findUnique.mockResolvedValue(null)

      const response = await POST(mockRequest as NextRequest)
      const result = await response.json()

      expect(response.status).toBe(404)
      expect(result.error).toBe('Product not found')
    })

    it('returns error for inactive product', async () => {
      const mockProduct = {
        id: 'prod-1',
        name: 'Test Product',
        price: 100,
        inventoryQuantity: 10,
        status: 'INACTIVE',
        images: [],
      }

      mockPrismaProduct.findUnique.mockResolvedValue(mockProduct)

      const response = await POST(mockRequest as NextRequest)
      const result = await response.json()

      expect(response.status).toBe(400)
      expect(result.error).toBe('Product not available')
    })

    it('returns error for insufficient stock', async () => {
      const mockProduct = {
        id: 'prod-1',
        name: 'Test Product',
        price: 100,
        inventoryQuantity: 1,
        status: 'ACTIVE',
        images: [],
      }

      mockPrismaProduct.findUnique.mockResolvedValue(mockProduct)

      const response = await POST(mockRequest as NextRequest)
      const result = await response.json()

      expect(response.status).toBe(400)
      expect(result.error).toBe('Insufficient stock')
    })

    it('increases quantity for existing cart item', async () => {
      const mockProduct = {
        id: 'prod-1',
        name: 'Test Product',
        price: 100,
        inventoryQuantity: 10,
        status: 'ACTIVE',
        images: [],
      }

      const existingItems = [
        { id: '1', productId: 'prod-1', quantity: 3, product: {} }
      ]

      mockPrismaProduct.findUnique.mockResolvedValue(mockProduct)
      mockGetDemoCart.mockReturnValue(existingItems)

      const response = await POST(mockRequest as NextRequest)

      expect(response.status).toBe(200)
      expect(mockSetDemoCart).toHaveBeenCalledWith('ecommerce-demo-cart', [
        { id: '1', productId: 'prod-1', quantity: 5, product: {} }
      ])
    })
  })

  describe('PUT /api/cart', () => {
    it('updates cart item quantity', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          productId: 'prod-1',
          quantity: 5
        })
      }

      const mockProduct = {
        id: 'prod-1',
        name: 'Test Product',
        price: 100,
        inventoryQuantity: 10,
        status: 'ACTIVE',
        images: [],
      }

      const existingItems = [
        { id: '1', productId: 'prod-1', quantity: 2, product: {} }
      ]

      mockPrismaProduct.findUnique.mockResolvedValue(mockProduct)
      mockGetDemoCart.mockReturnValue(existingItems)

      const response = await PUT(mockRequest as NextRequest)

      expect(response.status).toBe(200)
      expect(mockSetDemoCart).toHaveBeenCalled()
    })

    it('adds new item if not in cart', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          productId: 'prod-1',
          quantity: 3
        })
      }

      const mockProduct = {
        id: 'prod-1',
        name: 'Test Product',
        price: 100,
        inventoryQuantity: 10,
        status: 'ACTIVE',
        images: [],
      }

      mockPrismaProduct.findUnique.mockResolvedValue(mockProduct)
      mockGetDemoCart.mockReturnValue([])

      const response = await PUT(mockRequest as NextRequest)

      expect(response.status).toBe(200)
      expect(mockSetDemoCart).toHaveBeenCalled()
    })

    it('returns error for invalid quantity', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          productId: 'prod-1',
          quantity: 0
        })
      }

      const response = await PUT(mockRequest as NextRequest)
      const result = await response.json()

      expect(response.status).toBe(400)
      expect(result.error).toBe('Valid product ID and quantity required')
    })
  })

  describe('DELETE /api/cart', () => {
    it('removes item from cart', async () => {
      // Create a mock request with URL that includes search params
      const mockUrl = 'http://localhost/api/cart?itemId=test-item-1'
      const mockRequest = {
        url: mockUrl,
        json: jest.fn()
      } as Partial<NextRequest>

      const existingItems = [
        { id: 'test-item-1', productId: 'prod-1', quantity: 2 },
        { id: 'test-item-2', productId: 'prod-2', quantity: 1 }
      ]

      mockGetDemoCart.mockReturnValue(existingItems)

      const response = await DELETE(mockRequest as NextRequest)
      const result = await response.json()

      expect(response.status).toBe(200)
      expect(result.message).toBe('Item removed from cart')
      expect(mockSetDemoCart).toHaveBeenCalledWith('ecommerce-demo-cart', [
        { id: 'test-item-2', productId: 'prod-2', quantity: 1 }
      ])
    })

    it('returns error for missing item ID', async () => {
      const mockUrl = 'http://localhost/api/cart'
      const mockRequest = {
        url: mockUrl,
        json: jest.fn()
      } as Partial<NextRequest>

      const response = await DELETE(mockRequest as NextRequest)
      const result = await response.json()

      expect(response.status).toBe(400)
      expect(result.error).toBe('Item ID required')
    })
  })

  describe('Cart API Edge Cases', () => {
    it('handles database connection errors', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({
          productId: 'prod-1',
          quantity: 1
        })
      }

      mockPrismaProduct.findUnique.mockRejectedValue(new Error('Database error'))

      const response = await POST(mockRequest as NextRequest)
      const result = await response.json()

      expect(response.status).toBe(500)
      expect(result.error).toBe('Failed to add to cart')
    })

    it('validates product ID format', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({
          productId: '',
          quantity: 1
        })
      }

      const response = await POST(mockRequest as NextRequest)
      const result = await response.json()

      expect(response.status).toBe(400)
      expect(result.error).toBe('Product ID required')
    })

    it('defaults quantity to 1 when not provided', async () => {
      mockRequest = {
        json: jest.fn().mockResolvedValue({
          productId: 'prod-1'
        })
      }

      const mockProduct = {
        id: 'prod-1',
        name: 'Test Product',
        price: 100,
        inventoryQuantity: 10,
        status: 'ACTIVE',
        images: [],
      }

      mockPrismaProduct.findUnique.mockResolvedValue(mockProduct)
      mockGetDemoCart.mockReturnValue([])

      const response = await POST(mockRequest as NextRequest)

      expect(response.status).toBe(200)
      expect(mockSetDemoCart).toHaveBeenCalledWith('ecommerce-demo-cart', [
        expect.objectContaining({
          productId: 'prod-1',
          quantity: 1
        })
      ])
    })
  })
})
