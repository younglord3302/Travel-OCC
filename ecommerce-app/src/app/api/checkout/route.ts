import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getDemoCart, clearDemoCart } from '@/lib/demo-cart'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  try {
    const session = null // Temporarily disable auth for demo purposes
    const body = await request.json()
    const {
      paymentMethodId,
      shippingAddress,
      billingAddress,
      useBillingForShipping
    } = body

    // Get cart items
    let cartItems = []
    // For demo purposes, use localStorage simulation
    cartItems = getDemoCart() || []

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Calculate totals
    let subtotal = 0
    let taxAmount = 0
    let discountAmount = 0

    for (const item of cartItems) {
      const product = item.product
      if (!product || product.status !== 'ACTIVE' || product.inventoryQuantity < item.quantity) {
        return NextResponse.json({ error: `Product ${product.name} is not available or insufficient stock` }, { status: 400 })
      }

      const itemPrice = product.compareAtPrice || product.price
      subtotal += itemPrice * item.quantity

      // Update inventory
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          inventoryQuantity: product.inventoryQuantity - item.quantity
        }
      })

      // Record inventory adjustment
      await prisma.inventoryAdjustment.create({
        data: {
          productId: item.productId,
          quantity: -item.quantity,
          reason: 'Sale'
        }
      })
    }

    // Calculate tax (simplified - 8% of subtotal)
    taxAmount = Math.round(subtotal * 0.08)
    const shippingAmount = subtotal > 1000 ? 0 : 100 // Free shipping over ₹1000
    const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount

    // For demo purposes, simulate payment processing
    // In production, you'd create a real Stripe payment intent
    const paymentIntentId = `pi_sim_${Date.now()}_${Math.floor(Math.random() * 1000)}`

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: 'demo',
        orderNumber,
        status: 'PROCESSING',
        paymentStatus: 'PENDING',
        subtotal,
        taxAmount,
        shippingAmount,
        discountAmount,
        totalAmount,
        paymentMethod: 'CARD',
        paymentIntentId: paymentIntentId,
        notes: body.notes || null,
        shippingMethod: 'STANDARD'
      }
    })

    // Create order items
    for (const item of cartItems) {
      const product = item.product
      const itemPrice = product.compareAtPrice || product.price

      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          name: product.name,
          description: product.description,
          price: itemPrice,
          quantity: item.quantity,
          variantName: item.selectedVariant?.name
        }
      })
    }

    // Add addresses
    if (shippingAddress) {
      await prisma.orderAddress.create({
        data: {
          orderId: order.id,
          type: 'SHIPPING',
          ...shippingAddress
        }
      })
    }

    let finalBillingAddress = shippingAddress
    if (!useBillingForShipping && billingAddress) {
      finalBillingAddress = billingAddress
    }

    if (finalBillingAddress) {
      await prisma.orderAddress.create({
        data: {
          orderId: order.id,
          type: 'BILLING',
          ...finalBillingAddress
        }
      })
    }

    // Clear cart
    clearDemoCart()

    // For demo purposes, simulate payment success
    // In production, you'd wait for actual Stripe webhook or confirmation
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate processing

    // Update order status to confirmed (demo payment success)
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        paidAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalAmount
    })

  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to process order' }, { status: 500 })
  }
}
