<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCourse } from '../composables/useCourse'
import type { CourseInfo } from '../mock/courses'
import { ElMessageBox } from 'element-plus'

const { courses, addCourse, updateCourse, deleteCourse } = useCourse()

const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()
const search = ref('')

const form = ref({
  id: '',
  name: '',
  teacher: '',
  classId: '',
  className: '',
  schedule: '',
  hours: 0
})

const rules = {
  name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
  teacher: [{ required: true, message: '请输入授课教师', trigger: 'blur' }],
  className: [{ required: true, message: '请输入班级', trigger: 'blur' }],
  schedule: [{ required: true, message: '请输入上课时间', trigger: 'blur' }]
}

const filteredCourses = computed(() => {
  const kw = search.value.trim().toLowerCase()
  if (!kw) return courses.value
  return courses.value.filter(
    (c) =>
      c.name.toLowerCase().includes(kw) ||
      c.teacher.toLowerCase().includes(kw) ||
      c.className.toLowerCase().includes(kw)
  )
})

const openAdd = () => {
  isEdit.value = false
  form.value = { id: '', name: '', teacher: '', classId: '', className: '', schedule: '', hours: 0 }
  dialogVisible.value = true
}

const openEdit = (row: CourseInfo) => {
  isEdit.value = true
  form.value = { ...row }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate()
  if (isEdit.value) {
    updateCourse(form.value.id, {
      name: form.value.name,
      teacher: form.value.teacher,
      classId: form.value.classId,
      className: form.value.className,
      schedule: form.value.schedule,
      hours: form.value.hours
    })
  } else {
    addCourse({
      name: form.value.name,
      teacher: form.value.teacher,
      classId: form.value.classId,
      className: form.value.className,
      schedule: form.value.schedule,
      hours: form.value.hours
    })
  }
  dialogVisible.value = false
}

const handleDelete = (row: CourseInfo) => {
  ElMessageBox.confirm(`确定删除课程「${row.name}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteCourse(row.id)
  }).catch(() => {})
}
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h2>课程管理</h2>
      <div class="actions">
        <el-input
          v-model="search"
          placeholder="搜索课程/教师/班级"
          clearable
          style="width: 260px"
        />
        <el-button type="primary" @click="openAdd">新增课程</el-button>
      </div>
    </div>

    <el-table :data="filteredCourses" border stripe style="width: 100%">
      <el-table-column prop="name" label="课程名称" />
      <el-table-column prop="teacher" label="授课教师" width="120" />
      <el-table-column prop="className" label="班级" width="150" />
      <el-table-column prop="schedule" label="上课时间" width="140" />
      <el-table-column prop="hours" label="学时" width="80" />
      <el-table-column prop="createdAt" label="创建日期" width="120" />
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑课程' : '新增课程'" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="授课教师" prop="teacher">
          <el-input v-model="form.teacher" />
        </el-form-item>
        <el-form-item label="班级" prop="className">
          <el-input v-model="form.className" />
        </el-form-item>
        <el-form-item label="上课时间" prop="schedule">
          <el-input v-model="form.schedule" />
        </el-form-item>
        <el-form-item label="学时">
          <el-input-number v-model="form.hours" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.page-container {
  padding: 20px;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.page-header h2 {
  margin: 0;
  font-size: 20px;
}
.actions {
  display: flex;
  gap: 12px;
}
</style>
