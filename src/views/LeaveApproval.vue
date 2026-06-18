<script setup lang="ts">
import { ref, computed } from 'vue'
import { View } from '@element-plus/icons-vue'
import { useLeave } from '../composables/useLeave'
import type { LeaveRecord, LeaveStatus } from '../mock/leaves'
import { ElMessageBox } from 'element-plus'

void View

const { leaves, approveLeave, rejectLeave, deleteLeave } = useLeave()

const detailVisible = ref(false)
const search = ref('')
const currentDetail = ref<LeaveRecord | null>(null)

const statusMap: Record<LeaveStatus, { label: string; type: string }> = {
  pending: { label: '待审批', type: 'warning' },
  approved: { label: '已通过', type: 'success' },
  rejected: { label: '已驳回', type: 'danger' }
}

const getStatusTag = (status: LeaveStatus) => statusMap[status]

const filteredLeaves = computed(() => {
  const kw = search.value.trim().toLowerCase()
  if (!kw) return leaves.value
  return leaves.value.filter(
    (l) =>
      l.studentName.toLowerCase().includes(kw) ||
      l.className.toLowerCase().includes(kw) ||
      l.reason.toLowerCase().includes(kw)
  )
})

const openDetail = (row: LeaveRecord) => {
  currentDetail.value = row
  detailVisible.value = true
}

const getCurrentDetail = computed(() => {
  if (!currentDetail.value) return null
  const latest = leaves.value.find(l => l.id === currentDetail.value!.id)
  return latest || currentDetail.value
})

const handleApprove = (row: LeaveRecord) => {
  ElMessageBox.confirm(`确定通过「${row.studentName}」的请假申请吗？`, '审批确认', {
    confirmButtonText: '通过',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    approveLeave(row.id)
  }).catch(() => {})
}

const handleReject = (row: LeaveRecord) => {
  ElMessageBox.confirm(`确定驳回「${row.studentName}」的请假申请吗？`, '审批确认', {
    confirmButtonText: '驳回',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    rejectLeave(row.id)
  }).catch(() => {})
}

const handleDelete = (row: LeaveRecord) => {
  ElMessageBox.confirm(`确定删除「${row.studentName}」的请假记录吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteLeave(row.id)
  }).catch(() => {})
}

const handleDetailApprove = () => {
  if (currentDetail.value) {
    approveLeave(currentDetail.value.id)
  }
}

const handleDetailReject = () => {
  if (currentDetail.value) {
    rejectLeave(currentDetail.value.id)
  }
}
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h2>请假审批</h2>
      <div class="actions">
        <el-input
          v-model="search"
          placeholder="搜索学生/班级/事由"
          clearable
          style="width: 260px"
        />
      </div>
    </div>

    <el-table :data="filteredLeaves" border stripe style="width: 100%">
      <el-table-column prop="studentName" label="学生" width="100" />
      <el-table-column prop="className" label="班级" width="140" />
      <el-table-column prop="reason" label="请假事由" min-width="180" show-overflow-tooltip />
      <el-table-column prop="startDate" label="开始日期" width="110" />
      <el-table-column prop="endDate" label="结束日期" width="110" />
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="getStatusTag(row.status).type">
            {{ getStatusTag(row.status).label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="申请日期" width="110" />
      <el-table-column label="审批时间" width="170">
        <template #default="{ row }">
          <span v-if="row.approvedAt">{{ row.approvedAt }}</span>
          <span v-else class="text-muted">—</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openDetail(row)">
            <el-icon><view /></el-icon>
            查看
          </el-button>
          <el-button
            v-if="row.status === 'pending'"
            size="small"
            type="success"
            @click="handleApprove(row)"
          >通过</el-button>
          <el-button
            v-if="row.status === 'pending'"
            size="small"
            type="danger"
            @click="handleReject(row)"
          >驳回</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="detailVisible" title="请假详情" width="560px">
      <div v-if="getCurrentDetail" class="detail-content">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="学生姓名">
            {{ getCurrentDetail.studentName }}
          </el-descriptions-item>
          <el-descriptions-item label="班级">
            {{ getCurrentDetail.className }}
          </el-descriptions-item>
          <el-descriptions-item label="请假事由">
            {{ getCurrentDetail.reason }}
          </el-descriptions-item>
          <el-descriptions-item label="起止日期">
            {{ getCurrentDetail.startDate }} 至 {{ getCurrentDetail.endDate }}
          </el-descriptions-item>
          <el-descriptions-item label="申请日期">
            {{ getCurrentDetail.createdAt }}
          </el-descriptions-item>
          <el-descriptions-item label="审批状态">
            <el-tag :type="getStatusTag(getCurrentDetail.status).type">
              {{ getStatusTag(getCurrentDetail.status).label }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="审批时间">
            <span v-if="getCurrentDetail.approvedAt">{{ getCurrentDetail.approvedAt }}</span>
            <span v-else class="text-muted">暂无</span>
          </el-descriptions-item>
        </el-descriptions>

        <div v-if="getCurrentDetail.status === 'pending'" class="detail-actions">
          <el-button type="success" @click="handleDetailApprove">通过</el-button>
          <el-button type="danger" @click="handleDetailReject">驳回</el-button>
        </div>
      </div>
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
.detail-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.detail-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 8px;
}
.text-muted {
  color: #c0c4cc;
}
</style>
