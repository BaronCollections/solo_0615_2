import { ref } from 'vue'
import { loadData, saveData } from '../utils/storage'
import { mockRepairs, type RepairRecord, type RepairStatus } from '../mock/repairs'
import { ElMessage } from 'element-plus'

const STORAGE_KEY = 'repairs'

const repairs = ref<RepairRecord[]>(loadData<RepairRecord>(STORAGE_KEY, mockRepairs))

function persist() {
  saveData(STORAGE_KEY, repairs.value)
}

export function useRepair() {
  const addRepair = (item: Omit<RepairRecord, 'id' | 'createdAt'>) => {
    const newItem: RepairRecord = {
      ...item,
      id: `r${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10)
    }
    repairs.value.push(newItem)
    persist()
    ElMessage.success('报修记录新增成功')
  }

  const updateRepair = (id: string, data: Partial<RepairRecord>) => {
    const idx = repairs.value.findIndex((r) => r.id === id)
    if (idx !== -1) {
      repairs.value[idx] = { ...repairs.value[idx], ...data }
      persist()
      ElMessage.success('报修记录编辑成功')
    }
  }

  const updateRepairStatus = (id: string, status: RepairStatus) => {
    const idx = repairs.value.findIndex((r) => r.id === id)
    if (idx !== -1) {
      repairs.value[idx] = { ...repairs.value[idx], status }
      persist()
      ElMessage.success('状态更新成功')
    }
  }

  const deleteRepair = (id: string) => {
    repairs.value = repairs.value.filter((r) => r.id !== id)
    persist()
    ElMessage.success('报修记录删除成功')
  }

  return { repairs, addRepair, updateRepair, updateRepairStatus, deleteRepair }
}
