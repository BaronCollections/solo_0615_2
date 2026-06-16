<script setup lang="ts">
import { ref, computed } from 'vue'
import { useClass } from '../composables/useClass'
import type { ClassInfo } from '../mock/classes'
import { ElMessageBox } from 'element-plus'

const { classes, addClass, updateClass, deleteClass } = useClass()

const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()
const search = ref('')

const form = ref({
  id: '',
  name: '',
  grade: '',
  teacher: '',
  studentCount: 0
})

const rules = {
  name: [{ required: true, message: '请输入班级名称', trigger: 'blur' }],
  grade: [{ required: true, message: '请输入年级', trigger: 'blur' }],
  teacher: [{ required: true, message: '请输入班主任', trigger: 'blur' }]
}

const filteredClasses = computed(() => {
  const kw = search.value.trim().toLowerCase()
  if (!kw) return classes.value
  return classes.value.filter(
    (c) =>
      c.name.toLowerCase().includes(kw) ||
      c.grade.toLowerCase().includes(kw) ||
      c.teacher.toLowerCase().includes(kw)
  )
})

const openAdd = () => {
  isEdit.value = false
  form.value = { id: '', name: '', grade: '', teacher: '', studentCount: 0 }
  dialogVisible.value = true
}

const openEdit = (row: ClassInfo) => {
  isEdit.value = true
  form.value = { ...row }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate()
  if (isEdit.value) {
    updateClass(form.value.id, {
      name: form.value.name,
      grade: form.value.grade,
      teacher: form.value.teacher,
      studentCount: form.value.studentCount
    })
  } else {
    addClass({
      name: form.value.name,
      grade: form.value.grade,
      teacher: form.value.teacher,
      studentCount: form.value.studentCount
    })
  }
  dialogVisible.value = false
}

const handleDelete = (row: ClassInfo) => {
  ElMessageBox.confirm(`确定删除班级「${row.name}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteClass(row.id)
  }).catch(() => {})
}
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h2>班级管理</h2>
      <div class="actions">
        <el-input
          v-model="search"
          placeholder="搜索班级名称/年级/班主任"
          clearable
          style="width: 260px"
        />
        <el-button type="primary" @click="openAdd">新增班级</el-button>
      </div>
    </div>

    <el-table :data="filteredClasses" border stripe style="width: 100%">
      <el-table-column prop="name" label="班级名称" />
      <el-table-column prop="grade" label="年级" width="120" />
      <el-table-column prop="teacher" label="班主任" width="120" />
      <el-table-column prop="studentCount" label="人数" width="80" />
      <el-table-column prop="createdAt" label="创建日期" width="120" />
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑班级' : '新增班级'" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="班级名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <el-input v-model="form.grade" />
        </el-form-item>
        <el-form-item label="班主任" prop="teacher">
          <el-input v-model="form.teacher" />
        </el-form-item>
        <el-form-item label="人数" prop="studentCount">
          <el-input-number v-model="form.studentCount" :min="0" />
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
