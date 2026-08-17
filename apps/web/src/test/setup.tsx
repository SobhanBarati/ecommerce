import '@testing-library/jest-dom'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import type { ReactNode } from 'react'

// Automatically cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  useParams: () => ({
    slug: 'test-product',
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock next/image properly
vi.mock('next/image', () => ({
  default: (props: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fill, priority, ...rest } = props
    return (
      <img
        {...rest}
        data-testid="mock-image"
        {...(fill !== undefined && { fill: String(fill) })}
        {...(priority !== undefined && { priority: String(priority) })}
      />
    )
  },
}))

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { initial, animate, transition, whileHover, exit, ...rest } = props
      return <div {...rest}>{children}</div>
    },
    main: ({ children, ...props }: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { initial, animate, transition, ...rest } = props
      return <main {...rest}>{children}</main>
    },
  },
  AnimatePresence: ({ children }: { children: ReactNode }) => children,
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Search: () => <span data-testid="search-icon">🔍</span>,
  X: () => <span data-testid="x-icon">✕</span>,
  ShoppingBag: () => <span data-testid="shopping-bag-icon">🛍️</span>,
  Heart: () => <span data-testid="heart-icon">❤️</span>,
  ArrowLeft: () => <span data-testid="arrow-left-icon">←</span>,
  Filter: () => <span data-testid="filter-icon">⚙️</span>,
  Check: () => <span data-testid="check-icon">✓</span>,
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})