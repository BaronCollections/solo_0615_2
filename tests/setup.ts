import { beforeEach, vi } from 'vitest'

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  vi.clearAllMocks()
  vi.clearAllTimers()
})

vi.mock('element-plus', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(actual as object),
    ElMessage: {
      success: vi.fn(),
      warning: vi.fn(),
      error: vi.fn(),
      info: vi.fn()
    },
    ElMessageBox: {
      confirm: vi.fn().mockResolvedValue(true),
      alert: vi.fn().mockResolvedValue(undefined),
      prompt: vi.fn().mockResolvedValue({ value: '' })
    },
    ElNotification: {
      success: vi.fn(),
      warning: vi.fn(),
      error: vi.fn(),
      info: vi.fn()
    }
  }
})

vi.stubGlobal('scrollTo', vi.fn())
vi.stubGlobal('scroll', vi.fn())
vi.stubGlobal('alert', vi.fn())
vi.stubGlobal('confirm', vi.fn().mockReturnValue(true))
vi.stubGlobal('prompt', vi.fn().mockReturnValue(''))
vi.stubGlobal('getComputedStyle', vi.fn().mockReturnValue({
  getPropertyValue: vi.fn().mockReturnValue(''),
  getPropertyCSSValue: vi.fn().mockReturnValue(null),
  item: vi.fn().mockReturnValue(''),
  length: 0,
  parentRule: null,
  cssText: '',
  removeProperty: vi.fn(),
  setProperty: vi.fn()
}))

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
    dispatchEvent: vi.fn()
  }))
})

class MockResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: MockResizeObserver
})

class MockIntersectionObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  takeRecords = vi.fn().mockReturnValue([])
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver
})

Object.defineProperty(document, 'elementFromPoint', {
  writable: true,
  value: vi.fn().mockReturnValue(null)
})

Object.defineProperty(document, 'caretRangeFromPoint', {
  writable: true,
  value: vi.fn().mockReturnValue(null)
})

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  writable: true,
  value: vi.fn().mockReturnValue(null)
})

Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: vi.fn().mockReturnValue('blob:mock-url')
})

Object.defineProperty(URL, 'revokeObjectURL', {
  writable: true,
  value: vi.fn()
})
