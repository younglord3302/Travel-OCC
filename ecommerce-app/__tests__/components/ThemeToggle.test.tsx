import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeToggle } from '@/components/theme/theme-toggle'

// Create a mock ThemeProvider wrapper that doesn't rely on next-themes
const ThemeProvider = ({ children }: { children: React.ReactNode }) => <div data-testid="theme-provider">{children}</div>

// Mock next-themes to control theme state in tests
let mockThemeValue = 'light'
const mockSetTheme = jest.fn()

jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: mockThemeValue,
    setTheme: mockSetTheme
  })
}))

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    mockSetTheme.mockClear()
    mockThemeValue = 'light'
  })

  it('renders the theme toggle button', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /toggle theme/i })
      expect(button).toBeInTheDocument()
    })
  })

  it('renders with correct accessibility attributes', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /toggle theme/i })
      expect(button).toHaveClass('h-9', 'w-9')
    })
  })

  it('calls setTheme when clicked', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /toggle theme/i })
      fireEvent.click(button)
      expect(mockSetTheme).toHaveBeenCalledWith('dark')
    })
  })

  it('maintains button styling', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /toggle theme/i })
      expect(button).toHaveClass('h-9', 'w-9', 'p-0')
    })
  })
})
