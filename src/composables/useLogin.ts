import { ref, reactive, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import {
  validateLogin,
  normalizeUsername,
  getLockState,
  getRemainingLockSeconds
} from '../utils/auth'
import type { MockUser, UserRole } from '../mock/accounts'

const REMEMBERED_USERNAME_KEY = 'smart_campus_remembered_username'

export function useLogin() {
  const loginFormRef = ref<FormInstance>()
  const loading = ref(false)
  const isSubmitting = ref(false)
  const loggedInUser = ref<MockUser | null>(null)
  const rememberMe = ref(false)
  const lockUntil = ref(0)
  const countdownSeconds = ref(0)
  let countdownTimer: ReturnType<typeof setInterval> | null = null

  const loginForm = reactive({
    username: '',
    password: ''
  })

  const loginRules: FormRules = {
    username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
  }

  const isLocked = computed(() => countdownSeconds.value > 0)

  const getRoleTagType = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'danger'
      case 'teacher':
        return 'warning'
      case 'student':
        return 'success'
      default:
        return 'info'
    }
  }

  const persistRememberedUsername = () => {
    const normalized = normalizeUsername(loginForm.username)
    if (rememberMe.value && normalized) {
      localStorage.setItem(REMEMBERED_USERNAME_KEY, normalized)
    } else {
      localStorage.removeItem(REMEMBERED_USERNAME_KEY)
    }
  }

  const handleRememberMeChange = (val: boolean) => {
    rememberMe.value = val
    persistRememberedUsername()
  }

  const startCountdown = (targetLockUntil: number) => {
    lockUntil.value = targetLockUntil
    countdownSeconds.value = getRemainingLockSeconds(targetLockUntil)

    if (countdownTimer) {
      clearInterval(countdownTimer)
    }

    countdownTimer = setInterval(() => {
      const remaining = getRemainingLockSeconds(lockUntil.value)
      countdownSeconds.value = remaining
      if (remaining <= 0) {
        if (countdownTimer) {
          clearInterval(countdownTimer)
          countdownTimer = null
        }
        lockUntil.value = 0
      }
    }, 1000)
  }

  const refreshLockStatus = () => {
    const normalized = normalizeUsername(loginForm.username)
    if (!normalized) return
    const state = getLockState(normalized)
    if (state.locked) {
      startCountdown(state.lockUntil)
    }
  }

  const handleLogin = async () => {
    if (!loginFormRef.value || isSubmitting.value) return

    if (isLocked.value) {
      ElMessage.warning(`账号已锁定，请 ${countdownSeconds.value} 秒后再试`)
      return
    }

    isSubmitting.value = true
    loading.value = true

    try {
      await loginFormRef.value.validate(async (valid) => {
        if (!valid) {
          isSubmitting.value = false
          loading.value = false
          return
        }

        loginForm.username = normalizeUsername(loginForm.username)

        setTimeout(() => {
          const result = validateLogin(loginForm.username, loginForm.password)

          if (result.success && result.user) {
            persistRememberedUsername()
            loggedInUser.value = result.user
            loginForm.password = ''
            ElMessage.success(result.message)
          } else {
            if (result.shouldClearPassword) {
              loginForm.password = ''
            }

            const state = getLockState(loginForm.username)
            if (state.locked) {
              startCountdown(state.lockUntil)
            }

            ElMessage.error(result.message)
          }

          isSubmitting.value = false
          loading.value = false
        }, 500)
      })
    } catch (error) {
      isSubmitting.value = false
      loading.value = false
    }
  }

  const handleLogout = () => {
    loggedInUser.value = null
    loginForm.password = ''
    if (!rememberMe.value) {
      loginForm.username = ''
    }
  }

  watch(
    () => loginForm.username,
    () => {
      refreshLockStatus()
    }
  )

  onMounted(() => {
    const rememberedUsername = localStorage.getItem(REMEMBERED_USERNAME_KEY)
    if (rememberedUsername) {
      loginForm.username = rememberedUsername
      rememberMe.value = true
      refreshLockStatus()
    }
  })

  onBeforeUnmount(() => {
    if (countdownTimer) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  })

  return {
    loginFormRef,
    loading,
    loggedInUser,
    rememberMe,
    loginForm,
    loginRules,
    isLocked,
    countdownSeconds,
    getRoleTagType,
    handleRememberMeChange,
    handleLogin,
    handleLogout
  }
}
