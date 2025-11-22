'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Package, Eye, Truck, CheckCircle, Clock, XCircle, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Order {
  id: string
  orderNumber: string
  status: 'PENDING' | 'PROCESSING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
  totalAmount: number
  createdAt: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    variantName?: string
    product: {
      images: { url: string }[]
    }
  }>
  addresses: Array<{
    type: 'SHIPPING' | 'BILLING'
    city: string
    province: string
    country: string
  }>
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      // For demo purposes, simulate having some orders
      // In a real app with authentication, this would be /api/orders?userId=userId
      const demoOrders: Order[] = [
        {
          id: '1',
          orderNumber: 'ORD-1234567890-123',
          status: 'DELIVERED',
          totalAmount: 2500,
          createdAt: '2025-01-15T10:30:00Z',
          items: [
            {
              id: '1',
              name: 'Sample Product 1',
              price: 1200,
              quantity: 1,
              product: { images: [{ url: '/placeholder-product.jpg' }] }
            },
            {
              id: '2',
              name: 'Sample Product 2',
              price: 850,
              quantity: 2,
              product: { images: [{ url: '/placeholder-product.jpg' }] }
            }
          ],
          addresses: [
            {
              type: 'SHIPPING',
              city: 'Mumbai',
              province: 'Maharashtra',
              country: 'India'
            }
          ]
        },
        {
          id: '2',
          orderNumber: 'ORD-1234567891-456',
          status: 'SHIPPED',
          totalAmount: 1899,
          createdAt: '2025-01-20T14:15:00Z',
          items: [
            {
              id: '3',
              name: 'Another Product',
              price: 1899,
              quantity: 1,
              product: { images: [{ url: '/placeholder-product.jpg' }] }
            }
          ],
          addresses: [
            {
              type: 'SHIPPING',
              city: 'Delhi',
              province: 'Delhi',
              country: 'India'
            }
          ]
        }
      ]

      setOrders(demoOrders)
    } catch (error) {
      console.error('Error loading orders:', error)
      setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'SHIPPED':
        return <Truck className="h-4 w-4 text-blue-600" />
      case 'PROCESSING':
      case 'CONFIRMED':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'CANCELLED':
      case 'REFUNDED':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800'
      case 'PROCESSING':
      case 'CONFIRMED':
        return 'bg-yellow-100 text-yellow-800'
      case 'CANCELLED':
      case 'REFUNDED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadOrders}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your order history here.</p>
          <Link href="/products">
            <Button size="lg">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
        <p className="text-gray-600">Track your orders and view past purchases</p>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === 'DELIVERED').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-2xl font-bold">{orders.filter(o => ['SHIPPED', 'PROCESSING', 'CONFIRMED'].includes(o.status)).length}</p>
              </div>
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold">₹{orders.reduce((total, order) => total + order.totalAmount, 0).toLocaleString()}</p>
              </div>
              <div className="h-8 w-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold">
                ₹
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <CardTitle className="text-lg">Order {order.orderNumber}</CardTitle>
                    <CardDescription>
                      Placed on {formatDate(order.createdAt)}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">₹{order.totalAmount.toLocaleString()}</p>
                  <Link href={`/orders/${order.orderNumber}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="border-t pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex space-x-4">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                          {item.product.images.length > 0 ? (
                            <img
                              src={item.product.images[0].url}
                              alt={item.name}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <Package className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                          <p className="text-xs text-gray-600">₹{item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            +{order.items.length - 3}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {order.addresses.length > 0 && (
                    <div className="text-right text-sm text-gray-600">
                      <p className="font-medium">Shipping to</p>
                      <p>{order.addresses[0].city}, {order.addresses[0].province}</p>
                      <p>{order.addresses[0].country}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
