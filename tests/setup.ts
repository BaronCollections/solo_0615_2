import { beforeEach, vi } from 'vitest'

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
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
    }
  }
})

vi.stubGlobal('scrollTo', vi.fn())
vi.stubGlobal('alert', vi.fn())
vi.stubGlobal('confirm', vi.fn().mockReturnValue(true))
vi.stubGlobal('prompt', vi.fn().mockReturnValue(''))

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

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: vi.fn().mockReturnValue(''),
    getPropertyCSSValue: vi.fn().mockReturnValue(null),
    item: vi.fn().mockReturnValue(''),
    length: 0,
    parentRule: null,
    cssText: '',
    removeProperty: vi.fn(),
    setProperty: vi.fn()
  })
})
