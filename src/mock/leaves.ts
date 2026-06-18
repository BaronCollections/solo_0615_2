export type LeaveStatus = 'pending' | 'approved' | 'rejected'

export interface LeaveRecord {
  id: string
  studentName: string
  className: string
  reason: string
  startDate: string
  endDate: string
  status: LeaveStatus
  createdAt: string
  approvedAt: string | null
}

export const mockLeaves: LeaveRecord[] = [
  {
    id: 'l1',
    studentName: '张同学',
    className: '计算机2401班',
    reason: '家中有事，需请假回家处理',
    startDate: '2024-12-05',
    endDate: '2024-12-07',
    status: 'pending',
    createdAt: '2024-12-03',
    approvedAt: null
  },
  {
    id: 'l2',
    studentName: '王同学',
    className: '计算机2401班',
    reason: '身体不适，需去医院就诊',
    startDate: '2024-12-01',
    endDate: '2024-12-02',
    status: 'approved',
    createdAt: '2024-11-29',
    approvedAt: '2024-11-30 09:15:00'
  },
  {
    id: 'l3',
    studentName: '赵同学',
    className: '软件2402班',
    reason: '参加校外竞赛',
    startDate: '2024-12-10',
    endDate: '2024-12-12',
    status: 'rejected',
    createdAt: '2024-12-08',
    approvedAt: '2024-12-09 14:30:00'
  }
]
