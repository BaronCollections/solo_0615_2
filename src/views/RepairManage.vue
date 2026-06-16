<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { useRepair } from '../composables/useRepair'
import type { RepairRecord, RepairStatus } from '../mock/repairs'
import { ElMessageBox } from 'element-plus'

const { repairs, addRepair, updateRepair, updateRepairStatus, deleteRepair } = useRepair()

const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()
const search = ref('')

const form = ref({
  id: '',
  title: '',
  location: '',
  reporter: '',
  status: 'pending' as RepairStatus,
  description: ''
})

const rules = {
  title: [{ required: true, message: '请输入报修标题', trigger: 'blur' }],
  location: [{ required: true, message: '请输入报修地点', trigger: 'blur' }],
  reporter: [{ required: true, message: '请输入报修人', trigger: 'blur' }]
}

const statusMap: Record<RepairStatus, { label: string; type: string }> = {
  pending: { label: '待处理', type: 'warning' },
  processing: { label: '处理中', type: 'primary' },
  done: { label: '已完成', type: 'success' }
}

const getStatusTag = (status: RepairStatus) => statusMap[status]

const filteredRepairs = computed(() => {
  const kw = search.value.trim().toLowerCase()
  if (!kw) return repairs.value
  return repairs.value.filter(
    (r) =>
      r.title.toLowerCase().includes(kw) ||
      r.location.toLowerCase().includes(kw) ||
      r.reporter.toLowerCase().includes(kw)
  )
})

const openAdd = () => {
  isEdit.value = false
  form.value = { id: '', title: '', location: '', reporter: '', status: 'pending', description: '' }
  dialogVisible.value = true
}

const openEdit = (row: RepairRecord) => {
  isEdit.value = true
  form.value = { ...row }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate()
  if (isEdit.value) {
    updateRepair(form.value.id, {
      title: form.value.title,
      location: form.value.location,
      reporter: form.value.reporter,
      status: form.value.status,
      description: form.value.description
    })
  } else {
    addRepair({
      title: form.value.title,
      location: form.value.location,
      reporter: form.value.reporter,
      status: form.value.status,
      description: form.value.description
    })
  }
  dialogVisible.value = false
}

const handleStatusChange = (row: RepairRecord, status: RepairStatus) => {
  updateRepairStatus(row.id, status)
}

const handleDelete = (row: RepairRecord) => {
  ElMessageBox.confirm(`确定删除报修记录「${row.title}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteRepair(row.id)
  }).catch(() => {})
}
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h2>报修管理</h2>
      <div class="actions">
        <el-input
          v-model="search"
          placeholder="搜索标题/地点/报修人"
          clearable
          style="width: 260px"
        />
        <el-button type="primary" @click="openAdd">新增报修</el-button>
      </div>
    </div>

    <el-table :data="filteredRepairs" border stripe style="width: 100%">
      <el-table-column prop="title" label="报修标题" />
      <el-table-column prop="location" label="地点" width="180" />
      <el-table-column prop="reporter" label="报修人" width="100" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusTag(row.status).type">
            {{ getStatusTag(row.status).label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="报修日期" width="120" />
      <el-table-column label="操作" width="260" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openEdit(row)">编辑</el-button>
          <el-dropdown v-if="row.status !== 'done'" style="margin-left: 8px" @command="(cmd: string) => handleStatusChange(row, cmd as RepairStatus)">
            <el-button size="small" type="primary">
              更新状态<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-if="row.status === 'pending'" command="processing">处理中</el-dropdown-item>
                <el-dropdown-item command="done">已完成</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑报修' : '新增报修'" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="地点" prop="location">
          <el-input v-model="form.location" />
        </el-form-item>
        <el-form-item label="报修人" prop="reporter">
          <el-input v-model="form.reporter" />
        </el-form-item>
        <el-form-item v-if="isEdit" label="状态">
          <el-select v-model="form.status">
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="processing" />
            <el-option label="已完成" value="done" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="3" />
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
