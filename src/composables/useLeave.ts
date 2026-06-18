import { ref } from 'vue'
import { loadData, saveData } from '../utils/storage'
import { mockLeaves, type LeaveRecord, type LeaveStatus } from '../mock/leaves'
import { ElMessage } from 'element-plus'

const STORAGE_KEY = 'leaves'

const leaves = ref<LeaveRecord[]>(loadData<LeaveRecord>(STORAGE_KEY, mockLeaves))

function persist() {
  saveData(STORAGE_KEY, leaves.value)
}

export function useLeave() {
  const addLeave = (item: Omit<LeaveRecord, 'id' | 'createdAt' | 'approvedAt'>) => {
    const newItem: LeaveRecord = {
      ...item,
      id: `l${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
      approvedAt: null
    }
    leaves.value.push(newItem)
    persist()
    ElMessage.success('请假申请提交成功')
  }

  const approveLeave = (id: string) => {
    const idx = leaves.value.findIndex((l) => l.id === id)
    if (idx !== -1) {
      leaves.value[idx] = {
        ...leaves.value[idx],
        status: 'approved' as LeaveStatus,
        approvedAt: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).replace(/\//g, '-')
      }
      persist()
      ElMessage.success('已通过该请假申请')
    }
  }

  const rejectLeave = (id: string) => {
    const idx = leaves.value.findIndex((l) => l.id === id)
    if (idx !== -1) {
      leaves.value[idx] = {
        ...leaves.value[idx],
        status: 'rejected' as LeaveStatus,
        approvedAt: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).replace(/\//g, '-')
      }
      persist()
      ElMessage.success('已驳回该请假申请')
    }
  }

  const deleteLeave = (id: string) => {
    leaves.value = leaves.value.filter((l) => l.id !== id)
    persist()
    ElMessage.success('请假记录删除成功')
  }

  return { leaves, addLeave, approveLeave, rejectLeave, deleteLeave }
}
