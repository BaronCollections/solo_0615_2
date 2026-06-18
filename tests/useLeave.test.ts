import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mockLeaves } from '../src/mock/leaves'

async function freshUseLeave() {
  vi.resetModules()
  const { useLeave } = await import('../src/composables/useLeave')
  return useLeave()
}

describe('useLeave - 审批时间回归测试', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('待审批请假通过后，approvedAt 从 null 变为有值', async () => {
    const { leaves, approveLeave } = await freshUseLeave()

    const pendingRecord = leaves.value.find(l => l.status === 'pending')
    expect(pendingRecord).toBeDefined()
    expect(pendingRecord!.approvedAt).toBeNull()

    approveLeave(pendingRecord!.id)

    const updated = leaves.value.find(l => l.id === pendingRecord!.id)
    expect(updated!.status).toBe('approved')
    expect(updated!.approvedAt).not.toBeNull()
    expect(typeof updated!.approvedAt).toBe('string')
    expect(updated!.approvedAt!.length).toBeGreaterThan(0)
  }, 10000)

  it('审批时间持久化到 localStorage', async () => {
    const { leaves, approveLeave } = await freshUseLeave()

    const pendingRecord = leaves.value.find(l => l.status === 'pending')
    expect(pendingRecord).toBeDefined()

    approveLeave(pendingRecord!.id)

    const raw = localStorage.getItem('smart_campus_leaves')
    expect(raw).not.toBeNull()
    const parsed = JSON.parse(raw!)
    const stored = parsed.find((l: { id: string }) => l.id === pendingRecord!.id)
    expect(stored.status).toBe('approved')
    expect(stored.approvedAt).not.toBeNull()
    expect(typeof stored.approvedAt).toBe('string')
  })

  it('同一条请假多次调用 useLeave，审批时间保持一致', async () => {
    const { leaves, approveLeave } = await freshUseLeave()
    const pendingRecord = leaves.value.find(l => l.status === 'pending')!
    approveLeave(pendingRecord.id)

    const firstRecord = leaves.value.find(l => l.id === pendingRecord.id)!
    const firstApprovedAt = firstRecord.approvedAt

    const { leaves: leaves2 } = await freshUseLeave()
    const sameRecord = leaves2.value.find(l => l.id === pendingRecord.id)
    expect(sameRecord!.status).toBe('approved')
    expect(sameRecord!.approvedAt).toBe(firstApprovedAt)
  })
})
