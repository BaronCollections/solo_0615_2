import { ref } from 'vue'
import { loadData, saveData } from '../utils/storage'
import { mockClasses, type ClassInfo } from '../mock/classes'
import { ElMessage } from 'element-plus'

const STORAGE_KEY = 'classes'

const classes = ref<ClassInfo[]>(loadData<ClassInfo>(STORAGE_KEY, mockClasses))

function persist() {
  saveData(STORAGE_KEY, classes.value)
}

export function useClass() {
  const addClass = (item: Omit<ClassInfo, 'id' | 'createdAt'>) => {
    const newItem: ClassInfo = {
      ...item,
      id: `c${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10)
    }
    classes.value.push(newItem)
    persist()
    ElMessage.success('班级新增成功')
  }

  const updateClass = (id: string, data: Partial<ClassInfo>) => {
    const idx = classes.value.findIndex((c) => c.id === id)
    if (idx !== -1) {
      classes.value[idx] = { ...classes.value[idx], ...data }
      persist()
      ElMessage.success('班级编辑成功')
    }
  }

  const deleteClass = (id: string) => {
    classes.value = classes.value.filter((c) => c.id !== id)
    persist()
    ElMessage.success('班级删除成功')
  }

  return { classes, addClass, updateClass, deleteClass }
}
