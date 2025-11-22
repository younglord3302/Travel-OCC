import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Header } from '@/components/layout/Header'

// Mock next/navigation
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('Header Component', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockFetch.mockClear()
  })

  it('renders the header with logo and navigation elements', () => {
    render(<Header />)

    expect(screen.getByText('E-Store')).toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(5) // search (mobile), user, theme, cart, menu buttons
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument()
  })

  it('displays search form on desktop', () => {
    render(<Header />)

    const searchForm = screen.getByPlaceholderText('Search products...').closest('form')
    expect(searchForm).toBeInTheDocument()
    expect(searchForm).toHaveClass('hidden', 'md:flex') // Search form is hidden on mobile, visible on desktop
  })

  it('shows cart count badge when cart has items', async () => {
    // Mock fetch response with cart items
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: [
          { id: '1', quantity: 2 },
          { id: '2', quantity: 1 }
        ]
      })
    })

    render(<Header />)

    await waitFor(() => {
      const cartBadge = screen.getByText('3')
      expect(cartBadge).toBeInTheDocument()
      expect(cartBadge).toHaveClass('bg-primary', 'text-primary-foreground')
    })

    expect(mockFetch).toHaveBeenCalledWith('/api/cart')
  })

  it('shows "9+" for cart count > 9', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: Array(15).fill(null).map((_, i) => ({ id: i.toString(), quantity: 1 }))
      })
    })

    render(<Header />)

    await waitFor(() => {
      expect(screen.getByText('9+')).toBeInTheDocument()
    })
  })

  it('navigates to search page on search form submit', async () => {
    render(<Header />)

    const searchInput = screen.getByPlaceholderText('Search products...')
    const searchForm = searchInput.closest('form')!

    fireEvent.change(searchInput, { target: { value: 'headphones' } })
    fireEvent.submit(searchForm)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/search?q=headphones')
    })
  })

  it('does not navigate if search query is empty', () => {
    render(<Header />)

    const searchInput = screen.getByPlaceholderText('Search products...')
    const searchForm = searchInput.closest('form')!

    fireEvent.change(searchInput, { target: { value: '' } })
    fireEvent.submit(searchForm)

    expect(mockPush).not.toHaveBeenCalled()
  })

  it('handles cart API errors gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('API Error'))

    render(<Header />)

    // Component should not crash - wait a bit for the fetch to complete
    await waitFor(() => {
      expect(screen.getByText('E-Store')).toBeInTheDocument()
    })

    // No cart badge should exist since API failed
    expect(screen.queryByText(/\d+/)).not.toBeInTheDocument()
  })

  it('updates cart count when component mounts', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: [{ id: '1', quantity: 5 }]
      })
    })

    render(<Header />)

    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('includes theme toggle button in the header', () => {
    render(<Header />)

    const themeButton = screen.getByRole('button', { name: /toggle theme/i })
    expect(themeButton).toBeInTheDocument()
    expect(themeButton).toHaveClass('h-9', 'w-9')
  })

  it('theme toggle button is accessible and clickable', () => {
    render(<Header />)

    const themeButton = screen.getByRole('button', { name: /toggle theme/i })
    // Check for screen reader text accessibility
    const srText = screen.getByText('Toggle theme (light)')
    expect(srText).toBeInTheDocument()
    expect(themeButton).not.toBeDisabled()
  })
})
