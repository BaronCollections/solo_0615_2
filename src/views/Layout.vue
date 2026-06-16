<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { School, Reading, SetUp } from '@element-plus/icons-vue'
import type { MockUser } from '../mock/accounts'

const router = useRouter()
const route = useRoute()

const isCollapsed = ref(false)

const currentUser = ref<MockUser | null>(null)

const initUser = () => {
  const raw = localStorage.getItem('smart_campus_current_user')
  if (raw) {
    try { currentUser.value = JSON.parse(raw) } catch { currentUser.value = null }
  }
}

initUser()

const username = computed(() => currentUser.value?.name ?? '未知用户')
const roleLabel = computed(() => currentUser.value?.roleLabel ?? '')

const activeMenu = computed(() => route.path)

const handleSelect = (index: string) => {
  router.push(index)
}

const handleLogout = () => {
  localStorage.removeItem('smart_campus_current_user')
  router.push('/login')
}
</script>

<template>
  <el-container class="layout-container">
    <el-aside :width="isCollapsed ? '64px' : '200px'" class="layout-aside">
      <div class="logo-area">
        <h3 v-if="!isCollapsed">智慧校园</h3>
        <span v-else>校</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapsed"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409eff"
        @select="handleSelect"
      >
        <el-menu-item index="/classes">
          <el-icon><School /></el-icon>
          <template #title>班级管理</template>
        </el-menu-item>
        <el-menu-item index="/courses">
          <el-icon><Reading /></el-icon>
          <template #title>课程管理</template>
        </el-menu-item>
        <el-menu-item index="/repairs">
          <el-icon><SetUp /></el-icon>
          <template #title>报修管理</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="layout-header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="isCollapsed = !isCollapsed">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </el-icon>
        </div>
        <div class="header-right">
          <span class="user-name">{{ username }}（{{ roleLabel }}）</span>
          <el-button text type="danger" @click="handleLogout">退出登录</el-button>
        </div>
      </el-header>
      <el-main class="layout-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout-container {
  height: 100vh;
}
.layout-aside {
  background: #304156;
  transition: width 0.3s;
  overflow: hidden;
}
.logo-area {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}
.header-left {
  display: flex;
  align-items: center;
}
.collapse-btn {
  cursor: pointer;
  font-size: 20px;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.user-name {
  color: #606266;
  font-size: 14px;
}
.layout-main {
  background: #f5f7fa;
  overflow-y: auto;
}
</style>
