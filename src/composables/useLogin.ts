import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { validateLogin } from '../utils/auth'
import type { MockUser, UserRole } from '../mock/accounts'

const REMEMBERED_USERNAME_KEY = 'smart_campus_remembered_username'

export function useLogin() {
  const loginFormRef = ref<FormInstance>()
  const loading = ref(false)
  const loggedInUser = ref<MockUser | null>(null)
  const rememberMe = ref(false)

  const loginForm = reactive({
    username: '',
    password: ''
  })

  const loginRules: FormRules = {
    username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
  }

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

  const handleRememberMeChange = (val: boolean) => {
    if (!val) {
      localStorage.removeItem(REMEMBERED_USERNAME_KEY)
    }
  }

  const handleLogin = async () => {
    if (!loginFormRef.value) return

    await loginFormRef.value.validate((valid) => {
      if (!valid) return

      loading.value = true
      setTimeout(() => {
        const result = validateLogin(loginForm.username, loginForm.password)
        if (result.success && result.user) {
          if (rememberMe.value) {
            localStorage.setItem(REMEMBERED_USERNAME_KEY, loginForm.username)
          } else {
            localStorage.removeItem(REMEMBERED_USERNAME_KEY)
          }
          loggedInUser.value = result.user
          ElMessage.success(result.message)
        } else {
          ElMessage.error(result.message)
        }
        loading.value = false
      }, 500)
    })
  }

  const handleLogout = () => {
    loggedInUser.value = null
    loginForm.password = ''
    if (!rememberMe.value) {
      loginForm.username = ''
    }
  }

  onMounted(() => {
    const rememberedUsername = localStorage.getItem(REMEMBERED_USERNAME_KEY)
    if (rememberedUsername) {
      loginForm.username = rememberedUsername
      rememberMe.value = true
    }
  })

  return {
    loginFormRef,
    loading,
    loggedInUser,
    rememberMe,
    loginForm,
    loginRules,
    getRoleTagType,
    handleRememberMeChange,
    handleLogin,
    handleLogout
  }
}
