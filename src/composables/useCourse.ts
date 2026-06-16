import { ref } from 'vue'
import { loadData, saveData } from '../utils/storage'
import { mockCourses, type CourseInfo } from '../mock/courses'
import { ElMessage } from 'element-plus'

const STORAGE_KEY = 'courses'

const courses = ref<CourseInfo[]>(loadData<CourseInfo>(STORAGE_KEY, mockCourses))

function persist() {
  saveData(STORAGE_KEY, courses.value)
}

export function useCourse() {
  const addCourse = (item: Omit<CourseInfo, 'id' | 'createdAt'>) => {
    const newItem: CourseInfo = {
      ...item,
      id: `co${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10)
    }
    courses.value.push(newItem)
    persist()
    ElMessage.success('课程新增成功')
  }

  const updateCourse = (id: string, data: Partial<CourseInfo>) => {
    const idx = courses.value.findIndex((c) => c.id === id)
    if (idx !== -1) {
      courses.value[idx] = { ...courses.value[idx], ...data }
      persist()
      ElMessage.success('课程编辑成功')
    }
  }

  const deleteCourse = (id: string) => {
    courses.value = courses.value.filter((c) => c.id !== id)
    persist()
    ElMessage.success('课程删除成功')
  }

  return { courses, addCourse, updateCourse, deleteCourse }
}
