import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ElementPlus from 'element-plus'

async function freshUseLeave() {
  vi.resetModules()
  const { useLeave } = await import('../src/composables/useLeave')
  return useLeave()
}

async function mountLeaveApproval() {
  vi.resetModules()
  const LeaveApproval = (await import('../src/views/LeaveApproval.vue')).default
  return mount(LeaveApproval, {
    global: {
      plugins: [ElementPlus]
    }
  })
}

describe('LeaveApproval - 审批时间回归测试', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('已通过的请假在列表中展示审批时间', async () => {
    const wrapper = await mountLeaveApproval()
    await nextTick()
    await nextTick()

    const html = wrapper.html()
    expect(html).toContain('已通过')
    expect(html).toContain('2024-11-30 09:15:00')
  })

  it('审批通过后，重新挂载页面仍能看到同一审批时间', async () => {
    const { leaves, approveLeave } = await freshUseLeave()
    const pendingRecord = leaves.value.find(l => l.status === 'pending')!
    approveLeave(pendingRecord.id)

    const approvedRecord = leaves.value.find(l => l.id === pendingRecord.id)!
    const firstApprovedAt = approvedRecord.approvedAt
    expect(firstApprovedAt).not.toBeNull()

    const wrapper = await mountLeaveApproval()
    await nextTick()
    await nextTick()

    const html = wrapper.html()
    expect(html).toContain(firstApprovedAt!)

    const { leaves: leaves2 } = await freshUseLeave()
    const remountedRecord = leaves2.value.find(l => l.id === pendingRecord.id)!
    expect(remountedRecord.status).toBe('approved')
    expect(remountedRecord.approvedAt).toBe(firstApprovedAt)
  })
})
