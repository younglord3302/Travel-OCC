// Shared demo cart storage for development/demo purposes
const demoCarts: Record<string, any[]> = {}

export function getDemoCart(cartKey: string = 'ecommerce-demo-cart'): any[] {
  return demoCarts[cartKey] || []
}

export function setDemoCart(cartKey: string = 'ecommerce-demo-cart', items: any[]): void {
  demoCarts[cartKey] = items
}

export function clearDemoCart(cartKey: string = 'ecommerce-demo-cart'): void {
  demoCarts[cartKey] = []
}
