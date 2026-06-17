import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref, computed } from 'vue'
import ElementPlus from 'element-plus'
import { clearAllData } from '../src/utils/storage'
import type { RepairRecord, RepairStatus } from '../src/mock/repairs'

vi.mock('element-plus', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual as object,
    ElMessage: {
      success: vi.fn()
    },
    ElMessageBox: {
      confirm: vi.fn().mockResolvedValue(true)
    }
  }
})

async function freshUseRepair() {
  vi.resetModules()
  const { useRepair } = await import('../src/composables/useRepair')
  return useRepair()
}

async function mountRepairManage() {
  vi.resetModules()
  const RepairManage = (await import('../src/views/RepairManage.vue')).default
  return mount(RepairManage, {
    global: {
      plugins: [ElementPlus]
    }
  })
}

describe('RepairManage - 报修流转回归测试', () => {
  beforeEach(() => {
    clearAllData()
  })

  it('表格行状态与 repairs 源数据联动（源数据更新后表格行同步）', async () => {
    const wrapper = await mountRepairManage()
    await nextTick()

    const { repairs, updateRepairStatus } = await freshUseRepair()
    const pendingRecord = repairs.value.find(r => r.status === 'pending')
    expect(pendingRecord).toBeDefined()

    updateRepairStatus(pendingRecord!.id, 'processing')
    await nextTick()
    await nextTick()

    const html = wrapper.html()
    expect(html).toContain('处理中')
  })

  it('详情重新打开时从 repairs 源数据取最新状态', async () => {
    const { repairs, updateRepairStatus } = await freshUseRepair()
    const pendingRecord = repairs.value.find(r => r.status === 'pending')!
    const currentDetail = ref<RepairRecord | null>(pendingRecord)

    const getCurrentDetail = computed(() => {
      if (!currentDetail.value) return null
      const latest = repairs.value.find(r => r.id === currentDetail.value!.id)
      return latest || currentDetail.value
    })

    expect(getCurrentDetail.value!.status).toBe('pending')

    updateRepairStatus(pendingRecord.id, 'processing')

    expect(getCurrentDetail.value!.status).toBe('processing')
  })

  it('通过详情更新状态，表格同源数据同步更新', async () => {
    const { repairs, updateRepairStatus } = await freshUseRepair()
    const pendingRecord = repairs.value.find(r => r.status === 'pending')!
    const currentDetail = ref<RepairRecord | null>(pendingRecord)

    const getCurrentDetail = computed(() => {
      if (!currentDetail.value) return null
      const latest = repairs.value.find(r => r.id === currentDetail.value!.id)
      return latest || currentDetail.value
    })

    const handleDetailStatusChange = (status: RepairStatus) => {
      if (currentDetail.value) {
        updateRepairStatus(currentDetail.value.id, status)
      }
    }

    handleDetailStatusChange('processing')

    const rowStatus = repairs.value.find(r => r.id === pendingRecord.id)!.status
    expect(rowStatus).toBe('processing')
    expect(getCurrentDetail.value!.status).toBe('processing')
  })
})
