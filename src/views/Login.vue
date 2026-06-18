<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { mockUsers } from '../mock/accounts'
import { useLogin } from '../composables/useLogin'
import { normalizeUsername } from '../utils/auth'
import { watch } from 'vue'

const router = useRouter()

const {
  loginFormRef,
  loading,
  loggedInUser,
  rememberMe,
  loginForm,
  loginRules,
  isLocked,
  countdownSeconds,
  handleRememberMeChange,
  handleLogin
} = useLogin()

void loginFormRef

const handleUsernameBlur = () => {
  loginForm.username = normalizeUsername(loginForm.username)
}

watch(loggedInUser, (val) => {
  if (val) {
    localStorage.setItem('smart_campus_current_user', JSON.stringify(val))
    router.push('/')
  }
})
</script>

<template>
  <div class="login-container">
    <div v-if="!loggedInUser" class="login-card">
      <h1 class="system-title">智慧校园管理系统</h1>
      <h2 class="system-subtitle">Smart Campus Management System</h2>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        size="large"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入账号"
            :prefix-icon="User"
            clearable
            @blur="handleUsernameBlur"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
            :disabled="isLocked"
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="rememberMe" @change="handleRememberMeChange">
            记住账号
          </el-checkbox>
        </el-form-item>

        <el-alert
          v-if="isLocked"
          type="warning"
          :closable="false"
          show-icon
          class="lock-alert"
        >
          <template #title>
            账号已锁定，<span class="countdown">{{ countdownSeconds }}</span> 秒后可重试
          </template>
        </el-alert>

        <el-form-item>
          <el-button
            type="primary"
            class="login-btn"
            :loading="loading"
            :disabled="isLocked"
            @click="handleLogin"
          >
            {{ isLocked ? `锁定中 ${countdownSeconds}s` : '登 录' }}
          </el-button>
        </el-form-item>
      </el-form>

      <el-divider>测试账号</el-divider>

      <div class="test-accounts">
        <el-alert
          v-for="user in mockUsers"
          :key="user.role"
          :title="`${user.roleLabel}：${user.username} / ${user.password}（${user.name}）`"
          type="info"
          :closable="false"
          show-icon
          class="account-item"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 420px;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.system-title {
  text-align: center;
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 600;
  color: #303133;
}

.system-subtitle {
  text-align: center;
  margin: 0 0 32px;
  font-size: 14px;
  font-weight: 400;
  color: #909399;
  letter-spacing: 1px;
}

.login-form {
  margin-bottom: 0;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  letter-spacing: 8px;
}

.lock-alert {
  margin-bottom: 18px;
}

.lock-alert .countdown {
  font-weight: 700;
  color: #e6a23c;
  font-size: 16px;
}

.test-accounts {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.account-item :deep(.el-alert__content) {
  width: 100%;
}
</style>
