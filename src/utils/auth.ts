import { mockUsers, type MockUser } from '../mock/accounts'

export interface LoginResult {
  success: boolean
  message: string
  user?: MockUser
  shouldClearPassword?: boolean
}

export interface LockState {
  locked: boolean
  lockUntil: number
  failedAttempts: number
}

const LOCK_THRESHOLD = 5
const LOCK_DURATION_MS = 30 * 1000
const FAILED_ATTEMPTS_PREFIX = 'smart_campus_failed_'
const LOCK_PREFIX = 'smart_campus_lock_'

export function normalizeUsername(username: string): string {
  return username.trim()
}

export function getLockState(username: string): LockState {
  const normalized = normalizeUsername(username)
  if (!normalized) {
    return { locked: false, lockUntil: 0, failedAttempts: 0 }
  }

  const lockKey = `${LOCK_PREFIX}${normalized}`
  const attemptsKey = `${FAILED_ATTEMPTS_PREFIX}${normalized}`
  const lockUntilStr = localStorage.getItem(lockKey)
  const lockUntil = lockUntilStr ? parseInt(lockUntilStr, 10) : 0
  const failedAttemptsStr = localStorage.getItem(attemptsKey)
  const failedAttempts = failedAttemptsStr ? parseInt(failedAttemptsStr, 10) : 0

  if (lockUntil > 0 && Date.now() >= lockUntil) {
    localStorage.removeItem(lockKey)
    localStorage.removeItem(attemptsKey)
    return { locked: false, lockUntil: 0, failedAttempts: 0 }
  }

  return {
    locked: lockUntil > 0 && Date.now() < lockUntil,
    lockUntil,
    failedAttempts
  }
}

export function recordFailedAttempt(username: string): LockState {
  const normalized = normalizeUsername(username)
  if (!normalized) {
    return { locked: false, lockUntil: 0, failedAttempts: 0 }
  }

  const attemptsKey = `${FAILED_ATTEMPTS_PREFIX}${normalized}`
  const lockKey = `${LOCK_PREFIX}${normalized}`
  const current = getLockState(normalized)
  const newAttempts = current.failedAttempts + 1

  if (newAttempts >= LOCK_THRESHOLD) {
    const lockUntil = Date.now() + LOCK_DURATION_MS
    localStorage.setItem(lockKey, String(lockUntil))
    localStorage.setItem(attemptsKey, String(newAttempts))
    return { locked: true, lockUntil, failedAttempts: newAttempts }
  }

  localStorage.setItem(attemptsKey, String(newAttempts))
  return { locked: false, lockUntil: 0, failedAttempts: newAttempts }
}

export function resetFailedAttempts(username: string): void {
  const normalized = normalizeUsername(username)
  if (!normalized) return

  localStorage.removeItem(`${FAILED_ATTEMPTS_PREFIX}${normalized}`)
  localStorage.removeItem(`${LOCK_PREFIX}${normalized}`)
}

export function getRemainingLockSeconds(lockUntil: number): number {
  const remaining = Math.max(0, lockUntil - Date.now())
  return Math.ceil(remaining / 1000)
}

export function validateLogin(username: string, password: string): LoginResult {
  const normalizedUsername = normalizeUsername(username)

  if (!normalizedUsername || !password) {
    return { success: false, message: '请输入账号和密码' }
  }

  const lockState = getLockState(normalizedUsername)
  if (lockState.locked) {
    const remaining = getRemainingLockSeconds(lockState.lockUntil)
    return {
      success: false,
      message: `账号已锁定，请 ${remaining} 秒后再试`
    }
  }

  const user = mockUsers.find((u) => u.username === normalizedUsername)

  if (!user) {
    return {
      success: false,
      message: '账号不存在',
      shouldClearPassword: true
    }
  }

  if (user.password !== password) {
    const afterFail = recordFailedAttempt(normalizedUsername)
    if (afterFail.locked) {
      const remaining = getRemainingLockSeconds(afterFail.lockUntil)
      return {
        success: false,
        message: `密码连续错误 5 次，账号已锁定 ${remaining} 秒`,
        shouldClearPassword: true
      }
    }
    const remainingAttempts = LOCK_THRESHOLD - afterFail.failedAttempts
    return {
      success: false,
      message: `密码错误，还可尝试 ${remainingAttempts} 次`,
      shouldClearPassword: true
    }
  }

  resetFailedAttempts(normalizedUsername)
  return {
    success: true,
    message: '登录成功',
    user
  }
}
