import { getDemoCart, setDemoCart, clearDemoCart } from '@/lib/demo-cart'

describe('Demo Cart Utilities', () => {
  const testCartKey = 'test-cart-key'

  beforeEach(() => {
    // Clear any existing test data
    clearDemoCart(testCartKey)
  })

  describe('getDemoCart', () => {
    it('returns empty array for non-existent cart', () => {
      const result = getDemoCart(testCartKey)
      expect(result).toEqual([])
    })

    it('returns cart items when cart exists', () => {
      const mockItems = [
        { id: '1', productId: 'prod-1', quantity: 2, product: { name: 'Test Product' } }
      ]
      setDemoCart(testCartKey, mockItems)

      const result = getDemoCart(testCartKey)
      expect(result).toEqual(mockItems)
    })
  })

  describe('setDemoCart', () => {
    it('sets cart items correctly', () => {
      const mockItems = [
        { id: '1', productId: 'prod-1', quantity: 1, product: { name: 'Product 1' } },
        { id: '2', productId: 'prod-2', quantity: 2, product: { name: 'Product 2' } }
      ]

      setDemoCart(testCartKey, mockItems)
      const result = getDemoCart(testCartKey)

      expect(result).toEqual(mockItems)
    })

    it('overwrites existing cart items', () => {
      const initialItems = [{ id: '1', productId: 'prod-1', quantity: 1 }]
      const newItems = [{ id: '2', productId: 'prod-2', quantity: 1 }]

      setDemoCart(testCartKey, initialItems)
      setDemoCart(testCartKey, newItems)

      const result = getDemoCart(testCartKey)
      expect(result).toEqual(newItems)
    })

    it('handles empty array', () => {
      setDemoCart(testCartKey, [])
      const result = getDemoCart(testCartKey)
      expect(result).toEqual([])
    })
  })

  describe('clearDemoCart', () => {
    it('clears cart items', () => {
      const mockItems = [
        { id: '1', productId: 'prod-1', quantity: 1, product: { name: 'Test' } }
      ]

      setDemoCart(testCartKey, mockItems)
      expect(getDemoCart(testCartKey)).toEqual(mockItems)

      clearDemoCart(testCartKey)
      expect(getDemoCart(testCartKey)).toEqual([])
    })

    it('does not affect other carts', () => {
      const cart1Items = [{ id: '1', productId: 'prod-1', quantity: 1 }]
      const cart2Items = [{ id: '2', productId: 'prod-2', quantity: 1 }]

      setDemoCart('cart1', cart1Items)
      setDemoCart('cart2', cart2Items)

      clearDemoCart('cart1')

      expect(getDemoCart('cart1')).toEqual([])
      expect(getDemoCart('cart2')).toEqual(cart2Items)
    })
  })

  describe('Cart Business Logic', () => {
    it('calculates correct total quantity', () => {
      const mockItems = [
        { id: '1', quantity: 2 },
        { id: '2', quantity: 4 },
        { id: '3', quantity: 1 }
      ]

      const totalQuantity = mockItems.reduce((total, item) => total + item.quantity, 0)
      expect(totalQuantity).toBe(7)
    })

    it('calculates correct total price', () => {
      const mockItems = [
        { product: { price: 100 }, quantity: 2 },
        { product: { price: 50 }, quantity: 3 },
        { product: { price: 25 }, quantity: 1 }
      ]

      const totalPrice = mockItems.reduce((total, item) =>
        total + (item.product.price * item.quantity), 0
      )
      expect(totalPrice).toBe(375)
    })

    it('handles duplicate products correctly', () => {
      const items = [
        { productId: 'prod-1', quantity: 2 },
        { productId: 'prod-1', quantity: 3 },
        { productId: 'prod-2', quantity: 1 }
      ]

      const uniqueItems = items.reduce((acc, item) => {
        const existing = acc.find(existing => existing.productId === item.productId)
        if (existing) {
          existing.quantity += item.quantity
        } else {
          acc.push({ ...item })
        }
        return acc
      }, [])

      expect(uniqueItems).toEqual([
        { productId: 'prod-1', quantity: 5 },
        { productId: 'prod-2', quantity: 1 }
      ])
    })
  })
})
