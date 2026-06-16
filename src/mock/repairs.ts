export type RepairStatus = 'pending' | 'processing' | 'done'

export interface RepairRecord {
  id: string
  title: string
  location: string
  reporter: string
  status: RepairStatus
  createdAt: string
  description: string
}

export const mockRepairs: RepairRecord[] = [
  {
    id: 'r1',
    title: '教室投影仪故障',
    location: '教学楼A-301',
    reporter: '张同学',
    status: 'pending',
    createdAt: '2024-12-01',
    description: '投影仪无法正常开机，灯泡可能损坏'
  },
  {
    id: 'r2',
    title: '实验室空调漏水',
    location: '实验楼B-205',
    reporter: '李老师',
    status: 'processing',
    createdAt: '2024-11-28',
    description: '空调运行时持续滴水，影响实验进行'
  },
  {
    id: 'r3',
    title: '宿舍门锁损坏',
    location: '学生宿舍6号楼-412',
    reporter: '王同学',
    status: 'done',
    createdAt: '2024-11-20',
    description: '门锁无法正常关闭，存在安全隐患'
  }
]
