const STORAGE_PREFIX = 'smart_campus_'
const DATA_KEYS = ['classes', 'courses', 'repairs', 'leaves'] as const

function getFullKey(key: string): string {
  return `${STORAGE_PREFIX}${key}`
}

function isValidArray(data: unknown): data is unknown[] {
  return Array.isArray(data)
}

export function hasPersistedData(key: string): boolean {
  const fullKey = getFullKey(key)
  return localStorage.getItem(fullKey) !== null
}

export function loadData<T>(key: string, fallback: T[]): T[] {
  const fullKey = getFullKey(key)
  const raw = localStorage.getItem(fullKey)

  if (raw !== null) {
    try {
      const parsed = JSON.parse(raw)
      if (isValidArray(parsed)) {
        return parsed as T[]
      }
    } catch {
      // parse failed, fall through to use fallback
    }
  }

  localStorage.setItem(fullKey, JSON.stringify(fallback))
  return [...fallback]
}

export function saveData<T>(key: string, data: T[]): void {
  const fullKey = getFullKey(key)
  localStorage.setItem(fullKey, JSON.stringify(data))
}

export function clearData(key: string): void {
  const fullKey = getFullKey(key)
  localStorage.removeItem(fullKey)
}

export function clearAllData(): void {
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k && k.startsWith(STORAGE_PREFIX)) {
      keysToRemove.push(k)
    }
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k))
}

export function resetAllToMock(mockData: Record<string, unknown[]>): void {
  DATA_KEYS.forEach((key) => {
    if (mockData[key]) {
      saveData(key, mockData[key])
    }
  })
}
