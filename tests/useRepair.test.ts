import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mockRepairs } from '../src/mock/repairs'

async function freshUseRepair() {
  vi.resetModules()
  const { useRepair } = await import('../src/composables/useRepair')
  return useRepair()
}

describe('useRepair - 状态流转回归测试', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('待受理工单切到处理中后，repairs 列表同步更新', async () => {
    const { repairs, updateRepairStatus } = await freshUseRepair()

    const pendingRecord = repairs.value.find(r => r.status === 'pending')
    expect(pendingRecord).toBeDefined()
    expect(pendingRecord!.status).toBe('pending')

    updateRepairStatus(pendingRecord!.id, 'processing')

    const updated = repairs.value.find(r => r.id === pendingRecord!.id)
    expect(updated!.status).toBe('processing')
  })

  it('状态更新持久化到 localStorage', async () => {
    const { repairs, updateRepairStatus } = await freshUseRepair()

    const pendingRecord = repairs.value.find(r => r.status === 'pending')
    expect(pendingRecord).toBeDefined()

    updateRepairStatus(pendingRecord!.id, 'processing')

    const raw = localStorage.getItem('smart_campus_repairs')
    expect(raw).not.toBeNull()
    const parsed = JSON.parse(raw!)
    const stored = parsed.find((r: { id: string }) => r.id === pendingRecord!.id)
    expect(stored.status).toBe('processing')
  })

  it('同一条工单多次调用 useRepair，状态保持一致', async () => {
    const { repairs, updateRepairStatus } = await freshUseRepair()
    const pendingRecord = repairs.value.find(r => r.status === 'pending')!
    updateRepairStatus(pendingRecord.id, 'processing')

    const { repairs: repairs2 } = await freshUseRepair()
    const sameRecord = repairs2.value.find(r => r.id === pendingRecord.id)
    expect(sameRecord!.status).toBe('processing')
  })
})
