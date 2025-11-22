'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, Truck, MapPin, User, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { getDemoCart } from '@/lib/demo-cart'

interface CartItem {
  id: string
  quantity: number
  productId: string
  product: {
    id: string
    name: string
    price: number
    compareAtPrice?: number
    images: { url: string }[]
  }
}

interface CheckoutState {
  loading: boolean
  error: string | null
  step: 1 | 2 | 3 // 1: Cart Review, 2: Address & Payment, 3: Confirmation
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [state, setState] = useState<CheckoutState>({
    loading: true,
    error: null,
    step: 1
  })

  // Form states
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    zip: '',
    country: 'India'
  })

  const [billingAddress, setBillingAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    zip: '',
    country: 'India'
  })

  const [useBillingForShipping, setUseBillingForShipping] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [orderNumber, setOrderNumber] = useState('')

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      const items = getDemoCart() || []

      if (!items || items.length === 0) {
        router.push('/products')
        return
      }

      // Fetch product details for cart items
      const productIds = items.map(item => item.productId)
      const productsResponse = await fetch('/api/products')
      if (!productsResponse.ok) {
        throw new Error('Failed to load products')
      }

      const products = await productsResponse.json()
      const productsMap = products.reduce((acc: any, product: any) => {
        acc[product.id] = product
        return acc
      }, {})

      // Combine cart items with product data
      const itemsWithProducts = items.map((item: any) => ({
        ...item,
        product: productsMap[item.productId]
      })).filter(item => item.product)

      setCartItems(itemsWithProducts)
    } catch (error) {
      console.error('Error loading cart:', error)
      setState(prev => ({ ...prev, error: 'Failed to load cart', loading: false }))
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((total, item) => {
      return total + (item.product.compareAtPrice || item.product.price) * item.quantity
    }, 0)

    const taxAmount = Math.round(subtotal * 0.08) // 8% tax
    const shippingAmount = subtotal > 1000 ? 0 : 100 // Free shipping over ₹1000
    const total = subtotal + taxAmount + shippingAmount

    return { subtotal, taxAmount, shippingAmount, total }
  }

  const handleContinueToPayment = () => {
    setState(prev => ({ ...prev, step: 2 }))
  }

  const handlePlaceOrder = async () => {
    if (!cardNumber || !expiryDate || !cvv) {
      setState(prev => ({ ...prev, error: 'Please fill in all payment details' }))
      return
    }

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: `pm_sim_${Date.now()}`, // Simulated payment method ID
          shippingAddress,
          billingAddress: useBillingForShipping ? shippingAddress : billingAddress,
          useBillingForShipping
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Checkout failed')
      }

      setOrderNumber(data.orderNumber)
      setState(prev => ({ ...prev, step: 3 }))

    } catch (error) {
      console.error('Checkout error:', error)
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Checkout failed',
        loading: false
      }))
    }
  }

  if (state.loading && cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading checkout...</p>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Your cart is empty</p>
          <Button onClick={() => router.push('/products')} className="mt-4">
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  const { subtotal, taxAmount, shippingAmount, total } = calculateTotals()

  if (state.step === 3 && orderNumber) {
    // Order confirmation
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
            <CardDescription>
              Thank you for your order. Your order has been successfully placed.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-lg font-semibold text-gray-900">Order #{orderNumber}</p>
              <p className="text-sm text-gray-600">
                A confirmation email will be sent shortly.
              </p>
            </div>
            <div className="space-y-2">
              <Button onClick={() => router.push(`/orders/${orderNumber}`)}>
                View Order Details
              </Button>
              <Button variant="outline" onClick={() => router.push('/products')}>
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className={state.step >= 1 ? 'text-primary font-medium' : ''}>
            1. Cart Review
          </span>
          <span>→</span>
          <span className={state.step >= 2 ? 'text-primary font-medium' : ''}>
            2. Address & Payment
          </span>
          <span>→</span>
          <span className={state.step >= 3 ? 'text-primary font-medium' : ''}>
            3. Confirmation
          </span>
        </div>
      </div>

      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {state.step === 1 ? (
            // Cart Review Step
            <Card>
              <CardHeader>
                <CardTitle>Review Your Cart</CardTitle>
                <CardDescription>Check your items before proceeding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      {item.product.images.length > 0 ? (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Truck className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                      <p className="font-semibold">
                        ₹{(item.product.compareAtPrice || item.product.price) * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
                <Button onClick={handleContinueToPayment} className="w-full">
                  Continue to Payment
                </Button>
              </CardContent>
            </Card>
          ) : (
            // Address & Payment Step
            <div className="space-y-6">
              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={shippingAddress.firstName}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={shippingAddress.lastName}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address1">Address Line 1</Label>
                    <Input
                      id="address1"
                      value={shippingAddress.address1}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, address1: e.target.value }))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                    <Input
                      id="address2"
                      value={shippingAddress.address2}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, address2: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="province">State</Label>
                    <Input
                      id="province"
                      value={shippingAddress.province}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, province: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      value={shippingAddress.zip}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, zip: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, country: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Billing Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Billing Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="useShippingForBilling"
                      checked={useBillingForShipping}
                      onCheckedChange={(checked) => setUseBillingForShipping(checked as boolean)}
                    />
                    <Label htmlFor="useShippingForBilling">
                      Same as shipping address
                    </Label>
                  </div>

                  {!useBillingForShipping && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Similar fields for billing address - omitted for brevity */}
                      <p className="text-sm text-gray-600 col-span-2">
                        Billing address fields would be here
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handlePlaceOrder}
                className="w-full"
                disabled={state.loading}
              >
                {state.loading ? 'Processing...' : `Place Order - ₹${total.toLocaleString()}`}
              </Button>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span>₹{((item.product.compareAtPrice || item.product.price) * item.quantity).toLocaleString()}</span>
                </div>
              ))}

              <Separator />

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingAmount === 0 ? 'FREE' : `₹${shippingAmount}`}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span>₹{taxAmount.toLocaleString()}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
