// Mock auth route - NextAuth commented out due to Next.js 16 compatibility issues
// TODO: Re-implement authentication with Next.js 16 compatible solution

export async function GET() {
  return new Response('Auth not implemented yet', { status: 501 })
}

export async function POST() {
  return new Response('Auth not implemented yet', { status: 501 })
}
